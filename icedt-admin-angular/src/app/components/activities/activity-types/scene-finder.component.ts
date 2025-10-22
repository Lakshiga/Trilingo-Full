import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface Hotspot {
  id: number;
  name: string;
  audioUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SceneFinderContent {
  title: string;
  sceneImageUrl: string;
  sceneAudioUrl?: string;
  hotspots: Hotspot[];
}

@Component({
  selector: 'app-scene-finder',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="scene-finder-container">
      <h1 class="title">{{ content.title }}</h1>
      
      <mat-card class="instruction-card">
        <mat-card-content>
          <div class="instruction-content">
            <span class="instruction-text">Find:</span>
            <span class="target-item">{{ isComplete ? "Well Done!" : currentItem?.name || "..." }}</span>
            <button 
              mat-icon-button
              (click)="playCurrentItemAudio()" 
              [disabled]="isComplete"
              class="audio-button"
            >
              <mat-icon>volume_up</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- The Scene Container -->
      <div class="scene-container">
        <img 
          [src]="content.sceneImageUrl" 
          [alt]="content.title" 
          class="scene-image"
        />
        
        <!-- Overlay for Hotspots -->
        <div
          *ngFor="let hotspot of content.hotspots"
          class="hotspot"
          [class.found]="foundItems.includes(hotspot.id)"
          [style.top.%]="hotspot.y"
          [style.left.%]="hotspot.x"
          [style.width.%]="hotspot.width"
          [style.height.%]="hotspot.height"
          (click)="handleHotspotClick(hotspot.id)"
        >
          <div *ngIf="foundItems.includes(hotspot.id)" class="found-indicator">
            <mat-icon>check_circle</mat-icon>
          </div>
        </div>
      </div>
      
      <!-- Play Again Button -->
      <div class="action-section">
        <button 
          *ngIf="isComplete" 
          mat-raised-button
          (click)="handleReset()"
          class="play-again-button"
        >
          <mat-icon>replay</mat-icon>
          Play Again
        </button>
      </div>

      <audio #audioElement style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .scene-finder-container {
      padding: 16px;
      font-family: sans-serif;
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .title {
      margin-bottom: 16px;
      font-size: 1.5rem;
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
      font-size: 1.25rem;
    }

    .target-item {
      font-size: 1.25rem;
      color: #1976d2;
      font-weight: bold;
    }

    .audio-button {
      min-width: 40px;
      padding: 8px;
    }

    .scene-container {
      flex-grow: 1;
      position: relative;
      width: 100%;
      max-width: 800px;
      margin: auto;
    }

    .scene-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .hotspot {
      position: absolute;
      cursor: pointer;
      transition: all 0.3s;
    }

    .hotspot.found {
      cursor: default;
    }

    .found-indicator {
      width: 100%;
      height: 100%;
      background-color: rgba(46, 204, 113, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .found-indicator mat-icon {
      font-size: 40px;
      color: white;
    }

    .action-section {
      height: 60px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .play-again-button {
      margin-top: 16px;
    }

    @media (max-width: 768px) {
      .instruction-content {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class SceneFinderComponent implements OnInit, OnDestroy {
  @Input() content!: SceneFinderContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  foundItems: number[] = [];
  currentItemIndex = 0;
  private audioTimeout?: number;

  ngOnInit() {
    this.resetGame();
    this.startCurrentItem();
  }

  ngOnDestroy() {
    if (this.audioTimeout) {
      clearTimeout(this.audioTimeout);
    }
  }

  get currentItem(): Hotspot | undefined {
    return this.content.hotspots[this.currentItemIndex];
  }

  get isComplete(): boolean {
    return this.foundItems.length === this.content.hotspots.length;
  }

  private resetGame() {
    this.foundItems = [];
    this.currentItemIndex = 0;
  }

  private startCurrentItem() {
    if (this.currentItem?.audioUrl) {
      this.audioTimeout = window.setTimeout(() => {
        this.playAudio(this.currentItem!.audioUrl);
      }, 500);
    }
  }

  private playAudio(audioUrl: string) {
    if (this.audioElement?.nativeElement) {
      this.audioElement.nativeElement.src = audioUrl;
      this.audioElement.nativeElement.play().catch(e => console.error(e));
    }
  }

  playCurrentItemAudio() {
    if (this.currentItem?.audioUrl) {
      this.playAudio(this.currentItem.audioUrl);
    }
  }

  handleHotspotClick(hotspotId: number) {
    if (this.foundItems.includes(hotspotId) || !this.currentItem) return;

    if (hotspotId === this.currentItem.id) {
      // Correct guess
      this.foundItems = [...this.foundItems, hotspotId];

      // Move to the next item
      if (this.currentItemIndex < this.content.hotspots.length - 1) {
        this.currentItemIndex++;
        this.startCurrentItem();
      } else {
        // All items found
        this.currentItemIndex = -1; // Sentinel value for completion
      }
    }
  }

  handleReset() {
    this.resetGame();
    this.startCurrentItem();
  }
}
