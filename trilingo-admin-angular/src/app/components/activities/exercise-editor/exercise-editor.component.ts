import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Exercise } from '../../../services/exercise-api.service';

@Component({
  selector: 'app-exercise-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './exercise-editor.component.html',
  styleUrls: ['./exercise-editor.component.css']
})
export class ExerciseEditorComponent {
  @Input() exercises: Exercise[] = [];
  @Input() activityId: string | null = null;
  @Input() expandedExercise: number | false = false;
  @Output() addExercise = new EventEmitter<void>();
  @Output() updateExercise = new EventEmitter<{ exerciseId: number; jsonData: string }>();
  @Output() deleteExercise = new EventEmitter<number>();
  @Output() previewExercise = new EventEmitter<string>();
  @Output() expansionChange = new EventEmitter<{ index: number; isExpanded: boolean }>();

  editingExercises: Map<number, string> = new Map();
  jsonErrors: Map<number, string> = new Map();

  constructor(private snackBar: MatSnackBar) {}

  getExerciseJson(exercise: Exercise): string {
    const exerciseId = exercise.id;
    // If currently editing, return the editing version
    if (this.editingExercises.has(exerciseId)) {
      return this.editingExercises.get(exerciseId)!;
    }
    // Otherwise return the saved version formatted
    try {
      const parsed = JSON.parse(exercise.jsonData);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return exercise.jsonData;
    }
  }

  hasJsonError(exercise: Exercise): boolean {
    return this.jsonErrors.has(exercise.id);
  }

  getJsonError(exercise: Exercise): string {
    return this.jsonErrors.get(exercise.id) || '';
  }

  handleExerciseChange(exercise: Exercise, value: string): void {
    const exerciseId = exercise.id;
    this.editingExercises.set(exerciseId, value);

    try {
      JSON.parse(value);
      this.jsonErrors.delete(exerciseId);
    } catch {
      this.jsonErrors.set(exerciseId, 'Invalid JSON');
    }
  }

  saveExercise(exercise: Exercise): void {
    const exerciseId = exercise.id;
    const editedJson = this.editingExercises.get(exerciseId);
    
    if (!editedJson) return;

    try {
      // Validate JSON
      JSON.parse(editedJson);
      this.jsonErrors.delete(exerciseId);
      
      // Emit update event
      this.updateExercise.emit({ exerciseId, jsonData: editedJson });
      
      // Clear editing state
      this.editingExercises.delete(exerciseId);
    } catch {
      this.jsonErrors.set(exerciseId, 'Invalid JSON');
      this.snackBar.open('Invalid JSON format', 'Close', { duration: 3000 });
    }
  }

  onAddExercise(): void {
    this.addExercise.emit();
  }

  onDeleteExercise(exercise: Exercise, event: Event): void {
    event.stopPropagation();
    this.deleteExercise.emit(exercise.id);
  }

  onPreviewExercise(exercise: Exercise, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    // Use editing version if available, otherwise use saved version
    const jsonToPreview = this.editingExercises.get(exercise.id) || exercise.jsonData;
    
    try {
      // Validate the JSON before emitting
      JSON.parse(jsonToPreview);
      this.previewExercise.emit(jsonToPreview);
    } catch (error) {
      console.error('Invalid JSON for preview:', error);
      this.snackBar.open('Cannot preview invalid JSON', 'Close', { duration: 2000 });
    }
  }

  async onCopyExercise(exercise: Exercise, event: Event): Promise<void> {
    event.stopPropagation();
    const jsonToCopy = this.editingExercises.get(exercise.id) || exercise.jsonData;
    
    try {
      await navigator.clipboard.writeText(jsonToCopy);
      this.snackBar.open('Exercise JSON copied to clipboard!', 'Close', { duration: 2500 });
    } catch {
      const ta = document.createElement('textarea');
      ta.value = jsonToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.snackBar.open('Exercise JSON copied to clipboard!', 'Close', { duration: 2500 });
    }
  }

  onExpansionChange(index: number, isExpanded: boolean): void {
    this.expansionChange.emit({ index, isExpanded });
  }
}