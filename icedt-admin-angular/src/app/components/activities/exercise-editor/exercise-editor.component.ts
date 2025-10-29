import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Activity } from '../../../types/activity.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MultilingualActivityTemplates } from '../../../services/multilingual-activity-templates.service';

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
export class ExerciseEditorComponent implements OnInit, OnChanges {
  @Input() activityData: Partial<Activity> = {};
  @Input() expandedExercise: number | false = false;
  @Output() dataChange = new EventEmitter<Partial<Activity>>();
  @Output() previewExercise = new EventEmitter<string>();
  @Output() expansionChange = new EventEmitter<{ index: number; isExpanded: boolean }>();
  @Output() setExpanded = new EventEmitter<number>();

  exercises: string[] = ['{}'];
  jsonErrors: string[] = [''];

  constructor(private snackBar: MatSnackBar) {}

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
    const typeId = Number(this.activityData.activityTypeId || 0);
    if (typeId) {
      try {
        const templateString = MultilingualActivityTemplates.getTemplate(typeId);
        const parsed = JSON.parse(templateString);
        this.exercises.push(JSON.stringify(parsed, null, 2));
      } catch {
        this.exercises.push('{}');
      }
    } else {
      this.exercises.push('{}');
    }
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

  async onCopyExercise(exerciseJson: string, event: Event): Promise<void> {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(exerciseJson);
      this.snackBar.open('Exercise JSON copied to clipboard!', 'Close', { duration: 2500 });
    } catch {
      const ta = document.createElement('textarea');
      ta.value = exerciseJson;
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