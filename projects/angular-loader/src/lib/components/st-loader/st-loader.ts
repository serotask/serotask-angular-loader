import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StLoaderContainer } from '../st-loader-container/st-loader-container';

@Component({
  selector: 'st-loader',
  imports: [StLoaderContainer],
  templateUrl: './st-loader.html',
  styleUrl: './st-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StLoader {}
