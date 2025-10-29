import { Component, Input, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LanguageService } from '../../../services/language.service';
import { MultilingualText, MultilingualAudio, LanguageCode } from '../../../types/multilingual.types';

export interface WordChoice {
  id: string;
  text: MultilingualText;
}

export interface SentenceItem {
  id: string;
  preBlankText: MultilingualText;
  postBlankText?: MultilingualText;
  audioUrl: MultilingualAudio;
  correctWordId: string;
}

export interface ListeningMatchingContent {
  title: MultilingualText;
  introduction: MultilingualText;
  sentences: SentenceItem[];
  words: WordChoice[];
}

@Component({
  selector: 'app-listening-matching-drag-and-drop',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './listen-and-match.component.html',
  styleUrls: ['./listen-and-match.component.css']
})
export class ListenAndMatchComponent implements OnInit, OnDestroy {
  @Input() content!: ListeningMatchingContent;
  @ViewChild('audioRef') audioRef!: ElementRef<HTMLAudioElement>;

  wordChoices: WordChoice[] = [];
  selectedWords: { [sentenceId: string]: WordChoice } = {};
  isActivityFinished = false;
  allCorrect = false;
  correctAnswers = 0;
  private draggedWord: WordChoice | null = null;
  currentLanguage: LanguageCode = 'en';

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.initializeWordChoices();
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  private initializeWordChoices() {
    this.wordChoices = [...this.content.words];
  }

  handleDragStart(event: DragEvent, word: WordChoice) {
    this.draggedWord = word;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', word.id);
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  handleDrop(event: DragEvent, targetId: string) {
    event.preventDefault();
    
    if (targetId === 'pool') {
      // Return word to pool
      if (this.draggedWord) {
        this.returnWordToPool(this.draggedWord);
      }
    } else {
      // Drop on sentence
      if (this.draggedWord) {
        this.assignWordToSentence(targetId, this.draggedWord);
      }
    }
    
    this.draggedWord = null;
  }

  private assignWordToSentence(sentenceId: string, word: WordChoice) {
    // Remove word from pool
    this.wordChoices = this.wordChoices.filter(w => w.id !== word.id);
    
    // If sentence already has a word, return it to pool
    const existingWord = this.selectedWords[sentenceId];
    if (existingWord) {
      this.wordChoices.push(existingWord);
    }
    
    // Assign new word
    this.selectedWords[sentenceId] = word;
  }

  private returnWordToPool(word: WordChoice) {
    // Remove from any sentence
    Object.keys(this.selectedWords).forEach((sentenceId: any) => {
      if (this.selectedWords[sentenceId]?.id === word.id) {
        delete this.selectedWords[sentenceId];
      }
    });
    
    // Add back to pool if not already there
    if (!this.wordChoices.find((w: any) => w.id === word.id)) {
      this.wordChoices.push(word);
    }
  }

  getSelectedWordForSentence(sentenceId: string): WordChoice | undefined {
    return this.selectedWords[sentenceId];
  }

  isCorrectAnswer(sentenceId: string): boolean {
    const selectedWord = this.selectedWords[sentenceId];
    const sentence = this.content.sentences.find((s: any) => s.id === sentenceId);
    return !!(selectedWord && sentence && selectedWord.id === sentence.correctWordId);
  }

  isIncorrectAnswer(sentenceId: string): boolean {
    const selectedWord = this.selectedWords[sentenceId];
    const sentence = this.content.sentences.find((s: any) => s.id === sentenceId);
    return !!(selectedWord && sentence && selectedWord.id !== sentence.correctWordId);
  }

  canSubmit(): boolean {
    return Object.keys(this.selectedWords).length === this.content.sentences.length;
  }

  submitAnswers() {
    this.correctAnswers = 0;
    
    this.content.sentences.forEach((sentence: any) => {
      const selectedWord = this.selectedWords[sentence.id];
      if (selectedWord && selectedWord.id === sentence.correctWordId) {
        this.correctAnswers++;
      }
    });
    
    this.allCorrect = this.correctAnswers === this.content.sentences.length;
    this.isActivityFinished = true;
  }

  getText(text: MultilingualText): string {
    return this.languageService.getText(text, this.currentLanguage);
  }

  playAudio(audioUrl: MultilingualAudio) {
    if (this.audioRef) {
      const audioSrc = this.languageService.getAudio(audioUrl, this.currentLanguage);
      if (audioSrc) {
        this.audioRef.nativeElement.src = audioSrc;
        this.audioRef.nativeElement.play().catch(e => 
          console.error("Audio playback failed:", e)
        );
      }
    }
  }

  resetActivity() {
    this.selectedWords = {};
    this.wordChoices = [...this.content.words];
    this.isActivityFinished = false;
    this.allCorrect = false;
    this.correctAnswers = 0;
    this.draggedWord = null;
  }
}
