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
  templateUrl: './story-player.component.html',
  styleUrls: ['./story-player.component.css']
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
