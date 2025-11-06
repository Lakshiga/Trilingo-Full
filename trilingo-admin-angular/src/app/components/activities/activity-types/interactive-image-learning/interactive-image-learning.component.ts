import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InteractiveObject, InteractiveImageLearningContent } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-interactive-image-learning',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './interactive-image-learning.component.html',
  styleUrls: ['./interactive-image-learning.component.css']
})
export class InteractiveImageLearningComponent implements OnInit, OnDestroy {
  @Input() content!: InteractiveImageLearningContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  clickedObjects: number[] = [];
  currentlyPlaying: number | null = null;
  showObjectName: { id: number; name: string } | null = null;
  private mediaBaseUrl = '';

  get allObjectsClicked(): boolean {
    return this.clickedObjects.length === this.content.objects.length;
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  private getFullUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `${this.mediaBaseUrl}/${url}`;
  }

  getImageUrl(): string {
    return this.getFullUrl(this.content.imageUrl);
  }

  private playAudio(audioUrl: string, objectId: number, objectName: string): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = this.getFullUrl(audioUrl);
      this.currentlyPlaying = objectId;
      this.showObjectName = { id: objectId, name: objectName };
      
      this.audioElement.nativeElement.play()
        .then(() => {
          // Audio started playing successfully
        })
        .catch(e => {
          console.error('Error playing audio:', e);
          this.currentlyPlaying = null;
          this.showObjectName = null;
        });

      this.audioElement.nativeElement.onended = () => {
        this.currentlyPlaying = null;
        setTimeout(() => this.showObjectName = null, 1000);
      };
    }
  }

  playObjectAudio(): void {
    if (this.showObjectName) {
      const obj = this.content.objects.find((o: any) => o.id === this.showObjectName!.id);
      if (obj) {
        this.playAudio(obj.audioUrl, obj.id, obj.name);
      }
    }
  }

  handleObjectClick(object: InteractiveObject): void {
    if (!this.clickedObjects.includes(object.id)) {
      this.clickedObjects = [...this.clickedObjects, object.id];
    }
    
    this.playAudio(object.audioUrl, object.id, object.name);
  }

  handleReset(): void {
    this.clickedObjects = [];
    this.currentlyPlaying = null;
    this.showObjectName = null;
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
      this.audioElement.nativeElement.currentTime = 0;
    }
  }
}
