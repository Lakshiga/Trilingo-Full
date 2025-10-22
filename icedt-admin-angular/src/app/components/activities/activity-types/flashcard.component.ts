import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlashcardContent } from '../../../types/activity-content.types';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="container" *ngIf="content; else noContent">
      <h2 class="title">{{ content.title }}</h2>
      
      <mat-card class="flashcard">
        <img 
          mat-card-image 
          [src]="getImageUrl(content.imageUrl)" 
          [alt]="content.word"
          class="card-image"
        />
        <mat-card-content class="card-content">
          <div class="word-container">
            <span class="word">{{ content.word }}</span>
            <button
              *ngIf="content.audioUrl"
              mat-icon-button
              color="primary"
              (click)="playAudio()"
              class="audio-button"
            >
              <mat-icon>volume_up</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <audio #audioPlayer style="display: none;"></audio>
    </div>

    <ng-template #noContent>
      <div class="error-message">No flashcard content to display.</div>
    </ng-template>
  `,
  styles: [`
    .container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .title {
      margin-bottom: 24px;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .flashcard {
      width: 320px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .card-image {
      height: 240px;
      object-fit: cover;
    }

    .card-content {
      padding: 16px;
    }

    .word-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .word {
      font-size: 2rem;
      font-weight: bold;
    }

    .audio-button {
      margin-left: 8px;
    }

    .audio-button mat-icon {
      font-size: 2rem;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      padding: 24px;
      font-size: 1.1rem;
    }
  `]
})
export class FlashcardComponent implements OnInit {
  @Input() content!: FlashcardContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  ngOnInit(): void {
    // Add a small delay to allow the card to render before playing
    setTimeout(() => {
      this.playAudio();
    }, 300);
  }

  getImageUrl(imageUrl: string): string {
    // Assuming you have a media base URL configured
    const mediaBaseUrl = ''; // You can inject this from a service or environment
    return `${mediaBaseUrl}${imageUrl}`;
  }

  playAudio(): void {
    if (this.content?.audioUrl && this.audioPlayer) {
      const mediaBaseUrl = ''; // You can inject this from a service or environment
      this.audioPlayer.nativeElement.src = `${mediaBaseUrl}${this.content.audioUrl}`;
      this.audioPlayer.nativeElement.play().catch(e => console.error("Audio playback failed:", e));
    }
  }
}