import { Component, input } from '@angular/core';
import { SortState } from '../../sorting/models';

@Component({
  selector: 'app-sort-bars',
  imports: [],
  templateUrl: './sort-bars.html',
  styleUrl: './sort-bars.css',
})
export class SortBars {
  state = input.required<SortState>();
  maxValue = input.required<number>();
  imageUrl = input(''); // pusty = zwykłe słupki

  // Styl słupka, który ma pokazać kawałek zdjęcia o numerze "value"
  imageStyle(value: number) {
    const count = this.state().array.length; // na ile kawałków dzielimy zdjęcie

    return {
      'background-image': 'url(' + this.imageUrl() + ')',
      'background-size': count * 100 + '% 100%',
      'background-position': ((value - 1) / (count - 1)) * 100 + '% 0',
    };
  }

  color(index: number): string {
    const state = this.state();

    const isHighlighted = state.highlights.includes(index);
    const isSorted = state.sorted.includes(index);

    if (isHighlighted && state.highlightKind !== null) {
      return state.highlightKind;
    }

    if (isSorted) {
      return 'sorted';
    }

    return 'idle';
  }
}
