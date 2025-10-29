import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { WordBankCompletionContent } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-word-bank-completion',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatChipsModule],
  templateUrl: './word-bank-completion.component.html',
  styleUrls: ['./word-bank-completion.component.css']
})
export class WordBankCompletionComponent implements OnInit {
  @Input() content!: WordBankCompletionContent;

  answers: Record<number, string> = {};
  shuffledWordBank: string[] = [];
  isComplete: boolean = false;
  selectedWord: string | null = null;

  ngOnInit(): void {
    this.resetActivity();
  }

  get isAllCorrect(): boolean {
    return this.content.sentences.every((s: any) => this.answers[s.id] === s.correctAnswer);
  }

  private shuffleArray(array: string[]): string[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  isWordUsed(word: string): boolean {
    return Object.values(this.answers).includes(word);
  }

  handleWordBankClick(word: string): void {
    if (this.isWordUsed(word) || this.isComplete) return;
    this.selectedWord = word;
  }

  handleBlankClick(sentenceId: number): void {
    if (this.selectedWord && !this.isComplete) {
      this.answers = { ...this.answers, [sentenceId]: this.selectedWord };
      this.selectedWord = null;
    }
  }

  handleCheckAnswers(): void {
    this.isComplete = true;
  }

  resetActivity(): void {
    this.answers = {};
    this.shuffledWordBank = this.shuffleArray(this.content.wordBank);
    this.isComplete = false;
    this.selectedWord = null;
  }
}
