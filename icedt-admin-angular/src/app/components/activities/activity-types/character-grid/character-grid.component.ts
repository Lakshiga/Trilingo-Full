import { Component, Input, ElementRef, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { CharacterGridContent, CharacterGridItem } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-character-grid',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatGridListModule],
  templateUrl: './character-grid.component.html',
  styleUrls: ['./character-grid.component.css']
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
    return this.content.gridItems.find((item: any) => item.id === this.currentCorrectIds[this.currentItemToFindIndex]);
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