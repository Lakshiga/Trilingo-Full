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
  template: `
    <div class="letter-spotlight-container">
      <!-- Top section: The big spotlight letter -->
      <mat-card class="spotlight-letter-card">
        <mat-card-content>
          <div class="letter-display">{{ content.spotlightLetter }}</div>
        </mat-card-content>
      </mat-card>

      <!-- Bottom section: The list of words -->
      <div class="words-section">
        <mat-card
          *ngFor="let word of content.words; let index = index"
          class="word-card"
        >
          <mat-card-content>
            <div class="highlighted-word">
              <span
                *ngFor="let part of getHighlightedParts(word.text); let i = index"
                [class.highlighted]="part.toLowerCase() === content.spotlightLetter.toLowerCase()"
                class="word-part"
              >
                {{ part }}
              </span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .letter-spotlight-container {
      padding: 16px;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .spotlight-letter-card {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 300px;
      height: 200px;
      background-color: #1976d2;
      color: white;
      border-radius: 16px;
    }

    .letter-display {
      font-size: 8rem;
      font-weight: bold;
    }

    .words-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
    }

    .word-card {
      border: 1px solid #e0e0e0;
    }

    .highlighted-word {
      text-align: center;
      font-size: 1.5rem;
    }

    .word-part {
      display: inline;
    }

    .word-part.highlighted {
      color: #f44336;
      font-weight: bold;
    }
  `]
})
export class LetterSpotlightComponent {
  @Input() content!: LetterSpotlightContent;

  getHighlightedParts(word: string): string[] {
    return word.split(new RegExp(`(${this.content.spotlightLetter})`, 'gi'));
  }
}
