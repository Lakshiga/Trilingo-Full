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
  templateUrl: './media-spotlight-single.component.html',
  styleUrls: ['./media-spotlight-single.component.css']
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
