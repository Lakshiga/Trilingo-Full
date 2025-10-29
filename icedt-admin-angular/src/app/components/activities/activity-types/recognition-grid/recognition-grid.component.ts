import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GridItem, RecognitionGridContent } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-recognition-grid',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './recognition-grid.component.html',
  styleUrls: ['./recognition-grid.component.css']
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
    return this.content.gridItems.find((item: any) => 
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
