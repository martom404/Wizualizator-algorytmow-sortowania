import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AlgorithmInfo } from '../../sorting/models';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-info-panel',
  imports: [TableModule, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './info-panel.html',
  styleUrl: './info-panel.css',
})
export class InfoPanel {
  info = input.required<AlgorithmInfo>();
  // p-table przyjmuje tablicę wierszy, a my mamy tylko jeden wiersz, więc pakujemy go w tablicę
  rows = computed(() => [this.info()]);
}
