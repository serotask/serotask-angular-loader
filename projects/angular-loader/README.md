# @serotask/angular-loader

Lightweight, accessible loading indicator for Angular. Includes standalone components, Signals, pure CSS animations, and zero runtime dependencies.

## Features

- 20 built-in animations
- HTTP interceptor with parallel-request counting
- Manual `show()` / `hide()` control that works alongside the interceptor
- Global configuration with `provideLoader()`
- Flicker-free loading with `delay` and `minDuration`
- Per-request skip and custom text through `HttpContext`
- Configurable `size`, `position`, `fullscreen`, `overlay`, `showCloseButton`, and `duration`
- Accessible status announcements and reduced-motion support
- SSR-safe

**Requirements:** Angular 20+ and RxJS 7.

## Install

```bash
npm install @serotask/angular-loader
```

## Quick start

### `app.config.ts`

```ts
import { ApplicationConfig } from "@angular/core";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { loaderInterceptor, provideLoader } from "@serotask/angular-loader";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([loaderInterceptor])),
    provideLoader({
      type: "spinner",
      color: "#2563eb",
      delay: 150,
      minDuration: 300,
    }),
  ],
};
```

### `app.ts`

Add `<st-loader />` once in your root component.

```ts
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { StLoader } from "@serotask/angular-loader";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, StLoader],
  template: `
    <st-loader />
    <router-outlet />
  `,
})
export class App {}
```

With the interceptor configured, tracked HTTP requests show the loader automatically.

## Manual control

```ts
import { Component, inject } from "@angular/core";
import { LoaderService } from "@serotask/angular-loader";

@Component({
  /* ... */
})
export class Example {
  private readonly loader = inject(LoaderService);

  export(): void {
    this.loader.show({ type: "cube", text: "Exporting..." });

    // Call this.loader.hide() when the operation finishes.
  }
}
```

`show('Saving...')` is a shortcut for `show({ text: 'Saving...' })`.

You can also track an observable:

```ts
this.loader.track(this.service.heavyCall(), "Processing...").subscribe();
```

### How manual and HTTP loading combine

The loader stays visible while either a manual `show()` is active or at least one tracked HTTP request is running.

- `hide()` ends the manual part.
- `reset()` force-hides the loader and restores defaults.

## HTTP requests

### Skip the loader for one request

```ts
import { HttpContext } from "@angular/common/http";
import { SKIP_LOADER } from "@serotask/angular-loader";

this.http.get("/api/health", {
  context: new HttpContext().set(SKIP_LOADER, true),
});
```

### Customize the loader for one request

```ts
import { HttpContext } from "@angular/common/http";
import { LOADER_OPTIONS } from "@serotask/angular-loader";

this.http.post("/api/upload", file, {
  context: new HttpContext().set(LOADER_OPTIONS, {
    type: "progress",
    text: "Uploading...",
  }),
});
```

## Options

Set defaults with `provideLoader({...})`, then override them per call with `show({...})`.

| Option            | Type                       | Default      | Description                                             |
| ----------------- | -------------------------- | ------------ | ------------------------------------------------------- |
| `type`            | `LoaderType`               | `spinner`    | Animation type                                          |
| `size`            | `small \| medium \| large` | `medium`     | Animation size                                          |
| `text`            | `string`                   | `Loading...` | Text beneath the loader; `''` hides it                  |
| `fullscreen`      | `boolean`                  | `true`       | `false` confines it to the nearest positioned parent    |
| `overlay`         | `boolean`                  | `true`       | Dim the background and block clicks                     |
| `overlayOpacity`  | `number`                   | `0.2`        | Overlay darkness from 0 to 1                            |
| `showContainer`   | `boolean`                  | `false`      | Show a card behind the loader                           |
| `position`        | `center \| top \| bottom`  | `center`     | Vertical position                                       |
| `showCloseButton` | `boolean`                  | `false`      | Show a close button that force-hides the loader         |
| `color`           | `string`                   | `#2563eb`    | Any CSS color or `var(--x)`                             |
| `duration`        | `number` (ms)              | `0`          | Auto-hide a manual `show()`; `0` means never            |
| `delay`           | `number` (ms)              | `0`          | Wait before showing, avoiding flashes for fast requests |
| `minDuration`     | `number` (ms)              | `0`          | Minimum visible time to reduce flicker                  |

Recommended for most apps: `delay: 150` and `minDuration: 300`.

## Loader types

`spinner`, `dots`, `bars`, `pulse`, `ring`, `dual-ring`, `ripple`, `orbit`, `bounce`, `wave`, `snake`, `square`, `cube`, `dots-wave`, `progress`, `gradient-ring`, `ellipsis`, `heartbeat`, `stretch`, `solar`.

## `LoaderService` API

| Member                                         | Description                                   |
| ---------------------------------------------- | --------------------------------------------- |
| `show(options?)` / `hide()` / `toggle()`       | Manual control                                |
| `startRequest()` / `endRequest()`              | Track requests (used by the interceptor)      |
| `track(observable, options?)`                  | Show the loader while an observable is active |
| `reset()`                                      | Force-hide and restore defaults               |
| `setType`, `setSize`, `setText`, `setPosition` | Change the visible loader live                |
| `visible`, `options`, `requestCount`           | Read-only signals                             |
| `isLoading()`                                  | Returns `true` while the loader is visible    |

## Theming

```css
st-loader {
  --st-loader-text-color: #e5e7eb;
  --st-loader-container-bg: #111827;
}
```

The loader color can also be configured with the `color` option.

## Accessibility and SSR

The loader uses `role="status"`, `aria-live="polite"`, and `aria-busy`, with the status labelled by its text. Animations respect `prefers-reduced-motion`. No timers run on the server.

MIT. See `LICENSE` for the license terms and copyright notices.

## Author

[Satendra Rajput](https://satendra2rajput.com/)
