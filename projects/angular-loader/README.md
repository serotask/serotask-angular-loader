# @serotask/angular-loader

Lightweight, accessible loading indicator for Angular. Standalone components, Signals, pure CSS animations, zero runtime dependencies.

- 20 built-in animations
- HTTP interceptor with parallel-request counting
- Manual control (`show` / `hide`) that never fights with the interceptor
- Global config with `provideLoader()`
- Flicker-free: `delay` and `minDuration`
- Per-request skip / custom text via `HttpContext`
- Working `size`, `position`, `fullscreen`, `overlay`, `showCloseButton`, `duration`
- Accessible (`role="status"`, `aria-live`) and reduced-motion friendly
- SSR-safe

Requires Angular 20+ and RxJS 7.

## Install

```bash
npm install @serotask/angular-loader
```

## Quick start

`app.config.ts`

```ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor, provideLoader } from '@serotask/angular-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([loaderInterceptor])),
    provideLoader({ type: 'spinner', color: '#2563eb', delay: 150, minDuration: 300 }),
  ],
};
```

`app.ts` (place it once, in the root component)

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StLoader } from '@serotask/angular-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StLoader],
  template: `
    <st-loader />
    <router-outlet />
  `,
})
export class App {}
```

Every HTTP request now shows the loader automatically.

## Manual control

```ts
import { Component, inject } from '@angular/core';
import { LoaderService } from '@serotask/angular-loader';

@Component({ /* ... */ })
export class Example {
  private readonly loader = inject(LoaderService);

  export(): void {
    this.loader.show({ type: 'cube', text: 'Exporting...' });
    // ... later
    this.loader.hide();
  }
}
```

`show('Saving...')` is a shortcut for `show({ text: 'Saving...' })`.

Wrap any observable:

```ts
this.loader.track(this.service.heavyCall(), 'Processing...').subscribe();
```

### How manual and HTTP loading combine

The loader is visible while a manual `show()` is active **or** at least one tracked request is running.
`hide()` only ends the manual part; `reset()` force-hides everything.

## HTTP requests

Skip the loader for one request:

```ts
import { HttpContext } from '@angular/common/http';
import { SKIP_LOADER } from '@serotask/angular-loader';

this.http.get('/api/health', { context: new HttpContext().set(SKIP_LOADER, true) });
```

Custom look for one request:

```ts
import { LOADER_OPTIONS } from '@serotask/angular-loader';

this.http.post('/api/upload', file, {
  context: new HttpContext().set(LOADER_OPTIONS, { type: 'progress', text: 'Uploading...' }),
});
```

## Options

Set defaults once with `provideLoader({...})`, override per call with `show({...})`.

| Option            | Type                          | Default      | Description                                              |
| ----------------- | ----------------------------- | ------------ | -------------------------------------------------------- |
| `type`            | `LoaderType`                  | `spinner`    | Animation (see below)                                    |
| `size`            | `small \| medium \| large`    | `medium`     | Size of the animation                                    |
| `text`            | `string`                      | `Loading...` | Text under the loader (`''` hides it)                    |
| `fullscreen`      | `boolean`                     | `true`       | `false`: fills the nearest positioned parent             |
| `overlay`         | `boolean`                     | `true`       | Dim the background and block clicks                      |
| `overlayOpacity`  | `number`                      | `0.2`        | Overlay darkness, 0–1                                    |
| `showContainer`   | `boolean`                     | `false`      | White card behind the loader                             |
| `position`        | `center \| top \| bottom`     | `center`     | Vertical position                                        |
| `showCloseButton` | `boolean`                     | `false`      | Close button (force-hides the loader)                    |
| `color`           | `string`                      | `#2563eb`    | Any CSS color or `var(--x)`                              |
| `duration`        | `number` (ms)                 | `0`          | Auto-hide a manual `show()`; `0` = never                 |
| `delay`           | `number` (ms)                 | `0`          | Wait before showing, so fast requests never flash        |
| `minDuration`     | `number` (ms)                 | `0`          | Minimum visible time once shown, so it never flickers    |

Recommended for most apps: `delay: 150`, `minDuration: 300`.

### Loader types

`spinner` `dots` `bars` `pulse` `ring` `dual-ring` `ripple` `orbit` `bounce` `wave` `snake` `square` `cube` `dots-wave` `progress` `gradient-ring` `ellipsis` `heartbeat` `stretch` `solar`

## LoaderService API

| Member                                  | Description                                          |
| --------------------------------------- | ---------------------------------------------------- |
| `show(options?)` / `hide()` / `toggle()`| Manual control                                       |
| `startRequest()` / `endRequest()`       | Tracked requests (used by the interceptor)           |
| `track(observable, options?)`           | Show the loader while an observable is active        |
| `reset()`                               | Force-hide and restore defaults                      |
| `setType` `setSize` `setText` `setPosition` | Change the visible loader live                   |
| `visible`, `options`, `requestCount`    | Read-only signals                                    |
| `isLoading()`                           | `true` while the loader is on screen                 |

## Theming

```css
st-loader {
  --st-loader-text-color: #e5e7eb;
  --st-loader-container-bg: #111827;
}
```

The loader colour is controlled by the `color` option.

## Accessibility and SSR

The loader renders with `role="status"`, `aria-live="polite"` and `aria-busy`, labelled with its text.
Animations slow down under `prefers-reduced-motion`. No timers run on the server.

## Migrating from `@kudoengineer/loader`

| Before                                   | After                                    |
| ---------------------------------------- | ---------------------------------------- |
| `KeLoader` / `<ke-loader>`               | `StLoader` / `<st-loader>`               |
| `KeLoaderContainer`                      | `StLoaderContainer`                      |
| `--kudo-loader-*`, `.kudo-*`             | `--st-loader-*`, `.st-*`                 |

See `CHANGELOG.md` for behaviour changes.

## License

MIT. Based on `@kudoengineer/loader` by Satendra Rajput (MIT) — see `LICENSE`.
