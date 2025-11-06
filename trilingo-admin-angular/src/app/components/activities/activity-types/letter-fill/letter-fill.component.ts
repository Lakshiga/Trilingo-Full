import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export interface LetterFillContent {
  title: string;
  activityTitle: string;
  instruction: string;
  sentences: string[];
  options: string[];
  solutions: string[];
}

@Component({
  selector: 'app-letter-fill',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './letter-fill.component.html',
  styleUrls: ['./letter-fill.component.css']
})
export class LetterFillComponent implements OnInit {
  @Input() content!: LetterFillContent;

  answers: { [key: number]: string } = {};
  activeSentenceIndex: number | null = 0;
  isSubmitted = false;
  results: { [key: number]: boolean } = {};

  get allCorrect(): boolean {
    return this.isSubmitted && Object.values(this.results).every((res: any) => res);
  }

  ngOnInit(): void {
    // Component initialization
  }

  getSentenceParts(sentence: string): string[] {
    return sentence.split('____');
  }

  isBlank(part: string): boolean {
    return part === '';
  }

  setActiveSentence(index: number): void {
    if (!this.allCorrect) {
      this.activeSentenceIndex = index;
    }
  }

  handleOptionSelect(option: string): void {
    if (this.activeSentenceIndex !== null && !this.allCorrect) {
      this.answers = { ...this.answers, [this.activeSentenceIndex]: option };
      
      // Find the next unanswered blank and make it active
      const nextUnanswered = this.content.sentences.findIndex((_, i) => !this.answers[i]);
      this.activeSentenceIndex = nextUnanswered !== -1 ? nextUnanswered : null;
    }
  }

  handleSubmit(): void {
    const newResults: { [key: number]: boolean } = {};
    this.content.sentences.forEach((_, i) => {
      const isCorrect = this.answers[i] === this.content.solutions[i];
      newResults[i] = isCorrect;
    });
    this.results = newResults;
    this.isSubmitted = true;
  }

  handleRetry(): void {
    this.answers = {};
    this.isSubmitted = false;
    this.results = {};
    this.activeSentenceIndex = 0;
  }

  getAnswersCount(): number {
    return Object.keys(this.answers).length;
  }
}
