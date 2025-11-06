import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DragDropFillInBlankContent, WordChoice } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-drag-drop-fill-in-blank',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './drag-drop-fill-in-blank.component.html',
  styleUrls: ['./drag-drop-fill-in-blank.component.css']
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
