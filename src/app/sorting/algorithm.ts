import { Algorithm, Step } from './models';

// Algorytmy nie zmieniają tablicy na ekranie bezpośrednio, tylko zwracają listę kroków, które potem są odtwarzane jeden po drugim.

export function emptyBuckets(): number[][] {
  return Array.from({ length: 10 }, () => []);
}

export function bubbleSort(array: number[]): Step[] {
  // Algorytm sortuje kopię, a nie oryginał.
  // Oryginalna tablica jest potrzebna, żeby zacząć animację od stanu nieposortowanego.
  const copy = [...array];
  const steps: Step[] = [];

  for (let i = 0; i < copy.length - 1; i++) {
    for (let j = 0; j < copy.length - i - 1; j++) {
      steps.push({ type: 'compare', indexA: j, indexB: j + 1 });

      if (copy[j] > copy[j + 1]) {
        [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];
        steps.push({ type: 'swap', indexA: j, indexB: j + 1 });
      }
    }
    steps.push({ type: 'sorted', index: copy.length - i - 1 });
  }

  // Na końcu zostaje sam pierwszy element, więc on też jest już na miejscu
  steps.push({ type: 'sorted', index: 0 });

  return steps;
}

export function quickSort(array: number[]): Step[] {
  const copy = [...array];
  const steps: Step[] = [];

  // Zamiana miejsc + zapisanie kroku
  function swap(a: number, b: number): void {
    [copy[a], copy[b]] = [copy[b], copy[a]];
    steps.push({ type: 'swap', indexA: a, indexB: b });
  }

  // Dzieli zakres na część mniejszą i większą od pivota, zwraca nową pozycję pivota.
  // low - numer pierwszego elementu, high - ostatniego elementu
  function partition(low: number, high: number): number {
    const pivot = copy[high];
    // i - to granica, wszystko na lewo od i jest mniejsze od pivota
    let i = low;
    for (let j = low; j < high; j++) {
      steps.push({ type: 'compare', indexA: j, indexB: high });
      // Gdy j znajdzie element mniejszy od pivota, przenosi go na pozycję i
      // oraz przesuwa granicę o jeden w prawo
      if (copy[j] < pivot) {
        swap(i, j);
        i++;
      }
    }
    // na koniec pivot ląduje na granicy, czyli na swoim docelowym miejscu
    swap(i, high);
    return i;
  }

  //sortowanie zakresu od low do high
  function sort(low: number, high: number): void {
    if (low > high) {
      return;
    }
    // zakres z jednym elementem jest już posortowany
    if (low === high) {
      steps.push({ type: 'sorted', index: low });
      return;
    }

    const pivotIndex = partition(low, high);
    steps.push({ type: 'sorted', index: pivotIndex });
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  }

  sort(0, copy.length - 1);
  return steps;
}

export function countingSort(array: number[]): Step[] {
  const steps: Step[] = [];
  const max = Math.max(...array);
  // counts[x] = ile razy wartość x wystąpiła w tablicy
  const counts: number[] = new Array(max + 1).fill(0);

  // 1. Liczenie
  for (let i = 0; i < array.length; i++) {
    counts[array[i]]++;
    steps.push({ type: 'count', index: i, value: array[i] });
  }

  // 2. Wpisywanie od najmniejszej wartości, każdej tyle razy, ile wystąpiła
  let position = 0;
  for (let value = 0; value <= max; value++) {
    while (counts[value] > 0) {
      steps.push({ type: 'place', index: position, value });
      counts[value]--;
      position++;
    }
  }

  return steps;
}

export function radixSort(array: number[]): Step[] {
  const copy = [...array];
  const steps: Step[] = [];

  // Dwa przebiegi: najpierw po cyfrze jedności (dzielnik 1), potem po cyfrze dziesiątek (dzielnik 10).
  for (const divisor of [1, 10]) {
    const buckets = emptyBuckets();

    // Wrzucanie wartości do kubełków według aktualnej cyfry
    for (let i = 0; i < copy.length; i++) {
      const digit = Math.floor(copy[i] / divisor) % 10;
      buckets[digit].push(copy[i]);
      steps.push({ type: 'toBucket', index: i, bucket: digit, value: copy[i] });
    }

    // Wyjmowanie po kolei z kubełków wartości
    let position = 0;
    for (let bucket = 0; bucket < 10; bucket++) {
      for (const value of buckets[bucket]) {
        copy[position] = value;
        // dopiero po drugim przebiegu (dziesiątki) element jest na swoim miejscu
        steps.push({ type: 'fromBucket', index: position, bucket, value, isFinal: divisor === 10 });
        position++;
      }
    }
  }

  return steps;
}

export function bucketSort(array: number[]): Step[] {
  const steps: Step[] = [];
  const buckets = emptyBuckets();

  // 1. Wrzucanie - numer kubełka to cyfra dziesiątek (1-9 -> 0, 10-19 -> 1 itd.)
  for (let i = 0; i < array.length; i++) {
    const bucket = Math.floor(array[i] / 10);
    buckets[bucket].push(array[i]);
    steps.push({ type: 'toBucket', index: i, bucket, value: array[i] });
  }

  // 2. Sortowanie każdego kubełka osobno
  for (const bucket of buckets) {
    bucket.sort((a, b) => a - b);
  }

  // 3. Wyjmowanie po kolei z kubełków 0-9
  let position = 0;
  for (let bucket = 0; bucket < 10; bucket++) {
    for (const value of buckets[bucket]) {
      steps.push({ type: 'fromBucket', index: position, bucket, value, isFinal: true });
      position++;
    }
  }

  return steps;
}

export function runAlgorithm(algorithm: Algorithm, array: number[]): Step[] {
  switch (algorithm) {
    case 'bubble':
      return bubbleSort(array);
    case 'quick':
      return quickSort(array);
    case 'counting':
      return countingSort(array);
    case 'radix':
      return radixSort(array);
    case 'bucket':
      return bucketSort(array);
  }
}

export function generateArray(size: number, maxValue: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * maxValue) + 1);
}

// Liczby od 1 do size w losowej kolejności (liczba = numer kawałka zdjęcia)
export function generateShuffledRange(size: number): number[] {
  // Najpierw po kolei: 1, 2, 3, ..., size
  const result = Array.from({ length: size }, (_, i) => i + 1);

  // Potem mieszamy
  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
