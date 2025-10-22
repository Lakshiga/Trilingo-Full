import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { WordBankCompletionContent } from '../../../types/activity-content.types';

@Component({
  selector: 'app-word-bank-completion',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatChipsModule],
  template: `
    <div class="word-bank-container">
      <h2 class="title">{{ content.title }}</h2>

      <mat-card class="sentences-card">
        <mat-card-content>
          <div
            *ngFor="let sentence of content.sentences"
            class="sentence-row"
          >
            <span class="sentence-text">{{ sentence.prefix }}&nbsp;</span>
            <span
              class="blank-chip"
              [class.correct]="isComplete && answers[sentence.id] === sentence.correctAnswer"
              [class.incorrect]="isComplete && answers[sentence.id] !== sentence.correctAnswer"
              (click)="handleBlankClick(sentence.id)"
            >
              {{ answers[sentence.id] || '...........' }}
            </span>
            <span class="sentence-text">&nbsp;{{ sentence.suffix }}</span>
          </div>
        </mat-card-content>
      </mat-card>

      <p class="instructions">Click a word, then click a blank space.</p>

      <mat-card class="word-bank-card">
        <mat-card-content>
          <div class="word-bank">
            <span
              *ngFor="let word of shuffledWordBank"
              class="word-chip"
              [class.selected]="selectedWord === word"
              [class.used]="isWordUsed(word)"
              (click)="handleWordBankClick(word)"
            >
              {{ word }}
            </span>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="actions">
        <button
          *ngIf="!isComplete"
          mat-raised-button
          color="primary"
          (click)="handleCheckAnswers()"
        >
          Check Answers
        </button>
        <button
          *ngIf="isComplete"
          mat-stroked-button
          (click)="resetActivity()"
        >
          Try Again
        </button>
      </div>

      <div *ngIf="isComplete" class="result-message" [class.success]="isAllCorrect" [class.error]="!isAllCorrect">
        {{ isAllCorrect ? 'Excellent! All correct.' : 'Some answers are incorrect. Please try again.' }}
      </div>
    </div>
  `,
  styles: [`
    .word-bank-container {
      padding: 24px;
      font-family: sans-serif;
    }

    .title {
      text-align: center;
      margin-bottom: 16px;
    }

    .sentences-card {
      margin-bottom: 24px;
    }

    .sentence-row {
      display: flex;
      align-items: center;
      margin: 16px 0;
      flex-wrap: wrap;
    }

    .sentence-text {
      font-size: 1rem;
    }

    .blank-chip {
      min-width: 120px;
      height: 40px;
      font-size: 1rem;
      cursor: pointer;
      border: 1px dashed grey;
      background-color: #eee;
      border-radius: 16px;
      padding: 8px 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0 4px;
    }

    .blank-chip.correct {
      border: 2px solid green;
      background-color: #e8f5e9;
    }

    .blank-chip.incorrect {
      border: 2px solid red;
      background-color: #ffebee;
    }

    .instructions {
      text-align: center;
      margin-bottom: 16px;
    }

    .word-bank-card {
      margin-bottom: 24px;
    }

    .word-bank {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .word-chip {
      font-size: 1.1rem;
      cursor: pointer;
      border: 1px solid #1976d2;
      background-color: transparent;
      color: #1976d2;
      border-radius: 16px;
      padding: 8px 16px;
      transition: all 0.2s;
    }

    .word-chip:hover {
      background-color: #e3f2fd;
    }

    .word-chip.selected {
      background-color: #9c27b0;
      color: white;
      border-color: #9c27b0;
    }

    .word-chip.used {
      background-color: #1976d2;
      color: white;
      cursor: default;
    }

    .actions {
      text-align: center;
      margin-bottom: 16px;
    }

    .result-message {
      text-align: center;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .result-message.success {
      color: #4caf50;
    }

    .result-message.error {
      color: #f44336;
    }
  `]
})
export class WordBankCompletionComponent implements OnInit {
  @Input() content!: WordBankCompletionContent;

  answers: Record<number, string> = {};
  shuffledWordBank: string[] = [];
  isComplete: boolean = false;
  selectedWord: string | null = null;

  ngOnInit(): void {
    this.resetActivity();
  }

  get isAllCorrect(): boolean {
    return this.content.sentences.every(s => this.answers[s.id] === s.correctAnswer);
  }

  private shuffleArray(array: string[]): string[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  isWordUsed(word: string): boolean {
    return Object.values(this.answers).includes(word);
  }

  handleWordBankClick(word: string): void {
    if (this.isWordUsed(word) || this.isComplete) return;
    this.selectedWord = word;
  }

  handleBlankClick(sentenceId: number): void {
    if (this.selectedWord && !this.isComplete) {
      this.answers = { ...this.answers, [sentenceId]: this.selectedWord };
      this.selectedWord = null;
    }
  }

  handleCheckAnswers(): void {
    this.isComplete = true;
  }

  resetActivity(): void {
    this.answers = {};
    this.shuffledWordBank = this.shuffleArray(this.content.wordBank);
    this.isComplete = false;
    this.selectedWord = null;
  }
}
