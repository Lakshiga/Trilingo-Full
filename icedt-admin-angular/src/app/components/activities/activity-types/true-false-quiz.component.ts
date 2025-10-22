import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TrueFalseQuizContent, TrueFalseQuestion } from '../../../types/activity-content.types';

@Component({
  selector: 'app-true-false-quiz',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatListModule],
  template: `
    <div class="quiz-container">
      <h1 class="title">{{ content.title }}</h1>
      <p class="instructions">
        சரியாயின் ✔ குறியீட்டையும் பிழையாயின் ✘ குறியீட்டையும் அழுத்துக.
      </p>

      <div class="questions-list">
        <mat-card
          *ngFor="let question of content.questions"
          class="question-card"
          [class.correct]="isSubmitted && userAnswers[question.id] === question.isCorrect"
          [class.incorrect]="isSubmitted && userAnswers[question.id] !== question.isCorrect"
        >
          <mat-card-content>
            <div class="question-content">
              <h3 class="question-text">{{ question.statement }}</h3>
              <div class="answer-buttons">
                <button
                  mat-icon-button
                  [color]="userAnswers[question.id] === true ? 'primary' : ''"
                  (click)="handleAnswerSelect(question.id, true)"
                  [disabled]="isSubmitted"
                  class="answer-button"
                >
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button
                  mat-icon-button
                  [color]="userAnswers[question.id] === false ? 'accent' : ''"
                  (click)="handleAnswerSelect(question.id, false)"
                  [disabled]="isSubmitted"
                  class="answer-button"
                >
                  <mat-icon>cancel</mat-icon>
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="actions">
        <div *ngIf="isSubmitted" class="score-section">
          <div class="score-alert">
            Your Score: {{ score }} / {{ content.questions.length }}
          </div>
          <button mat-raised-button color="primary" (click)="resetQuiz()">
            <mat-icon>replay</mat-icon>
            Try Again
          </button>
        </div>
        <button
          *ngIf="!isSubmitted"
          mat-raised-button
          color="primary"
          (click)="handleSubmit()"
          [disabled]="!allQuestionsAnswered"
        >
          Check Answers
        </button>
      </div>
    </div>
  `,
  styles: [`
    .quiz-container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
    }

    .title {
      margin-bottom: 16px;
      margin-top: 0;
    }

    .instructions {
      margin-bottom: 24px;
      color: #666;
    }

    .questions-list {
      margin-bottom: 24px;
    }

    .question-card {
      margin-bottom: 16px;
      text-align: left;
    }

    .question-card.correct {
      background-color: #e8f5e9;
    }

    .question-card.incorrect {
      background-color: #ffebee;
    }

    .question-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .question-text {
      margin: 0;
      flex: 1;
    }

    .answer-buttons {
      display: flex;
      gap: 8px;
    }

    .answer-button {
      margin: 0;
    }

    .actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .score-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .score-alert {
      padding: 12px 24px;
      background-color: #e3f2fd;
      border: 1px solid #1976d2;
      border-radius: 4px;
      color: #1976d2;
      font-weight: 500;
    }
  `]
})
export class TrueFalseQuizComponent {
  @Input() content!: TrueFalseQuizContent;

  userAnswers: Record<number, boolean> = {};
  isSubmitted: boolean = false;

  get allQuestionsAnswered(): boolean {
    return Object.keys(this.userAnswers).length === this.content.questions.length;
  }

  get score(): number {
    let score = 0;
    this.content.questions.forEach(q => {
      if (this.userAnswers[q.id] === q.isCorrect) {
        score++;
      }
    });
    return score;
  }

  handleAnswerSelect(questionId: number, answer: boolean): void {
    if (this.isSubmitted) return;
    this.userAnswers = { ...this.userAnswers, [questionId]: answer };
  }

  handleSubmit(): void {
    this.isSubmitted = true;
  }

  resetQuiz(): void {
    this.userAnswers = {};
    this.isSubmitted = false;
  }
}
