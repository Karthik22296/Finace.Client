import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'auth_role';

  private authStatusSubject = new BehaviorSubject<boolean>(this.hasToken());
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(private router: Router) { }

  // Mock login for UI development
  login(username: string, password: string): Observable<boolean> {
    // Replace this with actual API call to api/fn/auth/auth-login later
    return of(true).pipe(
      delay(500),
      tap(() => {
        this.setToken('mock-jwt-token');
        this.setRole(username === 'admin' ? 'Admin' : 'Collector');
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.authStatusSubject.next(false);
    this.router.navigate(['/login']);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.authStatusSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setRole(role: string): void {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
