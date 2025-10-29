import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
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
    MatCardModule
  ],
  templateUrl: './drag-drop-categorization.component.html',
  styleUrls: ['./drag-drop-categorization.component.css']
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
      this.content.categories.forEach((category: any) => {
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
