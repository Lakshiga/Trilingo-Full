import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WordPairQuestion, WordPairMCQContent } from '../../../types/activity-content.types';

@Component({
  selector: 'app-word-pair-mcq',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="word-pair-container">
      <audio #audioElement [src]="currentQuestion.promptAudioUrl" style="display: none;"></audio>
      
      <mat-card class="instruction-card">
        <mat-card-content>
          <p class="instruction-text">Listen and choose the correct word:</p>
          <button mat-icon-button (click)="playAudio()" class="audio-button">
            <mat-icon>volume_up</mat-icon>
          </button>
        </mat-card-content>
      </mat-card>

      <div class="choices-container">
        <button
          *ngFor="let choice of currentQuestion.choices"
          mat-raised-button
          class="choice-button"
          [class.selected]="userAnswer === choice"
          [class.correct]="showResult && choice === currentQuestion.correctAnswer"
          [class.incorrect]="showResult && userAnswer === choice && choice !== currentQuestion.correctAnswer"
          [disabled]="showResult && !isCorrect"
          (click)="handleAnswer(choice)"
        >
          {{ choice }}
          <mat-icon *ngIf="showResult && userAnswer === choice && choice === currentQuestion.correctAnswer" class="result-icon">
            check_circle
          </mat-icon>
          <mat-icon *ngIf="showResult && userAnswer === choice && choice !== currentQuestion.correctAnswer" class="result-icon">
            cancel
          </mat-icon>
        </button>
      </div>

      <div *ngIf="showResult" class="result-section">
        <div *ngIf="isCorrect" class="correct-message">
          ✓ சரியான பதில்! {{ isLastQuestion ? 'செயல்பாடு முடிந்தது!' : 'அடுத்த கேள்விக்குச் செல்லவும்.' }}
        </div>
        <div *ngIf="!isCorrect" class="incorrect-message">
          ✗ தவறான பதில். சரியான பதில்: {{ currentQuestion.correctAnswer }}
        </div>

        <div class="action-buttons">
          <button
            *ngIf="!isCorrect"
            mat-stroked-button
            color="primary"
            (click)="handleReset()"
          >
            மீண்டும் முயலவும்
          </button>
          <button
            *ngIf="isCorrect && !isLastQuestion"
            mat-raised-button
            color="primary"
            (click)="handleNext()"
          >
            அடுத்த கேள்வி
          </button>
        </div>
      </div>

      <div *ngIf="!showResult && userAnswer" class="selection-message">
        பதிலைத் தேர்ந்தெடுக்கவும்
      </div>
    </div>
  `,
  styles: [`
    .word-pair-container {
      padding: 16px;
      text-align: center;
    }

    .instruction-card {
      margin-bottom: 32px;
    }

    .instruction-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .instruction-text {
      font-size: 1.2rem;
      margin: 0;
    }

    .audio-button {
      font-size: 2rem;
    }

    .choices-container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
    }

    .choice-button {
      font-size: 2rem;
      padding: 20px 40px;
      text-transform: none;
      min-width: 180px;
      transition: all 0.3s ease;
    }

    .choice-button.selected {
      transform: scale(1.05);
    }

    .choice-button.correct {
      background-color: #4caf50 !important;
      color: white !important;
    }

    .choice-button.incorrect {
      background-color: #f44336 !important;
      color: white !important;
    }

    .result-icon {
      margin-left: 8px;
    }

    .result-section {
      margin-top: 24px;
    }

    .correct-message {
      color: #4caf50;
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .incorrect-message {
      color: #f44336;
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    .selection-message {
      color: #1976d2;
      font-size: 1.2rem;
      margin-top: 24px;
    }
  `]
})
export class WordPairMCQComponent implements OnInit, OnDestroy {
  @Input() content!: WordPairMCQContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  currentQuestionIndex = 0;
  userAnswer: string | null = null;
  showResult = false;
  isCorrect = false;

  get currentQuestion(): WordPairQuestion {
    return this.content.questions[this.currentQuestionIndex];
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.content.questions.length - 1;
  }

  ngOnInit(): void {
    this.resetState();
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  private resetState(): void {
    this.userAnswer = null;
    this.showResult = false;
    this.isCorrect = false;
  }

  playAudio(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.play().catch(e => console.error(e));
    }
  }

  handleAnswer(choice: string): void {
    if (this.userAnswer || this.showResult) return;
    
    this.userAnswer = choice;
    this.isCorrect = choice === this.currentQuestion.correctAnswer;
    this.showResult = true;
  }

  handleReset(): void {
    this.resetState();
  }

  handleNext(): void {
    if (this.isLastQuestion) {
      return;
    }
    this.currentQuestionIndex++;
    this.resetState();
  }
}
