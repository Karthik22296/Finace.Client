import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  
  // Show loader on request start
  loaderService.show();

  return next(req).pipe(
    // Hide loader when request completes (success or error)
    finalize(() => loaderService.hide())
  );
};
