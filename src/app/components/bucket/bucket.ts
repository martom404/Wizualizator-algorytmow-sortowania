import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-bucket',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bucket.html',
  styleUrl: './bucket.css',
})
export class Bucket {
  buckets = input.required<number[][] | null>(); // zawartość kubełków z bieżącej klatki
  active = input<number | null>(null); // numer kubełka używanego w tym kroku
}
