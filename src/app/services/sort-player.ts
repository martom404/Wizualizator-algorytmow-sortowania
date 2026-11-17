import { Injectable, computed, signal } from '@angular/core';
import { generateArray, generateShuffledRange, runAlgorithm } from '../sorting/algorithm';
import { ALGORITHM_INFO } from '../sorting/algorithm-info';
import { buildSnapshots } from '../sorting/playback';
import { Algorithm, SortState } from '../sorting/models';

// Serwis, który trzyma cały stan wizualizacji i steruje odtwarzaniem
@Injectable({
  providedIn: 'root',
})
export class SortPlayer {
  // Ustawienia użytkownika
  algorithm = signal<Algorithm>('bubble');
  size = signal(10); // liczba elementów tablicy
  delay = signal(200); // czas między krokami w ms
  imageUrl = signal(''); // adres wgranego zdjęcia

  snapshots = signal<SortState[]>([]); // wszystkie klatki animacji policzone z góry
  currentStep = signal(0); // numer aktualnie wyświetlanej klatki
  isPlaying = signal(false);

  state = computed(() => this.snapshots()[this.currentStep()]); // aktualna klatka
  lastStep = computed(() => this.snapshots().length - 1);
  info = computed(() => ALGORITHM_INFO[this.algorithm()]); // opis wybranego algorytmu

  private timer = 0; // potrzebne do zatrzymania animacji

  constructor() {
    // od razu po starcie losujemy pierwszą tablicę
    this.shuffle();
  }

  // Włącza automatyczne odtwarzanie - co "delay" ms przechodzi do następnego kroku
  play(): void {
    if (this.isPlaying()) {
      return;
    }

    // jeśli animacja doszła do końca, to zaczynamy od początku
    if (this.currentStep() === this.lastStep()) {
      this.currentStep.set(0);
    }

    this.isPlaying.set(true);
    this.timer = setInterval(() => this.stepForward(), this.delay());
  }

  pause(): void {
    this.isPlaying.set(false);
    clearInterval(this.timer);
  }

  // Jeden krok do przodu (wywoływane przez timer), na ostatnim kroku zatrzymuje animację
  stepForward(): void {
    if (this.currentStep() === this.lastStep()) {
      this.pause();
      return;
    }

    this.currentStep.update((step) => step + 1);
  }

  // Krok do przodu z przycisku - najpierw zatrzymuje animację
  nextStep(): void {
    this.pause();
    this.stepForward();
  }

  // Krok do tyłu z przycisku
  stepBack(): void {
    this.pause();
    if (this.currentStep() > 0) {
      this.currentStep.update((step) => step - 1);
    }
  }

  // Przeskok do konkretnego kroku (suwak)
  seek(step: number): void {
    this.pause();
    this.currentStep.set(step);
  }

  // Powrót na początek tej samej tablicy
  restart(): void {
    this.pause();
    this.currentStep.set(0);
  }

  togglePlay(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  setDelay(delay: number): void {
    this.delay.set(delay);
    // setInterval ma stały czas, więc żeby zmiana zadziałała od razu, trzeba go uruchomić od nowa
    if (this.isPlaying()) {
      this.pause();
      this.play();
    }
  }

  setAlgorithm(algorithm: Algorithm): void {
    this.algorithm.set(algorithm);
  }

  setSize(size: number): void {
    this.size.set(size);
    this.shuffle();
  }

  setImage(file: File): void {
    // zwalniamy poprzednie zdjęcie z pamięci (jeśli było) i tworzymy adres dla nowego pliku
    URL.revokeObjectURL(this.imageUrl());
    this.imageUrl.set(URL.createObjectURL(file));
    this.shuffle();
  }

  removeImage(): void {
    URL.revokeObjectURL(this.imageUrl());
    this.imageUrl.set('');
    this.shuffle();
  }

  // Losuje nową tablicę, uruchamia na niej algorytm i zapisuje wszystkie klatki
  shuffle(): void {
    this.pause();

    // ze zdjęciem: każda liczba 1..size występuje raz (to numery kawałków zdjęcia),
    // bez zdjęcia: zwykłe losowe wartości
    const array = this.imageUrl()
      ? generateShuffledRange(this.size())
      : generateArray(this.size(), this.info().maxValue);

    const steps = runAlgorithm(this.algorithm(), array);
    this.snapshots.set(buildSnapshots(array, steps, this.algorithm()));
    this.currentStep.set(0);
  }
}
