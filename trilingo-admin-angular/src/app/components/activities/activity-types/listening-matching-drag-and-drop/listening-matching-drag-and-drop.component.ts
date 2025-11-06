import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LanguageService } from '../../../../services/language.service';

export interface WordChoice {
  id: string;
  text: string | any; // Can be a string or multilingual object
}

export interface SentenceItem {
  id: string;
  preBlankText: string | any; // Can be a string or multilingual object
  postBlankText?: string | any; // Can be a string or multilingual object
  audioUrl: string | any; // Can be a string or multilingual object
  correctWordId: string;
}

export interface ListeningMatchingContent {
  title: string | any; // Can be a string or multilingual object
  introduction: string | any; // Can be a string or multilingual object
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

  constructor(private languageService: LanguageService) {}

  // Helper methods to handle multilingual content
  private getText(value: string | any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && (value.ta || value.en || value.si)) {
      return this.languageService.getText(value);
    }
    return JSON.stringify(value);
  }

  private getAudio(value: string | any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && (value.ta || value.en || value.si)) {
      return this.languageService.getAudio(value) || '';
    }
    return value;
  }

  // Getters for processed content
  get processedTitle(): string {
    return this.getText(this.content.title);
  }

  get processedIntroduction(): string {
    return this.getText(this.content.introduction);
  }

  get processedSentences(): SentenceItem[] {
    return this.content.sentences.map(sentence => ({
      ...sentence,
      preBlankText: this.getText(sentence.preBlankText),
      postBlankText: sentence.postBlankText ? this.getText(sentence.postBlankText) : undefined,
      audioUrl: this.getAudio(sentence.audioUrl)
    }));
  }

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
    // Process words to handle multilingual text
    this.wordChoices = this.content.words.map(word => ({
      ...word,
      text: this.getText(word.text)
    }));
    this.droppedWords = {};
    this.isPlaying = false;
    this.isActivityFinished = false;
    this.feedback = null;
  }

  private startCurrentSentence() {
    if (this.currentSentenceIndex >= this.processedSentences.length) {
      this.isActivityFinished = true;
      return;
    }

    const currentSentence = this.processedSentences[this.currentSentenceIndex];
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
    const currentSentence = this.processedSentences[this.currentSentenceIndex];

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
