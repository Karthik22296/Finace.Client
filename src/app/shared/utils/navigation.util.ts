import { Location } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Shared navigation-back utility.
 * Falls back to the given route when there is no browser history.
 */
export function goBack(location: Location, router: Router, fallbackRoute = '/dashboard'): void {
  if (window.history.length > 1) {
    location.back();
  } else {
    router.navigate([fallbackRoute]);
  }
}
