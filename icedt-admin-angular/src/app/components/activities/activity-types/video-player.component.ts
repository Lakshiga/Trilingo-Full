import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// MatTypographyModule is not available in Angular Material v19

export interface VideoPlayerContent {
  title: string;
  description?: string;
  videoUrl: string;
}

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="video-player-activity">
      <h1>{{ content.title }}</h1>
      
      <p *ngIf="content.description" class="description">
        {{ content.description }}
      </p>
      
      <div class="video-container">
        <video
          #videoPlayer
          width="600"
          [controls]="false"
          class="video-element">
          <source [src]="content.videoUrl" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        
        <button 
          mat-fab 
          color="primary"
          (click)="togglePlay()"
          class="play-button">
          <mat-icon>{{ playing ? 'pause' : 'play_arrow' }}</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .video-player-activity {
      padding: 24px;
      font-family: sans-serif;
    }

    h1 {
      text-align: center;
      margin-bottom: 16px;
      font-size: 2rem;
    }

    .description {
      text-align: center;
      margin-bottom: 16px;
      color: #666;
    }

    .video-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .video-element {
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      max-width: 100%;
      height: auto;
    }

    .play-button {
      margin-top: 16px;
      font-size: 2rem;
    }

    @media (max-width: 768px) {
      .video-element {
        width: 100%;
        max-width: 400px;
      }
    }
  `]
})
export class VideoPlayerComponent {
  @Input() content!: VideoPlayerContent;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  playing = false;

  togglePlay(): void {
    if (this.videoPlayer?.nativeElement) {
      if (this.playing) {
        this.videoPlayer.nativeElement.pause();
        this.playing = false;
      } else {
        this.videoPlayer.nativeElement.play().catch(err => 
          console.error("Video play failed:", err)
        );
        this.playing = true;
      }
    }
  }
}