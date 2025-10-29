import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
// MatTypographyModule is not available in Angular Material v19
import { MatCardModule } from '@angular/material/card';

interface Item {
  id: string;
  content: string;
}

export interface LetterShapeContent {
  title: string;
  activityTitle: string;
  instruction: string;
  leftItems: Item[];
  rightItems: Item[];
  solutions: Record<string, string>; // Maps left item ID to right item ID
}

@Component({
  selector: 'app-letter-shape-matching',
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './letter-shape-matching.component.html',
  styleUrls: ['./letter-shape-matching.component.css']
})
export class LetterShapeMatchingComponent {
  @Input() content!: LetterShapeContent;
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  selectedLeft: string | null = null;
  matchedPairs: Record<string, string> = {};
  incorrectPair: { left: string, right: string } | null = null;

  get shuffledRightItems(): Item[] {
    return [...this.content.rightItems].sort(() => Math.random() - 0.5);
  }

  get isComplete(): boolean {
    return Object.keys(this.matchedPairs).length === this.content.leftItems.length;
  }

  get connectionLines(): Array<{ x1: number, y1: number, x2: number, y2: number, color: string }> {
    const lines: Array<{ x1: number, y1: number, x2: number, y2: number, color: string }> = [];
    
    // This is a simplified version - in a real implementation, you'd need to
    // calculate actual positions based on DOM elements
    // For now, we'll just return empty array
    return lines;
  }

  onItemClick(id: string, side: 'left' | 'right'): void {
    if (this.isComplete) return;

    if (side === 'left') {
      if (Object.keys(this.matchedPairs).includes(id)) return;
      this.selectedLeft = id;
      this.incorrectPair = null;
    }

    if (side === 'right' && this.selectedLeft) {
      if (Object.values(this.matchedPairs).includes(id)) return;

      if (this.content.solutions[this.selectedLeft] === id) {
        // Correct Match
        this.matchedPairs[this.selectedLeft] = id;
        this.selectedLeft = null;
        this.incorrectPair = null;
      } else {
        // Incorrect Match
        this.incorrectPair = { left: this.selectedLeft, right: id };
        this.selectedLeft = null;
        setTimeout(() => this.incorrectPair = null, 600);
      }
    }
  }

  isMatched(id: string, side: 'left' | 'right'): boolean {
    if (side === 'left') {
      return !!this.matchedPairs[id];
    } else {
      return Object.values(this.matchedPairs).includes(id);
    }
  }
}
