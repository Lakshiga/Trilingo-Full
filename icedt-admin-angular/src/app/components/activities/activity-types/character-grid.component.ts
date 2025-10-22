import { Component, Input, ElementRef, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { CharacterGridContent, CharacterGridItem } from '../../../types/activity-content.types';

@Component({
  selector: 'app-character-grid',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatGridListModule],
  template: `
    <div class="container">
      <h1 class="title">{{ content.title }}</h1>
      
      <div class="instruction-panel">
        <span class="instruction-text">Listen:</span>
        <button
          mat-icon-button
          color="primary"
          (click)="playCurrentAudio()"
          [disabled]="isComplete"
          class="audio-button"
        >
          <mat-icon>volume_up</mat-icon>
        </button>
      </div>

      <div class="grid-container">
        <div class="grid">
          <div
            *ngFor="let item of content.gridItems"
            class="grid-item"
            [class.found]="isFound(item.id)"
            (click)="handleCharacterClick(item.id)"
          >
            <span class="character">{{ item.character }}</span>
          </div>
        </div>
      </div>
      
      <div class="completion-message" *ngIf="isComplete">
        <h2 class="success-text">Well Done!</h2>
      </div>

      <audio #audioPlayer style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .container {
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
      font-weight: 500;
    }

    .instruction-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 8px;
      margin-bottom: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .instruction-text {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .audio-button {
      background-color: #e3f2fd;
    }

    .audio-button:hover {
      background-color: #bbdefb;
    }

    .grid-container {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 8px;
      max-width: 600px;
      width: 100%;
    }

    .grid-item {
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
      background-color: white;
      transition: transform 0.2s, background-color 0.2s, border-color 0.2s;
    }

    .grid-item:hover {
      transform: scale(1.1);
    }

    .grid-item.found {
      border-color: #4caf50;
      background-color: #e8f5e8;
    }

    .character {
      font-size: 2rem;
      font-weight: bold;
    }

    .completion-message {
      height: 80px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .success-text {
      color: #4caf50;
      font-size: 1.5rem;
      margin: 0;
    }
  `]
})
export class CharacterGridComponent implements OnInit, OnChanges {
  @Input() content!: CharacterGridContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  foundItems: number[] = [];
  currentItemToFindIndex: number = 0;

  get currentCorrectIds(): number[] {
    return this.content.correctItemIds;
  }

  get currentItemToFind(): CharacterGridItem | undefined {
    return this.content.gridItems.find(item => item.id === this.currentCorrectIds[this.currentItemToFindIndex]);
  }

  get isComplete(): boolean {
    return this.foundItems.length === this.currentCorrectIds.length;
  }

  ngOnInit(): void {
    this.resetGame();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this.resetGame();
    }
  }

  resetGame(): void {
    this.foundItems = [];
    this.currentItemToFindIndex = 0;
  }

  playAudio(audioUrl: string): void {
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.src = audioUrl;
      this.audioPlayer.nativeElement.play().catch(e => console.error("Audio playback failed:", e));
    }
  }

  playCurrentAudio(): void {
    if (this.currentItemToFind?.audioUrl) {
      this.playAudio(this.currentItemToFind.audioUrl);
    }
  }

  handleCharacterClick(clickedItemId: number): void {
    if (this.foundItems.includes(clickedItemId) || !this.currentItemToFind) return;

    if (clickedItemId === this.currentItemToFind.id) {
      this.foundItems.push(clickedItemId);
      this.currentItemToFindIndex++;
    }
  }

  isFound(itemId: number): boolean {
    return this.foundItems.includes(itemId);
  }
}