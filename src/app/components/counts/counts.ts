import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CountSlot } from '../../sorting/models';

@Component({
  selector: 'app-counts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './counts.html',
  styleUrl: './counts.css',
})
export class Counts {
  counts = input.required<CountSlot[] | null>(); // pola zliczeń z bieżącej klatki
  active = input<number | null>(null); // numer pola zmienianego w tym kroku
}
