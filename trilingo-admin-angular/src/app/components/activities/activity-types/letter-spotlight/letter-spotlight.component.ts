import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export interface SpotlightWord {
  text: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface LetterSpotlightContent {
  spotlightLetter: string;
  words: SpotlightWord[];
}

@Component({
  selector: 'app-letter-spotlight',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './letter-spotlight.component.html',
  styleUrls: ['./letter-spotlight.component.css']
})
export class LetterSpotlightComponent {
  @Input() content!: LetterSpotlightContent;

  getHighlightedParts(word: string): string[] {
    return word.split(new RegExp(`(${this.content.spotlightLetter})`, 'gi'));
  }
}
