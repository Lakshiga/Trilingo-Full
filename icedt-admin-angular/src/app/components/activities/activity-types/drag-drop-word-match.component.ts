import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTypographyModule } from '@angular/material/typography';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export interface WordSource {
  id: number;
  text: string;
  matchId: number;
}

export interface WordTarget {
  id: number;
  text: string;
}

export interface DragDropWordMatchContent {
  title: string;
  targetTitle: string;
  sourceTitle: string;
  targets: WordTarget[];
  sources: WordSource[];
}

@Component({
  selector: 'app-drag-drop-word-match',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTypographyModule,
    MatCardModule,
    MatGridListModule,
    MatSnackBarModule
  ],
  template: `
    <div class="drag-drop-word-match">
      <h1>{{ content.title }}</h1>
      
      <div class="success-message" *ngIf="isComplete">
        <mat-icon>check_circle</mat-icon>
        சரியாகப் பொருத்திவிட்டீர்கள்! (Matched Correctly!)
      </div>
      
      <div class="error-message" *ngIf="error">
        தவறான பொருத்தம். (Incorrect Match.)
      </div>
      
      <div class="grid-container">
        <!-- Column for Targets (Drop Zones) -->
        <div class="targets-column">
          <h3>{{ content.targetTitle }}</h3>
          <div 
            *ngFor="let target of content.targets" 
            class="target-item"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event, target.id)"
            [class.matched]="matchedPairs[target.id]">
            <span class="target-text">{{ target.text }}</span>
            <div 
              *ngIf="matchedPairs[target.id]" 
              class="matched-word">
              {{ getMatchedWordText(target.id) }}
            </div>
          </div>
        </div>
        
        <!-- Column for Sources (Draggable Items) -->
        <div class="sources-column">
          <h3>{{ content.sourceTitle }}</h3>
          <div 
            *ngFor="let source of shuffledSources" 
            class="source-item"
            [draggable]="!isMatched(source.id)"
            (dragstart)="onDragStart($event, source)"
            [class.dragging]="draggedItem?.id === source.id"
            [class.matched]="isMatched(source.id)"
            *ngIf="!isMatched(source.id)">
            {{ source.text }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drag-drop-word-match {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
    }

    h1 {
      margin-bottom: 24px;
      font-size: 2rem;
    }

    .success-message {
      background-color: #e8f5e9;
      color: #2e7d32;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      max-width: 800px;
      margin: 0 auto;
    }

    .targets-column,
    .sources-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    h3 {
      margin: 0 0 16px 0;
      font-size: 1.25rem;
    }

    .target-item {
      padding: 16px;
      min-height: 60px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      background-color: #fafafa;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s ease;
    }

    .target-item.matched {
      background-color: #e8f5e9;
      border-color: #4caf50;
    }

    .target-text {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .matched-word {
      background-color: #1976d2;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .source-item {
      padding: 16px;
      background-color: #1976d2;
      color: white;
      border-radius: 8px;
      cursor: grab;
      font-size: 1.25rem;
      font-weight: 500;
      transition: all 0.3s ease;
      user-select: none;
    }

    .source-item:hover {
      background-color: #1565c0;
    }

    .source-item.dragging {
      opacity: 0.5;
    }

    .source-item.matched {
      display: none;
    }

    @media (max-width: 768px) {
      .grid-container {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }
  `]
})
export class DragDropWordMatchComponent {
  @Input() content!: DragDropWordMatchContent;

  draggedItem: WordSource | null = null;
  matchedPairs: Record<number, number> = {};
  error = false;
  shuffledSources: WordSource[] = [];

  ngOnInit(): void {
    this.shuffleSources();
  }

  ngOnChanges(): void {
    this.shuffleSources();
  }

  private shuffleSources(): void {
    this.shuffledSources = [...this.content.sources].sort(() => Math.random() - 0.5);
  }

  onDragStart(event: DragEvent, source: WordSource): void {
    this.draggedItem = source;
    event.dataTransfer?.setData('sourceId', source.id.toString());
    this.error = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetId: number): void {
    event.preventDefault();
    if (!this.draggedItem) return;

    // Prevent dropping on an already matched target
    if (Object.keys(this.matchedPairs).map(Number).includes(targetId)) {
      return;
    }

    // Check if the dragged item's matchId corresponds to the target's id
    if (this.draggedItem.matchId === targetId) {
      this.matchedPairs = { ...this.matchedPairs, [targetId]: this.draggedItem.id };
    } else {
      this.error = true;
      setTimeout(() => this.error = false, 1500);
    }
    this.draggedItem = null;
  }

  get isComplete(): boolean {
    return Object.keys(this.matchedPairs).length === this.content.targets.length;
  }

  isMatched(sourceId: number): boolean {
    return Object.values(this.matchedPairs).includes(sourceId);
  }

  getMatchedWordText(targetId: number): string {
    const sourceId = this.matchedPairs[targetId];
    const source = this.content.sources.find(s => s.id === sourceId);
    return source?.text || '';
  }
}

