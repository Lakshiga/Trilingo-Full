import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DropdownCompletionContent, DropdownBlank } from '../../../types/activity-content.types';

@Component({
  selector: 'app-dropdown-completion',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatSelectModule, MatFormFieldModule],
  template: `
    <div class="container">
      <h1 class="title">{{ content.title }}</h1>

      <div class="sentences-container">
        <div *ngFor="let sentence of content.sentences" class="sentence-row">
          <span class="sentence-prefix">{{ sentence.prefix }}</span>
          
          <mat-form-field appearance="outline" class="dropdown-field">
            <mat-select
              [value]="answers[sentence.id] || ''"
              (selectionChange)="onSelectChange($event, sentence.id)"
              [disabled]="isComplete"
              class="dropdown-select"
              [class.correct]="isComplete && answers[sentence.id] === sentence.correctAnswer"
              [class.incorrect]="isComplete && answers[sentence.id] !== sentence.correctAnswer"
            >
              <mat-option value="" disabled>Select...</mat-option>
              <mat-option *ngFor="let option of sentence.options" [value]="option">
                {{ option }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <span class="sentence-suffix">{{ sentence.suffix }}</span>

          <mat-icon 
            *ngIf="isComplete" 
            [class.correct-icon]="answers[sentence.id] === sentence.correctAnswer"
            [class.incorrect-icon]="answers[sentence.id] !== sentence.correctAnswer"
            class="result-icon"
          >
            {{ answers[sentence.id] === sentence.correctAnswer ? 'check_circle' : 'cancel' }}
          </mat-icon>
        </div>
      </div>
      
      <div class="actions">
        <button
          *ngIf="!isComplete"
          mat-raised-button
          color="primary"
          (click)="handleCheckAnswers()"
          class="check-button"
        >
          Check Answers
        </button>
        
        <button
          *ngIf="isComplete"
          mat-stroked-button
          (click)="handleReset()"
          class="retry-button"
        >
          <mat-icon>replay</mat-icon>
          Try Again
        </button>
      </div>
      
      <div *ngIf="isComplete" class="result-message" [class.all-correct]="isAllCorrect" [class.some-incorrect]="!isAllCorrect">
        {{ isAllCorrect ? 'All Correct!' : 'Some answers are incorrect. Please review.' }}
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      font-family: sans-serif;
    }

    .title {
      text-align: center;
      margin-bottom: 16px;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .sentences-container {
      background: white;
      padding: 24px;
      margin-bottom: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .sentence-row {
      display: flex;
      align-items: center;
      margin: 20px 0;
      flex-wrap: wrap;
      gap: 16px;
    }

    .sentence-prefix, .sentence-suffix {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .dropdown-field {
      min-width: 150px;
    }

    .dropdown-select {
      font-size: 1rem;
    }

    .dropdown-select.correct {
      border-color: #4caf50 !important;
    }

    .dropdown-select.incorrect {
      border-color: #f44336 !important;
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
      text-align: center;
      margin-top: 32px;
    }

    .check-button, .retry-button {
      font-size: 1.1rem;
      padding: 12px 24px;
    }

    .retry-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .result-message {
      text-align: center;
      margin-top: 16px;
      font-size: 1.25rem;
      font-weight: 500;
    }

    .result-message.all-correct {
      color: #4caf50;
    }

    .result-message.some-incorrect {
      color: #f44336;
    }

    /* Override Material Design styles for correct/incorrect states */
    :host ::ng-deep .mat-mdc-form-field.correct .mat-mdc-form-field-focus-overlay {
      background-color: #e8f5e9;
    }

    :host ::ng-deep .mat-mdc-form-field.incorrect .mat-mdc-form-field-focus-overlay {
      background-color: #ffebee;
    }

    :host ::ng-deep .mat-mdc-form-field.correct .mat-mdc-outlined-input-notched-outline {
      border-color: #4caf50 !important;
      border-width: 2px !important;
    }

    :host ::ng-deep .mat-mdc-form-field.incorrect .mat-mdc-outlined-input-notched-outline {
      border-color: #f44336 !important;
      border-width: 2px !important;
    }
  `]
})
export class DropdownCompletionComponent implements OnInit {
  @Input() content!: DropdownCompletionContent;

  answers: Record<number, string> = {};
  isComplete: boolean = false;

  get isAllCorrect(): boolean {
    return this.content.sentences.every(s => this.answers[s.id] === s.correctAnswer);
  }

  ngOnInit(): void {
    this.handleReset();
  }

  onSelectChange(event: any, sentenceId: number): void {
    if (this.isComplete) return;
    this.answers[sentenceId] = event.value;
  }

  handleCheckAnswers(): void {
    this.isComplete = true;
  }

  handleReset(): void {
    this.answers = {};
    this.isComplete = false;
  }
}
