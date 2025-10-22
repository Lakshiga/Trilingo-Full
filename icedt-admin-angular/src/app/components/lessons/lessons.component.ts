import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { LessonApiService, LessonCreateDto, MultilingualLesson } from '../../services/lesson-api.service';
import { MultilingualText } from '../../types/multilingual.types';
import { LanguageService } from '../../services/language.service';
import { MultilingualInputComponent } from '../common/multilingual-input.component';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MultilingualInputComponent
  ],
  template: `
    <div class="lessons-container">
      <div class="header">
        <div class="breadcrumb">
          <a href="#" (click)="goBack()">← BACK TO LEVEL #{{ levelId }}</a>
        </div>
        <h2>Manage Lessons for: "Level #{{ levelId }}"</h2>
        <button mat-raised-button color="primary" (click)="openAddLessonDialog()" [disabled]="isLoading">
          + ADD NEW LESSON
        </button>
      </div>

      <div class="content">
        <div class="loading-container" *ngIf="isLoading">
          <mat-spinner></mat-spinner>
          <p>Loading lessons...</p>
        </div>
        
        <div class="error-message" *ngIf="error">
          <p>{{ error }}</p>
          <button mat-button color="primary" (click)="loadLessons()">Retry</button>
        </div>
        
        <div class="table-container" *ngIf="!isLoading && !error">
          <table mat-table [dataSource]="lessons" class="lessons-table">
            <ng-container matColumnDef="lessonId">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let lesson">{{ lesson.lessonId }}</td>
            </ng-container>

            <ng-container matColumnDef="lessonName">
              <th mat-header-cell *matHeaderCellDef>Lesson Name</th>
              <td mat-cell *matCellDef="let lesson">{{ getDisplayText(lesson.lessonName) }}</td>
            </ng-container>

            <ng-container matColumnDef="slug">
              <th mat-header-cell *matHeaderCellDef>Slug</th>
              <td mat-cell *matCellDef="let lesson">{{ lesson.slug }}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let lesson">{{ getDisplayText(lesson.description) || 'No description' }}</td>
            </ng-container>

            <ng-container matColumnDef="sequenceOrder">
              <th mat-header-cell *matHeaderCellDef>Sequence Order</th>
              <td mat-cell *matCellDef="let lesson">{{ lesson.sequenceOrder }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let lesson">
                <button mat-button color="primary" (click)="manageActivities(lesson)" [disabled]="isLoading">
                  MANAGE ACTIVITIES
                </button>
                <button mat-icon-button color="primary" (click)="editLesson(lesson)" [disabled]="isLoading">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteLesson(lesson)" [disabled]="isLoading">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          
          <div class="no-data" *ngIf="lessons.length === 0">
            <p>No lessons found. Create your first lesson!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Lesson Dialog -->
    <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ isEditing ? 'Edit Lesson' : 'Add New Lesson' }}</h3>
          <button mat-icon-button (click)="closeDialog()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <form class="lesson-form" (ngSubmit)="saveLesson()">
          <app-multilingual-input
            [value]="currentLesson.lessonName"
            [label]="'Lesson Name'"
            [required]="true"
            (valueChange)="onLessonNameChange($event)">
          </app-multilingual-input>

          <app-multilingual-input
            [value]="currentLesson.description || { ta: '', en: '', si: '' }"
            [label]="'Description'"
            [required]="false"
            (valueChange)="onDescriptionChange($event)">
          </app-multilingual-input>

          <mat-form-field appearance="outline">
            <mat-label>Sequence Order</mat-label>
            <input matInput type="number" [(ngModel)]="currentLesson.sequenceOrder" name="sequenceOrder" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Slug</mat-label>
            <input matInput [(ngModel)]="currentLesson.slug" name="slug" required>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="closeDialog()" [disabled]="isSaving">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">
              <mat-spinner *ngIf="isSaving" diameter="20"></mat-spinner>
              {{ isEditing ? 'Update' : 'Add' }} Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .lessons-container {
      padding: 0;
      background: white;
    }

    .header {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
      padding: 20px 20px 0 20px;
    }

    .breadcrumb {
      margin-bottom: 10px;
    }

    .breadcrumb a {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .header h2 {
      margin: 0;
      color: #333;
      font-size: 24px;
      font-weight: bold;
    }

    .content {
      padding: 0 20px 20px 20px;
    }

    .table-container {
      overflow-x: auto;
    }

    .lessons-table {
      width: 100%;
      border-collapse: collapse;
    }

    .lessons-table th,
    .lessons-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .lessons-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }

    .lessons-table tr:hover {
      background-color: #f9f9f9;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    .loading-container mat-spinner {
      margin-bottom: 16px;
    }

    .error-message {
      text-align: center;
      padding: 20px;
      color: #d32f2f;
    }

    .error-message button {
      margin-top: 12px;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      border-radius: 8px;
      padding: 0;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-header h3 {
      margin: 0;
      color: #333;
    }

    .lesson-form {
      padding: 20px;
    }

    .lesson-form mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }
  `]
})
export class LessonsComponent implements OnInit {
  lessons: MultilingualLesson[] = [];
  displayedColumns: string[] = ['lessonId', 'lessonName', 'slug', 'description', 'sequenceOrder', 'actions'];
  showDialog = false;
  isEditing = false;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  levelId: number = 1;
  
  currentLesson: LessonCreateDto = {
    lessonName: { ta: '', en: '', si: '' },
    description: { ta: '', en: '', si: '' },
    sequenceOrder: 1,
    slug: '',
    levelId: 1
  };

  constructor(
    private lessonApiService: LessonApiService,
    private snackBar: MatSnackBar,
    private languageService: LanguageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.levelId = params['levelId'] ? parseInt(params['levelId']) : 1;
      this.currentLesson.levelId = this.levelId;
      this.loadLessons();
    });
  }

  async loadLessons() {
    this.isLoading = true;
    this.error = null;
    
    try {
      this.lessons = await this.lessonApiService.getLessonsByLevelId(this.levelId).toPromise() || [];
    } catch (err) {
      console.error('Error loading lessons:', err);
      this.error = err instanceof Error ? err.message : 'Failed to load lessons';
      this.snackBar.open(this.error, 'Close', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  getDisplayText(content: MultilingualText | undefined): string {
    if (!content) return '';
    return this.languageService.getText(content);
  }

  onLessonNameChange(value: MultilingualText) {
    this.currentLesson.lessonName = value;
  }

  onDescriptionChange(value: MultilingualText) {
    this.currentLesson.description = value;
  }

  goBack() {
    this.router.navigate(['/levels']);
  }

  manageActivities(lesson: MultilingualLesson) {
    // Navigate to activities page with lessonId parameter
    window.location.href = `/activities?lessonId=${lesson.lessonId}`;
  }

  openAddLessonDialog() {
    this.isEditing = false;
    this.currentLesson = {
      lessonName: { ta: '', en: '', si: '' },
      description: { ta: '', en: '', si: '' },
      sequenceOrder: this.lessons.length + 1,
      slug: '',
      levelId: this.levelId
    };
    this.showDialog = true;
  }

  editLesson(lesson: MultilingualLesson) {
    this.isEditing = true;
    this.currentLesson = {
      lessonName: lesson.lessonName,
      description: lesson.description || { ta: '', en: '', si: '' },
      sequenceOrder: lesson.sequenceOrder,
      slug: lesson.slug,
      levelId: lesson.levelId
    };
    this.showDialog = true;
  }

  async deleteLesson(lesson: MultilingualLesson) {
    const lessonName = this.getDisplayText(lesson.lessonName);
    if (confirm(`Are you sure you want to delete "${lessonName}"?`)) {
      try {
        await this.lessonApiService.deleteItem(lesson.lessonId).toPromise();
        this.lessons = this.lessons.filter(l => l.lessonId !== lesson.lessonId);
        this.snackBar.open('Lesson deleted successfully', 'Close', { duration: 3000 });
      } catch (err) {
        console.error('Error deleting lesson:', err);
        this.snackBar.open(
          err instanceof Error ? err.message : 'Failed to delete lesson',
          'Close',
          { duration: 5000 }
        );
      }
    }
  }

  async saveLesson() {
    if (!this.currentLesson.lessonName || !this.currentLesson.slug) {
      this.snackBar.open('Lesson name and slug are required', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    
    try {
      if (this.isEditing) {
        // Find the lesson to update
        const lessonToUpdate = this.lessons.find(l => l.slug === this.currentLesson.slug);
        if (lessonToUpdate) {
          await this.lessonApiService.update(lessonToUpdate.lessonId, this.currentLesson).toPromise();
          // Update local array
          const index = this.lessons.findIndex(l => l.lessonId === lessonToUpdate.lessonId);
          if (index !== -1) {
            this.lessons[index] = { ...this.lessons[index], ...this.currentLesson };
          }
        }
        this.snackBar.open('Lesson updated successfully', 'Close', { duration: 3000 });
      } else {
        const newLesson = await this.lessonApiService.create(this.currentLesson).toPromise();
        if (newLesson) {
          this.lessons.push(newLesson);
          this.snackBar.open('Lesson created successfully', 'Close', { duration: 3000 });
        }
      }
      this.closeDialog();
    } catch (err) {
      console.error('Error saving lesson:', err);
      this.snackBar.open(
        err instanceof Error ? err.message : 'Failed to save lesson',
        'Close',
        { duration: 5000 }
      );
    } finally {
      this.isSaving = false;
    }
  }

  closeDialog() {
    this.showDialog = false;
    this.isEditing = false;
    this.currentLesson = {
      lessonName: { ta: '', en: '', si: '' },
      description: { ta: '', en: '', si: '' },
      sequenceOrder: 1,
      slug: '',
      levelId: this.levelId
    };
  }
}