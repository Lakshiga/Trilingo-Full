import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Exercise } from '../../../services/exercise-api.service';
import { ActivityRendererComponent } from '../../activities/activity-renderer/activity-renderer.component';

@Component({
  selector: 'app-exercise-preview-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ActivityRendererComponent
  ],
  templateUrl: './exercise-preview-modal.component.html',
  styleUrls: ['./exercise-preview-modal.component.css']
})
export class ExercisePreviewModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() exercise: Exercise | null = null;
  @Input() activityTypeId: number = 0;
  @Output() onClose = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exercise'] && this.exercise) {
      console.log('Exercise preview data:', this.exercise);
    }
  }

  get parsedContent(): any {
    if (!this.exercise?.jsonData) {
      return null;
    }

    try {
      const parsed = JSON.parse(this.exercise.jsonData);
      return parsed;
    } catch (e) {
      console.error('Error parsing exercise JSON:', e);
      return { error: 'Invalid JSON' };
    }
  }

  get hasValidData(): boolean {
    return !!(this.activityTypeId > 0 && this.parsedContent && !this.parsedContent.error);
  }

  handleClose(): void {
    this.onClose.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    // Close if clicking the backdrop (not the content)
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.handleClose();
    }
  }
}
