import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

export interface StoryScene {
  imageUrl: string;
  text: string;
  timestamp: number;
}

export interface StoryContent {
  title: string;
  audioUrl: string;
  scenes: StoryScene[];
}

@Component({
  selector: 'app-story-player',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatSliderModule],
  template: `
    <div class="story-player-container">
      <h1 class="title">{{ content.title }}</h1>

      <!-- Image Display Area -->
      <div class="image-section">
        <mat-card class="scene-card">
          <img
            mat-card-image
            [src]="currentScene?.imageUrl"
            [alt]="getImageAlt()"
            class="scene-image"
          />
        </mat-card>
      </div>

      <!-- Text Display Area -->
      <mat-card class="text-card">
        <mat-card-content>
          <p class="scene-text">{{ currentScene?.text }}</p>
        </mat-card-content>
      </mat-card>

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
    </div>
  `,
  styles: [`
    .story-player-container {
      padding: 16px;
      margin: auto;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .title {
      text-align: center;
      margin-bottom: 16px;
    }

    .image-section {
      flex-grow: 1;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
    }

    .scene-card {
      width: 100%;
      border-radius: 12px;
    }

    .scene-image {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }

    .text-card {
      min-height: 100px;
      margin-bottom: 16px;
      border-radius: 8px;
    }

    .scene-text {
      text-align: center;
      font-size: 1.2rem;
      margin: 0;
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
export class StoryPlayerComponent implements OnInit, OnDestroy {
  @Input() content!: StoryContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  isPlaying = false;
  currentTime = 0;
  duration = 0;
  activeSceneIndex = 0;

  get currentScene(): StoryScene | undefined {
    return this.content.scenes[this.activeSceneIndex];
  }

  ngOnInit(): void {
    this.resetState();
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  private resetState(): void {
    this.activeSceneIndex = 0;
    this.currentTime = 0;
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.nativeElement.currentTime = 0;
    }
  }

  onLoadedMetadata(): void {
    this.duration = this.audioElement.nativeElement.duration;
  }

  onTimeUpdate(): void {
    this.currentTime = this.audioElement.nativeElement.currentTime;
    this.updateActiveScene();
  }

  onEnded(): void {
    this.isPlaying = false;
    this.activeSceneIndex = this.content.scenes.length - 1;
  }

  onSliderChange(newTime: number): void {
    this.audioElement.nativeElement.currentTime = newTime;
    this.currentTime = newTime;
  }

  private updateActiveScene(): void {
    const time = this.currentTime;
    const currentSceneIndex = this.content.scenes.findIndex((scene, index) => {
      const nextScene = this.content.scenes[index + 1];
      return time >= scene.timestamp && (!nextScene || time < nextScene.timestamp);
    });
    
    if (currentSceneIndex !== -1 && currentSceneIndex !== this.activeSceneIndex) {
      this.activeSceneIndex = currentSceneIndex;
    }
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
      this.activeSceneIndex = 0;
      this.audioElement.nativeElement.play();
      this.isPlaying = true;
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getImageAlt(): string {
    return this.currentScene ? `Scene for "${this.currentScene.text.substring(0, 20)}..."` : '';
  }
}
