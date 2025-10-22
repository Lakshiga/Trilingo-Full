import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

export interface Sentence {
  id: string;
  text: string;
  correctOrder: number;
}

export interface SentenceOrderingContent {
  activityTitle: string;
  instruction: string;
  imageUrl: string;
  sentences: Sentence[];
}

@Component({
  selector: 'app-sentence-ordering-activity',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatButtonModule],
  template: `
    <div class="sentence-ordering-container">
      <h2 class="title">{{ content.activityTitle }}</h2>

      <mat-card class="instruction-card">
        <mat-card-content>
          <h3 class="activity-title">{{ content.activityTitle }}</h3>
          <p class="instruction-text">{{ content.instruction }}</p>
        </mat-card-content>
      </mat-card>
      
      <!-- Image Display -->
      <div class="image-section">
        <img 
          [src]="content.imageUrl" 
          alt="Activity visual" 
          class="activity-image"
        />
      </div>

      <!-- Number Pool -->
      <div class="number-pool-section">
        <h3 class="pool-title">சரியான எண்ணை இழுத்துவிடவும்:</h3>
        <mat-card
          class="number-pool-card"
          (dragover)="handleDragOver($event)"
          (drop)="handleDrop($event, 'pool')"
        >
          <mat-card-content>
            <div class="number-chips">
              <mat-chip
                *ngFor="let num of unplacedNumbers"
                [draggable]="true"
                (dragstart)="handleDragStart($event, num)"
                class="number-chip"
              >
                {{ num }}
              </mat-chip>
            </div>
            <p *ngIf="unplacedNumbers.length === 0" class="empty-message">
              அனைத்து எண்களும் பயன்படுத்தப்பட்டுவிட்டன.
            </p>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- List of Sentences with Drop Slots -->
      <div class="sentences-section">
        <div
          *ngFor="let sentence of shuffledSentences"
          class="sentence-row"
        >
          <div
            class="drop-slot"
            [class.correct]="isSubmitted && results[sentence.id]"
            [class.incorrect]="isSubmitted && !results[sentence.id]"
            (dragover)="handleDragOver($event)"
            (drop)="handleDrop($event, sentence.id)"
          >
            <mat-chip
              *ngIf="placements[sentence.id]"
              [draggable]="true"
              (dragstart)="handleDragStart($event, placements[sentence.id]!)"
              class="placed-chip"
            >
              {{ placements[sentence.id] }}
            </mat-chip>
          </div>
          <p class="sentence-text">{{ sentence.text }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-section">
        <button
          *ngIf="!isSubmitted"
          mat-raised-button
          color="primary"
          (click)="handleSubmit()"
          [disabled]="!allPlaced"
          class="submit-button"
        >
          சமர்ப்பிக்கவும்
        </button>
        
        <div *ngIf="isSubmitted && !allCorrect" class="retry-section">
          <p class="error-message">வரிசை தவறானது. மீண்டும் முயலவும்!</p>
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
          🎉 நன்று! சரியான வரிசை! 🎉
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sentence-ordering-container {
      padding: 16px;
      font-family: sans-serif;
      max-width: 900px;
      margin: auto;
    }

    .title {
      text-align: center;
      margin-bottom: 16px;
      font-weight: bold;
      font-size: 1.5rem;
    }

    .instruction-card {
      margin-bottom: 24px;
      background-color: #e3f2fd;
    }

    .activity-title {
      font-weight: 600;
      color: #01579b;
      margin-bottom: 8px;
    }

    .instruction-text {
      margin-top: 8px;
    }

    .image-section {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 24px;
    }

    .activity-image {
      max-width: 100%;
      max-height: 300px;
      border-radius: 8px;
      border: 1px solid #ddd;
    }

    .number-pool-section {
      margin-bottom: 24px;
    }

    .pool-title {
      text-align: center;
      margin-bottom: 8px;
      font-weight: bold;
    }

    .number-pool-card {
      padding: 16px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      align-items: center;
      min-height: 60px;
      border: 2px dashed #ccc;
    }

    .number-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }

    .number-chip {
      cursor: grab;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .empty-message {
      color: #666;
      text-align: center;
    }

    .sentences-section {
      margin-bottom: 32px;
    }

    .sentence-row {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      gap: 16px;
    }

    .drop-slot {
      width: 50px;
      height: 50px;
      border: 2px dashed #90caf9;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      transition: all 0.3s;
    }

    .drop-slot.correct {
      border-color: #2e7d32;
      background-color: #e8f5e9;
    }

    .drop-slot.incorrect {
      border-color: #c62828;
      background-color: #ffebee;
    }

    .placed-chip {
      cursor: grab;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .sentence-text {
      flex: 1;
      margin: 0;
    }

    .action-section {
      margin-top: 32px;
      text-align: center;
    }

    .submit-button {
      font-size: 1.1rem;
      padding: 12px 24px;
    }

    .retry-section {
      margin-top: 16px;
    }

    .error-message {
      color: #f44336;
      font-size: 1.25rem;
      margin-bottom: 16px;
    }

    .retry-button {
      font-size: 1.1rem;
      padding: 12px 24px;
    }

    .success-message {
      color: #2e7d32;
      font-size: 1.5rem;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .sentence-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .drop-slot {
        align-self: center;
      }
    }
  `]
})
export class SentenceOrderingActivityComponent implements OnInit {
  @Input() content!: SentenceOrderingContent;

  shuffledSentences: Sentence[] = [];
  unplacedNumbers: number[] = [];
  placements: Record<string, number | null> = {};
  isSubmitted = false;
  results: Record<string, boolean> = {};

  ngOnInit() {
    this.resetState();
  }

  get allPlaced(): boolean {
    return this.unplacedNumbers.length === 0;
  }

  get allCorrect(): boolean {
    return this.isSubmitted && 
           Object.values(this.results).length === this.content.sentences.length && 
           Object.values(this.results).every(res => res);
  }

  private resetState() {
    this.shuffledSentences = [...this.content.sentences].sort(() => Math.random() - 0.5);
    this.unplacedNumbers = Array.from({ length: this.content.sentences.length }, (_, i) => i + 1);
    this.placements = {};
    this.content.sentences.forEach(s => { this.placements[s.id] = null; });
    this.isSubmitted = false;
    this.results = {};
  }

  handleDragStart(event: DragEvent, number: number) {
    if (event.dataTransfer) {
      event.dataTransfer.setData("number", number.toString());
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleDrop(event: DragEvent, targetSentenceId: string | 'pool') {
    event.preventDefault();
    const draggedNumber = parseInt(event.dataTransfer?.getData("number") || '0');
    if (isNaN(draggedNumber)) return;

    let sourceSentenceId: string | null = null;
    for (const id in this.placements) {
      if (this.placements[id] === draggedNumber) {
        sourceSentenceId = id;
        break;
      }
    }

    const newPlacements = { ...this.placements };
    const newUnplacedNumbers = [...this.unplacedNumbers];
    const numberInTargetSlot = targetSentenceId !== 'pool' ? newPlacements[targetSentenceId] : null;

    if (sourceSentenceId) {
      newPlacements[sourceSentenceId] = null;
    } else {
      const index = newUnplacedNumbers.indexOf(draggedNumber);
      if (index > -1) newUnplacedNumbers.splice(index, 1);
    }
    
    if (numberInTargetSlot) {
      if (sourceSentenceId) {
        newPlacements[sourceSentenceId] = numberInTargetSlot;
      } else {
        newUnplacedNumbers.push(numberInTargetSlot);
      }
    }
    
    if (targetSentenceId !== 'pool') {
      newPlacements[targetSentenceId] = draggedNumber;
    } else {
      newUnplacedNumbers.push(draggedNumber);
    }

    this.placements = newPlacements;
    this.unplacedNumbers = newUnplacedNumbers.sort((a, b) => a - b);
  }

  handleSubmit() {
    const newResults: Record<string, boolean> = {};
    this.content.sentences.forEach(sentence => {
      const placedNumber = this.placements[sentence.id];
      newResults[sentence.id] = placedNumber === sentence.correctOrder;
    });
    this.results = newResults;
    this.isSubmitted = true;
  }

  handleRetry() {
    this.resetState();
  }
}
