import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

interface Sentence {
  id: string;
  scrambled: string[];
  solution: string;
}

export interface SentenceScrambleContent {
  title: string;
  activityTitle: string;
  instruction: string;
  sentences: Sentence[];
}

@Component({
  selector: 'app-sentence-scramble-exercise',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './sentence-scramble-exercise.component.html',
  styleUrls: ['./sentence-scramble-exercise.component.css']
})
export class SentenceScrambleExerciseComponent implements OnInit, OnChanges {
  @Input() content!: SentenceScrambleContent;

  currentSentenceIndex = 0;
  answerWords: string[] = [];
  wordBank: string[] = [];
  feedback: 'correct' | 'incorrect' | 'none' = 'none';
  submitted = false;

  get currentSentence(): Sentence {
    return this.content.sentences[this.currentSentenceIndex];
  }

  get isLastSentence(): boolean {
    return this.currentSentenceIndex === this.content.sentences.length - 1;
  }

  get allDone(): boolean {
    return this.submitted && this.feedback === 'correct' && this.isLastSentence;
  }

  ngOnInit(): void {
    this.setupCurrentSentence();
  }

  ngOnChanges(): void {
    this.setupCurrentSentence();
  }

  private setupCurrentSentence(): void {
    if (this.content?.sentences && this.content.sentences.length > 0) {
      this.answerWords = [];
      this.wordBank = [...this.content.sentences[this.currentSentenceIndex].scrambled]
        .sort(() => Math.random() - 0.5);
      this.feedback = 'none';
      this.submitted = false;
    }
  }

  handleWordBankClick(word: string, index: number): void {
    if (this.submitted) return;
    this.answerWords.push(word);
    this.wordBank.splice(index, 1);
  }

  handleAnswerClick(word: string, index: number): void {
    if (this.submitted) return;
    this.wordBank.push(word);
    this.answerWords.splice(index, 1);
  }

  handleCheck(): void {
    const userAnswer = this.answerWords.join(' ') + '.';
    if (userAnswer === this.currentSentence.solution) {
      this.feedback = 'correct';
    } else {
      this.feedback = 'incorrect';
    }
    this.submitted = true;
  }

  handleNext(): void {
    if (!this.isLastSentence) {
      this.currentSentenceIndex++;
      this.setupCurrentSentence();
    }
  }

  handleRetry(): void {
    this.setupCurrentSentence();
  }
}
