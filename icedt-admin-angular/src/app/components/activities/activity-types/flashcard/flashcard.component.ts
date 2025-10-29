import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlashcardContent } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css']
})
export class FlashcardComponent implements OnInit {
  @Input() content!: FlashcardContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  ngOnInit(): void {
    // Add a small delay to allow the card to render before playing
    setTimeout(() => {
      this.playAudio();
    }, 300);
  }

  getImageUrl(imageUrl: string): string {
    // Assuming you have a media base URL configured
    const mediaBaseUrl = ''; // You can inject this from a service or environment
    return `${mediaBaseUrl}${imageUrl}`;
  }

  playAudio(): void {
    if (this.content?.audioUrl && this.audioPlayer) {
      const mediaBaseUrl = ''; // You can inject this from a service or environment
      this.audioPlayer.nativeElement.src = `${mediaBaseUrl}${this.content.audioUrl}`;
      this.audioPlayer.nativeElement.play().catch(e => console.error("Audio playback failed:", e));
    }
  }
}