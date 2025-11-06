import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatchingContent, MatchItem } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-matching',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.css']
})
export class MatchingComponent {
  @Input() content!: MatchingContent;

  selectedA: MatchItem | null = null;
  selectedB: MatchItem | null = null;
  matches: Map<string, string> = new Map();
  showFeedback: boolean = false;
  isCorrect: boolean = false;

  get allMatched(): boolean {
    return this.matches.size === this.content.columnA.length;
  }

  selectItemA(item: MatchItem): void {
    if (this.isMatched(item.id)) return;
    
    this.selectedA = item;
    this.checkMatch();
  }

  selectItemB(item: MatchItem): void {
    if (this.isMatched(item.id)) return;
    
    this.selectedB = item;
    this.checkMatch();
  }

  private checkMatch(): void {
    if (this.selectedA && this.selectedB) {
      this.isCorrect = this.selectedA.matchId === this.selectedB.id;
      this.showFeedback = true;

      if (this.isCorrect) {
        this.matches.set(this.selectedA.id, this.selectedB.id);
        this.matches.set(this.selectedB.id, this.selectedA.id);
      }

      // Clear selection after a short delay
      setTimeout(() => {
        this.selectedA = null;
        this.selectedB = null;
        this.showFeedback = false;
      }, 1500);
    }
  }

  isMatched(itemId: string): boolean {
    return this.matches.has(itemId);
  }

  resetActivity(): void {
    this.selectedA = null;
    this.selectedB = null;
    this.matches.clear();
    this.showFeedback = false;
    this.isCorrect = false;
  }
}


