import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface WordChoice {
  id: string;
  text: string;
}

export interface SentenceItem {
  id: string;
  preBlankText: string;
  postBlankText?: string;
  audioUrl: string;
  correctWordId: string;
}

export interface ListeningMatchingContent {
  title: string;
  introduction: string;
  sentences: SentenceItem[];
  words: WordChoice[];
}

@Component({
  selector: 'app-listening-matching-drag-and-drop',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './listening-matching-drag-and-drop.component.html',
  styleUrls: ['./listening-matching-drag-and-drop.component.css']
})
export class ListeningMatchingDragAndDropComponent implements OnInit, OnDestroy {
  @Input() content!: ListeningMatchingContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  currentSentenceIndex = 0;
  wordChoices: WordChoice[] = [];
  droppedWords: Record<string, WordChoice | null> = {};
  isPlaying = false;
  isActivityFinished = false;
  feedback: 'correct' | 'incorrect' | null = null;

  private audioTimeout?: number;

  ngOnInit() {
    this.resetState();
    this.startCurrentSentence();
  }

  ngOnDestroy() {
    if (this.audioTimeout) {
      clearTimeout(this.audioTimeout);
    }
  }

  private resetState() {
    this.currentSentenceIndex = 0;
    this.wordChoices = [...this.content.words];
    this.droppedWords = {};
    this.isPlaying = false;
    this.isActivityFinished = false;
    this.feedback = null;
  }

  private startCurrentSentence() {
    if (this.currentSentenceIndex >= this.content.sentences.length) {
      this.isActivityFinished = true;
      return;
    }

    const currentSentence = this.content.sentences[this.currentSentenceIndex];
    this.audioTimeout = window.setTimeout(() => {
      this.playAudio(currentSentence.audioUrl);
    }, 500);
  }

  private playAudio(audioUrl: string) {
    if (this.audioElement?.nativeElement) {
      this.isPlaying = true;
      this.audioElement.nativeElement.src = audioUrl;
      
      const handleEnded = () => {
        this.isPlaying = false;
        this.audioElement.nativeElement.removeEventListener('ended', handleEnded);
      };
      
      this.audioElement.nativeElement.addEventListener('ended', handleEnded);
      this.audioElement.nativeElement.play().catch(e => {
        console.error("Audio playback failed:", e);
        this.isPlaying = false;
      });
    }
  }

  handleDragStart(event: DragEvent, word: WordChoice) {
    if (event.dataTransfer) {
      event.dataTransfer.setData("wordId", word.id);
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleDrop(event: DragEvent, sentenceId: string) {
    event.preventDefault();
    const currentSentence = this.content.sentences[this.currentSentenceIndex];

    // Only allow dropping on the CURRENT active sentence
    if (sentenceId !== currentSentence.id || this.isPlaying) {
      return;
    }

    const wordId = event.dataTransfer?.getData("wordId");
    const droppedWord = this.wordChoices.find((w: any) => w.id === wordId);

    if (droppedWord) {
      if (droppedWord.id === currentSentence.correctWordId) {
        // Correct Answer
        this.feedback = 'correct';
        this.droppedWords = { ...this.droppedWords, [sentenceId]: droppedWord };
        this.wordChoices = this.wordChoices.filter(w => w.id !== wordId);

        // After showing feedback, move to the next sentence
        setTimeout(() => {
          this.feedback = null;
          this.currentSentenceIndex++;
          this.startCurrentSentence();
        }, 1200);
      } else {
        // Incorrect Answer
        this.feedback = 'incorrect';
        setTimeout(() => this.feedback = null, 1000);
      }
    }
  }
}
