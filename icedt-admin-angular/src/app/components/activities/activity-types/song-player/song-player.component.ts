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
  templateUrl: './song-player.component.html',
  styleUrls: ['./song-player.component.css']
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
