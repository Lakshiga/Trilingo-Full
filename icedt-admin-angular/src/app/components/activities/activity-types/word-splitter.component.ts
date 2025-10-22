import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTypographyModule } from '@angular/material/typography';
import { MatCardModule } from '@angular/material/card';

interface WordPartChoice {
  id: string;
  text: string;
}

export interface WordSplitterContent {
  id: number;
  title: string;
  compoundWord: string;
  choices: WordPartChoice[];
  correctAnswers: [string, string];
}

@Component({
  selector: 'app-word-splitter',
  standalone: true,
  imports: [
    CommonModule,
    MatTypographyModule,
    MatCardModule
  ],
  template: `
    <div class="word-splitter">
      <h1>{{ content.title }}</h1>
      
      <!-- Draggable Choices Pool -->
      <div class="choices-pool">
        <div 
          *ngFor="let choice of availableChoices" 
          class="choice-item"
          [draggable]="true"
          (dragstart)="onDragStart($event, choice)">
          {{ choice.text }}
        </div>
      </div>
      
      <!-- The Equation Area -->
      <div class="equation-area">
        <div class="compound-word">
          {{ content.compoundWord }}
        </div>
        <span class="equals">=</span>
        <div 
          class="drop-zone"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event, 'part1')"
          [class.correct]="validation['part1'] === true"
          [class.incorrect]="validation['part1'] === false">
          <span *ngIf="droppedParts['part1']">{{ droppedParts['part1']!.text }}</span>
        </div>
        <span class="plus">+</span>
        <div 
          class="drop-zone"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event, 'part2')"
          [class.correct]="validation['part2'] === true"
          [class.incorrect]="validation['part2'] === false">
          <span *ngIf="droppedParts['part2']">{{ droppedParts['part2']!.text }}</span>
        </div>
      </div>
      
      <div class="success-message" *ngIf="isComplete">
        <p>மிகவும் சரி! (Correct!)</p>
      </div>
    </div>
  `,
  styles: [`
    .word-splitter {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
    }

    h1 {
      margin-bottom: 24px;
      font-size: 2rem;
    }

    .choices-pool {
      padding: 16px;
      margin-bottom: 32px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      align-items: center;
    }

    .choice-item {
      padding: 8px 16px;
      cursor: grab;
      background-color: #f44336;
      color: white;
      border-radius: 4px;
      user-select: none;
      font-size: 1.1rem;
      transition: transform 0.2s ease;
    }

    .choice-item:hover {
      transform: scale(1.05);
    }

    .equation-area {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }

    .compound-word {
      padding: 12px 24px;
      background-color: #1976d2;
      color: white;
      border-radius: 4px;
      font-size: 1.5rem;
    }

    .equals, .plus {
      font-size: 2rem;
      font-weight: bold;
    }

    .drop-zone {
      min-width: 150px;
      min-height: 60px;
      padding: 8px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .drop-zone.correct {
      border-color: #4caf50;
      background-color: #e8f5e9;
    }

    .drop-zone.incorrect {
      border-color: #f44336;
      background-color: #ffebee;
    }

    .drop-zone span {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .success-message {
      padding: 16px;
      background-color: #e8f5e9;
      border: 1px solid #4caf50;
      border-radius: 8px;
      color: #2e7d32;
    }

    .success-message p {
      margin: 0;
      font-size: 1.2rem;
      font-weight: bold;
    }
  `]
})
export class WordSplitterComponent implements OnInit, OnChanges {
  @Input() content!: WordSplitterContent;

  droppedParts: Record<string, WordPartChoice | null> = { part1: null, part2: null };
  validation: Record<string, boolean | null> = { part1: null, part2: null };

  get availableChoices(): WordPartChoice[] {
    const usedIds = Object.values(this.droppedParts)
      .map(part => part?.id)
      .filter(Boolean);
    return this.content.choices.filter(choice => !usedIds.includes(choice.id));
  }

  get isComplete(): boolean {
    return this.validation['part1'] === true && this.validation['part2'] === true;
  }

  ngOnInit(): void {
    this.resetState();
  }

  ngOnChanges(): void {
    this.resetState();
  }

  private resetState(): void {
    this.droppedParts = { part1: null, part2: null };
    this.validation = { part1: null, part2: null };
  }

  onDragStart(event: DragEvent, choice: WordPartChoice): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('choice', JSON.stringify(choice));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, partKey: 'part1' | 'part2'): void {
    event.preventDefault();
    const choiceJSON = event.dataTransfer?.getData('choice');
    if (!choiceJSON) return;
    
    const choice: WordPartChoice = JSON.parse(choiceJSON);
    const correctPartIndex = partKey === 'part1' ? 0 : 1;
    const isCorrect = choice.text === this.content.correctAnswers[correctPartIndex];

    if (isCorrect) {
      this.droppedParts[partKey] = choice;
      this.validation[partKey] = true;
    } else {
      // Show temporary error
      this.validation[partKey] = false;
      setTimeout(() => {
        this.validation[partKey] = null;
      }, 1000);
    }
  }
}
