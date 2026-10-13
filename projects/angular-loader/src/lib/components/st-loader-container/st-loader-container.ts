import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'st-loader-container',
  imports: [],
  templateUrl: './st-loader-container.html',
  styleUrl: './st-loader-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StLoaderContainer {
  private readonly loaderService = inject(LoaderService);

  readonly visible = this.loaderService.visible;
  readonly options = this.loaderService.options;

  /** Close button: force-hide, even if requests are still running. */
  close(): void {
    this.loaderService.reset();
  }
}
