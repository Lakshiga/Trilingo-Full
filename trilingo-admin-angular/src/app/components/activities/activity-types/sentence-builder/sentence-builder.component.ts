import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface SentencePart {
  text: string;
  audioUrl: string;
  imageUrl?: string;
}

export interface SentenceBuilderContent {
  id: number;
  title: string;
  imageWord: SentencePart;
  suffix: SentencePart;
  predicate: SentencePart;
  fullSentenceText: string;
  fullSentenceAudioUrl: string;
}

@Component({
  selector: 'app-sentence-builder',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './sentence-builder.component.html',
  styleUrls: ['./sentence-builder.component.css']
})
export class SentenceBuilderComponent implements OnInit, OnDestroy {
  @Input() content!: SentenceBuilderContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  clickedParts: string[] = [];
  isComplete = false;
  error = false;
  sequence = ['imageWord', 'suffix', 'predicate'];

  ngOnInit(): void {
    this.resetState();
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  private resetState(): void {
    this.clickedParts = [];
    this.isComplete = false;
    this.error = false;
  }

  private playAudio(audioUrl: string): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = audioUrl;
      this.audioElement.nativeElement.play().catch(e => 
        console.error("Audio playback error:", e)
      );
    }
  }

  handlePartClick(partKey: 'imageWord' | 'suffix' | 'predicate', partAudioUrl: string): void {
    if (this.isComplete) return;

    if (this.sequence[this.clickedParts.length] === partKey) {
      this.error = false;
      this.clickedParts = [...this.clickedParts, partKey];
      this.playAudio(partAudioUrl);

      if (this.clickedParts.length === this.sequence.length) {
        this.isComplete = true;
        setTimeout(() => {
          this.playAudio(this.content.fullSentenceAudioUrl);
        }, 1000);
      }
    } else {
      this.error = true;
      setTimeout(() => this.error = false, 1500);
    }
  }

  isClickable(partKey: string): boolean {
    return !this.isComplete && this.sequence[this.clickedParts.length] === partKey;
  }

  handleReset(): void {
    this.resetState();
  }
}
