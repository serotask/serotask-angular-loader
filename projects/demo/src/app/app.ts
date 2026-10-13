import { HttpClient, HttpContext } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { forkJoin, timer } from 'rxjs';

import {
  LOADER_OPTIONS,
  LoaderOptions,
  LoaderPosition,
  LoaderService,
  LoaderSize,
  LoaderType,
  SKIP_LOADER,
  StLoader,
} from '@serotask/angular-loader';

const API = 'https://jsonplaceholder.typicode.com/posts?_limit=3';

@Component({
  selector: 'app-root',
  imports: [StLoader],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly loader = inject(LoaderService);
  private readonly http = inject(HttpClient);

  protected readonly types: LoaderType[] = [
    'spinner', 'dots', 'bars', 'pulse', 'ring',
    'dual-ring', 'ripple', 'orbit', 'bounce', 'wave',
    'snake', 'square', 'cube', 'dots-wave', 'progress',
    'gradient-ring', 'ellipsis', 'heartbeat', 'stretch', 'solar',
  ];
  protected readonly sizes: LoaderSize[] = ['small', 'medium', 'large'];
  protected readonly positions: LoaderPosition[] = ['top', 'center', 'bottom'];

  protected readonly options = signal<LoaderOptions>({
    type: 'spinner',
    size: 'medium',
    position: 'center',
    text: 'Loading...',
    color: '#2563eb',
    overlay: true,
    overlayOpacity: 0.2,
    showContainer: false,
    showCloseButton: false,
    fullscreen: true,
    duration: 3000,
  });

  protected readonly log = signal<string[]>([]);

  // ---------- option form helpers ----------

  protected patch(partial: LoaderOptions): void {
    this.options.update((current) => ({ ...current, ...partial }));
  }

  protected value(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected checked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  protected asSize(value: string): LoaderSize {
    return value as LoaderSize;
  }

  protected asPosition(value: string): LoaderPosition {
    return value as LoaderPosition;
  }

  // ---------- manual loader ----------

  protected preview(type?: LoaderType): void {
    if (type) {
      this.patch({ type });
    }
    this.loader.show(this.options());
    this.note(`show({ type: '${this.options().type}', duration: ${this.options().duration} })`);
  }

  protected resetLoader(): void {
    this.loader.reset();
    this.note('reset()');
  }

  // ---------- HTTP (interceptor) ----------

  protected singleRequest(): void {
    this.http.get<unknown[]>(API).subscribe({
      next: (posts) => this.note(`GET ok: ${posts.length} posts`),
      error: () => this.note('GET failed - internet check karo (loader phir bhi hide hua)'),
    });
  }

  protected parallelRequests(): void {
    forkJoin([this.http.get(API), this.http.get(API), this.http.get(API)]).subscribe({
      next: () => this.note('3 parallel requests done'),
      error: () => this.note('Parallel requests failed'),
    });
  }

  protected skipLoader(): void {
    this.http.get(API, { context: new HttpContext().set(SKIP_LOADER, true) }).subscribe({
      next: () => this.note('SKIP_LOADER request done (loader nahi dikha)'),
      error: () => this.note('Request failed'),
    });
  }

  protected customText(): void {
    this.http
      .get(API, {
        context: new HttpContext().set(LOADER_OPTIONS, { type: 'progress', text: 'Uploading file...' }),
      })
      .subscribe({
        next: () => this.note('LOADER_OPTIONS request done'),
        error: () => this.note('Request failed'),
      });
  }

  // ---------- track() ----------

  protected trackObservable(): void {
    this.loader.track(timer(2000), 'Tracked observable...').subscribe(() => this.note('track(timer(2000)) done'));
  }

  private note(message: string): void {
    this.log.update((lines) => [`${new Date().toLocaleTimeString()}  ${message}`, ...lines].slice(0, 8));
  }
}
