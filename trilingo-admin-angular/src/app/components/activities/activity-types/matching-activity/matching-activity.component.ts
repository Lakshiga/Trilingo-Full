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
  templateUrl: './matching-activity.component.html',
  styleUrls: ['./matching-activity.component.css']
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
