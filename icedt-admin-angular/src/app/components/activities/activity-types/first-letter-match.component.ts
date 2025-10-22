import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FirstLetterMatchContent } from '../../../types/activity-content.types';

@Component({
  selector: 'app-first-letter-match',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  template: `
    <div class="first-letter-container">
      <div *ngIf="isComplete; else gameContent">
        <div class="completion-message">
          <mat-icon class="success-icon">check_circle</mat-icon>
          <h2 class="success-text">Excellent! All words found.</h2>
        </div>
        <button mat-raised-button color="primary" (click)="setupGame()">
          <mat-icon>replay</mat-icon>
          Play Again
        </button>
      </div>

      <ng-template #gameContent>
        <mat-card class="target-card">
          <mat-card-content>
            <p class="instruction">Find the word starting with:</p>
            <div class="target-letter">{{ firstLetter }}</div>
          </mat-card-content>
        </mat-card>
        
        <div class="words-container">
          <mat-chip
            *ngFor="let word of content.words"
            [class.found]="!wordsToFind.includes(word)"
            [class.correct]="feedback === 'correct' && currentTarget === word"
            [class.incorrect]="feedback === 'incorrect' && currentTarget === word"
            (click)="handleWordClick(word)"
            [disabled]="!wordsToFind.includes(word) || !!feedback"
          >
            {{ word }}
          </mat-chip>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .first-letter-container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
    }

    .completion-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 24px;
    }

    .success-icon {
      font-size: 2rem;
      color: #4caf50;
    }

    .success-text {
      color: #4caf50;
      margin: 0;
    }

    .target-card {
      margin-bottom: 24px;
      background-color: #f0f4f8;
    }

    .instruction {
      color: #666;
      margin-bottom: 16px;
    }

    .target-letter {
      font-size: 4rem;
      font-weight: bold;
      color: #1976d2;
    }

    .words-container {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    mat-chip {
      font-size: 1.2rem;
      padding: 20px 10px;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    mat-chip.found {
      opacity: 0.3;
    }

    mat-chip.correct {
      background-color: #4caf50 !important;
      color: white !important;
    }

    mat-chip.incorrect {
      background-color: #f44336 !important;
      color: white !important;
    }
  `]
})
export class FirstLetterMatchComponent implements OnInit {
  @Input() content!: FirstLetterMatchContent;

  wordsToFind: string[] = [];
  currentTarget: string | null = null;
  feedback: 'correct' | 'incorrect' | null = null;

  get firstLetter(): string {
    return this.currentTarget ? this.currentTarget.charAt(0) : '';
  }

  get isComplete(): boolean {
    return this.wordsToFind.length === 0 && !this.currentTarget;
  }

  ngOnInit(): void {
    this.setupGame();
  }

  setupGame(): void {
    this.wordsToFind = this.shuffleArray([...this.content.words]);
    this.currentTarget = null;
    this.feedback = null;
    this.setNextTarget();
  }

  private setNextTarget(): void {
    if (this.wordsToFind.length > 0 && !this.currentTarget) {
      this.currentTarget = this.wordsToFind[0];
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  handleWordClick(word: string): void {
    if (this.feedback) return;

    if (word === this.currentTarget) {
      this.feedback = 'correct';
      setTimeout(() => {
        const remainingWords = this.wordsToFind.slice(1);
        this.wordsToFind = remainingWords;
        this.currentTarget = remainingWords[0] || null;
        this.feedback = null;
      }, 1000);
    } else {
      this.feedback = 'incorrect';
      setTimeout(() => {
        this.feedback = null;
      }, 1000);
    }
  }
}
