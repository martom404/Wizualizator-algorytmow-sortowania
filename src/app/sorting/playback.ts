import { Algorithm, CountSlot, Step, SortState } from './models';
import { emptyBuckets } from './algorithm';

// Pola zliczeń dla Counting Sort
function emptyCounts(array: number[]): CountSlot[] {
  const values: number[] = [];
  for (const value of array) {
    if (!values.includes(value)) {
      values.push(value);
    }
  }

  values.sort((a, b) => a - b);

  const counts: CountSlot[] = [];
  for (const value of values) {
    counts.push({ value: value, count: 0 });
  }
  return counts;
}

// Stan przed pierwszym krokiem
export function initialState(array: number[], algorithm: Algorithm): SortState {
  return {
    array: [...array],
    sorted: [],
    highlights: [],
    highlightKind: null,
    // Pola zliczeń tylko dla Counting Sort
    counts: algorithm === 'counting' ? emptyCounts(array) : null,
    // 10 pustych kubełków tylko dla Radix i Bucket Sort
    buckets: algorithm === 'radix' || algorithm === 'bucket' ? emptyBuckets() : null,
    activeSlot: null,
    comparisons: 0,
    swaps: 0,
    writes: 0,
    description: 'Gotowe do rozpoczęcia sortowania. Naciśnij przycisk "Start", aby rozpocząć wizualizację.',
  };
}

// Na podstawie poprzedniego stanu i jednego kroku tworzy następną klatkę.
// Poprzedni stan zostaje bez zmian, dlatego wszystkie tablice są kopiowane.
export function applyStep(previous: SortState, step: Step): SortState {
  const next: SortState = {
    ...previous,
    array: [...previous.array],
    sorted: [...previous.sorted],
    counts: previous.counts ? previous.counts.map((slot) => ({ ...slot })) : null,
    buckets: previous.buckets ? previous.buckets.map((bucket) => [...bucket]) : null,
    highlights: [],
    highlightKind: null,
    activeSlot: null,
    description: '',
  };

  switch (step.type) {
    case 'compare': {
      const a = next.array[step.indexA];
      const b = next.array[step.indexB];
      next.comparisons++;
      next.highlights = [step.indexA, step.indexB];
      next.highlightKind = 'compare';
      next.description = `Porównanie: ${a} (poz. ${step.indexA + 1}) z ${b} (poz. ${step.indexB + 1})`;
      break;
    }
    case 'swap': {
      const a = next.array[step.indexA];
      const b = next.array[step.indexB];
      next.array[step.indexA] = b;
      next.array[step.indexB] = a;
      next.swaps++;
      next.highlights = [step.indexA, step.indexB];
      next.highlightKind = 'swap';
      if (step.indexA === step.indexB) {
        next.description = `Element ${a} zostaje na pozycji ${step.indexA + 1}`;
      } else {
        next.description = `Zamiana: ${a} <--> ${b}`;
      }
      break;
    }
    case 'sorted': {
      next.sorted.push(step.index);
      next.description = `Element ${next.array[step.index]} jest na swoim miejscu.`;
      break;
    }
    case 'count': {
      // szukamy pola z tą wartością i zwiększamy jego licznik
      const slot = next.counts!.findIndex((s) => s.value === step.value);
      next.counts![slot].count++;
      next.highlights = [step.index];
      next.highlightKind = 'write';
      next.activeSlot = slot;
      next.description = `Wartość: ${step.value}, wystąpiła już ${next.counts![slot].count} raz(y).`;
      break;
    }
    case 'place': {
      // wpisujemy wartość do tablicy, a w jej polu zmniejszamy licznik
      const slot = next.counts!.findIndex((s) => s.value === step.value);
      next.counts![slot].count--;
      next.array[step.index] = step.value;
      next.sorted.push(step.index);
      next.writes++;
      next.highlights = [step.index];
      next.highlightKind = 'write';
      next.activeSlot = slot;
      next.description = `Wpisanie wartości ${step.value} na pozycję ${step.index + 1}`;
      break;
    }
    case 'toBucket': {
      next.buckets![step.bucket].push(step.value);
      next.writes++;
      next.highlights = [step.index];
      next.highlightKind = 'write';
      next.activeSlot = step.bucket;
      next.description = `Element ${step.value} trafia do kubełka ${step.bucket}`;
      break;
    }
    case 'fromBucket': {
      const bucket = next.buckets![step.bucket];
      bucket.splice(bucket.indexOf(step.value), 1);
      next.array[step.index] = step.value;
      if (step.isFinal) {
        next.sorted.push(step.index);
      }
      next.writes++;
      next.highlights = [step.index];
      next.highlightKind = 'write';
      next.activeSlot = step.bucket;
      next.description = `Z kubełka ${step.bucket}: wartość ${step.value} na pozycję ${step.index + 1}`;
      break;
    }
  }

  return next;
}

// Zamienia listę kroków na listę gotowych klatek (stanów).
// Dzięki temu można łatwo cofać się i przeskakiwać do dowolnego kroku suwakiem.
export function buildSnapshots(array: number[], steps: Step[], algorithm: Algorithm): SortState[] {
  let current = initialState(array, algorithm);
  const snapshots: SortState[] = [current];

  for (const step of steps) {
    current = applyStep(current, step);
    snapshots.push(current);
  }

  // Ostatnia klatka: zdejmujemy podświetlenia i zmieniamy opis na końcowy
  current.description = 'Tablica została posortowana.';
  current.highlights = [];
  current.highlightKind = null;
  current.activeSlot = null;

  return snapshots;
}
