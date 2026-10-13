import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderService } from '../../services/loader.service';
import { StLoaderContainer } from './st-loader-container';

describe('StLoaderContainer', () => {
  let fixture: ComponentFixture<StLoaderContainer>;
  let loader: LoaderService;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StLoaderContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(StLoaderContainer);
    loader = TestBed.inject(LoaderService);
    element = fixture.nativeElement as HTMLElement;
  });

  it('renders nothing while hidden', () => {
    fixture.detectChanges();

    expect(element.querySelector('.st-loader')).toBeNull();
  });

  it('renders an accessible loader with text when shown', () => {
    loader.show({ text: 'Fetching users...' });
    fixture.detectChanges();

    const root = element.querySelector('.st-loader');
    expect(root?.getAttribute('role')).toBe('status');
    expect(root?.getAttribute('aria-label')).toBe('Fetching users...');
    expect(element.textContent).toContain('Fetching users...');
    expect(element.querySelector('.st-spinner')).not.toBeNull();
  });

  it('renders the selected loader type', () => {
    loader.show({ type: 'cube' });
    fixture.detectChanges();

    expect(element.querySelector('.st-cube')).not.toBeNull();
    expect(element.querySelector('.st-spinner')).toBeNull();
  });

  it('applies size, position and fullscreen options as classes', () => {
    loader.show({ size: 'large', position: 'top', fullscreen: false });
    fixture.detectChanges();

    const root = element.querySelector('.st-loader') as HTMLElement;
    expect(root.classList).toContain('st-loader--large');
    expect(root.classList).toContain('st-loader--top');
    expect(root.classList).toContain('st-loader--inline');
  });

  it('shows a close button that force-hides the loader', () => {
    loader.show({ showCloseButton: true });
    loader.startRequest();
    fixture.detectChanges();

    (element.querySelector('.st-loader__close') as HTMLButtonElement).click();

    expect(loader.visible()).toBe(false);
  });

  it('has no close button by default', () => {
    loader.show();
    fixture.detectChanges();

    expect(element.querySelector('.st-loader__close')).toBeNull();
  });
});
