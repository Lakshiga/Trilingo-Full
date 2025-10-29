import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatCardModule,
    MatGridListModule,
    MatSnackBarModule
  ],
  templateUrl: './drag-drop-word-match.component.html',
  styleUrls: ['./drag-drop-word-match.component.css']
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
    const source = this.content.sources.find((s: any) => s.id === sourceId);
    return source?.text || '';
  }
}

