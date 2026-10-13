import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { provideLoader } from '../config/loader.config';
import { LoaderService } from '../services/loader.service';
import { LOADER_OPTIONS, SKIP_LOADER } from '../tokens/loader.tokens';
import { loaderInterceptor } from './loader.interceptor';

describe('loaderInterceptor', () => {
  let http: HttpClient;
  let mock: HttpTestingController;
  let loader: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideLoader(),
        provideHttpClient(withInterceptors([loaderInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
    loader = TestBed.inject(LoaderService);
  });

  afterEach(() => mock.verify());

  it('shows the loader during a request and hides it afterwards', () => {
    http.get('/api/users').subscribe();
    expect(loader.visible()).toBe(true);

    mock.expectOne('/api/users').flush([]);
    expect(loader.visible()).toBe(false);
  });

  it('hides the loader when the request fails', () => {
    http.get('/api/users').subscribe({ error: () => undefined });

    mock.expectOne('/api/users').flush('boom', { status: 500, statusText: 'Server Error' });

    expect(loader.visible()).toBe(false);
  });

  it('tracks parallel requests', () => {
    http.get('/a').subscribe();
    http.get('/b').subscribe();

    mock.expectOne('/a').flush({});
    expect(loader.visible()).toBe(true);

    mock.expectOne('/b').flush({});
    expect(loader.visible()).toBe(false);
  });

  it('skips the loader when SKIP_LOADER is set', () => {
    http.get('/health', { context: new HttpContext().set(SKIP_LOADER, true) }).subscribe();

    expect(loader.visible()).toBe(false);
    mock.expectOne('/health').flush({});
  });

  it('applies per-request options from LOADER_OPTIONS', () => {
    http
      .post('/upload', {}, { context: new HttpContext().set(LOADER_OPTIONS, { text: 'Uploading...', type: 'progress' }) })
      .subscribe();

    expect(loader.options().text).toBe('Uploading...');
    expect(loader.options().type).toBe('progress');

    mock.expectOne('/upload').flush({});
  });
});
