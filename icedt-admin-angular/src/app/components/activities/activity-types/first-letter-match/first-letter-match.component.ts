import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FirstLetterMatchContent } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-first-letter-match',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './first-letter-match.component.html',
  styleUrls: ['./first-letter-match.component.css']
})
export class FirstLetterMatchComponent implements OnInit {
  @Input() content!: FirstLetterMatchContent;

  wordsToFind: string[] = [];
  currentTarget: string | null = null;
  feedback: 'correct' | 'incorrect' | null = null;

  get firstLetter(): string {
    return this.currentTarget ? this.currentTarget.charAt(0) : '';
  }

  get isComplete(): boolean {
    return this.wordsToFind.length === 0 && !this.currentTarget;
  }

  ngOnInit(): void {
    this.setupGame();
  }

  setupGame(): void {
    this.wordsToFind = this.shuffleArray([...this.content.words]);
    this.currentTarget = null;
    this.feedback = null;
    this.setNextTarget();
  }

  private setNextTarget(): void {
    if (this.wordsToFind.length > 0 && !this.currentTarget) {
      this.currentTarget = this.wordsToFind[0];
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  handleWordClick(word: string): void {
    if (this.feedback) return;

    if (word === this.currentTarget) {
      this.feedback = 'correct';
      setTimeout(() => {
        const remainingWords = this.wordsToFind.slice(1);
        this.wordsToFind = remainingWords;
        this.currentTarget = remainingWords[0] || null;
        this.feedback = null;
      }, 1000);
    } else {
      this.feedback = 'incorrect';
      setTimeout(() => {
        this.feedback = null;
      }, 1000);
    }
  }
}
