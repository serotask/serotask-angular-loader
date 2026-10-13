export type LoaderType =
  | 'spinner'
  | 'dots'
  | 'bars'
  | 'pulse'
  | 'ring'
  | 'dual-ring'
  | 'ripple'
  | 'orbit'
  | 'bounce'
  | 'wave'
  | 'snake'
  | 'square'
  | 'cube'
  | 'dots-wave'
  | 'progress'
  | 'gradient-ring'
  | 'ellipsis'
  | 'heartbeat'
  | 'stretch'
  | 'solar';

export type LoaderSize = 'small' | 'medium' | 'large';

export type LoaderPosition = 'center' | 'top' | 'bottom';

export interface LoaderOptions {
  /** Loader animation. */
  type?: LoaderType;
  /** Loader size. */
  size?: LoaderSize;
  /** Text shown under the loader. Empty string hides it. */
  text?: string;
  /** `true`: covers the whole viewport. `false`: fills the nearest positioned parent. */
  fullscreen?: boolean;
  /** Dim the background and block clicks behind the loader. */
  overlay?: boolean;
  /** Overlay darkness, 0 – 1. */
  overlayOpacity?: number;
  /** Draw a white card behind the loader. */
  showContainer?: boolean;
  /** Vertical position of the loader. */
  position?: LoaderPosition;
  /** Show a close button (calls `LoaderService.hide()`). */
  showCloseButton?: boolean;
  /** Any CSS color, e.g. `#2563eb` or `var(--primary)`. */
  color?: string;
  /** Auto-hide a manual `show()` after N ms. `0` = never. */
  duration?: number;
  /** Wait N ms before showing, so very fast requests never flash the loader. */
  delay?: number;
  /** Once visible, stay at least N ms, so the loader never flickers. */
  minDuration?: number;
}
