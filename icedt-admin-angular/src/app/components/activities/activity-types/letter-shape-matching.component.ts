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
  template: `
    <div class="letter-shape-matching">
      <h1>{{ content.title }}</h1>
      
      <div class="instruction-card">
        <h2>{{ content.activityTitle }}</h2>
        <p>{{ content.instruction }}</p>
      </div>
      
      <div class="matching-area" #container>
        <div class="left-column">
          <mat-card 
            *ngFor="let item of content.leftItems" 
            class="item-card"
            [class.matched]="isMatched(item.id, 'left')"
            [class.selected]="selectedLeft === item.id"
            (click)="onItemClick(item.id, 'left')"
            #itemRef>
            {{ item.content }}
          </mat-card>
        </div>
        
        <div class="right-column">
          <mat-card 
            *ngFor="let item of shuffledRightItems" 
            class="item-card"
            [class.matched]="isMatched(item.id, 'right')"
            (click)="onItemClick(item.id, 'right')"
            #itemRef>
            {{ item.content }}
          </mat-card>
        </div>
        
        <!-- SVG Overlay for Lines -->
        <svg class="lines-overlay">
          <line 
            *ngFor="let line of connectionLines"
            [attr.x1]="line.x1"
            [attr.y1]="line.y1"
            [attr.x2]="line.x2"
            [attr.y2]="line.y2"
            [attr.stroke]="line.color"
            stroke-width="4">
          </line>
        </svg>
      </div>
      
      <div class="completion-message" *ngIf="isComplete">
        <p>🎉 நன்று! நீங்கள் அனைத்தையும் சரியாக இணைத்துவிட்டீர்கள்! 🎉</p>
      </div>
    </div>
  `,
  styles: [`
    .letter-shape-matching {
      padding: 24px;
      font-family: sans-serif;
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      background: #AD1457;
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-weight: bold;
    }

    .instruction-card {
      background: #FCE4EC;
      padding: 16px;
      margin-bottom: 24px;
      border-radius: 8px;
    }

    .instruction-card h2 {
      font-weight: 600;
      color: #880E4F;
      margin-bottom: 8px;
    }

    .matching-area {
      position: relative;
      display: flex;
      justify-content: space-between;
      gap: 32px;
    }

    .left-column, .right-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .item-card {
      padding: 16px;
      text-align: center;
      cursor: pointer;
      font-size: 1.5rem;
      border: 2px solid #bdbdbd;
      transition: all 0.3s ease;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-card:hover {
      transform: scale(1.02);
    }

    .item-card.selected {
      border: 3px solid #1976d2;
      background-color: #e3f2fd;
    }

    .item-card.matched {
      border: 3px solid #2e7d32;
      background-color: #e8f5e9;
    }

    .lines-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .completion-message {
      margin-top: 32px;
      text-align: center;
      color: #2e7d32;
      font-size: 1.5rem;
      font-weight: bold;
    }
  `]
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
