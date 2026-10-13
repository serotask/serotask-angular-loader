import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import { LoaderOptions } from '../models/loader.types';

export const DEFAULT_LOADER_OPTIONS: Required<LoaderOptions> = {
  type: 'spinner',
  size: 'medium',
  text: 'Loading...',

  fullscreen: true,

  overlay: true,
  overlayOpacity: 0.2,

  showContainer: false,

  position: 'center',

  showCloseButton: false,

  color: '#2563eb',

  duration: 0,
  delay: 0,
  minDuration: 0,
};

/** Application-wide loader defaults. Provide it with `provideLoader()`. */
export const LOADER_CONFIG = new InjectionToken<Required<LoaderOptions>>('ST_LOADER_CONFIG', {
  providedIn: 'root',
  factory: () => ({ ...DEFAULT_LOADER_OPTIONS }),
});

/**
 * Change the default options for every loader in the app.
 *
 * ```ts
 * provideLoader({ type: 'dots', color: '#7c3aed', delay: 150, minDuration: 300 })
 * ```
 */
export function provideLoader(config: LoaderOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: LOADER_CONFIG,
      useValue: { ...DEFAULT_LOADER_OPTIONS, ...config },
    },
  ]);
}
