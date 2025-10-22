import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export interface WordFinderSingleChallenge {
  id: number;
  title: string;
  targetLetter: string;
  wordGrid: string[];
  correctWords: string[];
}

@Component({
  selector: 'app-word-finder',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  template: `
    <div class="word-finder-container">
      <h1 class="title">{{ content.title }}</h1>

      <mat-card class="target-card">
        <mat-card-content>
          <p class="instruction">Find all words with this letter:</p>
          <div class="target-letter">{{ content.targetLetter }}</div>
        </mat-card-content>
      </mat-card>

      <div class="words-grid">
        <mat-chip
          *ngFor="let word of content.wordGrid"
          [class.found]="foundWords.includes(word)"
          [class.incorrect]="incorrectGuesses.includes(word)"
          (click)="handleWordClick(word)"
          [disabled]="foundWords.includes(word)"
        >
          {{ word }}
        </mat-chip>
      </div>

      <div *ngIf="isComplete" class="completion-section">
        <div class="completion-message">
          <mat-icon class="success-icon">check_circle</mat-icon>
          <h2 class="success-text">Great Job! Challenge Completed!</h2>
        </div>
        <button mat-stroked-button (click)="handleReset()">
          <mat-icon>replay</mat-icon>
          Reset this challenge
        </button>
      </div>
    </div>
  `,
  styles: [`
    .word-finder-container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
    }

    .title {
      margin-bottom: 24px;
      margin-top: 0;
    }

    .target-card {
      margin-bottom: 32px;
      background-color: #9c27b0;
      color: white;
    }

    .instruction {
      margin-bottom: 16px;
      font-size: 1.2rem;
    }

    .target-letter {
      font-size: 4rem;
      font-weight: bold;
    }

    .words-grid {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }

    mat-chip {
      font-size: 1.5rem;
      padding: 24px 12px;
      cursor: pointer;
      transition: all 0.3s;
    }

    mat-chip.found {
      background-color: #4caf50 !important;
      color: white !important;
    }

    mat-chip.incorrect {
      background-color: #f44336 !important;
      color: white !important;
    }

    .completion-section {
      margin-top: 32px;
    }

    .completion-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .success-icon {
      font-size: 2rem;
      color: #4caf50;
    }

    .success-text {
      color: #4caf50;
      margin: 0;
    }
  `]
})
export class WordFinderComponent implements OnInit {
  @Input() content!: WordFinderSingleChallenge;

  foundWords: string[] = [];
  incorrectGuesses: string[] = [];

  get isComplete(): boolean {
    return this.foundWords.length === this.content.correctWords.length;
  }

  ngOnInit(): void {
    this.resetState();
  }

  private resetState(): void {
    this.foundWords = [];
    this.incorrectGuesses = [];
  }

  handleWordClick(word: string): void {
    if (this.foundWords.includes(word)) return;

    if (this.content.correctWords.includes(word)) {
      this.foundWords = [...this.foundWords, word];
    } else {
      this.incorrectGuesses = [...this.incorrectGuesses, word];
      setTimeout(() => {
        this.incorrectGuesses = this.incorrectGuesses.filter(w => w !== word);
      }, 500);
    }
  }

  handleReset(): void {
    this.resetState();
  }
}
