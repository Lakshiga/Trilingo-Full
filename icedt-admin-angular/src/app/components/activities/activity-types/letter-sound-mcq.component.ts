import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTypographyModule } from '@angular/material/typography';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface OptionItem {
  id: number;
  letter: string;
  imageUrl: string;
}

interface QuestionItem {
  id: number;
  questionAudioUrl: string;
  correctAnswerId: number;
  options: OptionItem[];
}

export interface LetterSoundMcqContent {
  title?: string;
  description?: string;
  questions: QuestionItem[];
}

@Component({
  selector: 'app-letter-sound-mcq',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTypographyModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="letter-sound-mcq" *ngIf="!isFinished">
      <h1>{{ content.title || 'செயல் 04' }}</h1>
      <p>{{ content.description || 'சரியான படத்தைத் தேர்ந்தெடு' }}</p>
      
      <div class="audio-controls">
        <button 
          mat-icon-button 
          color="primary" 
          (click)="playAudio(currentQuestion?.questionAudioUrl)"
          [disabled]="!currentQuestion">
          <mat-icon>volume_up</mat-icon>
        </button>
      </div>
      
      <div class="options-grid" *ngIf="currentOptions.length > 0">
        <mat-card 
          *ngFor="let option of currentOptions" 
          class="option-card"
          (click)="handleOptionClick(option)"
          [class.correct]="isAnswered && option.id === currentQuestion?.correctAnswerId"
          [class.incorrect]="isAnswered && selectedOptionId === option.id && option.id !== currentQuestion?.correctAnswerId"
          [class.disabled]="isAnswered">
          <img [src]="getImageUrl(option.imageUrl)" [alt]="option.letter" class="option-image">
          <div class="result-icon" *ngIf="isAnswered">
            <mat-icon *ngIf="option.id === currentQuestion?.correctAnswerId" color="success">check_circle</mat-icon>
            <mat-icon *ngIf="selectedOptionId === option.id && option.id !== currentQuestion?.correctAnswerId" color="warn">cancel</mat-icon>
          </div>
        </mat-card>
      </div>
      
      <mat-spinner *ngIf="currentOptions.length === 0" class="loading-spinner"></mat-spinner>
      
      <audio #audioPlayer style="display: none;"></audio>
    </div>
    
    <div class="finished-screen" *ngIf="isFinished">
      <h2>விளையாட்டு முடிந்தது!</h2>
      <p>உங்கள் இறுதி மதிப்பெண்: {{ score }} / {{ content.questions.length }}</p>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="restartGame()">
        மீண்டும் விளையாடு
      </button>
    </div>
  `,
  styles: [`
    .letter-sound-mcq {
      padding: 24px;
      text-align: center;
      font-family: sans-serif;
    }

    h1 {
      margin-bottom: 16px;
      font-size: 2rem;
    }

    p {
      margin-bottom: 24px;
      color: #666;
    }

    .audio-controls {
      margin-bottom: 32px;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .option-card {
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      border: 3px solid transparent;
    }

    .option-card:hover:not(.disabled) {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .option-card.correct {
      border-color: #4caf50;
      transform: scale(1.05);
    }

    .option-card.incorrect {
      border-color: #f44336;
      opacity: 0.5;
    }

    .option-card.disabled {
      cursor: default;
    }

    .option-image {
      width: 100%;
      height: 200px;
      object-fit: contain;
      padding: 16px;
    }

    .result-icon {
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: white;
      border-radius: 50%;
      padding: 4px;
    }

    .loading-spinner {
      margin: 32px auto;
    }

    .finished-screen {
      padding: 48px 24px;
      text-align: center;
    }

    .finished-screen h2 {
      margin-bottom: 16px;
      color: #1976d2;
    }

    .finished-screen p {
      margin-bottom: 24px;
      font-size: 1.2rem;
    }
  `]
})
export class LetterSoundMcqComponent implements OnInit, OnChanges {
  @Input() content!: LetterSoundMcqContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  currentQuestionIndex = 0;
  currentOptions: OptionItem[] = [];
  score = 0;
  isAnswered = false;
  selectedOptionId: number | null = null;
  isFinished = false;

  get currentQuestion(): QuestionItem | undefined {
    return this.content.questions[this.currentQuestionIndex];
  }

  ngOnInit(): void {
    this.initializeGame();
  }

  ngOnChanges(): void {
    this.initializeGame();
  }

  private initializeGame(): void {
    if (this.content?.questions && this.content.questions.length > 0) {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.isFinished = false;
      this.loadCurrentQuestion();
    }
  }

  private loadCurrentQuestion(): void {
    if (this.currentQuestionIndex >= this.content.questions.length) {
      this.isFinished = true;
      return;
    }

    const currentQuestion = this.content.questions[this.currentQuestionIndex];
    if (!currentQuestion) return;

    // Shuffle options
    this.currentOptions = [...currentQuestion.options].sort(() => 0.5 - Math.random());
    
    // Reset states
    this.isAnswered = false;
    this.selectedOptionId = null;

    // Play question audio
    this.playAudio(currentQuestion.questionAudioUrl);
  }

  handleOptionClick(option: OptionItem): void {
    if (this.isAnswered) return;

    this.isAnswered = true;
    this.selectedOptionId = option.id;

    if (option.id === this.currentQuestion?.correctAnswerId) {
      this.score++;
    }

    // Move to next question after delay
    setTimeout(() => {
      this.currentQuestionIndex++;
      this.loadCurrentQuestion();
    }, 1500);
  }

  playAudio(audioUrl?: string): void {
    if (audioUrl && this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.src = audioUrl;
      this.audioPlayer.nativeElement.play().catch(e => 
        console.error("Audio playback failed:", e)
      );
    }
  }

  getImageUrl(imageUrl: string): string {
    // Assuming you have a media base URL
    return imageUrl;
  }

  restartGame(): void {
    this.initializeGame();
  }
}
