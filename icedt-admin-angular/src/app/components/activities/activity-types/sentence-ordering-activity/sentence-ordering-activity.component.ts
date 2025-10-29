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
  templateUrl: './sentence-ordering-activity.component.html',
  styleUrls: ['./sentence-ordering-activity.component.css']
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
           Object.values(this.results).every((res: any) => res);
  }

  private resetState() {
    this.shuffledSentences = [...this.content.sentences].sort(() => Math.random() - 0.5);
    this.unplacedNumbers = Array.from({ length: this.content.sentences.length }, (_, i) => i + 1);
    this.placements = {};
    this.content.sentences.forEach((s: any) => { this.placements[s.id] = null; });
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
    this.content.sentences.forEach((sentence: any) => {
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
