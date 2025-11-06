import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { DragDropContent, Word, Category } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-drag-and-drop-activity',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatChipsModule, MatGridListModule],
  templateUrl: './drag-and-drop-activity.component.html',
  styleUrls: ['./drag-and-drop-activity.component.css']
})
export class DragAndDropActivityComponent implements OnInit {
  @Input() content!: DragDropContent;

  wordPool: Word[] = [];
  droppedWords: Record<string, Word[]> = {};
  isSubmitted: boolean = false;
  results: Record<string, boolean> = {};

  get allCorrect(): boolean {
    return this.isSubmitted && 
           Object.values(this.results).length === this.content.words.length && 
           Object.values(this.results).every((res: any) => res);
  }

  ngOnInit(): void {
    if (this.content) {
      this.initializeGame();
    }
  }

  private initializeGame(): void {
    this.wordPool = [...this.content.words];
    this.droppedWords = {};
    this.content.categories.forEach((cat: any) => {
      this.droppedWords[cat.id] = [];
    });
    this.isSubmitted = false;
    this.results = {};
  }

  onDragStart(event: DragEvent, word: Word): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('wordId', word.id);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDropToPool(event: DragEvent): void {
    event.preventDefault();
    const wordId = event.dataTransfer?.getData('wordId');
    if (!wordId) return;

    let wordToMove: Word | undefined;
    let sourceCategory: string | null = null;

    // Find the word in dropped words
    for (const catId in this.droppedWords) {
      const foundWord = this.droppedWords[catId].find((w: any) => w.id === wordId);
      if (foundWord) {
        wordToMove = foundWord;
        sourceCategory = catId;
        break;
      }
    }

    if (wordToMove && sourceCategory) {
      // Remove from category
      this.droppedWords[sourceCategory] = this.droppedWords[sourceCategory].filter(w => w.id !== wordId);
      // Add back to pool
      this.wordPool.push(wordToMove);
    }
  }

  onDropToCategory(event: DragEvent, categoryId: string): void {
    event.preventDefault();
    const wordId = event.dataTransfer?.getData('wordId');
    if (!wordId) return;

    let wordToMove: Word | undefined;
    let sourceCategory: string | null = null;

    // Check if word is in pool
    wordToMove = this.wordPool.find((w: any) => w.id === wordId);
    
    if (!wordToMove) {
      // Check if word is in another category
      for (const catId in this.droppedWords) {
        const foundWord = this.droppedWords[catId].find((w: any) => w.id === wordId);
        if (foundWord) {
          wordToMove = foundWord;
          sourceCategory = catId;
          break;
        }
      }
    }

    if (wordToMove) {
      if (sourceCategory) {
        // Remove from source category
        this.droppedWords[sourceCategory] = this.droppedWords[sourceCategory].filter(w => w.id !== wordId);
      } else {
        // Remove from pool
        this.wordPool = this.wordPool.filter(w => w.id !== wordId);
      }

      // Add to target category
      this.droppedWords[categoryId].push(wordToMove);
    }
  }

  handleSubmit(): void {
    const newResults: Record<string, boolean> = {};
    Object.entries(this.droppedWords).forEach(([categoryId, words]) => {
      words.forEach((word: any) => {
        newResults[word.id] = word.category === categoryId;
      });
    });
    this.results = newResults;
    this.isSubmitted = true;
  }

  handleRetry(): void {
    this.initializeGame();
  }
}