import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface PronunciationPracticeContent {
  id: number;
  title: string;
  text: string;
  audioUrl: string;
}

@Component({
  selector: 'app-pronunciation-practice',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="pronunciation-container" *ngIf="content; else noContentTemplate">
      <h1 class="title">{{ content.title }}</h1>
      
      <p class="instruction">
        சொல்லைக் கேட்டு மீண்டும் கூறவும் (Listen to the sound and repeat)
      </p>
      
      <!-- Main Display Area -->
      <mat-card class="display-card">
        <mat-card-content>
          <div class="text-display">{{ content.text }}</div>
          
          <button
            class="play-button"
            mat-fab
            color="primary"
            (click)="handlePlayCurrent()"
            [disabled]="isPlaying"
          >
            <mat-icon>volume_up</mat-icon>
          </button>
        </mat-card-content>
      </mat-card>

      <audio #audioElement style="display: none;"></audio>
    </div>

    <ng-template #noContentTemplate>
      <div class="error-message">
        <p>No item to display.</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .pronunciation-container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
    }

    .title {
      margin-bottom: 16px;
      color: #1976d2;
      font-size: 2rem;
    }

    .instruction {
      margin-bottom: 24px;
      color: #666;
    }

    .display-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px;
      background-color: #f8f9fa;
      min-height: 250px;
      border-radius: 16px;
    }

    .text-display {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 24px;
      color: #333;
    }

    .play-button {
      transform: scale(2.5);
      background-color: #e3f2fd;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      min-width: 80px;
    }

    .play-button:hover {
      background-color: #bbdefb;
    }

    .play-button:disabled {
      opacity: 0.6;
    }

    .error-message {
      padding: 24px;
      color: #f44336;
      text-align: center;
    }

    @media (max-width: 768px) {
      .text-display {
        font-size: 2rem;
      }
      
      .play-button {
        transform: scale(2);
        width: 60px;
        height: 60px;
        min-width: 60px;
      }
    }
  `]
})
export class PronunciationPracticeComponent implements OnInit, OnDestroy {
  @Input() content!: PronunciationPracticeContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  isPlaying = false;

  ngOnInit() {
    // Component initialization
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  handlePlayCurrent() {
    if (!this.isPlaying && this.content?.audioUrl) {
      this.playAudio(this.content.audioUrl);
    }
  }

  private playAudio(audioUrl: string) {
    if (this.audioElement?.nativeElement) {
      this.audioElement.nativeElement.src = audioUrl;
      this.isPlaying = true;
      
      this.audioElement.nativeElement.play().catch(e => {
        console.error("Audio playback error:", e);
        this.isPlaying = false;
      });
      
      this.audioElement.nativeElement.onended = () => {
        this.isPlaying = false;
      };
    }
  }
}
