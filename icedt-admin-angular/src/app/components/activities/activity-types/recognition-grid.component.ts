import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GridItem, RecognitionGridContent } from '../../../types/activity-content.types';

@Component({
  selector: 'app-recognition-grid',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="recognition-grid-container">
      <h1 class="title">{{ content.title }}</h1>

      <mat-card class="instruction-card">
        <mat-card-content>
          <div class="instruction-content">
            <span class="instruction-text">Listen:</span>
            <button 
              mat-icon-button 
              (click)="playCurrentAudio()" 
              [disabled]="isComplete"
              class="audio-button"
            >
              <mat-icon>volume_up</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="grid-container">
        <div class="image-grid">
          <div
            *ngFor="let item of content.gridItems"
            class="image-item"
            (click)="handleImageClick(item.id)"
          >
            <img [src]="item.imageUrl" [alt]="'item ' + item.id" class="item-image" />
            <div *ngIf="foundItems.includes(item.id)" class="checkmark-overlay">
              <mat-icon class="checkmark-icon">check_circle</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="completion-area">
        <div *ngIf="isComplete" class="completion-message">
          <h2 class="success-text">Well Done!</h2>
          <button mat-stroked-button (click)="handleReset()">
            <mat-icon>replay</mat-icon>
            Play Again
          </button>
        </div>
      </div>

      <audio #audioElement style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .recognition-grid-container {
      padding: 16px;
      font-family: sans-serif;
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .title {
      margin-bottom: 16px;
      margin-top: 0;
    }

    .instruction-card {
      margin-bottom: 16px;
    }

    .instruction-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .instruction-text {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .audio-button {
      font-size: 2rem;
    }

    .grid-container {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      max-width: 600px;
      width: 100%;
    }

    .image-item {
      position: relative;
      cursor: pointer;
      overflow: hidden;
      border-radius: 8px;
      border: 2px solid transparent;
      transition: transform 0.2s;
    }

    .image-item:hover {
      transform: scale(1.05);
    }

    .item-image {
      width: 100%;
      display: block;
    }

    .checkmark-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .checkmark-icon {
      font-size: 3rem;
      color: white;
    }

    .completion-area {
      height: 80px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .completion-message {
      text-align: center;
    }

    .success-text {
      color: #4caf50;
      margin: 0 0 16px 0;
    }
  `]
})
export class RecognitionGridComponent implements OnInit, OnDestroy {
  @Input() content!: RecognitionGridContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  foundItems: number[] = [];
  currentItemToFindIndex = 0;
  private mediaBaseUrl = '';

  get itemsToFind(): number[] {
    return this.content.correctItemIds;
  }

  get currentItemToFind(): GridItem | undefined {
    return this.content.gridItems.find(item => 
      item.id === this.itemsToFind[this.currentItemToFindIndex]
    );
  }

  get isComplete(): boolean {
    return this.foundItems.length === this.itemsToFind.length;
  }

  ngOnInit(): void {
    this.resetGame();
    this.playCurrentAudioWithDelay();
  }

  ngOnDestroy(): void {
    // Clean up any timers if needed
  }

  private resetGame(): void {
    this.foundItems = [];
    this.currentItemToFindIndex = 0;
  }

  private playCurrentAudioWithDelay(): void {
    if (this.currentItemToFind?.audioUrl) {
      setTimeout(() => {
        this.playAudio(this.currentItemToFind!.audioUrl);
      }, 500);
    }
  }

  private playAudio(audioUrl: string): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = `${this.mediaBaseUrl}${audioUrl}`;
      this.audioElement.nativeElement.play().catch(e => 
        console.error("Audio playback failed:", e)
      );
    }
  }

  playCurrentAudio(): void {
    if (this.currentItemToFind) {
      this.playAudio(this.currentItemToFind.audioUrl);
    }
  }

  handleImageClick(clickedItemId: number): void {
    if (this.foundItems.includes(clickedItemId) || !this.currentItemToFind) {
      return;
    }

    if (clickedItemId === this.currentItemToFind.id) {
      this.foundItems = [...this.foundItems, clickedItemId];
      this.currentItemToFindIndex++;
      
      // Play audio for next item if available
      if (this.currentItemToFindIndex < this.itemsToFind.length) {
        setTimeout(() => {
          this.playCurrentAudioWithDelay();
        }, 300);
      }
    }
  }

  handleReset(): void {
    this.resetGame();
    this.playCurrentAudioWithDelay();
  }
}
