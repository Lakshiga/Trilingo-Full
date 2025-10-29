import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export interface WordFinderSingleChallenge {
  id: number;
  title: string;
  targetLetter: string;
  wordGrid: string[];
  correctWords: string[];
}

@Component({
  selector: 'app-word-finder',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './word-finder.component.html',
  styleUrls: ['./word-finder.component.css']
})
export class WordFinderComponent implements OnInit {
  @Input() content!: WordFinderSingleChallenge;

  foundWords: string[] = [];
  incorrectGuesses: string[] = [];

  get isComplete(): boolean {
    return this.foundWords.length === this.content.correctWords.length;
  }

  ngOnInit(): void {
    this.resetState();
  }

  private resetState(): void {
    this.foundWords = [];
    this.incorrectGuesses = [];
  }

  handleWordClick(word: string): void {
    if (this.foundWords.includes(word)) return;

    if (this.content.correctWords.includes(word)) {
      this.foundWords = [...this.foundWords, word];
    } else {
      this.incorrectGuesses = [...this.incorrectGuesses, word];
      setTimeout(() => {
        this.incorrectGuesses = this.incorrectGuesses.filter(w => w !== word);
      }, 500);
    }
  }

  handleReset(): void {
    this.resetState();
  }
}
