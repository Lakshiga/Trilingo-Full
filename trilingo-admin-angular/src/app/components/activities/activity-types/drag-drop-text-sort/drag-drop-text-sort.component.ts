import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    MatCardModule
  ],
  templateUrl: './drag-drop-text-sort.component.html',
  styleUrls: ['./drag-drop-text-sort.component.css']
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
      this.content.categories.forEach((category: any) => {
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
