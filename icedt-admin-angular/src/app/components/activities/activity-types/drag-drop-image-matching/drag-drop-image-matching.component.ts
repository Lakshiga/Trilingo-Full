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
  templateUrl: './drag-drop-image-matching.component.html',
  styleUrls: ['./drag-drop-image-matching.component.css']
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
