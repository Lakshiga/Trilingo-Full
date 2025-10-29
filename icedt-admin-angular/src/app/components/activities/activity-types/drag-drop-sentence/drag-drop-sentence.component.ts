import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

interface Word {
  id: string;
  text: string;
}

interface Sentence {
  id: string;
  text: string;
  correctWordId: string;
}

export interface FillInTheBlanksContent {
  title: string;
  activityTitle: string;
  instruction: string;
  words: Word[];
  sentences: Sentence[];
}

@Component({
  selector: 'app-drag-drop-sentence',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './drag-drop-sentence.component.html',
  styleUrls: ['./drag-drop-sentence.component.css']
})
export class DragDropSentenceComponent implements OnInit, OnChanges {
  @Input() content!: FillInTheBlanksContent;

  wordPool: Word[] = [];
  droppedWords: Record<string, Word | null> = {};
  isSubmitted = false;
  results: Record<string, boolean> = {};

  get allWordsPlaced(): boolean {
    return this.wordPool.length === 0;
  }

  get allCorrect(): boolean {
    return this.isSubmitted && 
           Object.values(this.results).length === this.content.sentences.length && 
           Object.values(this.results).every((res: any) => res);
  }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(): void {
    this.initializeData();
  }

  private initializeData(): void {
    if (this.content?.words && this.content?.sentences) {
      this.wordPool = [...this.content.words];
      this.droppedWords = {};
      this.content.sentences.forEach((sentence: any) => {
        this.droppedWords[sentence.id] = null;
      });
      this.isSubmitted = false;
      this.results = {};
    }
  }

  onDragStart(event: DragEvent, word: Word): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('wordId', word.id);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDropOnSentence(event: DragEvent, sentenceId: string): void {
    event.preventDefault();
    const wordId = event.dataTransfer?.getData('wordId');
    if (!wordId) return;

    const wordToMove = this.findWordById(wordId);
    if (wordToMove) {
      // Remove from word pool
      this.wordPool = this.wordPool.filter(w => w.id !== wordId);
      
      // Handle existing word in sentence
      const existingWord = this.droppedWords[sentenceId];
      if (existingWord) {
        this.wordPool.push(existingWord);
      }
      
      // Place new word
      this.droppedWords[sentenceId] = wordToMove;
    }
  }

  onDropOnPool(event: DragEvent): void {
    event.preventDefault();
    const wordId = event.dataTransfer?.getData('wordId');
    if (!wordId) return;

    const wordToMove = this.findWordInSentences(wordId);
    if (wordToMove) {
      // Remove from sentence
      Object.keys(this.droppedWords).forEach((sentenceId: any) => {
        if (this.droppedWords[sentenceId]?.id === wordId) {
          this.droppedWords[sentenceId] = null;
        }
      });
      
      // Add to word pool
      this.wordPool.push(wordToMove);
    }
  }

  private findWordById(wordId: string): Word | undefined {
    const allWords = [...this.wordPool, ...Object.values(this.droppedWords).filter((w): w is Word => w !== null)] as Word[];
    return allWords.find(w => w.id === wordId);
  }

  private findWordInSentences(wordId: string): Word | undefined {
    const droppedWords = Object.values(this.droppedWords).filter((w): w is Word => w !== null);
    return droppedWords.find(w => w.id === wordId);
  }

  submit(): void {
    const newResults: Record<string, boolean> = {};
    this.content.sentences.forEach((sentence: any) => {
      const droppedWord = this.droppedWords[sentence.id];
      newResults[sentence.id] = droppedWord?.id === sentence.correctWordId;
    });
    this.results = newResults;
    this.isSubmitted = true;
  }

  retry(): void {
    this.initializeData();
  }
}
