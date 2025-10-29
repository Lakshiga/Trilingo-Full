import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface MediaSpotlightItem {
  text: string;
  imageUrl: string;
  audioUrl?: string;
}

export interface MediaSpotlightMultipleContent {
  title: string;
  spotlightLetter: string;
  items: MediaSpotlightItem[];
}

@Component({
  selector: 'app-media-spotlight-multiple',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './media-spotlight-multiple.component.html',
  styleUrls: ['./media-spotlight-multiple.component.css']
})
export class MediaSpotlightMultipleComponent {
  @Input() content!: MediaSpotlightMultipleContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  getImageUrl(imageUrl: string): string {
    // Assuming you have an environment variable or service for media URL
    return `${imageUrl}`;
  }

  getHighlightedWord(word: string): string {
    const letter = this.content.spotlightLetter;
    const regex = new RegExp(`(${letter})`, 'gi');
    return word.replace(regex, '<span class="highlight">$1</span>');
  }

  playAudio(audioUrl?: string): void {
    if (audioUrl && this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.src = audioUrl;
      this.audioPlayer.nativeElement.play().catch(e => 
        console.error("Audio playback failed:", e)
      );
    }
  }
}
