import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

export interface LyricLine {
  text: string;
  timestamp: number;
}

export interface SongContent {
  title: string;
  artist?: string;
  albumArtUrl?: string;
  audioUrl: string;
  lyrics: LyricLine[];
}

@Component({
  selector: 'app-song-player',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatSliderModule],
  template: `
    <mat-card class="song-player-card">
      <!-- Album Art and Song Info -->
      <div class="song-info">
        <div class="album-art">
          <img 
            [src]="content.albumArtUrl || 'default_album_art.png'" 
            [alt]="content.title"
            class="album-image"
          />
        </div>
        <h1 class="song-title">{{ content.title }}</h1>
        <p *ngIf="content.artist" class="artist-name">{{ content.artist }}</p>
      </div>

      <!-- Lyrics Area with Auto-Scroll -->
      <div class="lyrics-container" #lyricsContainer>
        <div
          *ngFor="let line of content.lyrics; let i = index"
          class="lyric-line"
          [class.active]="i === activeLineIndex"
          [class.inactive]="i !== activeLineIndex"
          #lyricLine
        >
          {{ line.text }}
        </div>
      </div>

      <!-- Audio Player Controls -->
      <div class="player-controls">
        <audio 
          #audioElement 
          [src]="content.audioUrl" 
          style="display: none;"
          (loadedmetadata)="onLoadedMetadata()"
          (timeupdate)="onTimeUpdate()"
          (ended)="onEnded()"
        ></audio>
        
        <mat-slider
          [min]="0"
          [max]="duration"
          [step]="1"
          [ngModel]="currentTime"
          (ngModelChange)="onSliderChange($event)"
          class="time-slider"
        ></mat-slider>
        
        <div class="time-display">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <span class="total-time">{{ formatTime(duration) }}</span>
        </div>
        
        <div class="control-buttons">
          <button mat-icon-button (click)="togglePlayPause()" class="play-pause-button">
            <mat-icon>{{ isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>
          </button>
          <button mat-icon-button (click)="handleReplay()">
            <mat-icon>replay</mat-icon>
          </button>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .song-player-card {
      padding: 24px;
      margin: auto;
      max-width: 450px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      height: 95%;
    }

    .song-info {
      text-align: center;
      margin-bottom: 16px;
    }

    .album-art {
      margin-bottom: 16px;
    }

    .album-image {
      width: 150px;
      height: 150px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .song-title {
      font-weight: bold;
      margin: 0 0 8px 0;
    }

    .artist-name {
      color: #666;
      margin: 0;
    }

    .lyrics-container {
      flex-grow: 1;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      text-align: center;
      max-height: 300px;
    }

    .lyric-line {
      padding: 8px;
      border-radius: 4px;
      transition: all 0.3s;
      margin: 4px 0;
    }

    .lyric-line.active {
      background-color: #e3f2fd;
      color: #1976d2;
      transform: scale(1.05);
      font-weight: bold;
    }

    .lyric-line.inactive {
      background-color: transparent;
      transform: scale(1);
    }

    .player-controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .time-slider {
      width: 100%;
    }

    .time-display {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #666;
    }

    .control-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 8px;
    }

    .play-pause-button mat-icon {
      font-size: 2.5rem;
    }
  `]
})
export class SongPlayerComponent implements OnInit, OnDestroy {
  @Input() content!: SongContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;
  @ViewChild('lyricsContainer') lyricsContainer!: ElementRef<HTMLDivElement>;

  isPlaying = false;
  currentTime = 0;
  duration = 0;
  activeLineIndex = -1;

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    // Clean up audio resources
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  onLoadedMetadata(): void {
    this.duration = this.audioElement.nativeElement.duration;
  }

  onTimeUpdate(): void {
    this.currentTime = this.audioElement.nativeElement.currentTime;
    this.updateActiveLyric();
  }

  onEnded(): void {
    this.isPlaying = false;
  }

  onSliderChange(newTime: number): void {
    this.audioElement.nativeElement.currentTime = newTime;
    this.currentTime = newTime;
  }

  private updateActiveLyric(): void {
    const time = this.currentTime;
    const currentLineIndex = this.content.lyrics.findIndex((line, index) => {
      const nextLine = this.content.lyrics[index + 1];
      return time >= line.timestamp && (!nextLine || time < nextLine.timestamp);
    });
    
    if (currentLineIndex !== this.activeLineIndex) {
      this.activeLineIndex = currentLineIndex;
      this.scrollToActiveLyric();
    }
  }

  private scrollToActiveLyric(): void {
    // Auto-scroll to active lyric
    setTimeout(() => {
      const activeElement = this.lyricsContainer.nativeElement.querySelector('.lyric-line.active');
      if (activeElement) {
        activeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  }

  togglePlayPause(): void {
    if (this.audioElement) {
      if (this.isPlaying) {
        this.audioElement.nativeElement.pause();
      } else {
        this.audioElement.nativeElement.play();
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  handleReplay(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.currentTime = 0;
      this.audioElement.nativeElement.play();
      this.isPlaying = true;
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
