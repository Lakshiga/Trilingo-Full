import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// MatTypographyModule is not available in Angular Material v19
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface DragDropImageItem {
  id: number;
  imageUrl: string;
  audioUrl: string;
  matchId?: number;
}

export interface DragDropImageMatchingContent {
  title: string;
  images: DragDropImageItem[];
}

@Component({
  selector: 'app-drag-drop-image-matching',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  template: `
    <div class="drag-drop-image-matching">
      <h2>{{ content.title }}</h2>
      
      <p class="instructions">
        படங்களை இழுத்து சரியான இடத்தில் விடுங்கள் (Drag images to match them correctly)
      </p>
      
      <div class="game-area">
        <!-- Left Side - Draggable Images -->
        <div class="left-side">
          <h3>இழுக்கவும் (Drag From)</h3>
          <div class="image-container">
            <mat-card 
              *ngFor="let item of availableLeftImages" 
              class="draggable-card"
              [draggable]="true"
              (dragstart)="onDragStart($event, item)"
              (click)="playAudio(item.audioUrl)"
              [class.dragging]="draggedItem?.id === item.id">
              <img [src]="item.imageUrl" [alt]="'Draggable item ' + item.id" class="image">
            </mat-card>
          </div>
        </div>
        
        <!-- Right Side - Drop Targets -->
        <div class="right-side">
          <h3>விடவும் (Drop Here)</h3>
          <div class="image-container">
            <mat-card 
              *ngFor="let item of availableRightImages"
              class="drop-target"
              (dragover)="onDragOver($event, item)"
              (dragleave)="onDragLeave()"
              (drop)="onDrop($event, item)"
              (click)="playAudio(item.audioUrl)"
              [class.drag-over]="dragOverTarget === item.id">
              <img [src]="item.imageUrl" [alt]="'Drop target ' + item.id" class="image">
            </mat-card>
          </div>
        </div>
      </div>
      
      <div class="actions" *ngIf="!isComplete">
        <button 
          mat-stroked-button 
          (click)="resetActivity()">
          <mat-icon>replay</mat-icon>
          மீண்டும் தொடங்கு (Reset)
        </button>
      </div>
      
      <div class="completion-message" *ngIf="isComplete">
        <mat-icon class="success-icon">check_circle</mat-icon>
        <p>அனைத்து படங்களும் சரியாக பொருத்தப்பட்டன! (All images matched correctly!)</p>
      </div>
      
      <audio #audioPlayer style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .drag-drop-image-matching {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
      min-height: 600px;
    }

    h2 {
      margin-bottom: 24px;
      font-size: 1.5rem;
    }

    .instructions {
      margin-bottom: 24px;
      color: #666;
    }

    .game-area {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin-bottom: 32px;
    }

    .left-side, .right-side {
      flex: 1;
      max-width: 300px;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 1.2rem;
    }

    .left-side h3 {
      color: #1976d2;
    }

    .right-side h3 {
      color: #f44336;
    }

    .image-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .draggable-card, .drop-target {
      cursor: grab;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .draggable-card:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .draggable-card.dragging {
      opacity: 0.5;
      cursor: grabbing;
    }

    .drop-target:hover {
      transform: scale(1.02);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .drop-target.drag-over {
      border: 3px dashed #1976d2;
      background-color: #e3f2fd;
    }

    .image {
      width: 100%;
      height: 120px;
      object-fit: cover;
    }

    .actions {
      margin-top: 32px;
    }

    .completion-message {
      margin-top: 32px;
      padding: 16px;
      background-color: #e8f5e9;
      border: 1px solid #2e7d32;
      border-radius: 8px;
      color: #2e7d32;
    }

    .success-icon {
      font-size: 2rem;
      margin-bottom: 8px;
    }
  `]
})
export class DragDropImageMatchingComponent {
  @Input() content!: DragDropImageMatchingContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  draggedItem: DragDropImageItem | null = null;
  matchedPairs: number[] = [];
  dragOverTarget: number | null = null;

  get leftImages(): DragDropImageItem[] {
    return this.content.images;
  }

  get rightImages(): DragDropImageItem[] {
    // Create shuffled duplicates with offset IDs
    return this.shuffleArray(this.content.images.map(img => ({
      ...img,
      id: img.id + 100, // Offset IDs to avoid conflicts
      matchId: img.id   // Point back to original left image
    })));
  }

  get availableLeftImages(): DragDropImageItem[] {
    return this.leftImages.filter(item => !this.matchedPairs.includes(item.id));
  }

  get availableRightImages(): DragDropImageItem[] {
    return this.rightImages.filter(item => !this.matchedPairs.includes(item.id));
  }

  get isComplete(): boolean {
    return this.matchedPairs.length === this.content.images.length * 2;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  onDragStart(event: DragEvent, item: DragDropImageItem): void {
    this.draggedItem = item;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', item.id.toString());
    }
  }

  onDragOver(event: DragEvent, targetItem: DragDropImageItem): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverTarget = targetItem.id;
  }

  onDragLeave(): void {
    this.dragOverTarget = null;
  }

  onDrop(event: DragEvent, targetItem: DragDropImageItem): void {
    event.preventDefault();
    this.dragOverTarget = null;

    if (!this.draggedItem) return;

    // Check if it's a correct match
    if (this.draggedItem.id === targetItem.matchId) {
      // Correct match
      this.matchedPairs.push(this.draggedItem.id, targetItem.id);
      this.playAudio(targetItem.audioUrl);
      // Show success message (you could use MatSnackBar here)
    } else {
      // Incorrect match - show error message
      // You could use MatSnackBar here to show error
    }

    this.draggedItem = null;
  }

  playAudio(audioUrl: string): void {
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.src = audioUrl;
      this.audioPlayer.nativeElement.play().catch(e => {
        console.warn("Audio playback failed:", e);
      });
    }
  }

  resetActivity(): void {
    this.matchedPairs = [];
    this.draggedItem = null;
    this.dragOverTarget = null;
  }
}
