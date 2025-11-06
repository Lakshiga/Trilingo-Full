import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export interface ComprehensionQuestion {
  id: number;
  text: string;
  audioUrl: string;
}

export interface ComprehensionAnswer {
  id: number;
  text: string;
  matchId: number;
}

export interface ReadingComprehensionContent {
  title: string;
  passage: string;
  passageAudioUrl: string;
  questions: ComprehensionQuestion[];
  answers: ComprehensionAnswer[];
}

@Component({
  selector: 'app-reading-comprehension-match',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './reading-comprehension-match.component.html',
  styleUrls: ['./reading-comprehension-match.component.css']
})
export class ReadingComprehensionMatchComponent implements OnInit, OnDestroy {
  @Input() content!: ReadingComprehensionContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  draggedItem: ComprehensionAnswer | null = null;
  matchedPairs: Record<number, number> = {};
  shuffledAnswers: ComprehensionAnswer[] = [];

  ngOnInit() {
    this.shuffleAnswers();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  get isComplete(): boolean {
    return Object.keys(this.matchedPairs).length === this.content.questions.length;
  }

  private shuffleAnswers() {
    this.shuffledAnswers = [...this.content.answers].sort(() => Math.random() - 0.5);
  }

  playAudio(audioUrl: string) {
    if (this.audioElement?.nativeElement) {
      this.audioElement.nativeElement.src = audioUrl;
      this.audioElement.nativeElement.play().catch(e => 
        console.error("Audio playback error:", e)
      );
    }
  }

  handleDragStart(event: DragEvent, answer: ComprehensionAnswer) {
    this.draggedItem = answer;
    if (event.dataTransfer) {
      event.dataTransfer.setData('answerId', answer.id.toString());
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleDrop(event: DragEvent, questionId: number) {
    event.preventDefault();
    if (!this.draggedItem || this.matchedPairs[questionId]) return;

    if (this.draggedItem.matchId === questionId) {
      this.matchedPairs = { ...this.matchedPairs, [questionId]: this.draggedItem.id };
    }
    this.draggedItem = null;
  }

  isAnswerMatched(answerId: number): boolean {
    return Object.values(this.matchedPairs).includes(answerId);
  }

  getMatchedAnswerText(questionId: number): string {
    const answerId = this.matchedPairs[questionId];
    const answer = this.content.answers.find((a: any) => a.id === answerId);
    return answer?.text || '';
  }
}
