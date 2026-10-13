import { isPlatformBrowser } from '@angular/common';
import { Injectable, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { LOADER_CONFIG } from '../config/loader.config';
import { LoaderOptions, LoaderPosition, LoaderSize, LoaderType } from '../models/loader.types';

type Timer = ReturnType<typeof setTimeout> | null;

/**
 * Single source of truth for the loader.
 *
 * The loader is visible while EITHER a manual `show()` is active OR at least one
 * tracked HTTP request is running, so a finishing request can never hide a loader
 * you opened manually (and the other way round).
 */
@Injectable({
  providedIn: 'root',
})
export class LoaderService implements OnDestroy {
  private readonly config = inject(LOADER_CONFIG);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _visible = signal(false);
  private readonly _manual = signal(false);
  private readonly _requestCount = signal(0);
  private readonly _options = signal<Required<LoaderOptions>>({ ...this.config });

  private showTimer: Timer = null;
  private hideTimer: Timer = null;
  private autoHideTimer: Timer = null;
  private shownAt = 0;

  /** `true` while the loader is on screen. */
  readonly visible = this._visible.asReadonly();

  /** Options currently used to render the loader. */
  readonly options = this._options.asReadonly();

  /** Number of tracked HTTP requests in flight. */
  readonly requestCount = this._requestCount.asReadonly();

  // ============================================
  // MANUAL CONTROL
  // ============================================

  /** Show the loader. Pass a string as a shortcut for `{ text }`. */
  show(options?: LoaderOptions | string): void {
    this._options.set(this.resolve(options));
    this._manual.set(true);

    this.clearTimer('autoHideTimer');
    const { duration } = this._options();
    if (duration > 0 && this.isBrowser) {
      this.autoHideTimer = setTimeout(() => {
        this.autoHideTimer = null;
        this.hide();
      }, duration);
    }

    this.sync();
  }

  /**
   * Hide the loader opened with `show()`.
   * It stays visible while tracked HTTP requests are still running — use `reset()` to force.
   */
  hide(): void {
    this._manual.set(false);
    this.clearTimer('autoHideTimer');
    this.sync();
  }

  toggle(): void {
    if (this._manual()) {
      this.hide();
    } else {
      this.show();
    }
  }

  // ============================================
  // TRACKED REQUESTS (used by the interceptor)
  // ============================================

  startRequest(options?: LoaderOptions | string): void {
    const wasActive = this.isActive();

    this._requestCount.update((count) => count + 1);

    // Do not override the look of a loader that is already showing.
    if (!wasActive) {
      this._options.set(this.resolve(options));
    }

    this.sync();
  }

  endRequest(): void {
    this._requestCount.update((count) => Math.max(0, count - 1));
    this.sync();
  }

  /** Run any async work with the loader: `loader.track(this.http.get(...))`. */
  track<T>(source: Observable<T>, options?: LoaderOptions | string): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.startRequest(options);
      const subscription = source.subscribe(subscriber);
      return () => {
        subscription.unsubscribe();
        this.endRequest();
      };
    });
  }

  // ============================================
  // STATUS
  // ============================================

  isLoading(): boolean {
    return this._visible();
  }

  // ============================================
  // LIVE OPTION CHANGES
  // ============================================

  setType(type: LoaderType): void {
    this._options.update((options) => ({ ...options, type }));
  }

  setSize(size: LoaderSize): void {
    this._options.update((options) => ({ ...options, size }));
  }

  setText(text: string): void {
    this._options.update((options) => ({ ...options, text }));
  }

  setPosition(position: LoaderPosition): void {
    this._options.update((options) => ({ ...options, position }));
  }

  // ============================================
  // RESET
  // ============================================

  /** Force-hide everything and restore the default options. */
  reset(): void {
    this.clearAllTimers();

    this._manual.set(false);
    this._requestCount.set(0);
    this._options.set({ ...this.config });
    this._visible.set(false);
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
  }

  // ============================================
  // INTERNALS
  // ============================================

  private isActive(): boolean {
    return this._manual() || this._requestCount() > 0;
  }

  private resolve(options?: LoaderOptions | string): Required<LoaderOptions> {
    const extra: LoaderOptions = typeof options === 'string' ? { text: options } : (options ?? {});

    // `{ type: undefined }` must not wipe out a default.
    const defined = Object.fromEntries(
      Object.entries(extra).filter(([, value]) => value !== undefined),
    );

    return { ...this.config, ...defined };
  }

  /** Moves `visible` towards `isActive()`, honouring `delay` and `minDuration`. */
  private sync(): void {
    const { delay, minDuration } = this._options();

    if (this.isActive()) {
      this.clearTimer('hideTimer');

      if (this._visible() || this.showTimer) {
        return;
      }

      if (delay > 0 && this.isBrowser) {
        this.showTimer = setTimeout(() => {
          this.showTimer = null;
          this.reveal();
        }, delay);
      } else {
        this.reveal();
      }

      return;
    }

    this.clearTimer('showTimer');

    if (!this._visible()) {
      return;
    }

    const remaining = this.isBrowser ? minDuration - (Date.now() - this.shownAt) : 0;

    if (remaining > 0) {
      if (!this.hideTimer) {
        this.hideTimer = setTimeout(() => {
          this.hideTimer = null;
          this._visible.set(false);
        }, remaining);
      }
    } else {
      this._visible.set(false);
    }
  }

  private reveal(): void {
    this.shownAt = Date.now();
    this._visible.set(true);
  }

  private clearTimer(name: 'showTimer' | 'hideTimer' | 'autoHideTimer'): void {
    const timer = this[name];
    if (timer) {
      clearTimeout(timer);
      this[name] = null;
    }
  }

  private clearAllTimers(): void {
    this.clearTimer('showTimer');
    this.clearTimer('hideTimer');
    this.clearTimer('autoHideTimer');
  }
}
