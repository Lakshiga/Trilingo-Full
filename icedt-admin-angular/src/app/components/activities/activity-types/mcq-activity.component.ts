import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MCQContent, MCQChoice } from '../../../types/activity-content.types';

@Component({
  selector: 'app-mcq-activity',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="container">
      <div class="question-card">
        <h2 class="question">{{ content.question }}</h2>
      </div>

      <div class="choices-container">
        <button
          *ngFor="let choice of content.choices"
          mat-button
          [class.mat-raised-button]="getButtonVariant(choice) === 'raised'"
          [class.mat-outlined-button]="getButtonVariant(choice) === 'outlined'"
          [color]="getButtonColor(choice)"
          (click)="handleChoiceClick(choice)"
          class="choice-button"
        >
          <span class="choice-text">{{ choice.text }}</span>
          <mat-icon 
            *ngIf="isAnswered && choice.isCorrect" 
            class="result-icon correct-icon"
          >
            check_circle
          </mat-icon>
          <mat-icon 
            *ngIf="isAnswered && selectedChoiceId === choice.id && !choice.isCorrect" 
            class="result-icon incorrect-icon"
          >
            cancel
          </mat-icon>
        </button>
      </div>
      
      <div *ngIf="isAnswered" class="actions">
        <button mat-raised-button (click)="handleTryAgain()" class="try-again-button">
          Try Again
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      font-family: sans-serif;
    }

    .question-card {
      background: white;
      padding: 16px;
      margin-bottom: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .question {
      text-align: center;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
    }

    .choices-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .choice-button {
      justify-content: space-between;
      text-align: left;
      padding: 12px 16px;
      text-transform: none;
      width: 100%;
      font-size: 1rem;
    }

    .choice-text {
      flex-grow: 1;
    }

    .result-icon {
      margin-left: 8px;
    }

    .correct-icon {
      color: #4caf50;
    }

    .incorrect-icon {
      color: #f44336;
    }

    .actions {
      margin-top: 24px;
      display: flex;
      justify-content: center;
    }

    .try-again-button {
      font-size: 1.1rem;
      padding: 12px 24px;
    }

    /* Override Material Design button styles for correct/incorrect states */
    :host ::ng-deep .mat-mdc-button.correct {
      background-color: #4caf50 !important;
      color: white !important;
    }

    :host ::ng-deep .mat-mdc-button.incorrect {
      background-color: #f44336 !important;
      color: white !important;
    }
  `]
})
export class McqActivityComponent {
  @Input() content!: MCQContent;

  selectedChoiceId: string | number | null = null;
  isAnswered: boolean = false;

  handleChoiceClick(choice: MCQChoice): void {
    if (this.isAnswered) return; // Prevent changing answer
    this.selectedChoiceId = choice.id;
    this.isAnswered = true;
  }

  getButtonVariant(choice: MCQChoice): 'raised' | 'outlined' {
    if (!this.isAnswered) return 'outlined';
    if (choice.isCorrect) return 'raised'; // Always highlight the correct answer
    if (this.selectedChoiceId === choice.id && !choice.isCorrect) return 'raised'; // Highlight the user's wrong choice
    return 'outlined';
  }

  getButtonColor(choice: MCQChoice): 'primary' | 'accent' | 'warn' {
    if (!this.isAnswered) return 'primary';
    if (choice.isCorrect) return 'accent'; // Success color
    if (this.selectedChoiceId === choice.id && !choice.isCorrect) return 'warn'; // Error color
    return 'primary';
  }

  handleTryAgain(): void {
    this.isAnswered = false;
    this.selectedChoiceId = null;
  }
}