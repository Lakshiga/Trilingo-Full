import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TrueFalseQuizContent, TrueFalseQuestion } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-true-false-quiz',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatListModule],
  templateUrl: './true-false-quiz.component.html',
  styleUrls: ['./true-false-quiz.component.css']
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
    this.content.questions.forEach((q: any) => {
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
