import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTypographyModule } from '@angular/material/typography';
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
    MatTypographyModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="drag-drop-sentence" *ngIf="content && content.words && content.sentences">
      <h1>{{ content.title }}</h1>
      
      <div class="instruction-card">
        <h2>{{ content.activityTitle }}</h2>
        <p>{{ content.instruction }}</p>
      </div>
      
      <div class="activity-area">
        <div class="sentences-section">
          <div class="sentence-list">
            <div 
              *ngFor="let sentence of content.sentences; let i = index" 
              class="sentence-item">
              <span class="sentence-number">{{ i + 1 }}.</span>
              <span class="sentence-text">{{ sentence.text }}</span>
              <div 
                class="drop-zone"
                (dragover)="onDragOver($event)"
                (drop)="onDropOnSentence($event, sentence.id)"
                [class.correct]="isSubmitted && results[sentence.id] === true"
                [class.incorrect]="isSubmitted && results[sentence.id] === false">
                <mat-chip 
                  *ngIf="droppedWords[sentence.id]"
                  [draggable]="!allCorrect"
                  (dragstart)="onDragStart($event, droppedWords[sentence.id]!)"
                  class="dropped-word">
                  {{ droppedWords[sentence.id]!.text }}
                </mat-chip>
              </div>
            </div>
          </div>
        </div>
        
        <div class="words-section">
          <h3>சொற்கள்</h3>
          <div 
            class="word-pool"
            (dragover)="onDragOver($event)"
            (drop)="onDropOnPool($event)">
            <mat-chip 
              *ngFor="let word of wordPool" 
              [draggable]="!allCorrect"
              (dragstart)="onDragStart($event, word)"
              class="word-chip">
              {{ word.text }}
            </mat-chip>
          </div>
        </div>
      </div>
      
      <div class="actions" *ngIf="!isSubmitted">
        <button 
          mat-raised-button 
          color="primary" 
          (click)="submit()"
          [disabled]="!allWordsPlaced">
          சமர்ப்பிக்கவும்
        </button>
      </div>
      
      <div class="results" *ngIf="isSubmitted && !allCorrect">
        <p class="error-message">சில பதில்கள் தவறானவை. மீண்டும் முயலவும்!</p>
        <button 
          mat-raised-button 
          color="accent" 
          (click)="retry()">
          மீண்டும் முயலவும்
        </button>
      </div>
      
      <div class="success" *ngIf="allCorrect">
        <p class="success-message">🎉 நன்று! எல்லா பதில்களும் சரியானவை! 🎉</p>
      </div>
    </div>
    
    <div *ngIf="!content || !content.words || !content.sentences" class="loading">
      செயல்பாடு ஏற்றுகிறது...
    </div>
  `,
  styles: [`
    .drag-drop-sentence {
      padding: 24px;
      font-family: sans-serif;
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      background: #0288D1;
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-weight: bold;
    }

    .instruction-card {
      background: #e3f2fd;
      padding: 16px;
      margin-bottom: 24px;
      border-radius: 8px;
    }

    .instruction-card h2 {
      font-weight: 600;
      color: #01579b;
      margin-bottom: 8px;
    }

    .activity-area {
      display: flex;
      gap: 32px;
    }

    .sentences-section {
      flex: 1;
    }

    .words-section {
      flex: 1;
    }

    .sentence-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sentence-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sentence-number {
      font-weight: bold;
      min-width: 20px;
    }

    .sentence-text {
      flex: 1;
    }

    .drop-zone {
      width: 150px;
      height: 40px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 16px;
    }

    .drop-zone.correct {
      border: 2px solid #2e7d32;
    }

    .drop-zone.incorrect {
      border: 2px solid #c62828;
    }

    .dropped-word {
      cursor: grab;
    }

    .word-pool {
      min-height: 200px;
      padding: 16px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background-color: #fafafa;
    }

    .word-chip {
      cursor: grab;
      font-size: 1rem;
      padding: 10px;
      width: 80%;
    }

    .actions, .results, .success {
      text-align: center;
      margin-top: 32px;
    }

    .error-message {
      color: #f44336;
      font-size: 1.25rem;
      margin-bottom: 16px;
    }

    .success-message {
      color: #2e7d32;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .loading {
      padding: 24px;
      text-align: center;
    }
  `]
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
           Object.values(this.results).every(res => res);
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
      this.content.sentences.forEach(sentence => {
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
      Object.keys(this.droppedWords).forEach(sentenceId => {
        if (this.droppedWords[sentenceId]?.id === wordId) {
          this.droppedWords[sentenceId] = null;
        }
      });
      
      // Add to word pool
      this.wordPool.push(wordToMove);
    }
  }

  private findWordById(wordId: string): Word | undefined {
    return [...this.wordPool, ...Object.values(this.droppedWords).filter(Boolean)]
      .find(w => w!.id === wordId);
  }

  private findWordInSentences(wordId: string): Word | undefined {
    return Object.values(this.droppedWords).find(w => w?.id === wordId);
  }

  submit(): void {
    const newResults: Record<string, boolean> = {};
    this.content.sentences.forEach(sentence => {
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
