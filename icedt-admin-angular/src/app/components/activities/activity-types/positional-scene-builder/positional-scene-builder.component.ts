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
  templateUrl: './positional-scene-builder.component.html',
  styleUrls: ['./positional-scene-builder.component.css']
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
      const object = this.content.draggableObjects.find((o: any) => o.id === objectId);
      const zone = this.content.dropZones.find((z: any) => z.id === zoneId);
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
