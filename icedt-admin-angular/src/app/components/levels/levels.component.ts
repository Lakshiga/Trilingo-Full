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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LevelApiService, LevelCreateDto, MultilingualLevel } from '../../services/level-api.service';
import { Level } from '../../types/level.types';
import { MultilingualText } from '../../types/multilingual.types';
import { LanguageService } from '../../services/language.service';
import { MultilingualInputComponent } from '../common/multilingual-input.component';

@Component({
  selector: 'app-levels',
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
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MultilingualInputComponent
  ],
  template: `
    <div class="levels-container">
      <div class="header">
        <h2>Manage Levels</h2>
        <button mat-raised-button color="primary" (click)="openAddLevelDialog()" [disabled]="isLoading">
          + ADD NEW LEVEL
        </button>
      </div>

      <div class="content">
        <div class="loading-container" *ngIf="isLoading">
          <mat-spinner></mat-spinner>
          <p>Loading levels...</p>
        </div>
        
        <div class="error-message" *ngIf="error">
          <p>{{ error }}</p>
          <button mat-button color="primary" (click)="loadLevels()">Retry</button>
        </div>
        
        <div class="table-container" *ngIf="!isLoading && !error">
          <table mat-table [dataSource]="levels" class="levels-table">
            <ng-container matColumnDef="levelId">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let level">{{ level.levelId }}</td>
            </ng-container>

            <ng-container matColumnDef="levelName">
              <th mat-header-cell *matHeaderCellDef>Level Name</th>
              <td mat-cell *matCellDef="let level">{{ getDisplayText(level.levelName) }}</td>
            </ng-container>

            <ng-container matColumnDef="slug">
              <th mat-header-cell *matHeaderCellDef>Slug (for URLs)</th>
              <td mat-cell *matCellDef="let level">{{ level.slug }}</td>
            </ng-container>

            <ng-container matColumnDef="sequenceOrder">
              <th mat-header-cell *matHeaderCellDef>Sequence Order</th>
              <td mat-cell *matCellDef="let level">{{ level.sequenceOrder }}</td>
            </ng-container>

            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let level">
                <span class="no-image" *ngIf="!level.imageUrl">No Image</span>
                <img *ngIf="level.imageUrl" [src]="level.imageUrl" alt="Level image" class="level-image">
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let level">
                <button mat-button color="primary" (click)="manageLessons(level)" [disabled]="isLoading">
                  MANAGE LESSONS
                </button>
                <button mat-icon-button color="primary" (click)="editLevel(level)" [disabled]="isLoading">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteLevel(level)" [disabled]="isLoading">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          
          <div class="no-data" *ngIf="levels.length === 0">
            <p>No levels found. Create your first level!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Level Dialog -->
    <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ isEditing ? 'Edit Level' : 'Add New Level' }}</h3>
          <button mat-icon-button (click)="closeDialog()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <form class="level-form" (ngSubmit)="saveLevel()">
          <app-multilingual-input
            [value]="currentLevel.levelName"
            [label]="'Level Name'"
            [required]="true"
            (valueChange)="onLevelNameChange($event)">
          </app-multilingual-input>

          <app-multilingual-input
            [value]="currentLevel.description || { ta: '', en: '', si: '' }"
            [label]="'Description'"
            [required]="false"
            (valueChange)="onDescriptionChange($event)">
          </app-multilingual-input>

          <mat-form-field appearance="outline">
            <mat-label>Sequence Order</mat-label>
            <input matInput type="number" [(ngModel)]="currentLevel.sequenceOrder" name="sequenceOrder" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Slug</mat-label>
            <input matInput [(ngModel)]="currentLevel.slug" name="slug" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Barcode</mat-label>
            <input matInput [(ngModel)]="currentLevel.barcode" name="barcode" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Cover Image URL</mat-label>
            <input matInput [(ngModel)]="currentLevel.coverImageUrl" name="coverImageUrl">
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="closeDialog()" [disabled]="isSaving">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">
              <mat-spinner *ngIf="isSaving" diameter="20"></mat-spinner>
              {{ isEditing ? 'Update' : 'Add' }} Level
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .levels-container {
      padding: 0;
      background: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 20px 20px 0 20px;
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

    .levels-table {
      width: 100%;
      border-collapse: collapse;
    }

    .levels-table th,
    .levels-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .levels-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }

    .levels-table tr:hover {
      background-color: #f9f9f9;
    }

    .no-image {
      color: #666;
      font-style: italic;
    }

    .level-image {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
    }

    .stage-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .stage-letters {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .stage-words {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .stage-sentences {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .status-badge.inactive {
      background-color: #ffebee;
      color: #d32f2f;
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

    .level-form {
      padding: 20px;
    }

    .level-form mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
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
  `]
})
export class LevelsComponent implements OnInit {
  levels: MultilingualLevel[] = [];
  displayedColumns: string[] = ['levelId', 'levelName', 'slug', 'sequenceOrder', 'image', 'actions'];
  showDialog = false;
  isEditing = false;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  
  currentLevel: LevelCreateDto = {
    levelName: { ta: '', en: '', si: '' },
    description: { ta: '', en: '', si: '' },
    sequenceOrder: 1,
    slug: '',
    barcode: '',
    coverImageUrl: ''
  };

  constructor(
    private levelApiService: LevelApiService,
    private snackBar: MatSnackBar,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.loadLevels();
  }

  async loadLevels() {
    this.isLoading = true;
    this.error = null;
    
    try {
      this.levels = await this.levelApiService.getAll().toPromise() || [];
    } catch (err) {
      console.error('Error loading levels:', err);
      this.error = err instanceof Error ? err.message : 'Failed to load levels';
      this.snackBar.open(this.error, 'Close', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  getDisplayText(content: MultilingualText | undefined): string {
    if (!content) return '';
    return this.languageService.getText(content);
  }

  onLevelNameChange(value: MultilingualText) {
    this.currentLevel.levelName = value;
  }

  onDescriptionChange(value: MultilingualText) {
    this.currentLevel.description = value;
  }

  openAddLevelDialog() {
    this.isEditing = false;
    this.currentLevel = {
      levelName: { ta: '', en: '', si: '' },
      description: { ta: '', en: '', si: '' },
      sequenceOrder: this.levels.length + 1,
      slug: '',
      barcode: '',
      coverImageUrl: ''
    };
    this.showDialog = true;
  }

  editLevel(level: MultilingualLevel) {
    this.isEditing = true;
    this.currentLevel = {
      levelName: level.levelName,
      description: level.description || { ta: '', en: '', si: '' },
      sequenceOrder: level.sequenceOrder,
      slug: level.slug,
      barcode: level.barcode,
      coverImageUrl: level.imageUrl || ''
    };
    this.showDialog = true;
  }

  async deleteLevel(level: MultilingualLevel) {
    const levelName = this.getDisplayText(level.levelName);
    if (confirm(`Are you sure you want to delete "${levelName}"?`)) {
      try {
        await this.levelApiService.deleteItem(level.levelId).toPromise();
        this.levels = this.levels.filter(l => l.levelId !== level.levelId);
        this.snackBar.open('Level deleted successfully', 'Close', { duration: 3000 });
      } catch (err) {
        console.error('Error deleting level:', err);
        this.snackBar.open(
          err instanceof Error ? err.message : 'Failed to delete level',
          'Close',
          { duration: 5000 }
        );
      }
    }
  }

  async saveLevel() {
    if (!this.currentLevel.levelName || !this.currentLevel.slug || !this.currentLevel.barcode) {
      this.snackBar.open('Level name, slug, and barcode are required', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    
    try {
      if (this.isEditing) {
        // Find the level to update
        const levelToUpdate = this.levels.find(l => l.slug === this.currentLevel.slug);
        if (levelToUpdate) {
          await this.levelApiService.update(levelToUpdate.levelId, this.currentLevel).toPromise();
          // Update local array
          const index = this.levels.findIndex(l => l.levelId === levelToUpdate.levelId);
          if (index !== -1) {
            this.levels[index] = { ...this.levels[index], ...this.currentLevel };
          }
        }
        this.snackBar.open('Level updated successfully', 'Close', { duration: 3000 });
      } else {
        const newLevel = await this.levelApiService.create(this.currentLevel).toPromise();
        if (newLevel) {
          this.levels.push(newLevel);
          this.snackBar.open('Level created successfully', 'Close', { duration: 3000 });
        }
      }
      this.closeDialog();
    } catch (err) {
      console.error('Error saving level:', err);
      this.snackBar.open(
        err instanceof Error ? err.message : 'Failed to save level',
        'Close',
        { duration: 5000 }
      );
    } finally {
      this.isSaving = false;
    }
  }

  manageLessons(level: MultilingualLevel) {
    // Navigate to lessons page with levelId parameter
    window.location.href = `/lessons?levelId=${level.levelId}`;
  }

  closeDialog() {
    this.showDialog = false;
    this.isEditing = false;
    this.currentLevel = {
      levelName: { ta: '', en: '', si: '' },
      description: { ta: '', en: '', si: '' },
      sequenceOrder: 1,
      slug: '',
      barcode: '',
      coverImageUrl: ''
    };
  }
}
