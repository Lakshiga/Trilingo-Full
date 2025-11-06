import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface PronunciationPracticeContent {
  id: number;
  title: string;
  text: string;
  audioUrl: string;
}

@Component({
  selector: 'app-pronunciation-practice',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './pronunciation-practice.component.html',
  styleUrls: ['./pronunciation-practice.component.css']
})
export class PronunciationPracticeComponent implements OnInit, OnDestroy {
  @Input() content!: PronunciationPracticeContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  isPlaying = false;

  ngOnInit() {
    // Component initialization
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  handlePlayCurrent() {
    if (!this.isPlaying && this.content?.audioUrl) {
      this.playAudio(this.content.audioUrl);
    }
  }

  private playAudio(audioUrl: string) {
    if (this.audioElement?.nativeElement) {
      this.audioElement.nativeElement.src = audioUrl;
      this.isPlaying = true;
      
      this.audioElement.nativeElement.play().catch(e => {
        console.error("Audio playback error:", e);
        this.isPlaying = false;
      });
      
      this.audioElement.nativeElement.onended = () => {
        this.isPlaying = false;
      };
    }
  }
}
