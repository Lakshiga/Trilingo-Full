import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TamilVowel, LettersDisplayContent } from '../../../types/activity-content.types';

@Component({
  selector: 'app-tamil-vowels',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="tamil-vowels-container">
      <h1 class="title">{{ content.title }}</h1>
      
      <p *ngIf="content.description" class="description">
        {{ content.description }}
      </p>

      <!-- Control buttons -->
      <div class="controls">
        <button
          mat-raised-button
          color="primary"
          (click)="playSequence()"
          [disabled]="isSequencePlaying"
        >
          <mat-icon>play_arrow</mat-icon>
          {{ isSequencePlaying ? 'Playing Sequence...' : 'Play All Vowels' }}
        </button>

        <button
          mat-stroked-button
          (click)="handleReset()"
          [disabled]="isSequencePlaying"
        >
          <mat-icon>replay</mat-icon>
          Reset
        </button>
      </div>

      <!-- Progress indicator -->
      <div class="progress-section">
        <p class="progress-text">
          Progress: {{ playedVowels.length }} / {{ content.vowels.length }} vowels learned
        </p>
        <div *ngIf="allVowelsPlayed" class="completion-message">
          🎉 Excellent! You've learned all Tamil vowels!
        </div>
      </div>

      <!-- Tamil Vowels Grid - 3 rows -->
      <div class="vowels-grid">
        <div *ngFor="let row of vowelRows; let rowIndex = index" class="vowel-row">
          <mat-card
            *ngFor="let vowel of row"
            class="vowel-card"
            [class.playing]="playingVowelId === vowel.id"
            [class.played]="playedVowels.includes(vowel.id)"
            [class.current-sequence]="isCurrentInSequence(vowel.id)"
            (click)="handleVowelClick(vowel)"
            [style.pointer-events]="isSequencePlaying ? 'none' : 'auto'"
          >
            <mat-card-content class="vowel-content">
              <div class="vowel-letter">{{ vowel.letter }}</div>
              <div class="romanization">{{ vowel.romanization }}</div>
              <mat-icon *ngIf="playingVowelId === vowel.id" class="playing-icon">volume_up</mat-icon>
              <div *ngIf="playedVowels.includes(vowel.id) && playingVowelId !== vowel.id && !isCurrentInSequence(vowel.id)" class="checkmark">✓</div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Instructions -->
      <div class="instructions">
        <p>உயிர் எழுத்துக்களை அழுத்தி உச்சரிப்பைக் கேளுங்கள் (Click on vowels to hear pronunciation)</p>
      </div>

      <audio #audioElement style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .tamil-vowels-container {
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

    .controls {
      margin-bottom: 24px;
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    .progress-section {
      margin-bottom: 24px;
    }

    .progress-text {
      color: #666;
      margin: 0 0 8px 0;
    }

    .completion-message {
      color: #4caf50;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .vowels-grid {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .vowel-row {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .vowel-card {
      width: 120px;
      height: 120px;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: #fafafa;
      border: 2px solid #e0e0e0;
    }

    .vowel-card:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      background-color: #f0f0f0;
    }

    .vowel-card.playing {
      background-color: #1976d2;
      border: 3px solid #1976d2;
      animation: pulse 1s infinite;
    }

    .vowel-card.played {
      background-color: #e8f5e8;
      border: 2px solid #4caf50;
    }

    .vowel-card.current-sequence {
      background-color: #2196f3;
      border: 3px solid #1976d2;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .vowel-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 8px;
    }

    .vowel-letter {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
      margin-bottom: 4px;
    }

    .vowel-card.playing .vowel-letter,
    .vowel-card.current-sequence .vowel-letter {
      color: white;
    }

    .romanization {
      font-size: 0.75rem;
      color: #666;
    }

    .vowel-card.playing .romanization,
    .vowel-card.current-sequence .romanization {
      color: white;
    }

    .playing-icon {
      color: white;
      font-size: 1rem;
      margin-top: 4px;
    }

    .checkmark {
      color: #4caf50;
      font-size: 0.8rem;
      margin-top: 4px;
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
export class TamilVowelsComponent implements OnInit, OnDestroy {
  @Input() content!: LettersDisplayContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  playingVowelId: number | null = null;
  playedVowels: number[] = [];
  currentSequenceIndex = 0;
  isSequencePlaying = false;
  private mediaBaseUrl = '';

  get vowelRows(): TamilVowel[][] {
    return this.arrangeInRows(this.content.vowels);
  }

  get allVowelsPlayed(): boolean {
    return this.playedVowels.length === this.content.vowels.length;
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  private arrangeInRows(vowels: TamilVowel[]): TamilVowel[][] {
    const rows = [];
    for (let i = 0; i < vowels.length; i += 4) {
      rows.push(vowels.slice(i, i + 4));
    }
    return rows;
  }

  private getFullUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `${this.mediaBaseUrl}/${url}`;
  }

  playAudio(audioUrl: string, vowelId: number): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = this.getFullUrl(audioUrl);
      this.playingVowelId = vowelId;

      this.audioElement.nativeElement.play()
        .then(() => {
          if (!this.playedVowels.includes(vowelId)) {
            this.playedVowels = [...this.playedVowels, vowelId];
          }
        })
        .catch(e => {
          console.error('Error playing audio:', e);
          this.playingVowelId = null;
        });

      this.audioElement.nativeElement.onended = () => {
        this.playingVowelId = null;
      };
    }
  }

  handleVowelClick(vowel: TamilVowel): void {
    this.playAudio(vowel.audioUrl, vowel.id);
  }

  async playSequence(): Promise<void> {
    if (this.isSequencePlaying) return;

    this.isSequencePlaying = true;
    this.currentSequenceIndex = 0;

    for (let i = 0; i < this.content.vowels.length; i++) {
      this.currentSequenceIndex = i;
      const vowel = this.content.vowels[i];

      await new Promise<void>((resolve) => {
        if (this.audioElement) {
          this.audioElement.nativeElement.src = this.getFullUrl(vowel.audioUrl);
          this.playingVowelId = vowel.id;

          this.audioElement.nativeElement.play().catch(e => 
            console.error('Error playing audio:', e)
          );

          this.audioElement.nativeElement.onended = () => {
            this.playingVowelId = null;
            if (!this.playedVowels.includes(vowel.id)) {
              this.playedVowels = [...this.playedVowels, vowel.id];
            }
            setTimeout(resolve, 500);
          };
        }
      });
    }

    this.isSequencePlaying = false;
    this.currentSequenceIndex = -1;
  }

  handleReset(): void {
    this.playedVowels = [];
    this.playingVowelId = null;
    this.currentSequenceIndex = 0;
    this.isSequencePlaying = false;
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
      this.audioElement.nativeElement.currentTime = 0;
    }
  }

  isCurrentInSequence(vowelId: number): boolean {
    return this.isSequencePlaying && 
           this.currentSequenceIndex === this.content.vowels.findIndex(v => v.id === vowelId);
  }
}
