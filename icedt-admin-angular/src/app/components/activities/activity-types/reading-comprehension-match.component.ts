import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export interface ComprehensionQuestion {
  id: number;
  text: string;
  audioUrl: string;
}

export interface ComprehensionAnswer {
  id: number;
  text: string;
  matchId: number;
}

export interface ReadingComprehensionContent {
  title: string;
  passage: string;
  passageAudioUrl: string;
  questions: ComprehensionQuestion[];
  answers: ComprehensionAnswer[];
}

@Component({
  selector: 'app-reading-comprehension-match',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="reading-comprehension-container">
      <h1 class="title">{{ content.title }}</h1>
      
      <!-- Reading Passage with Audio Button -->
      <mat-card class="passage-card">
        <mat-card-content>
          <div class="passage-header">
            <h3>Passage</h3>
            <button mat-raised-button color="primary" (click)="playAudio(content.passageAudioUrl)">
              <mat-icon>volume_up</mat-icon>
              <span>Listen to Passage</span>
            </button>
          </div>
          <p class="passage-text">{{ content.passage }}</p>
        </mat-card-content>
      </mat-card>

      <!-- Success Message -->
      <div *ngIf="isComplete" class="success-message">
        <mat-icon>check_circle</mat-icon>
        <span>Excellent! All questions answered correctly!</span>
      </div>

      <div class="matching-section">
        <!-- Questions Column (Drop Targets) -->
        <div class="questions-column">
          <h3 class="column-title">வினாக்கள் (Questions)</h3>
          <mat-card
            *ngFor="let question of content.questions"
            class="question-card"
            [class.matched]="matchedPairs[question.id]"
            (dragover)="handleDragOver($event)"
            (drop)="handleDrop($event, question.id)"
          >
            <mat-card-content>
              <div class="question-content">
                <p class="question-text">{{ question.text }}</p>
                <button mat-icon-button (click)="playAudio(question.audioUrl)" class="audio-button">
                  <mat-icon>volume_up</mat-icon>
                </button>
                <div *ngIf="matchedPairs[question.id]" class="matched-answer">
                  {{ getMatchedAnswerText(question.id) }}
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Answers Column (Draggable Items) -->
        <div class="answers-column">
          <h3 class="column-title">பதில்கள் (Answers)</h3>
          <ng-container *ngFor="let answer of shuffledAnswers">
            <mat-card
              *ngIf="!isAnswerMatched(answer.id)"
              class="answer-card"
              [draggable]="true"
              (dragstart)="handleDragStart($event, answer)"
            >
              <mat-card-content>
                <p class="answer-text">{{ answer.text }}</p>
              </mat-card-content>
            </mat-card>
          </ng-container>
        </div>
      </div>

      <audio #audioElement style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .reading-comprehension-container {
      padding: 24px;
      font-family: sans-serif;
    }

    .title {
      text-align: center;
      margin-bottom: 24px;
      font-size: 2rem;
    }

    .passage-card {
      margin-bottom: 32px;
      background-color: #f5f5f5;
    }

    .passage-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .passage-text {
      line-height: 1.8;
      text-align: left;
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding: 16px;
      background-color: #e8f5e9;
      color: #2e7d32;
      border-radius: 4px;
    }

    .matching-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 32px;
      justify-content: center;
    }

    .column-title {
      text-align: center;
      margin-bottom: 16px;
    }

    .question-card {
      margin-bottom: 16px;
      border: 2px dashed #ccc;
      background-color: #fafafa;
      transition: background-color 0.3s;
    }

    .question-card.matched {
      background-color: #e8f5e9;
    }

    .question-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .question-text {
      flex-grow: 1;
      text-align: left;
      margin: 0;
    }

    .audio-button {
      min-width: 40px;
      padding: 8px;
    }

    .matched-answer {
      padding: 8px;
      background-color: #4caf50;
      color: white;
      border-radius: 4px;
      font-weight: bold;
    }

    .answer-card {
      margin-bottom: 16px;
      cursor: grab;
      background-color: #1976d2;
      color: white;
      text-align: center;
      transition: transform 0.2s;
    }

    .answer-card:hover {
      transform: scale(1.02);
    }

    .answer-text {
      margin: 0;
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .matching-section {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class ReadingComprehensionMatchComponent implements OnInit, OnDestroy {
  @Input() content!: ReadingComprehensionContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  draggedItem: ComprehensionAnswer | null = null;
  matchedPairs: Record<number, number> = {};
  shuffledAnswers: ComprehensionAnswer[] = [];

  ngOnInit() {
    this.shuffleAnswers();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  get isComplete(): boolean {
    return Object.keys(this.matchedPairs).length === this.content.questions.length;
  }

  private shuffleAnswers() {
    this.shuffledAnswers = [...this.content.answers].sort(() => Math.random() - 0.5);
  }

  playAudio(audioUrl: string) {
    if (this.audioElement?.nativeElement) {
      this.audioElement.nativeElement.src = audioUrl;
      this.audioElement.nativeElement.play().catch(e => 
        console.error("Audio playback error:", e)
      );
    }
  }

  handleDragStart(event: DragEvent, answer: ComprehensionAnswer) {
    this.draggedItem = answer;
    if (event.dataTransfer) {
      event.dataTransfer.setData('answerId', answer.id.toString());
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleDrop(event: DragEvent, questionId: number) {
    event.preventDefault();
    if (!this.draggedItem || this.matchedPairs[questionId]) return;

    if (this.draggedItem.matchId === questionId) {
      this.matchedPairs = { ...this.matchedPairs, [questionId]: this.draggedItem.id };
    }
    this.draggedItem = null;
  }

  isAnswerMatched(answerId: number): boolean {
    return Object.values(this.matchedPairs).includes(answerId);
  }

  getMatchedAnswerText(questionId: number): string {
    const answerId = this.matchedPairs[questionId];
    const answer = this.content.answers.find(a => a.id === answerId);
    return answer?.text || '';
  }
}
