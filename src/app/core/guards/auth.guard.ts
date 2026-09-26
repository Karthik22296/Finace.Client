import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (this.authService.hasValidToken()) {
      return true;
    }

    if (this.authService.hasRefreshToken() && this.authService.isTokenExpired()) {
      return this.authService.refreshToken().pipe(
        map(() => true),
        catchError(() => of(this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })))
      );
    }

    return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthGuard).canActivate(route, state);
};
