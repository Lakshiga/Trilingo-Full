import { Component, Input, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ConversationContent, ChatMessage } from '../../../../types/activity-content.types';
import { LanguageService } from '../../../../services/language.service';

@Component({
  selector: 'app-conversation-player',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './conversation-player.component.html',
  styleUrls: ['./conversation-player.component.css']
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

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.setupAudioListeners();
  }

  ngOnDestroy(): void {
    this.removeAudioListeners();
  }

  // --- Multilingual helpers ---
  text(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      // Prefer English; fallback to ta/si
      if ('en' in value) return String((value as any).en || '');
      if ('ta' in value || 'si' in value) return String((value as any).en || (value as any).ta || (value as any).si || '');
    }
    return String(value);
  }

  audio(value: any): string | undefined {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return this.languageService.getAudio(value as any);
    }
    return undefined;
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