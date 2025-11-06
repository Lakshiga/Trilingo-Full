import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
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
    MatCardModule
  ],
  templateUrl: './multi-drag-drop-fill-in-blank.component.html',
  styleUrls: ['./multi-drag-drop-fill-in-blank.component.css']
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
