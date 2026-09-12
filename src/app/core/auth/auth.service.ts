import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../../api/api-configuration';
import { authLogin } from '../../../api/fn/auth/auth-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'auth_role';

  private authStatusSubject = new BehaviorSubject<boolean>(this.hasToken());
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private config: ApiConfiguration
  ) { }

  login(username: string, password: string): Observable<boolean> {
    return authLogin(this.http, this.config.rootUrl, { 
      body: { usernameOrEmail: username, password } 
    }).pipe(
      switchMap(async (response) => {
        // The generated client treats text/plain or binary responses as Blobs
        const token = await response.body.text();
        this.setToken(token);
        
        // Basic role assignment (can be upgraded to JWT decoding later)
        this.setRole(username.toLowerCase().includes('admin') ? 'Admin' : 'Collector');
        return true;
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(() => new Error('Invalid credentials or server error'));
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
