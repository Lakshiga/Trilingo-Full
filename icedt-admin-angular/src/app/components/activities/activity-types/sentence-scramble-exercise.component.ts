import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTypographyModule } from '@angular/material/typography';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

interface Sentence {
  id: string;
  scrambled: string[];
  solution: string;
}

export interface SentenceScrambleContent {
  title: string;
  activityTitle: string;
  instruction: string;
  sentences: Sentence[];
}

@Component({
  selector: 'app-sentence-scramble-exercise',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTypographyModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="sentence-scramble-exercise" *ngIf="content && content.sentences && content.sentences.length > 0">
      <h1>{{ content.title }}</h1>
      
      <div class="instruction-card">
        <h2>{{ content.activityTitle }}</h2>
        <p>{{ content.instruction }}</p>
      </div>
      
      <div class="exercise-area" *ngIf="!allDone">
        <h3>வாக்கியம் {{ currentSentenceIndex + 1 }}</h3>
        
        <!-- Answer Area -->
        <div class="answer-area" 
             [class.incorrect]="submitted && feedback === 'incorrect'"
             [class.correct]="submitted && feedback === 'correct'">
          <mat-chip 
            *ngFor="let word of answerWords; let i = index" 
            (click)="handleAnswerClick(word, i)"
            [class.disabled]="submitted">
            {{ word }}
          </mat-chip>
        </div>
        
        <!-- Word Bank -->
        <div class="word-bank">
          <mat-chip 
            *ngFor="let word of wordBank; let i = index" 
            (click)="handleWordBankClick(word, i)"
            [class.disabled]="submitted">
            {{ word }}
          </mat-chip>
        </div>
        
        <!-- Feedback -->
        <div class="feedback" *ngIf="submitted">
          <div class="feedback-content" 
               [class.correct-feedback]="feedback === 'correct'"
               [class.incorrect-feedback]="feedback === 'incorrect'">
            <div *ngIf="feedback === 'correct'" class="correct-message">
              <mat-icon>check_circle</mat-icon>
              மிகச் சரி!
            </div>
            <div *ngIf="feedback === 'incorrect'" class="incorrect-message">
              <mat-icon>cancel</mat-icon>
              தவறான வாக்கியம்
              <p>சரியான வாக்கியம்: <strong>{{ currentSentence.solution }}</strong></p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Controls -->
      <div class="controls">
        <button 
          *ngIf="!submitted" 
          mat-raised-button 
          color="primary" 
          (click)="handleCheck()"
          [disabled]="answerWords.length === 0">
          சரிபார்க்கவும்
        </button>
        
        <button 
          *ngIf="submitted && feedback === 'incorrect'" 
          mat-raised-button 
          color="accent" 
          (click)="handleRetry()">
          மீண்டும் முயலவும்
        </button>
        
        <button 
          *ngIf="submitted && feedback === 'correct' && !isLastSentence" 
          mat-raised-button 
          color="primary" 
          (click)="handleNext()">
          அடுத்த வாக்கியம்
          <mat-icon>arrow_forward</mat-icon>
        </button>
        
        <div *ngIf="allDone" class="completion-message">
          <h2>🎉 வாழ்த்துக்கள்! நீங்கள் எல்லா வாக்கியங்களையும் சரியாக முடித்துவிட்டீர்கள்! 🎉</h2>
        </div>
      </div>
    </div>
    
    <div *ngIf="!content || !content.sentences || content.sentences.length === 0" class="loading">
      செயல்பாட்டு உள்ளடக்கம் ஏற்றுகிறது...
    </div>
  `,
  styles: [`
    .sentence-scramble-exercise {
      padding: 24px;
      font-family: sans-serif;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      background: #AD1457;
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-weight: bold;
    }

    .instruction-card {
      background: #FCE4EC;
      padding: 16px;
      margin-bottom: 24px;
      border-radius: 8px;
    }

    .instruction-card h2 {
      font-weight: 600;
      color: #880E4F;
      margin-bottom: 8px;
    }

    .exercise-area {
      margin-bottom: 32px;
    }

    .exercise-area h3 {
      margin-bottom: 16px;
      font-weight: bold;
    }

    .answer-area {
      padding: 16px;
      min-height: 100px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 16px;
      border: 2px solid transparent;
      border-radius: 8px;
      background-color: white;
    }

    .answer-area.incorrect {
      border-color: #d32f2f;
    }

    .answer-area.correct {
      background-color: #EDF7ED;
    }

    .word-bank {
      padding: 16px;
      min-height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 16px;
      border-radius: 8px;
    }

    .word-bank mat-chip {
      background-color: #EC407A;
      color: white;
      font-size: 1.2rem;
      padding: 16px;
      cursor: pointer;
    }

    .answer-area mat-chip {
      font-size: 1.2rem;
      padding: 16px;
      cursor: pointer;
    }

    .word-bank mat-chip.disabled,
    .answer-area mat-chip.disabled {
      cursor: default;
    }

    .feedback {
      margin-top: 16px;
    }

    .feedback-content {
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
      flex-direction: column;
      align-items: flex-start;
    }

    .incorrect-message p {
      margin: 8px 0 0 0;
    }

    .controls {
      text-align: center;
      margin-top: 32px;
      min-height: 50px;
    }

    .completion-message {
      background-color: #2e7d32;
      color: white;
      padding: 32px;
      border-radius: 8px;
    }

    .completion-message h2 {
      margin: 0;
      font-weight: bold;
    }

    .loading {
      padding: 24px;
      text-align: center;
    }
  `]
})
export class SentenceScrambleExerciseComponent implements OnInit, OnChanges {
  @Input() content!: SentenceScrambleContent;

  currentSentenceIndex = 0;
  answerWords: string[] = [];
  wordBank: string[] = [];
  feedback: 'correct' | 'incorrect' | 'none' = 'none';
  submitted = false;

  get currentSentence(): Sentence {
    return this.content.sentences[this.currentSentenceIndex];
  }

  get isLastSentence(): boolean {
    return this.currentSentenceIndex === this.content.sentences.length - 1;
  }

  get allDone(): boolean {
    return this.submitted && this.feedback === 'correct' && this.isLastSentence;
  }

  ngOnInit(): void {
    this.setupCurrentSentence();
  }

  ngOnChanges(): void {
    this.setupCurrentSentence();
  }

  private setupCurrentSentence(): void {
    if (this.content?.sentences && this.content.sentences.length > 0) {
      this.answerWords = [];
      this.wordBank = [...this.content.sentences[this.currentSentenceIndex].scrambled]
        .sort(() => Math.random() - 0.5);
      this.feedback = 'none';
      this.submitted = false;
    }
  }

  handleWordBankClick(word: string, index: number): void {
    if (this.submitted) return;
    this.answerWords.push(word);
    this.wordBank.splice(index, 1);
  }

  handleAnswerClick(word: string, index: number): void {
    if (this.submitted) return;
    this.wordBank.push(word);
    this.answerWords.splice(index, 1);
  }

  handleCheck(): void {
    const userAnswer = this.answerWords.join(' ') + '.';
    if (userAnswer === this.currentSentence.solution) {
      this.feedback = 'correct';
    } else {
      this.feedback = 'incorrect';
    }
    this.submitted = true;
  }

  handleNext(): void {
    if (!this.isLastSentence) {
      this.currentSentenceIndex++;
      this.setupCurrentSentence();
    }
  }

  handleRetry(): void {
    this.setupCurrentSentence();
  }
}
