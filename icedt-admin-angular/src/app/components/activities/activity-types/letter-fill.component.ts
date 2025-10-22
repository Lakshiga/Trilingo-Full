import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export interface LetterFillContent {
  title: string;
  activityTitle: string;
  instruction: string;
  sentences: string[];
  options: string[];
  solutions: string[];
}

@Component({
  selector: 'app-letter-fill',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  template: `
    <div class="letter-fill-container">
      <h1 class="title">{{ content.title }}</h1>

      <mat-card class="instruction-card">
        <mat-card-content>
          <h2 class="activity-title">{{ content.activityTitle }}</h2>
          <p class="instruction-text">{{ content.instruction }}</p>
        </mat-card-content>
      </mat-card>

      <!-- Sentences with blanks -->
      <div class="sentences-section">
        <div *ngFor="let sentence of content.sentences; let i = index" class="sentence-card">
          <div class="sentence-content">
            <span
              *ngFor="let part of getSentenceParts(sentence); let idx = index"
              class="sentence-part"
            >
              <span *ngIf="!isBlank(part)" class="text-part">{{ part }}</span>
              <mat-chip
                *ngIf="isBlank(part)"
                class="blank-chip"
                [class.active]="activeSentenceIndex === i"
                [class.correct]="isSubmitted && results[i]"
                [class.incorrect]="isSubmitted && !results[i]"
                (click)="setActiveSentence(i)"
              >
                <mat-icon *ngIf="isSubmitted" class="result-icon">
                  {{ results[i] ? 'check_circle' : 'cancel' }}
                </mat-icon>
                {{ answers[i] || '          ' }}
              </mat-chip>
            </span>
          </div>
        </div>
      </div>

      <!-- Word bank -->
      <div class="word-bank-section">
        <h3 class="word-bank-title">விருப்பங்கள்:</h3>
        <div class="options-grid">
          <mat-chip
            *ngFor="let option of content.options"
            class="option-chip"
            (click)="handleOptionSelect(option)"
            [disabled]="allCorrect"
          >
            {{ option }}
          </mat-chip>
        </div>
      </div>

      <!-- Action Buttons and Status Message -->
      <div class="controls">
        <button
          *ngIf="!isSubmitted"
          mat-raised-button
          color="accent"
          (click)="handleSubmit()"
          [disabled]="getAnswersCount() !== content.sentences.length"
        >
          சமர்ப்பிக்கவும்
        </button>

        <div *ngIf="isSubmitted && !allCorrect" class="error-section">
          <p class="error-message">சில பதில்கள் தவறானவை. மீண்டும் முயலவும்!</p>
          <button mat-raised-button color="primary" (click)="handleRetry()">
            மீண்டும் முயலவும்
          </button>
        </div>

        <div *ngIf="allCorrect" class="success-message">
          🎉 நன்று! எல்லா பதில்களும் சரியானவை! 🎉
        </div>
      </div>
    </div>
  `,
  styles: [`
    .letter-fill-container {
      padding: 24px;
      font-family: sans-serif;
      max-width: 800px;
      margin: auto;
    }

    .title {
      background: #2e7d32;
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-weight: bold;
      text-align: center;
    }

    .instruction-card {
      margin-bottom: 24px;
      background: #f1f8e9;
    }

    .activity-title {
      font-weight: 600;
      color: #33691e;
      margin-bottom: 8px;
    }

    .instruction-text {
      margin: 0;
    }

    .sentences-section {
      margin-top: 16px;
    }

    .sentence-card {
      padding: 16px;
      margin-bottom: 16px;
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }

    .sentence-content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    .sentence-part {
      display: inline;
    }

    .text-part {
      font-size: 1.2rem;
      line-height: 1.8;
    }

    .blank-chip {
      margin: 0 8px;
      font-size: 1.1rem;
      font-weight: bold;
      min-width: 60px;
      border: 1px solid #ccc;
      background-color: #f5f5f5;
      color: #1769aa;
      cursor: pointer;
    }

    .blank-chip.active {
      border: 2px solid #1976d2;
      background-color: #e3f2fd;
    }

    .blank-chip.correct {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .blank-chip.incorrect {
      background-color: #ffebee;
      color: #c62828;
    }

    .result-icon {
      margin-right: 4px;
    }

    .word-bank-section {
      margin-top: 32px;
    }

    .word-bank-title {
      color: #d32f2f;
      font-weight: bold;
      margin-bottom: 16px;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
    }

    .option-chip {
      width: 100%;
      font-size: 1.2rem;
      padding: 20px 10px;
      background-color: #1976d2;
      color: white;
      cursor: pointer;
    }

    .option-chip:hover {
      background-color: #1565c0;
    }

    .option-chip:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .controls {
      margin-top: 32px;
      text-align: center;
    }

    .error-section {
      margin-bottom: 16px;
    }

    .error-message {
      color: #d32f2f;
      font-size: 1.2rem;
      margin-bottom: 16px;
    }

    .success-message {
      color: #2e7d32;
      font-size: 1.2rem;
      font-weight: bold;
    }
  `]
})
export class LetterFillComponent implements OnInit {
  @Input() content!: LetterFillContent;

  answers: { [key: number]: string } = {};
  activeSentenceIndex: number | null = 0;
  isSubmitted = false;
  results: { [key: number]: boolean } = {};

  get allCorrect(): boolean {
    return this.isSubmitted && Object.values(this.results).every(res => res);
  }

  ngOnInit(): void {
    // Component initialization
  }

  getSentenceParts(sentence: string): string[] {
    return sentence.split('____');
  }

  isBlank(part: string): boolean {
    return part === '';
  }

  setActiveSentence(index: number): void {
    if (!this.allCorrect) {
      this.activeSentenceIndex = index;
    }
  }

  handleOptionSelect(option: string): void {
    if (this.activeSentenceIndex !== null && !this.allCorrect) {
      this.answers = { ...this.answers, [this.activeSentenceIndex]: option };
      
      // Find the next unanswered blank and make it active
      const nextUnanswered = this.content.sentences.findIndex((_, i) => !this.answers[i]);
      this.activeSentenceIndex = nextUnanswered !== -1 ? nextUnanswered : null;
    }
  }

  handleSubmit(): void {
    const newResults: { [key: number]: boolean } = {};
    this.content.sentences.forEach((_, i) => {
      const isCorrect = this.answers[i] === this.content.solutions[i];
      newResults[i] = isCorrect;
    });
    this.results = newResults;
    this.isSubmitted = true;
  }

  handleRetry(): void {
    this.answers = {};
    this.isSubmitted = false;
    this.results = {};
    this.activeSentenceIndex = 0;
  }

  getAnswersCount(): number {
    return Object.keys(this.answers).length;
  }
}
