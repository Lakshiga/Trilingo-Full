import { Component, Input, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ConversationContent, ChatMessage } from '../../../types/activity-content.types';

@Component({
  selector: 'app-conversation-player',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="container">
      <h1 class="title">{{ content.title }}</h1>

      <!-- Chat Messages Area -->
      <div class="messages-container">
        <div class="message" *ngFor="let message of content.messages; let i = index" 
             [class.sender]="i % 2 === 0" 
             [class.active]="i === activeMessageIndex">
          <div class="message-bubble" [class.sender-bubble]="i % 2 === 0">
            <span class="message-text">{{ message.text }}</span>
          </div>
        </div>
      </div>

      <!-- Audio Player Controls -->
      <div class="player-controls">
        <audio #audioPlayer [src]="content.audioUrl" style="display: none;"></audio>
        <div class="controls-grid">
          <button mat-icon-button (click)="togglePlayPause()" class="play-button">
            <mat-icon>{{ isPlaying ? 'pause' : 'play_arrow' }}</mat-icon>
          </button>
          
          <div class="slider-container">
            <input
              type="range"
              [value]="currentTime"
              [min]="0"
              [max]="duration"
              [step]="1"
              (input)="onSliderChange($event)"
              class="time-slider"
            />
            <div class="time-display">
              <span class="current-time">{{ formatTime(currentTime) }}</span>
              <span class="total-time">{{ formatTime(duration) }}</span>
            </div>
          </div>
          
          <button mat-icon-button (click)="handleReplay()" class="replay-button">
            <mat-icon>replay</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 16px;
      font-family: sans-serif;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .title {
      text-align: center;
      margin-bottom: 16px;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .messages-container {
      flex-grow: 1;
      overflow-y: auto;
      padding: 16px;
      margin-bottom: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message {
      display: flex;
      justify-content: flex-start;
    }

    .message.sender {
      justify-content: flex-end;
    }

    .message-bubble {
      padding: 12px 16px;
      border-radius: 20px;
      max-width: 75%;
      background-color: #e0e0e0;
      color: black;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .message-bubble.sender-bubble {
      background-color: #1976d2;
      color: white;
      border-top-left-radius: 5px;
    }

    .message-bubble:not(.sender-bubble) {
      border-top-right-radius: 5px;
    }

    .message.active .message-bubble {
      transform: scale(1.03);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .message-text {
      font-size: 1rem;
    }

    .player-controls {
      padding: 12px;
      border-radius: 16px;
      background-color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .controls-grid {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 16px;
    }

    .play-button mat-icon {
      font-size: 40px;
    }

    .slider-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .time-slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #ddd;
      outline: none;
      -webkit-appearance: none;
    }

    .time-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #1976d2;
      cursor: pointer;
    }

    .time-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #1976d2;
      cursor: pointer;
      border: none;
    }

    .time-display {
      display: flex;
      justify-content: space-between;
      padding: 0 8px;
      font-size: 0.75rem;
      color: #666;
    }

    .replay-button mat-icon {
      font-size: 24px;
    }
  `]
})
export class ConversationPlayerComponent implements OnInit, OnDestroy {
  @Input() content!: ConversationContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  activeMessageIndex: number = -1;

  private audioTimeUpdateListener?: () => void;
  private audioLoadedMetadataListener?: () => void;
  private audioEndedListener?: () => void;

  ngOnInit(): void {
    this.setupAudioListeners();
  }

  ngOnDestroy(): void {
    this.removeAudioListeners();
  }

  private setupAudioListeners(): void {
    const audio = this.audioPlayer?.nativeElement;
    if (!audio) return;

    this.audioTimeUpdateListener = () => {
      this.currentTime = audio.currentTime;
      // Find the currently spoken message
      const currentMessageIndex = this.content.messages.findIndex((msg, index) => {
        const nextMsg = this.content.messages[index + 1];
        return audio.currentTime >= msg.timestamp && (!nextMsg || audio.currentTime < nextMsg.timestamp);
      });
      this.activeMessageIndex = currentMessageIndex;
    };

    this.audioLoadedMetadataListener = () => {
      this.duration = audio.duration;
    };

    this.audioEndedListener = () => {
      this.isPlaying = false;
    };

    audio.addEventListener('timeupdate', this.audioTimeUpdateListener);
    audio.addEventListener('loadedmetadata', this.audioLoadedMetadataListener);
    audio.addEventListener('ended', this.audioEndedListener);
  }

  private removeAudioListeners(): void {
    const audio = this.audioPlayer?.nativeElement;
    if (!audio) return;

    if (this.audioTimeUpdateListener) {
      audio.removeEventListener('timeupdate', this.audioTimeUpdateListener);
    }
    if (this.audioLoadedMetadataListener) {
      audio.removeEventListener('loadedmetadata', this.audioLoadedMetadataListener);
    }
    if (this.audioEndedListener) {
      audio.removeEventListener('ended', this.audioEndedListener);
    }
  }

  togglePlayPause(): void {
    const audio = this.audioPlayer?.nativeElement;
    if (!audio) return;

    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  onSliderChange(event: any): void {
    const audio = this.audioPlayer?.nativeElement;
    if (audio) {
      const value = parseFloat(event.target.value);
      audio.currentTime = value;
      this.currentTime = value;
    }
  }

  handleReplay(): void {
    const audio = this.audioPlayer?.nativeElement;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      this.isPlaying = true;
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}