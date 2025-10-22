import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTypographyModule } from '@angular/material/typography';
import { MatCardModule } from '@angular/material/card';

interface WordChoice {
  id: string;
  text: string;
}

interface PromptSegment {
  type: 'text' | 'blank';
  content: string;
}

export interface MultiDragDropFillInBlankContent {
  id: number;
  title: string;
  promptSegments: PromptSegment[];
  choices: WordChoice[];
  correctAnswers: Record<string, string>;
}

@Component({
  selector: 'app-multi-drag-drop-fill-in-blank',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTypographyModule,
    MatCardModule
  ],
  template: `
    <div class="multi-drag-drop-fill-in-blank">
      <div class="header">
        <h1>{{ content.title }}</h1>
        <button mat-button (click)="handleReset()">Reset</button>
      </div>
      
      <p class="instruction">
        சரியான சொற்களை இழுத்து இடைவெளிகளை நிரப்படுக (Drag the correct words to fill the blanks)
      </p>
      
      <!-- The Sentence/Prompt Area -->
      <div class="prompt-area">
        <div 
          *ngFor="let segment of content.promptSegments; let i = index"
          class="segment"
          [class.blank]="segment.type === 'blank'"
          [class.correct]="isComplete && isBlankCorrect(segment.content)"
          [class.incorrect]="showWrong && isBlankIncorrect(segment.content)"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event, segment.content)"
          *ngIf="segment.type === 'blank'">
          <span>{{ getDroppedText(segment.content) || '...........' }}</span>
        </div>
        <span 
          *ngFor="let segment of content.promptSegments; let i = index"
          *ngIf="segment.type === 'text'"
          class="text-segment">
          {{ segment.content }}
        </span>
      </div>
      
      <!-- Draggable Choices Pool -->
      <h3>Choices</h3>
      <div class="choices-pool">
        <div 
          *ngFor="let choice of availableChoices" 
          class="choice-item"
          [draggable]="true"
          (dragstart)="onDragStart($event, choice)">
          {{ choice.text }}
        </div>
      </div>
      
      <!-- Feedback -->
      <div class="feedback" *ngIf="showWrong">
        <div class="error-message">
          சில பதில்கள் தவறாக உள்ளன — தயவுசெய்து தவறான சொற்களை சரி செய்யவும்.
        </div>
        <button mat-raised-button color="accent" (click)="handleTryAgain()">
          மீண்டும் முயற்சி செய்
        </button>
      </div>
      
      <div class="success-message" *ngIf="isComplete">
        மிகச் சரி! நீங்கள் இறுதி செய்தீர்கள் — வாழ்த்துகள்!
      </div>
    </div>
  `,
  styles: [`
    .multi-drag-drop-fill-in-blank {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
    }

    .instruction {
      margin-bottom: 32px;
      color: #666;
    }

    .prompt-area {
      padding: 24px;
      margin-bottom: 24px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      min-height: 80px;
    }

    .text-segment {
      font-size: 1.5rem;
    }

    .segment.blank {
      min-width: 150px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border-radius: 8px;
      border: 2px dashed #ccc;
      background-color: transparent;
      transition: all 0.2s ease;
    }

    .segment.blank.correct {
      border-color: #4caf50;
      background-color: #e8f5e9;
    }

    .segment.blank.incorrect {
      border-color: #f44336;
      background-color: #ffebee;
    }

    .segment.blank span {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .choices-pool {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      min-height: 60px;
      margin-bottom: 16px;
    }

    .choice-item {
      padding: 10px 20px;
      cursor: grab;
      background-color: #f44336;
      color: white;
      border-radius: 4px;
      font-size: 1.1rem;
      transition: transform 0.2s ease;
    }

    .choice-item:hover {
      transform: scale(1.05);
    }

    .feedback {
      margin-top: 16px;
    }

    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .success-message {
      background-color: #e8f5e9;
      color: #2e7d32;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
      font-weight: bold;
    }
  `]
})
export class MultiDragDropFillInBlankComponent implements OnInit, OnChanges {
  @Input() content!: MultiDragDropFillInBlankContent;

  droppedItems: Record<string, WordChoice> = {};
  usedChoiceIds: string[] = [];
  isComplete = false;

  get availableChoices(): WordChoice[] {
    return this.content.choices.filter(choice => !this.usedChoiceIds.includes(choice.id));
  }

  get allFilled(): boolean {
    const blankIds = this.content.promptSegments
      .filter(s => s.type === 'blank')
      .map(s => s.content);
    return Object.keys(this.droppedItems).length === blankIds.length;
  }

  get showWrong(): boolean {
    return this.allFilled && !this.isComplete;
  }

  ngOnInit(): void {
    this.resetState();
  }

  ngOnChanges(): void {
    this.resetState();
  }

  private resetState(): void {
    this.droppedItems = {};
    this.usedChoiceIds = [];
    this.isComplete = false;
  }

  onDragStart(event: DragEvent, choice: WordChoice): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('choice', JSON.stringify(choice));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, blankId: string): void {
    event.preventDefault();
    const choiceJSON = event.dataTransfer?.getData('choice');
    if (!choiceJSON) return;
    
    const choice: WordChoice = JSON.parse(choiceJSON);

    // If this choice is already used in another blank, do nothing
    if (this.usedChoiceIds.includes(choice.id) && !this.droppedItems[blankId]) return;

    // If a word is already in this blank, return that word to the pool
    const oldItemInBlank = this.droppedItems[blankId];
    if (oldItemInBlank) {
      const index = this.usedChoiceIds.indexOf(oldItemInBlank.id);
      if (index > -1) {
        this.usedChoiceIds.splice(index, 1);
      }
    }

    this.droppedItems[blankId] = choice;
    if (!this.usedChoiceIds.includes(choice.id)) {
      this.usedChoiceIds.push(choice.id);
    }

    this.checkCompletion();
  }

  private checkCompletion(): void {
    const blankIds = this.content.promptSegments
      .filter(s => s.type === 'blank')
      .map(s => s.content);
    
    if (Object.keys(this.droppedItems).length !== blankIds.length) {
      this.isComplete = false;
      return;
    }

    let allCorrect = true;
    for (const blankId of blankIds) {
      if (this.droppedItems[blankId]?.text !== this.content.correctAnswers[blankId]) {
        allCorrect = false;
        break;
      }
    }
    this.isComplete = allCorrect;
  }

  isBlankCorrect(blankId: string): boolean {
    const placed = this.droppedItems[blankId];
    return placed && placed.text === this.content.correctAnswers[blankId];
  }

  isBlankIncorrect(blankId: string): boolean {
    const placed = this.droppedItems[blankId];
    return placed && placed.text !== this.content.correctAnswers[blankId];
  }

  getDroppedText(blankId: string): string | null {
    return this.droppedItems[blankId]?.text || null;
  }

  handleTryAgain(): void {
    const blankIds = this.content.promptSegments
      .filter(s => s.type === 'blank')
      .map(s => s.content);

    const newDropped = { ...this.droppedItems };
    const newUsed = [...this.usedChoiceIds];

    for (const blankId of blankIds) {
      const placed = newDropped[blankId];
      if (placed && placed.text !== this.content.correctAnswers[blankId]) {
        delete newDropped[blankId];
        const idx = newUsed.indexOf(placed.id);
        if (idx > -1) {
          newUsed.splice(idx, 1);
        }
      }
    }

    this.droppedItems = newDropped;
    this.usedChoiceIds = newUsed;
    this.isComplete = false;
  }

  handleReset(): void {
    this.resetState();
  }
}
