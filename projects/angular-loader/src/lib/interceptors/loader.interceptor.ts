import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoaderService } from '../services/loader.service';
import { LOADER_OPTIONS, SKIP_LOADER } from '../tokens/loader.tokens';

/**
 * Shows the loader while HTTP requests are in flight.
 * Look and behaviour come from `provideLoader()`; use `SKIP_LOADER` or
 * `LOADER_OPTIONS` (HttpContext) to change them for a single request.
 */
export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADER)) {
    return next(req);
  }

  const loader = inject(LoaderService);
  loader.startRequest(req.context.get(LOADER_OPTIONS) ?? undefined);

  return next(req).pipe(finalize(() => loader.endRequest()));
};
