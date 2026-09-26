import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Exclude auth endpoints from token attachment (except logout which may attach current token)
  const isAuthNoTokenEndpoint = req.url.includes('/api/auth/login') ||
    req.url.includes('/api/auth/refresh-token') ||
    req.url.includes('/api/auth/register');

  // Any auth endpoint (including logout) must never trigger a refresh loop on 401
  const isRefreshExemptEndpoint = isAuthNoTokenEndpoint || req.url.includes('/api/auth/logout');

  let authReq = req;
  if (token && !isAuthNoTokenEndpoint) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Single-flight refresh token flow on 401 Unauthorized for non-auth requests
      if (error.status === 401 && !isRefreshExemptEndpoint) {
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
