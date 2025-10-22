import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTypographyModule } from '@angular/material/typography';
import { MatCardModule } from '@angular/material/card';

interface MediaSpotlightItem {
  text: string;
  imageUrl: string;
  audioUrl?: string;
}

export interface MediaSpotlightMultipleContent {
  title: string;
  spotlightLetter: string;
  items: MediaSpotlightItem[];
}

@Component({
  selector: 'app-media-spotlight-multiple',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTypographyModule,
    MatCardModule
  ],
  template: `
    <div class="media-spotlight-multiple">
      <h1>{{ content.title }}</h1>
      
      <!-- Spotlight Letter -->
      <div class="spotlight-letter">
        <span>{{ content.spotlightLetter }}</span>
      </div>
      
      <!-- Grid of word cards -->
      <div class="items-grid">
        <mat-card 
          *ngFor="let item of content.items; let i = index"
          class="item-card">
          <img 
            [src]="getImageUrl(item.imageUrl)" 
            [alt]="item.text"
            class="item-image">
          <mat-card-content class="item-content">
            <div class="word-container">
              <span class="highlighted-word" [innerHTML]="getHighlightedWord(item.text)"></span>
              <button 
                *ngIf="item.audioUrl"
                mat-icon-button 
                color="primary" 
                (click)="playAudio(item.audioUrl)"
                class="audio-button">
                <mat-icon>volume_up</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <audio #audioPlayer style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .media-spotlight-multiple {
      padding: 16px;
      font-family: sans-serif;
      text-align: center;
    }

    h1 {
      margin-bottom: 16px;
      font-size: 2rem;
    }

    .spotlight-letter {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      background-color: #f44336;
      color: white;
      border-radius: 50%;
      margin-bottom: 24px;
    }

    .spotlight-letter span {
      font-size: 3rem;
      font-weight: bold;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      max-width: 800px;
      margin: 0 auto;
    }

    .item-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .item-image {
      width: 100%;
      height: 120px;
      object-fit: contain;
      padding: 8px;
    }

    .item-content {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .word-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .highlighted-word {
      font-size: 1.25rem;
      font-weight: bold;
    }

    .audio-button {
      margin-left: 4px;
    }

    .highlight {
      color: #f44336;
      font-weight: bold;
    }
  `]
})
export class MediaSpotlightMultipleComponent {
  @Input() content!: MediaSpotlightMultipleContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  getImageUrl(imageUrl: string): string {
    // Assuming you have an environment variable or service for media URL
    return `${imageUrl}`;
  }

  getHighlightedWord(word: string): string {
    const letter = this.content.spotlightLetter;
    const regex = new RegExp(`(${letter})`, 'gi');
    return word.replace(regex, '<span class="highlight">$1</span>');
  }

  playAudio(audioUrl?: string): void {
    if (audioUrl && this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.src = audioUrl;
      this.audioPlayer.nativeElement.play().catch(e => 
        console.error("Audio playback failed:", e)
      );
    }
  }
}
