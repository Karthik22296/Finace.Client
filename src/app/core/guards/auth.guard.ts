import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    _route: ActivatedRouteSnapshot,
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

export const authGuard: CanActivateFn = (_route, state) => {
  return inject(AuthGuard).canActivate(_route, state);
};
