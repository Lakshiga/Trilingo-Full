import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface SoundSource {
  id: number;
  text: string;
  audioUrl: string;
  matchId: number;
}

export interface ImageTarget {
  id: number;
  name: string;
  imageUrl: string;
}

export interface SoundImageMatchContent {
  title: string;
  soundSources: SoundSource[];
  imageTargets: ImageTarget[];
}

@Component({
  selector: 'app-sound-image-match',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="sound-image-container">
      <h1 class="title">{{ content.title }}</h1>
      <p class="instruction">
        Drag the correct sound and drop it onto the matching image.
      </p>

      <div *ngIf="isComplete" class="success-message">
        Well done! All sounds matched correctly.
      </div>

      <div class="main-content">
        <!-- Image Targets (Drop Zones) -->
        <div class="image-targets">
          <div class="targets-grid">
            <mat-card
              *ngFor="let image of content.imageTargets"
              class="image-target"
              [class.matched]="matchedPairs[image.id]"
              (dragover)="onDragOver($event)"
              (drop)="onDrop($event, image.id)"
            >
              <img
                mat-card-image
                [src]="image.imageUrl"
                [alt]="image.name"
                class="target-image"
              />
              <mat-icon *ngIf="matchedPairs[image.id]" class="checkmark">check_circle</mat-icon>
            </mat-card>
          </div>
        </div>

        <!-- Sound Sources (Draggable Items) -->
        <div class="sound-sources">
          <mat-card class="sources-card">
            <mat-card-content>
              <div class="sources-list">
                <div
                  *ngFor="let sound of shuffledSounds"
                  class="sound-item"
                  draggable="true"
                  (dragstart)="onDragStart($event, sound)"
                  [style.display]="isSoundMatched(sound.id) ? 'none' : 'flex'"
                >
                  <button mat-icon-button (click)="playAudio(sound.audioUrl)" class="audio-button">
                    <mat-icon>volume_up</mat-icon>
                  </button>
                  <span class="sound-text">{{ sound.text }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <audio #audioElement style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .sound-image-container {
      padding: 24px;
      font-family: sans-serif;
    }

    .title {
      text-align: center;
      margin-bottom: 16px;
      margin-top: 0;
    }

    .instruction {
      text-align: center;
      color: #666;
      margin-bottom: 24px;
    }

    .success-message {
      background-color: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #4caf50;
      border-radius: 4px;
      padding: 12px;
      text-align: center;
      margin-bottom: 24px;
    }

    .main-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 32px;
      align-items: start;
    }

    .targets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .image-target {
      position: relative;
      border: 2px dashed #ccc;
      background-color: #fafafa;
      transition: all 0.3s ease;
    }

    .image-target.matched {
      background-color: #e8f5e9;
      border-color: #4caf50;
    }

    .target-image {
      height: 150px;
      object-fit: cover;
    }

    .checkmark {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 2rem;
      color: #4caf50;
    }

    .sources-card {
      height: fit-content;
    }

    .sources-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sound-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px;
      cursor: grab;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .sound-item:hover {
      background-color: #f5f5f5;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .sound-item:active {
      cursor: grabbing;
    }

    .audio-button {
      color: #1976d2;
    }

    .sound-text {
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .main-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }
  `]
})
export class SoundImageMatchComponent implements OnInit, OnDestroy {
  @Input() content!: SoundImageMatchContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  draggedItem: SoundSource | null = null;
  matchedPairs: Record<number, number> = {};
  shuffledSounds: SoundSource[] = [];
  private mediaBaseUrl = '';

  get isComplete(): boolean {
    return Object.keys(this.matchedPairs).length === this.content.imageTargets.length;
  }

  ngOnInit(): void {
    this.shuffledSounds = [...this.content.soundSources].sort(() => Math.random() - 0.5);
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  playAudio(audioUrl: string): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = `${this.mediaBaseUrl}${audioUrl}`;
      this.audioElement.nativeElement.play().catch(e => 
        console.error("Audio playback error:", e)
      );
    }
  }

  isSoundMatched(soundId: number): boolean {
    return Object.values(this.matchedPairs).includes(soundId);
  }

  onDragStart(event: DragEvent, sound: SoundSource): void {
    this.draggedItem = sound;
    if (event.dataTransfer) {
      event.dataTransfer.setData('soundId', sound.id.toString());
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, imageId: number): void {
    event.preventDefault();
    if (!this.draggedItem || this.matchedPairs[imageId]) return;

    if (this.draggedItem.matchId === imageId) {
      this.matchedPairs = { ...this.matchedPairs, [imageId]: this.draggedItem.id };
      this.playAudio(this.draggedItem.audioUrl);
    }
    this.draggedItem = null;
  }
}
