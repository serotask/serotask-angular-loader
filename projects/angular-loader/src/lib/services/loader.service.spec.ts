import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { provideLoader } from '../config/loader.config';
import { LoaderOptions } from '../models/loader.types';
import { LoaderService } from './loader.service';

function setup(config: LoaderOptions = {}): LoaderService {
  TestBed.configureTestingModule({ providers: [provideLoader(config)] });
  return TestBed.inject(LoaderService);
}

describe('LoaderService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows and hides manually', () => {
    const loader = setup();

    loader.show();
    expect(loader.visible()).toBe(true);

    loader.hide();
    expect(loader.visible()).toBe(false);
  });

  it('stays visible until all parallel requests finish', () => {
    const loader = setup();

    loader.startRequest();
    loader.startRequest();
    expect(loader.requestCount()).toBe(2);

    loader.endRequest();
    expect(loader.visible()).toBe(true);

    loader.endRequest();
    expect(loader.visible()).toBe(false);
  });

  it('never goes below zero requests', () => {
    const loader = setup();

    loader.endRequest();
    expect(loader.requestCount()).toBe(0);
  });

  it('does not let a finishing request hide a manual loader', () => {
    const loader = setup();

    loader.show();
    loader.startRequest();
    loader.endRequest();

    expect(loader.visible()).toBe(true);
  });

  it('does not let hide() close the loader while a request is running', () => {
    const loader = setup();

    loader.show();
    loader.startRequest();
    loader.hide();
    expect(loader.visible()).toBe(true);

    loader.endRequest();
    expect(loader.visible()).toBe(false);
  });

  it('does not override the look of a loader that is already showing', () => {
    const loader = setup();

    loader.show({ type: 'dots', text: 'Manual' });
    loader.startRequest({ type: 'cube', text: 'Request' });

    expect(loader.options().type).toBe('dots');
    expect(loader.options().text).toBe('Manual');
  });

  it('uses defaults from provideLoader() and lets show() override them', () => {
    const loader = setup({ type: 'ring', color: '#ff0000' });

    loader.show('Please wait');

    expect(loader.options().type).toBe('ring');
    expect(loader.options().color).toBe('#ff0000');
    expect(loader.options().text).toBe('Please wait');
  });

  it('ignores undefined option values', () => {
    const loader = setup({ type: 'ring' });

    loader.show({ type: undefined });

    expect(loader.options().type).toBe('ring');
  });

  it('reset() force-hides everything and restores defaults', () => {
    const loader = setup();

    loader.show({ type: 'cube' });
    loader.startRequest();
    loader.reset();

    expect(loader.visible()).toBe(false);
    expect(loader.requestCount()).toBe(0);
    expect(loader.options().type).toBe('spinner');
  });

  it('delay: waits before showing', () => {
    vi.useFakeTimers();
    const loader = setup({ delay: 100 });

    loader.startRequest();
    vi.advanceTimersByTime(99);
    expect(loader.visible()).toBe(false);

    vi.advanceTimersByTime(1);
    expect(loader.visible()).toBe(true);
  });

  it('delay: a fast request never flashes the loader', () => {
    vi.useFakeTimers();
    const loader = setup({ delay: 100 });

    loader.startRequest();
    vi.advanceTimersByTime(50);
    loader.endRequest();
    vi.advanceTimersByTime(500);

    expect(loader.visible()).toBe(false);
  });

  it('minDuration: keeps the loader visible for at least the given time', () => {
    vi.useFakeTimers();
    const loader = setup({ minDuration: 300 });

    loader.show();
    vi.advanceTimersByTime(100);
    loader.hide();
    expect(loader.visible()).toBe(true);

    vi.advanceTimersByTime(199);
    expect(loader.visible()).toBe(true);

    vi.advanceTimersByTime(1);
    expect(loader.visible()).toBe(false);
  });

  it('minDuration: stays visible if a new request starts while waiting to hide', () => {
    vi.useFakeTimers();
    const loader = setup({ minDuration: 300 });

    loader.startRequest();
    loader.endRequest();
    loader.startRequest();
    vi.advanceTimersByTime(1000);

    expect(loader.visible()).toBe(true);
  });

  it('duration: auto-hides a manual loader', () => {
    vi.useFakeTimers();
    const loader = setup();

    loader.show({ duration: 500 });
    vi.advanceTimersByTime(499);
    expect(loader.visible()).toBe(true);

    vi.advanceTimersByTime(1);
    expect(loader.visible()).toBe(false);
  });

  it('track() shows the loader until the observable completes', () => {
    const loader = setup();
    const source = new Subject<number>();

    const subscription = loader.track(source).subscribe();
    expect(loader.visible()).toBe(true);

    source.complete();
    expect(loader.visible()).toBe(false);
    subscription.unsubscribe();
  });

  it('track() also hides the loader on unsubscribe', () => {
    const loader = setup();

    const subscription = loader.track(new Subject<number>()).subscribe();
    expect(loader.visible()).toBe(true);

    subscription.unsubscribe();
    expect(loader.visible()).toBe(false);
  });
});
