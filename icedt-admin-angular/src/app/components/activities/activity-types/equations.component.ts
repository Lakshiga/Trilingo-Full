import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Equation } from '../../../types/activity-content.types';

@Component({
  selector: 'app-equations',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatChipsModule],
  template: `
    <div class="container" *ngIf="content; else invalidContent">
      <h2 class="instruction">சரியான விடையைத் தெரிவு செய்க</h2>

      <div class="equation-container" [class.correct]="isAnswered && isCorrect" [class.incorrect]="isAnswered && !isCorrect">
        <div class="equation-display">
          <span class="operand">{{ content.leftOperand }}</span>
          <span class="operator">+</span>
          <span class="operand">{{ content.rightOperand }}</span>
          <span class="operator">=</span>
          <div class="answer-box">
            <span class="answer" [class.correct-answer]="isAnswered && isCorrect" [class.incorrect-answer]="isAnswered && !isCorrect">
              {{ userAnswer || '?' }}
            </span>
          </div>
          <mat-icon 
            *ngIf="isAnswered" 
            [class.correct-icon]="isCorrect" 
            [class.incorrect-icon]="!isCorrect"
            class="result-icon"
          >
            {{ isCorrect ? 'check_circle' : 'cancel' }}
          </mat-icon>
        </div>
      </div>

      <div class="options-container">
        <mat-chip
          *ngFor="let option of content.options"
          [disabled]="isAnswered"
          (click)="handleOptionClick(option)"
          [class.selected]="userAnswer === option"
          class="option-chip"
        >
          {{ option }}
        </mat-chip>
      </div>

      <div *ngIf="isAnswered" class="actions">
        <button mat-stroked-button (click)="handleReset()" class="retry-button">
          <mat-icon>replay</mat-icon>
          Try Again
        </button>
      </div>
    </div>

    <ng-template #invalidContent>
      <div class="error-message">Invalid exercise content.</div>
    </ng-template>
  `,
  styles: [`
    .container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
    }

    .instruction {
      color: #666;
      margin-bottom: 32px;
      font-size: 1.25rem;
    }

    .equation-container {
      padding: 24px;
      margin-bottom: 32px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      background-color: white;
      transition: background-color 0.3s ease;
    }

    .equation-container.correct {
      background-color: #e8f5e9;
    }

    .equation-container.incorrect {
      background-color: #ffebee;
    }

    .equation-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .operand, .operator {
      font-size: 2rem;
      font-weight: bold;
    }

    .answer-box {
      width: 60px;
      height: 60px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      transition: border-color 0.3s ease;
    }

    .answer {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }

    .answer.correct-answer {
      color: #4caf50;
    }

    .answer.incorrect-answer {
      color: #f44336;
    }

    .result-icon {
      font-size: 2rem;
    }

    .correct-icon {
      color: #4caf50;
    }

    .incorrect-icon {
      color: #f44336;
    }

    .options-container {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }

    .option-chip {
      font-size: 1.5rem;
      padding: 20px 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .option-chip:hover:not([disabled]) {
      transform: scale(1.05);
    }

    .option-chip.selected {
      background-color: #1976d2;
      color: white;
    }

    .actions {
      margin-top: 32px;
    }

    .retry-button {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
      padding: 12px 24px;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      padding: 24px;
      font-size: 1.1rem;
    }
  `]
})
export class EquationsComponent {
  @Input() content!: Equation;

  userAnswer: string | null = null;
  isAnswered: boolean = false;

  get isCorrect(): boolean {
    return this.userAnswer === this.content.correctAnswer;
  }

  handleOptionClick(option: string): void {
    if (this.isAnswered) return;
    this.userAnswer = option;
    this.isAnswered = true;
  }

  handleReset(): void {
    this.userAnswer = null;
    this.isAnswered = false;
  }
}