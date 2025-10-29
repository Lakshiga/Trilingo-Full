import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export interface Word {
  id: string;
  scrambled: string[];
  solution: string;
}

export interface WordScrambleContent {
  title: string;
  activityTitle: string;
  instruction: string;
  words: Word[];
}

@Component({
  selector: 'app-word-scramble-exercise',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './word-scramble-exercise.component.html',
  styleUrls: ['./word-scramble-exercise.component.css']
})
export class WordScrambleExerciseComponent implements OnInit {
  @Input() content!: WordScrambleContent;

  answers: { [key: string]: string[] } = {};
  remainingLetters: { [key: string]: string[] } = {};
  feedbacks: { [key: string]: 'correct' | 'incorrect' | 'none' } = {};
  submitted = false;
  currentPage = 0;
  wordsPerPage = 5;

  get totalPages(): number {
    return Math.ceil(this.content.words.length / this.wordsPerPage);
  }

  get isLastPage(): boolean {
    return this.currentPage === this.totalPages - 1;
  }

  get currentWords(): Word[] {
    return this.content.words.slice(
      this.currentPage * this.wordsPerPage,
      (this.currentPage + 1) * this.wordsPerPage
    );
  }

  get allCorrectOnPage(): boolean {
    return this.submitted && this.currentWords.every((word: any) => this.feedbacks[word.id] === 'correct');
  }

  ngOnInit(): void {
    this.initializeState();
  }

  private initializeState(): void {
    const initialAnswers: { [key: string]: string[] } = {};
    const initialRemainingLetters: { [key: string]: string[] } = {};
    const initialFeedbacks: { [key: string]: 'correct' | 'incorrect' | 'none' } = {};

    this.content.words.forEach((word: any) => {
      initialAnswers[word.id] = [];
      initialRemainingLetters[word.id] = [...word.scrambled].sort(() => Math.random() - 0.5);
      initialFeedbacks[word.id] = 'none';
    });

    this.answers = initialAnswers;
    this.remainingLetters = initialRemainingLetters;
    this.feedbacks = initialFeedbacks;
    this.submitted = false;
    this.currentPage = 0;
  }

  handleLetterClick(wordId: string, letter: string, index: number): void {
    this.answers = {
      ...this.answers,
      [wordId]: [...this.answers[wordId], letter]
    };
    this.remainingLetters = {
      ...this.remainingLetters,
      [wordId]: this.remainingLetters[wordId].filter((_, i) => i !== index)
    };
  }
  
  handleAnswerLetterClick(wordId: string, letter: string, index: number): void {
    if (this.submitted) return;
    this.remainingLetters = {
      ...this.remainingLetters,
      [wordId]: [...this.remainingLetters[wordId], letter]
    };
    this.answers = {
      ...this.answers,
      [wordId]: this.answers[wordId].filter((_, i) => i !== index)
    };
  }

  checkCurrentPageAnswers(): void {
    const newFeedbacks: { [key: string]: 'correct' | 'incorrect' } = {};
    this.currentWords.forEach((word: any) => {
      const userAnswer = this.answers[word.id]?.join('') || '';
      newFeedbacks[word.id] = userAnswer === word.solution ? 'correct' : 'incorrect';
    });
    this.feedbacks = {...this.feedbacks, ...newFeedbacks};
    this.submitted = true;
  }

  handleNextPage(): void {
    if (!this.isLastPage) {
      this.currentPage++;
      this.submitted = false;
    }
  }

  resetCurrentPage(): void {
    const wordIdsOnPage = this.currentWords.map(w => w.id);
    this.answers = {
      ...this.answers,
      ...wordIdsOnPage.reduce((acc, id) => ({ ...acc, [id]: [] }), {})
    };
    this.remainingLetters = {
      ...this.remainingLetters,
      ...this.currentWords.reduce((acc, word) => ({
        ...acc,
        [word.id]: [...word.scrambled].sort(() => Math.random() - 0.5)
      }), {})
    };
    this.submitted = false;
  }
}
