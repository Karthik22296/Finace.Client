import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const expectedRoles = (route.data?.['roles'] as string[]) || [];
    if (!expectedRoles.length) {
      return true;
    }

    const currentRole = this.authService.getRole();
    const currentUser = this.authService.currentUser();
    const userRoles = currentUser?.roles?.length ? currentUser.roles : (currentRole ? [currentRole] : []);

    const isAuthorized = expectedRoles.some(expected =>
      userRoles.some(r => r.toLowerCase() === expected.toLowerCase())
    );

    if (isAuthorized) {
      return true;
    }

    return this.router.createUrlTree(['/dashboard']);
  }
}

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentRole = authService.getRole();
    const currentUser = authService.currentUser();
    const userRoles = currentUser?.roles?.length ? currentUser.roles : (currentRole ? [currentRole] : []);

    const isAuthorized = allowedRoles.some(expected =>
      userRoles.some(r => r.toLowerCase() === expected.toLowerCase())
    );

    return isAuthorized ? true : router.createUrlTree(['/dashboard']);
  };
};
