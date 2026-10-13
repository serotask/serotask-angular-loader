import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { delay } from 'rxjs';

import { loaderInterceptor, provideLoader } from '@serotask/angular-loader';

/** Demo only: slows responses down so the loader is easy to see. Runs AFTER loaderInterceptor. */
const slowDown: HttpInterceptorFn = (req, next) => next(req).pipe(delay(1200));

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([loaderInterceptor, slowDown])),
    // Global defaults for every loader in the app.
    provideLoader({ type: 'spinner', color: '#2563eb', delay: 150, minDuration: 300 }),
  ],
};
