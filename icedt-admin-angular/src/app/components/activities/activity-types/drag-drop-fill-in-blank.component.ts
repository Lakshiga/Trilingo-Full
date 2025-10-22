import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DragDropFillInBlankContent, WordChoice } from '../../../types/activity-content.types';

@Component({
  selector: 'app-drag-drop-fill-in-blank',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="drag-drop-container">
      <h1 class="title">{{ content.title }}</h1>
      <p class="instruction">
        சரியான சொல்லை இழுத்து ખાલી இடத்தில் விடவும் (Drag the correct word into the blank space)
      </p>

      <!-- The Sentence/Prompt Area -->
      <mat-card class="sentence-card">
        <mat-card-content>
          <div class="sentence-content">
            <span class="sentence-part">{{ content.promptParts[0] }}</span>
            <div
              class="drop-zone"
              [class.active]="isDropZoneActive"
              [class.correct]="isCorrect === true"
              [class.incorrect]="isCorrect === false"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave()"
              (drop)="onDrop($event)"
            >
              <span class="drop-text">
                {{ droppedItem ? droppedItem.text : '...........' }}
              </span>
            </div>
            <span class="sentence-part">{{ content.promptParts[1] }}</span>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Draggable Choices -->
      <h3 class="choices-title">Choices</h3>
      <div class="choices-container">
        <div
          *ngFor="let choice of content.choices"
          class="choice-item"
          draggable="true"
          (dragstart)="onDragStart($event, choice)"
        >
          {{ choice.text }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drag-drop-container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
    }

    .title {
      margin-bottom: 16px;
      margin-top: 0;
    }

    .instruction {
      margin-bottom: 32px;
      color: #666;
    }

    .sentence-card {
      margin-bottom: 32px;
    }

    .sentence-content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      min-height: 80px;
    }

    .sentence-part {
      font-size: 1.5rem;
    }

    .drop-zone {
      min-width: 150px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border-radius: 8px;
      border: 2px dashed #ccc;
      transition: all 0.3s;
      background-color: white;
    }

    .drop-zone.active {
      background-color: #e3f2fd;
    }

    .drop-zone.correct {
      border-color: #4caf50;
      background-color: #e8f5e9;
    }

    .drop-zone.incorrect {
      border-color: #f44336;
      background-color: #ffebee;
    }

    .drop-text {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .choices-title {
      margin-bottom: 16px;
    }

    .choices-container {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .choice-item {
      padding: 10px 20px;
      background-color: #1976d2;
      color: white;
      border-radius: 4px;
      cursor: grab;
      font-size: 1.2rem;
      transition: transform 0.2s;
    }

    .choice-item:hover {
      transform: scale(1.05);
    }

    .choice-item:active {
      cursor: grabbing;
    }
  `]
})
export class DragDropFillInBlankComponent implements OnInit {
  @Input() content!: DragDropFillInBlankContent;

  droppedItem: WordChoice | null = null;
  isCorrect: boolean | null = null;
  isDropZoneActive = false;

  ngOnInit(): void {
    this.resetState();
  }

  private resetState(): void {
    this.droppedItem = null;
    this.isCorrect = null;
    this.isDropZoneActive = false;
  }

  onDragStart(event: DragEvent, choice: WordChoice): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('choice', JSON.stringify(choice));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDropZoneActive = true;
  }

  onDragLeave(): void {
    this.isDropZoneActive = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const choiceJSON = event.dataTransfer?.getData('choice');
    
    if (choiceJSON) {
      const choice: WordChoice = JSON.parse(choiceJSON);
      this.droppedItem = choice;
      this.isCorrect = choice.text === this.content.correctAnswer;
    }
    
    this.isDropZoneActive = false;
  }
}
