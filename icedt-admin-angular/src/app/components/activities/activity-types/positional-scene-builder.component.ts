import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DraggableSceneObject {
  id: string;
  name: string;
  imageUrl: string;
}

export interface DropZone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SceneInstruction {
  id: number;
  text: string;
  audioUrl: string;
  draggableObjectId: string;
  dropZoneId: string;
}

export interface PositionalSceneBuilderContent {
  title: string;
  sceneImageUrl: string;
  draggableObjects: DraggableSceneObject[];
  dropZones: DropZone[];
  instructions: SceneInstruction[];
}

@Component({
  selector: 'app-positional-scene-builder',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="scene-builder-container">
      <h1 class="title">{{ content.title }}</h1>

      <!-- Instruction Bar -->
      <mat-card class="instruction-card">
        <mat-card-content>
          <div *ngIf="isComplete; else instructionContent" class="completion-message">
            <mat-icon>check_circle</mat-icon>
            Excellent! You have completed the scene.
          </div>
          <ng-template #instructionContent>
            <div class="instruction-content">
              <button mat-icon-button (click)="playCurrentInstruction()" class="audio-button">
                <mat-icon>volume_up</mat-icon>
              </button>
              <span class="instruction-text">{{ currentInstruction?.text }}</span>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <div *ngIf="feedback" class="feedback-message" [class.success]="feedback.type === 'success'" [class.error]="feedback.type === 'error'">
        {{ feedback.message }}
      </div>

      <!-- Main Scene Area -->
      <div class="scene-area">
        <img [src]="content.sceneImageUrl" alt="Main scene" class="scene-image" />

        <!-- Render Drop Zones -->
        <div
          *ngFor="let zone of content.dropZones"
          class="drop-zone"
          [style.left.%]="zone.x"
          [style.top.%]="zone.y"
          [style.width.%]="zone.width"
          [style.height.%]="zone.height"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event, zone.id)"
        ></div>

        <!-- Render Placed Objects -->
        <img
          *ngFor="let entry of getPlacedObjects()"
          [src]="entry.object.imageUrl"
          [alt]="entry.object.name"
          class="placed-object"
          [style.left.%]="entry.zone.x"
          [style.top.%]="entry.zone.y"
          [style.width.%]="entry.zone.width"
          [style.height.%]="entry.zone.height"
        />
      </div>

      <!-- Draggable Objects Pool -->
      <mat-card class="objects-pool">
        <mat-card-content>
          <div class="objects-grid">
            <img
              *ngFor="let obj of availableObjects"
              [src]="obj.imageUrl"
              [alt]="obj.name"
              class="draggable-object"
              draggable="true"
              (dragstart)="onDragStart($event, obj.id)"
            />
          </div>
        </mat-card-content>
      </mat-card>

      <div *ngIf="isComplete" class="controls">
        <button mat-raised-button (click)="handleReset()">
          <mat-icon>replay</mat-icon>
          Start Over
        </button>
      </div>

      <audio #audioElement style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .scene-builder-container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
    }

    .title {
      margin-bottom: 24px;
      margin-top: 0;
    }

    .instruction-card {
      margin-bottom: 16px;
    }

    .completion-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #4caf50;
      font-weight: 500;
    }

    .instruction-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .audio-button {
      color: #1976d2;
    }

    .instruction-text {
      font-size: 1.2rem;
    }

    .feedback-message {
      padding: 12px 24px;
      border-radius: 4px;
      margin-bottom: 16px;
      font-weight: 500;
    }

    .feedback-message.success {
      background-color: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #4caf50;
    }

    .feedback-message.error {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #f44336;
    }

    .scene-area {
      position: relative;
      width: 100%;
      max-width: 800px;
      margin: auto;
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
    }

    .scene-image {
      width: 100%;
      display: block;
    }

    .drop-zone {
      position: absolute;
      background-color: rgba(25, 118, 210, 0.2);
      border: 2px dashed rgba(25, 118, 210, 0.5);
    }

    .placed-object {
      position: absolute;
      object-fit: contain;
      pointer-events: none;
    }

    .objects-pool {
      margin-top: 24px;
    }

    .objects-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
    }

    .draggable-object {
      height: 80px;
      cursor: grab;
      transition: transform 0.2s;
      border-radius: 4px;
    }

    .draggable-object:hover {
      transform: scale(1.05);
    }

    .controls {
      margin-top: 16px;
    }
  `]
})
export class PositionalSceneBuilderComponent implements OnInit, OnDestroy {
  @Input() content!: PositionalSceneBuilderContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  currentInstructionIndex = 0;
  placedObjects: Record<string, string> = {};
  feedback: { type: 'success' | 'error'; message: string } | null = null;
  private mediaBaseUrl = '';

  get currentInstruction(): SceneInstruction | undefined {
    return this.content.instructions[this.currentInstructionIndex];
  }

  get isComplete(): boolean {
    return this.currentInstructionIndex >= this.content.instructions.length;
  }

  get availableObjects(): DraggableSceneObject[] {
    const placedObjectIds = Object.keys(this.placedObjects);
    return this.content.draggableObjects.filter(obj => !placedObjectIds.includes(obj.id));
  }

  ngOnInit(): void {
    this.playCurrentInstructionWithDelay();
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  private playAudio(audioUrl: string): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = `${this.mediaBaseUrl}${audioUrl}`;
      this.audioElement.nativeElement.play().catch(e => 
        console.error("Audio error:", e)
      );
    }
  }

  private playCurrentInstructionWithDelay(): void {
    if (this.currentInstruction?.audioUrl) {
      setTimeout(() => {
        this.playAudio(this.currentInstruction!.audioUrl);
      }, 500);
    }
  }

  playCurrentInstruction(): void {
    if (this.currentInstruction) {
      this.playAudio(this.currentInstruction.audioUrl);
    }
  }

  onDragStart(event: DragEvent, objectId: string): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('objectId', objectId);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropZoneId: string): void {
    event.preventDefault();
    if (this.isComplete) return;

    const draggedObjectId = event.dataTransfer?.getData('objectId');

    if (draggedObjectId === this.currentInstruction?.draggableObjectId && 
        dropZoneId === this.currentInstruction?.dropZoneId) {
      // Correct placement
      this.feedback = { type: 'success', message: 'Correct!' };
      this.placedObjects = { ...this.placedObjects, [draggedObjectId as string]: dropZoneId };
      
      // Advance to the next step after a delay
      setTimeout(() => {
        this.feedback = null;
        this.currentInstructionIndex++;
        this.playCurrentInstructionWithDelay();
      }, 1500);
    } else {
      // Incorrect placement
      this.feedback = { type: 'error', message: 'That is not the correct place. Listen again.' };
      setTimeout(() => this.feedback = null, 2000);
    }
  }

  getPlacedObjects(): Array<{ object: DraggableSceneObject; zone: DropZone }> {
    return Object.entries(this.placedObjects).map(([objectId, zoneId]) => {
      const object = this.content.draggableObjects.find(o => o.id === objectId);
      const zone = this.content.dropZones.find(z => z.id === zoneId);
      return { object: object!, zone: zone! };
    }).filter(entry => entry.object && entry.zone);
  }

  handleReset(): void {
    this.currentInstructionIndex = 0;
    this.placedObjects = {};
    this.feedback = null;
    this.playCurrentInstructionWithDelay();
  }
}
