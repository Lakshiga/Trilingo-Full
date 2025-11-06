import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    MatCardModule
  ],
  templateUrl: './word-splitter.component.html',
  styleUrls: ['./word-splitter.component.css']
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
