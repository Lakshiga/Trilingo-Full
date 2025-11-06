import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WordPairQuestion, WordPairMCQContent } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-word-pair-mcq',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './word-pair-mcq.component.html',
  styleUrls: ['./word-pair-mcq.component.css']
})
export class WordPairMCQComponent implements OnInit, OnDestroy {
  @Input() content!: WordPairMCQContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  currentQuestionIndex = 0;
  userAnswer: string | null = null;
  showResult = false;
  isCorrect = false;

  get currentQuestion(): WordPairQuestion {
    return this.content.questions[this.currentQuestionIndex];
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.content.questions.length - 1;
  }

  ngOnInit(): void {
    this.resetState();
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  private resetState(): void {
    this.userAnswer = null;
    this.showResult = false;
    this.isCorrect = false;
  }

  playAudio(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.play().catch(e => console.error(e));
    }
  }

  handleAnswer(choice: string): void {
    if (this.userAnswer || this.showResult) return;
    
    this.userAnswer = choice;
    this.isCorrect = choice === this.currentQuestion.correctAnswer;
    this.showResult = true;
  }

  handleReset(): void {
    this.resetState();
  }

  handleNext(): void {
    if (this.isLastQuestion) {
      return;
    }
    this.currentQuestionIndex++;
    this.resetState();
  }
}
