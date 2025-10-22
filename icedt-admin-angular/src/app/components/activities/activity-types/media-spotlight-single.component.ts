import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface MediaSpotlightItem {
  text: string;
  imageUrl: string;
  audioUrl?: string;
}

export interface MediaSpotlightSingleContent {
  title: string;
  spotlightLetter: string;
  item: MediaSpotlightItem;
}

@Component({
  selector: 'app-media-spotlight-single',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="media-spotlight-container">
      <div class="spotlight-circle">
        <span class="spotlight-letter">{{ content.spotlightLetter }}</span>
      </div>

      <div class="media-card">
        <mat-card class="item-card">
          <img
            mat-card-image
            [src]="getImageUrl()"
            [alt]="content.item.text"
            class="item-image"
          />
          <mat-card-content class="item-content">
            <div class="highlighted-word">
              <span
                *ngFor="let part of highlightedWordParts; let i = index"
                [class.highlighted]="part.toLowerCase() === content.spotlightLetter.toLowerCase()"
                class="word-part"
              >
                {{ part }}
              </span>
            </div>
            <button
              *ngIf="content.item.audioUrl"
              mat-icon-button
              color="primary"
              (click)="playAudio()"
              class="audio-button"
            >
              <mat-icon>volume_up</mat-icon>
            </button>
          </mat-card-content>
        </mat-card>
      </div>

      <audio #audioElement style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .media-spotlight-container {
      padding: 16px;
      font-family: sans-serif;
      text-align: center;
    }

    .spotlight-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      background-color: #1976d2;
      color: white;
      border-radius: 50%;
      margin-bottom: 24px;
    }

    .spotlight-letter {
      font-size: 5rem;
      font-weight: bold;
    }

    .media-card {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-card {
      min-width: 250px;
      margin: 0 8px;
    }

    .item-image {
      height: 180px;
      object-fit: contain;
      padding: 8px;
    }

    .item-content {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .highlighted-word {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .word-part {
      display: inline;
    }

    .word-part.highlighted {
      color: #f44336;
    }

    .audio-button {
      margin-left: 8px;
    }
  `]
})
export class MediaSpotlightSingleComponent implements OnInit, OnDestroy {
  @Input() content!: MediaSpotlightSingleContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  private mediaBaseUrl = '';

  get highlightedWordParts(): string[] {
    if (!this.content?.item?.text) return [];
    return this.content.item.text.split(new RegExp(`(${this.content.spotlightLetter})`, 'gi'));
  }

  ngOnInit(): void {
    this.playAudioWithDelay();
  }

  ngOnDestroy(): void {
    // Clean up audio resources
  }

  private playAudioWithDelay(): void {
    if (this.content?.item?.audioUrl) {
      setTimeout(() => {
        this.playAudio();
      }, 300);
    }
  }

  getImageUrl(): string {
    return `${this.mediaBaseUrl}${this.content.item.imageUrl}`;
  }

  playAudio(): void {
    if (this.content?.item?.audioUrl && this.audioElement) {
      this.audioElement.nativeElement.src = `${this.mediaBaseUrl}${this.content.item.audioUrl}`;
      this.audioElement.nativeElement.play().catch(e => 
        console.error("Audio playback failed:", e)
      );
    }
  }
}
