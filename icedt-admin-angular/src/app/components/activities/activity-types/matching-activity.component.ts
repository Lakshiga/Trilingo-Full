import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

export interface MatchItem {
  id: string;
  content: string;
  matchId: string;
}

export interface MatchingContent {
  title?: string;
  columnA: MatchItem[];
  columnB: MatchItem[];
}

@Component({
  selector: 'app-matching-activity',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="matching-container">
      <h2 *ngIf="content.title" class="title">{{ content.title }}</h2>

      <div class="matching-grid">
        <!-- Column A -->
        <div class="column">
          <button
            *ngFor="let item of content.columnA"
            mat-raised-button
            [color]="getButtonColor(item)"
            (click)="handleItemClick(item, 'A')"
            [disabled]="correctPairs.includes(item.id)"
            class="match-button"
          >
            {{ item.content }}
          </button>
        </div>

        <!-- Column B -->
        <div class="column">
          <button
            *ngFor="let item of content.columnB"
            mat-raised-button
            [color]="getButtonColor(item)"
            (click)="handleItemClick(item, 'B')"
            [disabled]="correctPairs.includes(item.id)"
            class="match-button"
          >
            {{ item.content }}
          </button>
        </div>
      </div>

      <!-- Completion Message -->
      <div *ngIf="isComplete" class="completion-message">
        <mat-icon>check_circle</mat-icon>
        <span>All Matched!</span>
      </div>

      <!-- Reset Button -->
      <div class="reset-section">
        <button mat-stroked-button (click)="handleReset()">
          <mat-icon>replay</mat-icon>
          Reset
        </button>
      </div>
    </div>
  `,
  styles: [`
    .matching-container {
      padding: 16px;
      font-family: sans-serif;
    }

    .title {
      text-align: center;
      margin-bottom: 24px;
      font-size: 1.5rem;
    }

    .matching-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      justify-content: center;
      align-items: center;
      margin-bottom: 32px;
    }

    .column {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .match-button {
      height: 60px;
      text-transform: none;
      justify-content: center;
      font-size: 1rem;
      width: 100%;
    }

    .completion-message {
      text-align: center;
      margin: 32px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #2e7d32;
      font-size: 1.25rem;
    }

    .reset-section {
      text-align: center;
      margin-top: 32px;
    }

    @media (max-width: 768px) {
      .matching-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class MatchingActivityComponent implements OnInit {
  @Input() content!: MatchingContent;

  selectedA: MatchItem | null = null;
  selectedB: MatchItem | null = null;
  correctPairs: string[] = [];

  ngOnInit() {
    this.resetState();
  }

  get isComplete(): boolean {
    return this.correctPairs.length === this.content.columnA.length + this.content.columnB.length;
  }

  getButtonColor(item: MatchItem): 'primary' | 'accent' {
    return this.correctPairs.includes(item.id) ? 'accent' : 'primary';
  }

  handleItemClick(item: MatchItem, column: 'A' | 'B') {
    // Don't allow clicking an already matched item
    if (this.correctPairs.includes(item.id)) return;

    if (column === 'A') {
      this.selectedA = item;
    } else {
      this.selectedB = item;
    }

    // Check for a match
    this.checkForMatch();
  }

  private checkForMatch() {
    if (this.selectedA && this.selectedB) {
      if (this.selectedA.matchId === this.selectedB.id) {
        // Correct match!
        this.correctPairs = [...this.correctPairs, this.selectedA.id, this.selectedB.id];
      }
      
      // Reset selections after a short delay to give user feedback
      setTimeout(() => {
        this.selectedA = null;
        this.selectedB = null;
      }, 300);
    }
  }

  handleReset() {
    this.resetState();
  }

  private resetState() {
    this.selectedA = null;
    this.selectedB = null;
    this.correctPairs = [];
  }
}
