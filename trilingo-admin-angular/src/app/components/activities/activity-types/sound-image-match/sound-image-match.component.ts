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
  templateUrl: './sound-image-match.component.html',
  styleUrls: ['./sound-image-match.component.css']
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
