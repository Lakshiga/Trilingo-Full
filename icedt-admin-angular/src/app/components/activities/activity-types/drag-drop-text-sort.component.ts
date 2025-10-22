import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTypographyModule } from '@angular/material/typography';
import { MatCardModule } from '@angular/material/card';

interface DraggableText {
  id: string;
  text: string;
  categoryId: string;
}

interface Category {
  id: string;
  title: string;
}

export interface DragDropTextSortContent {
  title: string;
  items: DraggableText[];
  categories: Category[];
}

@Component({
  selector: 'app-drag-drop-text-sort',
  standalone: true,
  imports: [
    CommonModule,
    MatTypographyModule,
    MatCardModule
  ],
  template: `
    <div class="drag-drop-text-sort">
      <h1>{{ content.title }}</h1>
      
      <div class="completion-message" *ngIf="isComplete">
        <p>Well done! You have sorted all the items correctly.</p>
      </div>
      
      <!-- Pool of Unsorted Items -->
      <div class="unsorted-pool">
        <div 
          *ngFor="let item of shuffledUnsortedItems" 
          class="unsorted-item"
          [draggable]="true"
          (dragstart)="onDragStart($event, item)">
          {{ item.text }}
        </div>
      </div>
      
      <!-- Category Bins -->
      <div class="categories-grid">
        <div 
          *ngFor="let category of content.categories" 
          class="category-bin"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event, category.id)">
          <h3>{{ category.title }}</h3>
          <div class="sorted-items">
            <div 
              *ngFor="let item of sortedItems[category.id] || []" 
              class="sorted-item">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drag-drop-text-sort {
      padding: 24px;
      font-family: sans-serif;
    }

    h1 {
      text-align: center;
      margin-bottom: 24px;
      font-size: 2rem;
    }

    .completion-message {
      text-align: center;
      margin-bottom: 24px;
      padding: 16px;
      background-color: #e8f5e9;
      border: 1px solid #2e7d32;
      border-radius: 8px;
      color: #2e7d32;
    }

    .unsorted-pool {
      min-height: 120px;
      padding: 16px;
      margin-bottom: 32px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      align-items: center;
    }

    .unsorted-item {
      padding: 8px 16px;
      cursor: grab;
      background-color: #f44336;
      color: white;
      border-radius: 4px;
      user-select: none;
      font-size: 1.1rem;
      transition: transform 0.2s ease;
    }

    .unsorted-item:hover {
      transform: scale(1.05);
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .category-bin {
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      min-height: 300px;
    }

    .category-bin h3 {
      text-align: center;
      margin-bottom: 16px;
      font-size: 1.2rem;
    }

    .sorted-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sorted-item {
      padding: 8px 16px;
      background-color: #1976d2;
      color: white;
      border-radius: 4px;
      font-size: 1.1rem;
    }
  `]
})
export class DragDropTextSortComponent {
  @Input() content!: DragDropTextSortContent;

  unsortedItems: DraggableText[] = [];
  sortedItems: Record<string, DraggableText[]> = {};
  draggedItem: DraggableText | null = null;

  get shuffledUnsortedItems(): DraggableText[] {
    return [...this.unsortedItems].sort(() => Math.random() - 0.5);
  }

  get isComplete(): boolean {
    return this.unsortedItems.length === 0;
  }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(): void {
    this.initializeData();
  }

  private initializeData(): void {
    if (this.content?.items && this.content?.categories) {
      this.unsortedItems = [...this.content.items];
      this.sortedItems = {};
      this.content.categories.forEach(category => {
        this.sortedItems[category.id] = [];
      });
    }
  }

  onDragStart(event: DragEvent, item: DraggableText): void {
    this.draggedItem = item;
    if (event.dataTransfer) {
      event.dataTransfer.setData('itemId', item.id);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, categoryId: string): void {
    event.preventDefault();
    if (!this.draggedItem) return;

    // Check for a correct match
    if (this.draggedItem.categoryId === categoryId) {
      // Move item from unsorted to the correct sorted category
      this.unsortedItems = this.unsortedItems.filter(item => item.id !== this.draggedItem!.id);
      this.sortedItems[categoryId] = [...(this.sortedItems[categoryId] || []), this.draggedItem];
    } else {
      // You can add feedback for an incorrect drop here if needed
      console.log("Incorrect drop!");
    }
    this.draggedItem = null;
  }
}
