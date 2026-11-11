import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-player-controls',
  imports: [FormsModule, ButtonModule, SliderModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './player-controls.html',
  styleUrl: './player-controls.css',
})
export class PlayerControls {
  currentStep = input.required<number>();
  lastStep = input.required<number>();
  isPlaying = input.required<boolean>();
  comparisons = input.required<number>();
  swaps = input.required<number>();
  writes = input.required<number>();

  togglePlay = output<void>();
  nextStep = output<void>();
  previousStep = output<void>();
  restart = output<void>();
  seek = output<number>(); // numer kroku wybrany na suwaku

  playLabel = computed(() => {
    if (this.isPlaying()) {
      return 'Stop';
    }
    if (this.currentStep() === this.lastStep()) {
      return 'Restart';
    }
    return 'Start';
  });

  playIcon = computed(() => (this.isPlaying() ? 'pi pi-pause' : 'pi pi-play'));
}
