import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ALGORITHM_INFO } from '../../sorting/algorithm-info';
import { Algorithm } from '../../sorting/models';

@Component({
  selector: 'app-setting-panel',
  imports: [FormsModule, SelectModule, SliderModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './setting-panel.html',
  styleUrl: './setting-panel.css',
})
export class SettingPanel {
  // lista algorytmów do rozwijanej listy
  algorithms = Object.values(ALGORITHM_INFO);

  selectedAlgorithm = input.required<Algorithm>();
  selectedSize = input.required<number>();
  selectedDelay = input.required<number>();

  algorithmChange = output<Algorithm>();
  sizeChange = output<number>();
  delayChange = output<number>();
  shuffle = output<void>();
  imageChange = output<File>();
  imageRemove = output<void>();

  // Wywoływane, gdy użytkownik wybierze plik
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageChange.emit(file);
    }
  }
}
