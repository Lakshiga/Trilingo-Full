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
  templateUrl: './scene-finder.component.html',
  styleUrls: ['./scene-finder.component.css']
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
