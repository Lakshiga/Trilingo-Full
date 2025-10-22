import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatchingContent, MatchItem } from '../../../types/activity-content.types';

@Component({
  selector: 'app-matching',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="matching-container">
      <h2 *ngIf="content.title" class="title">{{ content.title }}</h2>
      
      <div class="matching-area">
        <div class="column">
          <h3>Column A</h3>
          <div class="items-container">
            <button
              *ngFor="let item of content.columnA"
              mat-button
              [class.selected]="selectedA?.id === item.id"
              [class.matched]="isMatched(item.id)"
              (click)="selectItemA(item)"
              class="item-button"
            >
              {{ item.content }}
            </button>
          </div>
        </div>

        <div class="column">
          <h3>Column B</h3>
          <div class="items-container">
            <button
              *ngFor="let item of content.columnB"
              mat-button
              [class.selected]="selectedB?.id === item.id"
              [class.matched]="isMatched(item.id)"
              (click)="selectItemB(item)"
              class="item-button"
            >
              {{ item.content }}
            </button>
          </div>
        </div>
      </div>

      <div class="feedback" *ngIf="showFeedback">
        <mat-icon [class.success]="isCorrect" [class.error]="!isCorrect">
          {{ isCorrect ? 'check_circle' : 'cancel' }}
        </mat-icon>
        <span>{{ isCorrect ? 'Correct!' : 'Try again!' }}</span>
      </div>

      <div class="actions" *ngIf="allMatched">
        <button mat-raised-button color="primary" (click)="resetActivity()">
          Try Again
        </button>
      </div>
    </div>
  `,
  styles: [`
    .matching-container {
      padding: 24px;
      text-align: center;
    }

    .title {
      margin-bottom: 24px;
    }

    .matching-area {
      display: flex;
      gap: 32px;
      justify-content: center;
      margin-bottom: 24px;
    }

    .column {
      flex: 1;
      max-width: 300px;
    }

    .column h3 {
      margin-bottom: 16px;
    }

    .items-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .item-button {
      width: 100%;
      text-align: left;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .item-button:hover {
      background: #f5f5f5;
    }

    .item-button.selected {
      border-color: #1976d2;
      background: #e3f2fd;
    }

    .item-button.matched {
      border-color: #4caf50;
      background: #e8f5e8;
      cursor: default;
    }

    .feedback {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 1.2rem;
    }

    .success {
      color: #4caf50;
    }

    .error {
      color: #f44336;
    }

    .actions {
      display: flex;
      justify-content: center;
    }
  `]
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


