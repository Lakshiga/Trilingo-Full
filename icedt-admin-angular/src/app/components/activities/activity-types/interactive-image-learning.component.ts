import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InteractiveObject, InteractiveImageLearningContent } from '../../../types/activity-content.types';

@Component({
  selector: 'app-interactive-image-learning',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="interactive-image-container">
      <h1 class="title">{{ content.title }}</h1>
      
      <!-- Display current object name and audio controls -->
      <mat-card class="info-card">
        <mat-card-content>
          <div *ngIf="showObjectName; else defaultMessage" class="object-info">
            <span class="object-name">{{ showObjectName.name }}</span>
            <button mat-icon-button (click)="playObjectAudio()" class="audio-button">
              <mat-icon>volume_up</mat-icon>
            </button>
          </div>
          <ng-template #defaultMessage>
            <p class="instruction">
              படத்தில் உள்ள பொருட்களை அழுத்தி கேளுங்கள் (Click on objects in the image to learn)
            </p>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <!-- Progress indicator -->
      <div class="progress-section">
        <p class="progress-text">
          Progress: {{ clickedObjects.length }} / {{ content.objects.length }} objects explored
        </p>
      </div>

      <!-- The Interactive Image Container -->
      <div class="image-container">
        <img 
          [src]="getImageUrl()" 
          [alt]="content.title" 
          class="main-image"
        />
        
        <!-- Overlay for Interactive Objects -->
        <div
          *ngFor="let object of content.objects"
          class="interactive-object"
          [class.clicked]="clickedObjects.includes(object.id)"
          [class.playing]="currentlyPlaying === object.id"
          [style.top.%]="object.y"
          [style.left.%]="object.x"
          [style.width.%]="object.width"
          [style.height.%]="object.height"
          (click)="handleObjectClick(object)"
        >
          <div *ngIf="clickedObjects.includes(object.id) && currentlyPlaying !== object.id" class="checkmark">
            ✓
          </div>
        </div>
      </div>
      
      <!-- Control buttons -->
      <div class="controls">
        <button 
          mat-stroked-button 
          (click)="handleReset()"
          [disabled]="clickedObjects.length === 0"
        >
          <mat-icon>replay</mat-icon>
          Reset
        </button>
        
        <div *ngIf="allObjectsClicked" class="completion-message">
          🎉 All objects explored! Well done!
        </div>
      </div>
      
      <audio #audioElement style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .interactive-image-container {
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

    .info-card {
      margin-bottom: 16px;
      min-height: 60px;
    }

    .object-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .object-name {
      font-size: 1.2rem;
      font-weight: bold;
      color: #1976d2;
    }

    .audio-button {
      font-size: 2rem;
    }

    .instruction {
      color: #666;
      margin: 0;
    }

    .progress-section {
      margin-bottom: 16px;
    }

    .progress-text {
      color: #666;
      margin: 0;
    }

    .image-container {
      flex-grow: 1;
      position: relative;
      width: 100%;
      max-width: 800px;
      margin: auto;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .interactive-object {
      position: absolute;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.3s ease;
      background-color: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .interactive-object:hover {
      background-color: rgba(33, 150, 243, 0.2);
      border: 2px solid #2196f3;
      transform: scale(1.05);
    }

    .interactive-object.clicked {
      background-color: rgba(76, 175, 80, 0.3);
      border: 2px solid #4caf50;
    }

    .interactive-object.playing {
      background-color: rgba(33, 150, 243, 0.4);
      border: 3px solid #2196f3;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }

    .checkmark {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4caf50;
      font-size: 12px;
      font-weight: bold;
    }

    .controls {
      height: 60px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .completion-message {
      color: #4caf50;
      font-size: 1.2rem;
      font-weight: 500;
    }
  `]
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
      const obj = this.content.objects.find(o => o.id === this.showObjectName!.id);
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
