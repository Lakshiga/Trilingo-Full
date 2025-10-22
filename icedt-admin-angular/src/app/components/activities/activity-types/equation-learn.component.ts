import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UyirMeiEquation, EquationLernContent } from '../../../types/activity-content.types';

@Component({
  selector: 'app-equation-learn',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="equation-learn-container">
      <h1 class="title">{{ content.title }}</h1>
      
      <p *ngIf="content.description" class="description">
        {{ content.description }}
      </p>

      <!-- Progress indicator -->
      <div class="progress">
        <p>{{ currentEquationIndex + 1 }} / {{ content.equations.length }}</p>
      </div>

      <!-- Main equation display -->
      <div class="equation-section">
        <div class="equation-display">
          <div class="equation-parts">
            <!-- Consonant -->
            <mat-card
              class="equation-card consonant-card"
              [class.active]="currentStep === 'consonant'"
              [class.completed]="currentStep === 'vowel' || currentStep === 'result' || currentStep === 'complete'"
              (click)="playConsonantAudio()"
            >
              <mat-card-content>
                <div class="equation-text">{{ currentEquation.consonant }}</div>
              </mat-card-content>
            </mat-card>

            <!-- Plus symbol -->
            <div class="symbol" [class.active]="currentStep === 'vowel' || currentStep === 'result' || currentStep === 'complete'">+</div>

            <!-- Vowel -->
            <mat-card
              class="equation-card vowel-card"
              (click)="playVowelAudio()"
            >
              <mat-card-content>
                <div class="equation-text vowel-text">{{ currentEquation.vowel }}</div>
              </mat-card-content>
            </mat-card>

            <!-- Equals symbol -->
            <div class="symbol" [class.active]="currentStep === 'result' || currentStep === 'complete'">=</div>

            <!-- Result -->
            <mat-card
              class="equation-card result-card"
              [class.active]="currentStep === 'result' || currentStep === 'complete'"
              [class.disabled]="currentStep === 'consonant' || currentStep === 'vowel'"
              (click)="playResultAudio()"
            >
              <mat-card-content>
                <div class="equation-text">
                  {{ (currentStep === 'result' || currentStep === 'complete') ? currentEquation.result : '?' }}
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <!-- Romanization -->
        <div *ngIf="currentEquation.romanization && (currentStep === 'result' || currentStep === 'complete')" class="romanization">
          ({{ currentEquation.romanization }})
        </div>
      </div>

      <!-- Control buttons -->
      <div class="controls">
        <button
          mat-stroked-button
          (click)="handlePrevious()"
          [disabled]="currentEquationIndex === 0"
        >
          <mat-icon>navigate_before</mat-icon>
          Previous Equation
        </button>

        <button
          mat-raised-button
          color="primary"
          (click)="handlePlayCurrentAudio()"
          [disabled]="isPlaying"
        >
          <mat-icon>play_arrow</mat-icon>
          {{ isPlaying ? 'Playing...' : 'Replay Sound' }}
        </button>

        <button
          *ngIf="!isLastEquation"
          mat-raised-button
          color="accent"
          (click)="handleNext()"
        >
          Next Equation
          <mat-icon>navigate_next</mat-icon>
        </button>

        <button
          mat-stroked-button
          (click)="handleReset()"
        >
          <mat-icon>replay</mat-icon>
          Reset All
        </button>
      </div>

      <!-- Completion message -->
      <div *ngIf="currentStep === 'complete' && isLastEquation" class="completion-message">
        <h2>🎉 Excellent! You've learned all Uyir-Mei combinations!</h2>
        <p>You now understand how consonants and vowels combine to form syllables in Tamil.</p>
      </div>

      <!-- Instructions -->
      <div class="instructions">
        <p>மெய்யும் உயிரும் சேர்ந்து உயிர்மெய் எழுத்தாகும் (Consonant + Vowel = Syllable)</p>
      </div>

      <audio #audioElement style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .equation-learn-container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .title {
      color: #1976d2;
      margin-bottom: 16px;
      margin-top: 0;
    }

    .description {
      color: #666;
      margin-bottom: 24px;
    }

    .progress {
      margin-bottom: 24px;
    }

    .progress p {
      color: #666;
      margin: 0;
    }

    .equation-section {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .equation-display {
      background-color: #f8f9fa;
      padding: 32px;
      margin-bottom: 32px;
      border-radius: 8px;
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .equation-parts {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .equation-card {
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .equation-card:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .consonant-card {
      background-color: #fafafa;
      border: 2px solid #e0e0e0;
    }

    .consonant-card.active {
      background-color: #2196f3;
      border: 3px solid #1976d2;
    }

    .consonant-card.completed {
      background-color: #e3f2fd;
    }

    .vowel-card {
      width: 140px;
      height: 140px;
      background-color: #4caf50;
      border: 4px solid #388e3c;
    }

    .result-card {
      background-color: #fafafa;
      border: 2px solid #e0e0e0;
    }

    .result-card.active {
      background-color: #4caf50;
      border: 3px solid #388e3c;
    }

    .result-card.disabled {
      opacity: 0.3;
      cursor: default;
    }

    .result-card.disabled:hover {
      transform: none;
      box-shadow: none;
    }

    .equation-text {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
    }

    .consonant-card.active .equation-text,
    .result-card.active .equation-text {
      color: white;
    }

    .vowel-text {
      font-size: 3rem;
      color: white;
    }

    .symbol {
      font-size: 3rem;
      font-weight: bold;
      color: #bdbdbd;
      transition: color 0.3s ease;
    }

    .symbol.active {
      color: #2196f3;
    }

    .romanization {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 24px;
    }

    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 24px;
      flex-wrap: wrap;
    }

    .completion-message {
      margin-top: 24px;
    }

    .completion-message h2 {
      color: #4caf50;
      margin: 0 0 8px 0;
    }

    .completion-message p {
      color: #666;
      margin: 0;
    }

    .instructions {
      margin-top: 16px;
    }

    .instructions p {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }
  `]
})
export class EquationLearnComponent implements OnInit, OnDestroy {
  @Input() content!: EquationLernContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  currentEquationIndex = 0;
  currentStep: 'consonant' | 'vowel' | 'result' | 'complete' = 'consonant';
  isPlaying = false;
  private mediaBaseUrl = '';

  get currentEquation(): UyirMeiEquation {
    return this.content.equations[this.currentEquationIndex];
  }

  get isLastEquation(): boolean {
    return this.currentEquationIndex === this.content.equations.length - 1;
  }

  ngOnInit(): void {
    this.startAutoSequence();
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  private getFullUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `${this.mediaBaseUrl}/${url}`;
  }

  private playAudio(audioUrl: string): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = this.getFullUrl(audioUrl);
      this.isPlaying = true;
      
      this.audioElement.nativeElement.play()
        .then(() => {
          // Audio started playing successfully
        })
        .catch(e => {
          console.error('Error playing audio:', e);
          this.isPlaying = false;
        });

      this.audioElement.nativeElement.onended = () => {
        this.isPlaying = false;
      };
    }
  }

  private startAutoSequence(): void {
    if (this.currentEquation) {
      setTimeout(() => {
        switch (this.currentStep) {
          case 'consonant':
            this.playAudio(this.currentEquation.consonantAudioUrl);
            setTimeout(() => this.currentStep = 'vowel', 2000);
            break;
          case 'vowel':
            this.playAudio(this.currentEquation.vowelAudioUrl);
            setTimeout(() => this.currentStep = 'result', 2000);
            break;
          case 'result':
            this.playAudio(this.currentEquation.resultAudioUrl);
            setTimeout(() => this.currentStep = 'complete', 2000);
            break;
        }
      }, 500);
    }
  }

  playConsonantAudio(): void {
    if (this.currentStep !== 'consonant') {
      this.playAudio(this.currentEquation.consonantAudioUrl);
    }
  }

  playVowelAudio(): void {
    this.playAudio(this.currentEquation.vowelAudioUrl);
  }

  playResultAudio(): void {
    if (this.currentStep === 'result' || this.currentStep === 'complete') {
      this.playAudio(this.currentEquation.resultAudioUrl);
    }
  }

  handlePlayCurrentAudio(): void {
    if (this.currentEquation) {
      switch (this.currentStep) {
        case 'consonant':
          this.playAudio(this.currentEquation.consonantAudioUrl);
          break;
        case 'vowel':
          this.playAudio(this.currentEquation.vowelAudioUrl);
          break;
        case 'result':
        case 'complete':
          this.playAudio(this.currentEquation.resultAudioUrl);
          break;
      }
    }
  }

  handleNext(): void {
    if (this.currentEquationIndex < this.content.equations.length - 1) {
      this.currentEquationIndex++;
      this.currentStep = 'consonant';
      this.startAutoSequence();
    }
  }

  handlePrevious(): void {
    if (this.currentEquationIndex > 0) {
      this.currentEquationIndex--;
      this.currentStep = 'consonant';
      this.startAutoSequence();
    }
  }

  handleReset(): void {
    this.currentEquationIndex = 0;
    this.currentStep = 'consonant';
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
      this.audioElement.nativeElement.currentTime = 0;
    }
    this.startAutoSequence();
  }
}
