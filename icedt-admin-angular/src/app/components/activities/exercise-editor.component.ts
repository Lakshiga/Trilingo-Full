import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// MatTypographyModule is not available in Angular Material v19
import { MatCardModule } from '@angular/material/card';
import { Activity } from '../../types/activity.types';

@Component({
  selector: 'app-exercise-editor',
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
  template: `
    <mat-card class="exercise-editor">
      <mat-card-header>
        <mat-card-title>Exercises</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <mat-accordion multi="false">
          <mat-expansion-panel 
            *ngFor="let exercise of exercises; let i = index"
            [expanded]="expandedExercise === i"
            (opened)="onExpansionChange(i, true)"
            (closed)="onExpansionChange(i, false)">
            
            <mat-expansion-panel-header>
              <mat-panel-title>
                <div class="panel-header">
                  <span class="exercise-title">Exercise #{{ i + 1 }}</span>
                  <div class="panel-actions">
                    <button 
                      mat-button 
                      color="primary" 
                      (click)="onPreviewExercise(exercise, $event)"
                      [disabled]="!!jsonErrors[i]"
                      class="preview-button">
                      <mat-icon>preview</mat-icon>
                      Preview
                    </button>
                    <button 
                      mat-icon-button 
                      color="warn" 
                      (click)="removeExercise(i, $event)"
                      [disabled]="exercises.length <= 1"
                      class="delete-button">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-panel-title>
            </mat-expansion-panel-header>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Exercise JSON</mat-label>
              <textarea 
                matInput 
                [ngModel]="exercise"
                (ngModelChange)="handleExerciseChange(i, $event)"
                rows="15"
                [class.error]="!!jsonErrors[i]"
                placeholder="Enter exercise JSON content...">
              </textarea>
              <mat-error *ngIf="jsonErrors[i]">{{ jsonErrors[i] }}</mat-error>
            </mat-form-field>
          </mat-expansion-panel>
        </mat-accordion>
        
        <button 
          mat-stroked-button 
          (click)="addExercise()" 
          class="add-exercise-button">
          <mat-icon>add_circle_outline</mat-icon>
          Add Another Exercise
        </button>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .exercise-editor {
      margin: 16px 0;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .exercise-title {
      font-weight: bold;
    }

    .panel-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .preview-button {
      margin-right: 8px;
    }

    .full-width {
      width: 100%;
    }

    .add-exercise-button {
      width: 100%;
      margin-top: 16px;
    }

    textarea.error {
      border-color: #f44336;
    }

    mat-expansion-panel {
      margin-bottom: 8px;
    }
  `]
})
export class ExerciseEditorComponent implements OnInit, OnChanges {
  @Input() activityData: Partial<Activity> = {};
  @Input() expandedExercise: number | false = false;
  @Output() dataChange = new EventEmitter<Partial<Activity>>();
  @Output() previewExercise = new EventEmitter<string>();
  @Output() expansionChange = new EventEmitter<{ index: number; isExpanded: boolean }>();
  @Output() setExpanded = new EventEmitter<number>();

  exercises: string[] = ['{}'];
  jsonErrors: string[] = [''];

  ngOnInit(): void {
    this.parseExercises();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityData']) {
      this.parseExercises();
    }
  }

  private parseExercises(): void {
    try {
      const parsed = JSON.parse(this.activityData.contentJson || '[]');
      const exerciseArray = Array.isArray(parsed) ? parsed : [parsed];
      const stringifiedExercises = exerciseArray.map(ex => JSON.stringify(ex, null, 2));
      this.exercises = stringifiedExercises;
      this.jsonErrors = new Array(stringifiedExercises.length).fill('');
    } catch {
      this.exercises = ['{}'];
      this.jsonErrors = [''];
    }
  }

  private triggerParentUpdate(updatedExercises: string[]): void {
    try {
      const parsedObjects = updatedExercises.map(exStr => JSON.parse(exStr));
      const combinedJsonString = JSON.stringify(parsedObjects, null, 2);
      this.dataChange.emit({ ...this.activityData, contentJson: combinedJsonString });
    } catch {
      // If there's an error, we still pass the raw string up so the user can see the error
      const rawCombined = `[${updatedExercises.join(',')}]`;
      this.dataChange.emit({ ...this.activityData, contentJson: rawCombined });
    }
  }

  handleExerciseChange(index: number, value: string): void {
    this.exercises[index] = value;

    try {
      JSON.parse(value);
      this.jsonErrors[index] = '';
    } catch {
      this.jsonErrors[index] = 'Invalid JSON';
    }

    this.triggerParentUpdate(this.exercises);
  }

  addExercise(): void {
    this.exercises.push('{}');
    this.jsonErrors.push('');
    this.triggerParentUpdate(this.exercises);
    this.setExpanded.emit(this.exercises.length - 1);
  }

  removeExercise(index: number, event: Event): void {
    event.stopPropagation();
    
    if (this.exercises.length <= 1) {
      alert("An activity must have at least one exercise.");
      return;
    }

    this.exercises.splice(index, 1);
    this.jsonErrors.splice(index, 1);
    this.triggerParentUpdate(this.exercises);
  }

  onPreviewExercise(exerciseJson: string, event: Event): void {
    event.stopPropagation();
    this.previewExercise.emit(exerciseJson);
  }

  onExpansionChange(index: number, isExpanded: boolean): void {
    this.expansionChange.emit({ index, isExpanded });
  }
}
