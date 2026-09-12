import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    console.log('[AuthInterceptor] Attaching token to request:', req.url);
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn('[AuthInterceptor] No token found in localStorage!');
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('[AuthInterceptor] HTTP Error:', error.status, error.url);
      // Enterprise standard: Automatically log out if the backend rejects the token (e.g. expired JWT)
      if (error.status === 401) {
        console.warn('[AuthInterceptor] 401 Unauthorized detected. Logging out...');
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
