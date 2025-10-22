import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTypographyModule } from '@angular/material/typography';
import { MatCardModule } from '@angular/material/card';

interface Item {
  id: number;
  name: string;
  imageUrl: string;
  audioUrl: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

export interface CategorizationContent {
  title: string;
  instruction: string;
  items: Item[];
  categories: Category[];
}

@Component({
  selector: 'app-drag-drop-categorization',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTypographyModule,
    MatCardModule
  ],
  template: `
    <div class="drag-drop-categorization">
      <h1>{{ content.title }}</h1>
      <p class="instruction">{{ content.instruction }}</p>
      
      <div class="game-area">
        <div class="items-section">
          <h2>பொருட்கள்</h2>
          <div class="items-container">
            <mat-card 
              *ngFor="let item of unplacedItems" 
              class="item-card"
              [draggable]="true"
              (dragstart)="onDragStart($event, item)"
              (dragend)="onDragEnd()"
              [class.dragging]="draggedItem?.id === item.id">
              <img [src]="item.imageUrl" [alt]="item.name" class="item-image">
            </mat-card>
          </div>
        </div>
        
        <div class="categories-section">
          <div class="categories-grid">
            <div *ngFor="let category of content.categories" class="category-container">
              <h3>{{ category.name }}</h3>
              <div 
                class="category-drop-zone"
                (dragover)="onDragOver($event)"
                (drop)="onDrop($event, category)">
                <mat-card 
                  *ngFor="let item of placedItems[category.id] || []" 
                  class="placed-item">
                  <img [src]="item.imageUrl" [alt]="item.name" class="placed-image">
                </mat-card>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        mat-raised-button 
        color="primary" 
        (click)="resetActivity()"
        class="reset-button">
        மீண்டும் தொடங்கு
      </button>
      
      <audio #audioPlayer style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .drag-drop-categorization {
      padding: 24px;
      text-align: center;
      font-family: sans-serif;
    }

    h1 {
      margin-bottom: 16px;
      font-size: 1.5rem;
    }

    .instruction {
      margin-bottom: 24px;
      color: #666;
    }

    .game-area {
      display: flex;
      gap: 32px;
      margin-bottom: 32px;
    }

    .items-section {
      flex: 1;
    }

    .categories-section {
      flex: 1;
    }

    h2, h3 {
      margin-bottom: 16px;
    }

    .items-container {
      min-height: 300px;
      padding: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
    }

    .item-card {
      cursor: grab;
      transition: opacity 0.3s ease;
    }

    .item-card.dragging {
      opacity: 0.5;
      cursor: grabbing;
    }

    .item-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .category-container {
      text-align: center;
    }

    .category-drop-zone {
      min-height: 300px;
      padding: 16px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      align-items: flex-start;
    }

    .placed-item {
      margin: 4px;
    }

    .placed-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
    }

    .reset-button {
      margin-top: 16px;
    }
  `]
})
export class DragDropCategorizationComponent {
  @Input() content!: CategorizationContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  unplacedItems: Item[] = [];
  placedItems: Record<string, Item[]> = {};
  draggedItem: Item | null = null;

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(): void {
    this.initializeData();
  }

  private initializeData(): void {
    if (this.content?.items && this.content?.categories) {
      this.unplacedItems = [...this.content.items];
      this.placedItems = {};
      this.content.categories.forEach(category => {
        this.placedItems[category.id] = [];
      });
    }
  }

  onDragStart(event: DragEvent, item: Item): void {
    this.draggedItem = item;
    if (event.dataTransfer) {
      event.dataTransfer.setData('itemId', item.id.toString());
    }
  }

  onDragEnd(): void {
    this.draggedItem = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, category: Category): void {
    event.preventDefault();
    if (!this.draggedItem) return;

    if (this.draggedItem.categoryId === category.id) {
      // Correct category
      this.unplacedItems = this.unplacedItems.filter(item => item.id !== this.draggedItem!.id);
      this.placedItems[category.id] = [...(this.placedItems[category.id] || []), this.draggedItem];
    } else {
      // Wrong category - could show feedback here
      console.log("Wrong category!");
    }
    this.draggedItem = null;
  }

  resetActivity(): void {
    this.initializeData();
  }
}
