import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, finalize, shareReplay } from 'rxjs/operators';
import { ApiConfiguration } from '../../../api/api-configuration';
import { authLogin } from '../../../api/fn/auth/auth-login';
import { authRefreshToken } from '../../../api/fn/auth/auth-refresh-token';
import { authLogout } from '../../../api/fn/auth/auth-logout';

export interface AuthUser {
  id?: string;
  email?: string;
  fullName?: string;
  role: string;
  roles: string[];
  branchId?: number | null;
  tokenExp?: number;
}

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function parseUserFromToken(token: string): AuthUser | null {
  const claims = decodeJwt(token);
  if (!claims) return null;

  const rawRoles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    ?? claims['role']
    ?? claims['roles'];

  const roles: string[] = Array.isArray(rawRoles)
    ? rawRoles.map(String)
    : typeof rawRoles === 'string' && rawRoles
      ? [rawRoles]
      : [];

  const primaryRole = roles.length > 0 ? roles[0] : 'Collector';

  const rawBranchId = claims['branchId'];
  const branchId = rawBranchId ? Number(rawBranchId) : null;
  const exp = typeof claims['exp'] === 'number' ? claims['exp'] : undefined;

  return {
    id: (claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? claims['sub'] ?? claims['nameid']) as string | undefined,
    email: (claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? claims['email']) as string | undefined,
    fullName: (claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? claims['name'] ?? claims['unique_name']) as string | undefined,
    role: primaryRole,
    roles,
    branchId: isNaN(branchId as number) ? null : branchId,
    tokenExp: exp
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly ROLE_KEY = 'auth_role';
  private readonly USER_KEY = 'auth_user';

  private router = inject(Router);
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);

  // Modern Signal-based state
  readonly currentUser = signal<AuthUser | null>(this.getStoredUser());
  readonly isAuthenticated = computed(() => {
    const user = this.currentUser();
    const token = this.getToken();
    return !!user && !!token && !this.isTokenExpired();
  });
  readonly userRole = computed(() => this.currentUser()?.role ?? null);

  // Backward-compatible Observable stream
  private authStatusSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public authStatus$ = this.authStatusSubject.asObservable();

  // Single-flight refresh token cache
  private refreshInProgress$: Observable<string> | null = null;

  login(username: string, password: string): Observable<boolean> {
    return authLogin(this.http, this.config.rootUrl, {
      body: { usernameOrEmail: username, password }
    }).pipe(
      switchMap(async (response) => {
        const rawText = await response.body.text();
        let parsed: Record<string, unknown> | null = null;
        try {
          parsed = JSON.parse(rawText) as Record<string, unknown>;
        } catch {
          parsed = { accessToken: rawText.replace(/^"|"$/g, '').trim() };
        }

        const accessToken = (parsed?.['accessToken'] || parsed?.['token'] || '').toString().trim();
        const refreshToken = parsed?.['refreshToken'] ? String(parsed['refreshToken']) : null;

        if (!accessToken) {
          throw new Error('Access token missing from login response.');
        }

        const userFromToken = parseUserFromToken(accessToken);
        const serverRoles = Array.isArray(parsed?.['roles'])
          ? (parsed['roles'] as string[])
          : [];
        const roles = serverRoles.length > 0 ? serverRoles : (userFromToken?.roles ?? []);
        const primaryRole = roles[0] || userFromToken?.role || 'Collector';

        const user: AuthUser = {
          id: (parsed?.['userId'] as string | undefined) || userFromToken?.id,
          fullName: (parsed?.['fullName'] as string | undefined) || userFromToken?.fullName,
          email: userFromToken?.email,
          role: primaryRole,
          roles,
          branchId: userFromToken?.branchId ?? null,
          tokenExp: userFromToken?.tokenExp
        };

        this.setSession(accessToken, refreshToken, user);
        return true;
      }),
      catchError(error => {
        return throwError(() => new Error(error?.error?.message || 'Invalid credentials or server error'));
      })
    );
  }

  refreshToken(): Observable<string> {
    if (this.refreshInProgress$) {
      return this.refreshInProgress$;
    }

    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available.'));
    }

    this.refreshInProgress$ = authRefreshToken(this.http, this.config.rootUrl, {
      body: { accessToken, refreshToken }
    }).pipe(
      switchMap(async (response) => {
        const rawText = await response.body.text();
        let parsed: Record<string, unknown> | null = null;
        try {
          parsed = JSON.parse(rawText) as Record<string, unknown>;
        } catch {
          parsed = { accessToken: rawText.replace(/^"|"$/g, '').trim() };
        }

        const newAccessToken = (parsed?.['accessToken'] || parsed?.['token'] || '').toString().trim();
        const newRefreshToken = parsed?.['refreshToken'] ? String(parsed['refreshToken']) : refreshToken;

        if (!newAccessToken) {
          throw new Error('Failed to refresh access token.');
        }

        const userFromToken = parseUserFromToken(newAccessToken);
        const current = this.currentUser();
        const user: AuthUser = {
          id: current?.id || userFromToken?.id,
          fullName: current?.fullName || userFromToken?.fullName,
          email: current?.email || userFromToken?.email,
          role: userFromToken?.role || current?.role || 'Collector',
          roles: userFromToken?.roles?.length ? userFromToken.roles : (current?.roles ?? []),
          branchId: userFromToken?.branchId ?? current?.branchId ?? null,
          tokenExp: userFromToken?.tokenExp
        };

        this.setSession(newAccessToken, newRefreshToken, user);
        return newAccessToken;
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      }),
      finalize(() => {
        this.refreshInProgress$ = null;
      }),
      shareReplay(1)
    );

    return this.refreshInProgress$;
  }

  logout(): void {
    try {
      authLogout(this.http, this.config.rootUrl).subscribe({
        error: () => { /* Best-effort server notification */ }
      });
    } catch {
      // Ignore network errors on logout
    }

    this.clearSession();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getRole(): string | null {
    return this.userRole() || localStorage.getItem(this.ROLE_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  hasRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }

  hasValidToken(): boolean {
    return this.hasToken() && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    const user = parseUserFromToken(token);
    if (!user?.tokenExp) return false;
    // 10-second skew window
    return user.tokenExp * 1000 <= Date.now() + 10000;
  }

  private setSession(token: string, refreshToken?: string | null, user?: AuthUser): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
    const resolvedUser = user ?? parseUserFromToken(token);
    if (resolvedUser) {
      localStorage.setItem(this.ROLE_KEY, resolvedUser.role);
      localStorage.setItem(this.USER_KEY, JSON.stringify(resolvedUser));
      this.currentUser.set(resolvedUser);
    } else {
      this.currentUser.set(null);
    }
    this.authStatusSubject.next(true);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.authStatusSubject.next(false);
  }

  private getStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      if (stored) {
        return JSON.parse(stored) as AuthUser;
      }
      const token = this.getToken();
      if (token) {
        return parseUserFromToken(token);
      }
    } catch {
      return null;
    }
    return null;
  }
}
