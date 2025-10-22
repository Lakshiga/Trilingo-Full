import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { DragDropContent, Word, Category } from '../../../types/activity-content.types';

@Component({
  selector: 'app-drag-and-drop-activity',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatChipsModule, MatGridListModule],
  template: `
    <div class="container" *ngIf="content; else loadingContent">
      <h1 class="title">{{ content.title }}</h1>

      <div class="instruction-panel">
        <h2 class="activity-title">{{ content.activityTitle }}</h2>
        <p class="instruction">{{ content.instruction }}</p>
      </div>

      <h3 class="words-title">இழுக்க வேண்டிய சொற்கள்</h3>
      <div 
        class="word-pool"
        (dragover)="onDragOver($event)"
        (drop)="onDropToPool($event)"
      >
        <mat-chip
          *ngFor="let word of wordPool"
          [draggable]="!allCorrect"
          (dragstart)="onDragStart($event, word)"
          class="word-chip"
          [class.disabled]="allCorrect"
        >
          {{ word.text }}
        </mat-chip>
        <p *ngIf="wordPool.length === 0" class="empty-message">
          அனைத்து சொற்களும் நகர்த்தப்பட்டுவிட்டன.
        </p>
      </div>

      <div class="categories-grid">
        <div
          *ngFor="let category of content.categories"
          class="category-card"
          (dragover)="onDragOver($event)"
          (drop)="onDropToCategory($event, category.id)"
        >
          <h3 class="category-title">{{ category.title }}</h3>
          <div class="category-words">
            <mat-chip
              *ngFor="let word of droppedWords[category.id]"
              [draggable]="!allCorrect"
              (dragstart)="onDragStart($event, word)"
              class="word-chip"
              [class.correct]="isSubmitted && results[word.id] === true"
              [class.incorrect]="isSubmitted && results[word.id] === false"
              [class.disabled]="allCorrect"
            >
              {{ word.text }}
            </mat-chip>
          </div>
        </div>
      </div>

      <div class="actions">
        <button
          *ngIf="!isSubmitted"
          mat-raised-button
          color="primary"
          (click)="handleSubmit()"
          [disabled]="wordPool.length > 0"
          class="submit-button"
        >
          சமர்ப்பிக்கவும்
        </button>

        <div *ngIf="isSubmitted && !allCorrect" class="retry-section">
          <p class="error-message">சில பதில்கள் தவறானவை. மீண்டும் முயலவும்!</p>
          <button
            mat-raised-button
            color="accent"
            (click)="handleRetry()"
            class="retry-button"
          >
            மீண்டும் முயலவும்
          </button>
        </div>

        <div *ngIf="allCorrect" class="success-message">
          🎉 நன்று! எல்லா பதில்களும் சரியானவை! 🎉
        </div>
      </div>
    </div>

    <ng-template #loadingContent>
      <div class="loading-message">செயல்பாடு ஏற்றுகிறது...</div>
    </ng-template>
  `,
  styles: [`
    .container {
      padding: 24px;
      font-family: sans-serif;
      max-width: 900px;
      margin: 0 auto;
    }

    .title {
      background: #0288D1;
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-weight: bold;
      text-align: center;
      font-size: 1.5rem;
    }

    .instruction-panel {
      background: #e3f2fd;
      padding: 16px;
      margin-bottom: 24px;
      border-radius: 8px;
    }

    .activity-title {
      font-weight: 600;
      color: #01579b;
      margin-bottom: 8px;
      font-size: 1.25rem;
    }

    .instruction {
      margin: 0;
      font-size: 1rem;
    }

    .words-title {
      text-align: center;
      margin-bottom: 16px;
      font-size: 1.25rem;
    }

    .word-pool {
      padding: 16px;
      margin-bottom: 32px;
      min-height: 80px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      align-items: center;
      background-color: #fafafa;
      border: 2px dashed #ccc;
      border-radius: 8px;
    }

    .word-chip {
      font-size: 1rem;
      padding: 10px;
      cursor: grab;
    }

    .word-chip.disabled {
      cursor: default;
    }

    .word-chip.correct {
      background-color: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #2e7d32;
    }

    .word-chip.incorrect {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #c62828;
    }

    .empty-message {
      color: #666;
      margin: 0;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
      margin-bottom: 32px;
    }

    .category-card {
      width: 100%;
      min-height: 250px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      border: 3px dashed #90caf9;
      background-color: #f0f7ff;
    }

    .category-title {
      font-weight: bold;
      color: #0d47a1;
      margin-bottom: 16px;
      font-size: 1.25rem;
    }

    .category-words {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
    }

    .actions {
      text-align: center;
    }

    .submit-button, .retry-button {
      font-size: 1.1rem;
      padding: 12px 24px;
    }

    .retry-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .error-message {
      color: #f44336;
      font-size: 1.25rem;
      margin: 0;
    }

    .success-message {
      color: #2e7d32;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .loading-message {
      padding: 24px;
      text-align: center;
    }
  `]
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
           Object.values(this.results).every(res => res);
  }

  ngOnInit(): void {
    if (this.content) {
      this.initializeGame();
    }
  }

  private initializeGame(): void {
    this.wordPool = [...this.content.words];
    this.droppedWords = {};
    this.content.categories.forEach(cat => {
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
      const foundWord = this.droppedWords[catId].find(w => w.id === wordId);
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
    wordToMove = this.wordPool.find(w => w.id === wordId);
    
    if (!wordToMove) {
      // Check if word is in another category
      for (const catId in this.droppedWords) {
        const foundWord = this.droppedWords[catId].find(w => w.id === wordId);
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
      words.forEach(word => {
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