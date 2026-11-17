import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SortState } from '../../sorting/models';

@Component({
  selector: 'app-sort-bars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sort-bars.html',
  styleUrl: './sort-bars.css',
})
export class SortBars {
  state = input.required<SortState>();
  maxValue = input.required<number>(); // potrzebne do policzenia wysokości słupka w %
  imageUrl = input('');

  // Zdjęcie jest rozciągnięte na szerokość wszystkich słupków i przesunięte tak,
  // żeby w danym słupku był widoczny tylko jego kawałek.
  imageStyle(value: number) {
    const count = this.state().array.length;

    return {
      // Wstawiamy zdjęcie jako tło słupka.
      'background-image': `url(${this.imageUrl()})`,

      // Robimy zdjęcie tak szerokie jak wszystkie słupki razem.
      // Dzięki temu w jednym słupku mieści się tylko jeden kawałek zdjęcia.
      'background-size': `${count * 100}% 100%`,

      // Przesuwamy zdjęcie w bok, żeby w słupku było widać właściwy kawałek:
      // value = 1 -> 0% (pierwszy kawałek od lewej),
      // value = count -> 100% (ostatni kawałek po prawej),
      // reszta wartości wypada równo pomiędzy.
      'background-position': `${((value - 1) / (count - 1)) * 100}% 0`,
    };
  }

  barClass(index: number): string {
    const state = this.state();

    if (state.highlightKind !== null && state.highlights.includes(index)) {
      return state.highlightKind;
    }

    if (state.sorted.includes(index)) {
      return 'sorted';
    }

    return 'idle';
  }
}
