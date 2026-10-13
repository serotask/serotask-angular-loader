# Changelog

Versioning follows [SemVer](https://semver.org). Add an entry here before every release.

## 1.0.0

Based on `@kudoengineer/loader` 1.0.1 (MIT), renamed and extended.

### Changed
- Package renamed to `@serotask/angular-loader`.
- Components: `ke-loader` → `st-loader`, `ke-loader-container` → `st-loader-container`
  (`KeLoader` → `StLoader`, `KeLoaderContainer` → `StLoaderContainer`).
- CSS classes and variables: `kudo-*` → `st-*`, `--kudo-loader-*` → `--st-loader-*`.
- `hide()` now only ends a manual `show()`; it no longer hides the loader while HTTP requests
  are still running (and a finishing request no longer hides a manual loader). Use `reset()` to force.
- The interceptor uses the global defaults instead of hard-coded options.

### Added
- `provideLoader(config)` and `LOADER_CONFIG` for app-wide defaults.
- `delay` and `minDuration` options to avoid flicker on fast requests.
- `LOADER_OPTIONS` HttpContext token for per-request text/type/colour.
- `LoaderService.track(observable)` helper.
- Working `size`, `position`, `fullscreen`, `showCloseButton` and `duration` options
  (they were documented but not implemented).
- Accessibility: `role="status"`, `aria-live`, `aria-busy`, label from `text`.
- Theming variables `--st-loader-text-color` and `--st-loader-container-bg`;
  spinner/ring tracks now follow the loader colour.
- SSR-safe (no timers on the server) and timers cleaned up on destroy.
- Real unit tests for the service, interceptor and component.
