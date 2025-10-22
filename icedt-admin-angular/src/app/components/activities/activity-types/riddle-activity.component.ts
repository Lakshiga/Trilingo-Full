import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface RiddleChoice {
  id: number;
  text: string;
  imageUrl: string;
}

export interface RiddleContent {
  id: number;
  title: string;
  riddleText: string;
  riddleAudioUrl: string;
  choices: RiddleChoice[];
  correctChoiceId: number;
}

@Component({
  selector: 'app-riddle-activity',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="riddle-container">
      <h1 class="title">{{ content.title }}</h1>
      
      <!-- Riddle Display -->
      <mat-card class="riddle-card">
        <mat-card-content>
          <div class="riddle-content">
            <p class="riddle-text">{{ content.riddleText }}</p>
            <button mat-icon-button (click)="playRiddleAudio()" class="audio-button">
              <mat-icon>volume_up</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Result Feedback -->
      <div class="feedback-area">
        <div *ngIf="showResult" class="feedback-message" [class.correct]="isCorrect" [class.incorrect]="!isCorrect">
          {{ isCorrect ? 'சரியான விடை!' : 'தவறான விடை, மீண்டும் முயற்சிக்கவும்.' }}
        </div>
      </div>

      <!-- Image Choices -->
      <div class="choices-grid">
        <mat-card
          *ngFor="let choice of content.choices"
          class="choice-card"
          [class.selected]="selectedId === choice.id"
          [class.correct]="showResult && content.correctChoiceId === choice.id"
          [class.incorrect]="showResult && selectedId === choice.id && choice.id !== content.correctChoiceId"
          [class.disabled]="showResult"
          (click)="handleChoiceSelect(choice.id)"
        >
          <img
            mat-card-image
            [src]="choice.imageUrl"
            [alt]="choice.text"
            class="choice-image"
          />
        </mat-card>
      </div>

      <!-- Action Buttons -->
      <div *ngIf="showResult" class="action-buttons">
        <button mat-raised-button (click)="handleReset()">
          <mat-icon>replay</mat-icon>
          மீண்டும் முயற்சி செய் (Try Again)
        </button>
      </div>

      <audio #audioElement style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .riddle-container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
    }

    .title {
      color: #1976d2;
      margin-bottom: 24px;
      margin-top: 0;
    }

    .riddle-card {
      margin-bottom: 32px;
      background-color: #e3f2fd;
    }

    .riddle-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .riddle-text {
      font-size: 1.2rem;
      font-weight: bold;
      margin: 0;
    }

    .audio-button {
      font-size: 2rem;
    }

    .feedback-area {
      min-height: 60px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .feedback-message {
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: 500;
    }

    .feedback-message.correct {
      background-color: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #4caf50;
    }

    .feedback-message.incorrect {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #f44336;
    }

    .choices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .choice-card {
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .choice-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .choice-card.selected {
      transform: scale(1.05);
    }

    .choice-card.correct {
      border: 4px solid #4caf50;
    }

    .choice-card.incorrect {
      border: 4px solid #f44336;
      opacity: 0.6;
    }

    .choice-card.disabled {
      cursor: default;
    }

    .choice-image {
      height: 180px;
      object-fit: cover;
    }

    .action-buttons {
      margin-top: 32px;
    }
  `]
})
export class RiddleActivityComponent implements OnInit, OnDestroy {
  @Input() content!: RiddleContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  selectedId: number | null = null;
  showResult = false;
  private mediaBaseUrl = '';

  get isCorrect(): boolean {
    return this.selectedId === this.content.correctChoiceId;
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  playRiddleAudio(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = `${this.mediaBaseUrl}${this.content.riddleAudioUrl}`;
      this.audioElement.nativeElement.play().catch(e => 
        console.error("Audio playback failed:", e)
      );
    }
  }

  handleChoiceSelect(choiceId: number): void {
    if (this.showResult) return;
    
    this.selectedId = choiceId;
    this.showResult = true;
  }

  handleReset(): void {
    this.selectedId = null;
    this.showResult = false;
  }
}
