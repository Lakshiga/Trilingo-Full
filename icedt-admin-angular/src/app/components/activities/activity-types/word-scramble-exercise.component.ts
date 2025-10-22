import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export interface Word {
  id: string;
  scrambled: string[];
  solution: string;
}

export interface WordScrambleContent {
  title: string;
  activityTitle: string;
  instruction: string;
  words: Word[];
}

@Component({
  selector: 'app-word-scramble-exercise',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  template: `
    <div class="word-scramble-container">
      <h1 class="title">{{ content.title }}</h1>

      <mat-card class="instruction-card">
        <mat-card-content>
          <h2 class="activity-title">{{ content.activityTitle }}</h2>
          <p class="instruction-text">{{ content.instruction }}</p>
        </mat-card-content>
      </mat-card>
      
      <div *ngFor="let word of currentWords; let index = index" class="word-exercise">
        <mat-card class="word-card">
          <mat-card-content>
            <h3 class="question-title">கேள்வி {{ currentPage * wordsPerPage + index + 1 }}</h3>
            
            <!-- Answer Area -->
            <div 
              class="answer-area"
              [class.incorrect]="submitted && feedbacks[word.id] === 'incorrect'"
              [class.correct]="submitted && feedbacks[word.id] === 'correct'"
            >
              <mat-chip
                *ngFor="let letter of answers[word.id]; let i = index"
                class="answer-chip"
                (click)="handleAnswerLetterClick(word.id, letter, i)"
                [style.cursor]="submitted ? 'default' : 'pointer'"
              >
                {{ letter }}
              </mat-chip>
            </div>
            
            <!-- Letter Bank -->
            <div class="letter-bank">
              <mat-chip
                *ngFor="let letter of remainingLetters[word.id]; let i = index"
                class="letter-chip"
                (click)="handleLetterClick(word.id, letter, i)"
                [style.cursor]="submitted ? 'default' : 'pointer'"
              >
                {{ letter }}
              </mat-chip>
            </div>

            <!-- Feedback per word -->
            <div *ngIf="submitted" class="feedback" [class.correct-feedback]="feedbacks[word.id] === 'correct'" [class.incorrect-feedback]="feedbacks[word.id] === 'incorrect'">
              <div *ngIf="feedbacks[word.id] === 'correct'" class="correct-message">
                <mat-icon>check_circle</mat-icon>
                சரியாகச் செய்தீர்கள்!
              </div>
              <div *ngIf="feedbacks[word.id] === 'incorrect'" class="incorrect-message">
                <mat-icon>cancel</mat-icon>
                தவறான பதில்
                <p class="correct-answer">சரியான பதில்: <strong>{{ word.solution }}</strong></p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <!-- Global Controls -->
      <div class="controls">
        <button
          *ngIf="!submitted"
          mat-raised-button
          color="primary"
          (click)="checkCurrentPageAnswers()"
        >
          சரிபார்க்கவும்
        </button>

        <button
          *ngIf="submitted && !allCorrectOnPage"
          mat-raised-button
          color="accent"
          (click)="resetCurrentPage()"
        >
          மீண்டும் முயலவும்
        </button>
        
        <button
          *ngIf="allCorrectOnPage && !isLastPage"
          mat-raised-button
          color="accent"
          (click)="handleNextPage()"
        >
          அடுத்து
          <mat-icon>arrow_forward</mat-icon>
        </button>

        <div *ngIf="allCorrectOnPage && isLastPage" class="completion-message">
          🎉 வாழ்த்துக்கள்! நீங்கள் எல்லாவற்றையும் சரியாக முடித்துவிட்டீர்கள்! 🎉
        </div>
      </div>
    </div>
  `,
  styles: [`
    .word-scramble-container {
      padding: 24px;
      font-family: sans-serif;
      max-width: 800px;
      margin: auto;
    }

    .title {
      background: #00695c;
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-weight: bold;
      text-align: center;
    }

    .instruction-card {
      margin-bottom: 24px;
      background: #e0f2f1;
    }

    .activity-title {
      font-weight: 600;
      color: #004d40;
      margin-bottom: 8px;
    }

    .instruction-text {
      margin: 0;
    }

    .word-exercise {
      margin-bottom: 24px;
    }

    .question-title {
      font-weight: bold;
      margin-bottom: 16px;
    }

    .answer-area {
      min-height: 80px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 16px;
      padding: 16px;
      border: 2px solid transparent;
      background-color: white;
      border-radius: 4px;
    }

    .answer-area.incorrect {
      border-color: #d32f2f;
    }

    .answer-area.correct {
      background-color: #edf7ed;
    }

    .letter-bank {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 16px;
      padding: 16px;
      border-radius: 4px;
    }

    .answer-chip {
      height: 56px;
      width: 56px;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .letter-chip {
      height: 56px;
      width: 56px;
      font-size: 1.5rem;
      font-weight: bold;
      background-color: #4db6ac;
      color: white;
    }

    .feedback {
      margin-top: 16px;
      padding: 16px;
      border-radius: 4px;
    }

    .correct-feedback {
      background-color: #f1f8e9;
    }

    .incorrect-feedback {
      background-color: #ffebee;
    }

    .correct-message {
      color: #2e7d32;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .incorrect-message {
      color: #d32f2f;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .correct-answer {
      margin: 8px 0 0 0;
    }

    .controls {
      text-align: center;
      margin-top: 32px;
      min-height: 50px;
    }

    .completion-message {
      color: #2e7d32;
      font-size: 1.2rem;
      font-weight: bold;
    }
  `]
})
export class WordScrambleExerciseComponent implements OnInit {
  @Input() content!: WordScrambleContent;

  answers: { [key: string]: string[] } = {};
  remainingLetters: { [key: string]: string[] } = {};
  feedbacks: { [key: string]: 'correct' | 'incorrect' | 'none' } = {};
  submitted = false;
  currentPage = 0;
  wordsPerPage = 5;

  get totalPages(): number {
    return Math.ceil(this.content.words.length / this.wordsPerPage);
  }

  get isLastPage(): boolean {
    return this.currentPage === this.totalPages - 1;
  }

  get currentWords(): Word[] {
    return this.content.words.slice(
      this.currentPage * this.wordsPerPage,
      (this.currentPage + 1) * this.wordsPerPage
    );
  }

  get allCorrectOnPage(): boolean {
    return this.submitted && this.currentWords.every(word => this.feedbacks[word.id] === 'correct');
  }

  ngOnInit(): void {
    this.initializeState();
  }

  private initializeState(): void {
    const initialAnswers: { [key: string]: string[] } = {};
    const initialRemainingLetters: { [key: string]: string[] } = {};
    const initialFeedbacks: { [key: string]: 'correct' | 'incorrect' | 'none' } = {};

    this.content.words.forEach(word => {
      initialAnswers[word.id] = [];
      initialRemainingLetters[word.id] = [...word.scrambled].sort(() => Math.random() - 0.5);
      initialFeedbacks[word.id] = 'none';
    });

    this.answers = initialAnswers;
    this.remainingLetters = initialRemainingLetters;
    this.feedbacks = initialFeedbacks;
    this.submitted = false;
    this.currentPage = 0;
  }

  handleLetterClick(wordId: string, letter: string, index: number): void {
    this.answers = {
      ...this.answers,
      [wordId]: [...this.answers[wordId], letter]
    };
    this.remainingLetters = {
      ...this.remainingLetters,
      [wordId]: this.remainingLetters[wordId].filter((_, i) => i !== index)
    };
  }
  
  handleAnswerLetterClick(wordId: string, letter: string, index: number): void {
    if (this.submitted) return;
    this.remainingLetters = {
      ...this.remainingLetters,
      [wordId]: [...this.remainingLetters[wordId], letter]
    };
    this.answers = {
      ...this.answers,
      [wordId]: this.answers[wordId].filter((_, i) => i !== index)
    };
  }

  checkCurrentPageAnswers(): void {
    const newFeedbacks: { [key: string]: 'correct' | 'incorrect' } = {};
    this.currentWords.forEach(word => {
      const userAnswer = this.answers[word.id]?.join('') || '';
      newFeedbacks[word.id] = userAnswer === word.solution ? 'correct' : 'incorrect';
    });
    this.feedbacks = {...this.feedbacks, ...newFeedbacks};
    this.submitted = true;
  }

  handleNextPage(): void {
    if (!this.isLastPage) {
      this.currentPage++;
      this.submitted = false;
    }
  }

  resetCurrentPage(): void {
    const wordIdsOnPage = this.currentWords.map(w => w.id);
    this.answers = {
      ...this.answers,
      ...wordIdsOnPage.reduce((acc, id) => ({ ...acc, [id]: [] }), {})
    };
    this.remainingLetters = {
      ...this.remainingLetters,
      ...this.currentWords.reduce((acc, word) => ({
        ...acc,
        [word.id]: [...word.scrambled].sort(() => Math.random() - 0.5)
      }), {})
    };
    this.submitted = false;
  }
}
