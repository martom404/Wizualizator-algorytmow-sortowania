// Dostępne algorytmy
export type Algorithm = 'bubble' | 'quick' | 'counting' | 'radix' | 'bucket';

// Rodzaj podświetlenia słupka
export type HighlightKind = 'compare' | 'swap' | 'write';

// Jeden krok algorytmu. Algorytm zwraca listę takich kroków.
export type Step =
  | { type: 'compare'; indexA: number; indexB: number } // porównanie dwóch elementów
  | { type: 'swap'; indexA: number; indexB: number } // zamiana dwóch elementów miejscami
  | { type: 'sorted'; index: number } // element jest już na swoim miejscu
  | { type: 'count'; index: number; value: number } // counting sort: zliczenie wartości
  | { type: 'place'; index: number; value: number } // counting sort: wpisanie wartości do tablicy
  | { type: 'toBucket'; index: number; bucket: number; value: number } // wrzucenie do kubełka
  // wyjęcie z kubełka, isFinal = to już ostatni przebieg i element jest na swoim miejscu
  | { type: 'fromBucket'; index: number; bucket: number; value: number; isFinal: boolean };

// Jedno pole tablicy zliczeń: wartość i ile razy ją do tej pory policzono
export interface CountSlot {
  value: number;
  count: number;
}

// Wszystko, co jest potrzebne do narysowania jednej klatki animacji
export interface SortState {
  array: number[];
  sorted: number[]; // indeksy elementów już na swoim miejscu
  highlights: number[]; // indeksy podświetlone w tym kroku
  highlightKind: HighlightKind | null;
  counts: CountSlot[] | null; // pola zliczeń (tylko counting sort)
  buckets: number[][] | null; // zawartość kubełków (tylko radix i bucket sort)
  activeSlot: number | null; // podświetlony kubełek albo pole zliczeń
  comparisons: number; // liczniki do statystyk pod wykresem
  swaps: number;
  writes: number;
  description: string; // tekst, który pokazuje się nad wykresem
}

// Opis algorytmu do karty informacyjnej
export interface AlgorithmInfo {
  id: Algorithm;
  name: string;
  summary: string;
  best: string;
  average: string;
  worst: string;
  note: string;
  maxValue: number;
}
