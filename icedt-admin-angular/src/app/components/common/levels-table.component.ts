import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LevelApiService, LevelResponse, LevelCreateDto } from '../../services/level-api.service';
import { LanguageApiService, LanguageResponse } from '../../services/language-api.service';
import { MultilingualFormComponent, MultilingualFormData } from '../common/multilingual-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-levels-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MultilingualFormComponent,
    RouterLink
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Levels Management</mat-card-title>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add Level
        </button>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="!isLoading" class="table-container">
          <table mat-table [dataSource]="levels" class="levels-table">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let level">{{ level.id }}</td>
            </ng-container>

            <!-- English Name Column -->
            <ng-container matColumnDef="name_en">
              <th mat-header-cell *matHeaderCellDef>English Name</th>
              <td mat-cell *matCellDef="let level">{{ level.name_en }}</td>
            </ng-container>

            <!-- Tamil Name Column -->
            <ng-container matColumnDef="name_ta">
              <th mat-header-cell *matHeaderCellDef>தமிழ் Name</th>
              <td mat-cell *matCellDef="let level">{{ level.name_ta }}</td>
            </ng-container>

            <!-- Sinhala Name Column -->
            <ng-container matColumnDef="name_si">
              <th mat-header-cell *matHeaderCellDef>සිංහල Name</th>
              <td mat-cell *matCellDef="let level">{{ level.name_si }}</td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let level">
                <button mat-button color="primary" [routerLink]="['/lessons']" [queryParams]="{ levelId: level.id }">
                  MANAGE LESSONS
                </button>
                <button mat-icon-button (click)="openEditDialog(level)" color="primary">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteLevel(level)" color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- Add/Edit Dialog -->
    <div *ngIf="showDialog" class="dialog-overlay" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <app-multilingual-form
          [title]="dialogTitle"
          [fieldLabel]="'Level Name'"
          [showDescription]="false"
          [showActions]="false"
          [initialData]="dialogMode === 'edit' && currentLevel ? {
            name_en: currentLevel.name_en,
            name_ta: currentLevel.name_ta,
            name_si: currentLevel.name_si
          } : {}"
          (dataChange)="onFormDataChange($event)">
        </app-multilingual-form>
        
        <div class="dialog-actions">
          <div class="action-buttons">
            <button mat-button (click)="closeDialog()">Cancel</button>
            <button mat-raised-button 
                    color="primary" 
                    (click)="onSave()"
                    [disabled]="!isFormValid()">
              {{ dialogMode === 'add' ? 'Add Level' : 'Update Level' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 32px;
    }

    .table-container {
      overflow-x: auto;
    }

    .levels-table {
      width: 100%;
    }

    mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .mat-mdc-cell, .mat-mdc-header-cell {
      padding: 8px 16px;
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
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .dialog-actions {
      padding: 20px;
      border-top: 1px solid #e0e0e0;
    }

    .language-selector {
      width: 100%;
      margin-bottom: 16px;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  `]
})
export class LevelsTableComponent implements OnInit, OnDestroy {
  levels: LevelResponse[] = [];
  isLoading = false;
  showDialog = false;
  dialogMode: 'add' | 'edit' = 'add';
  currentLevel: LevelResponse | null = null;
  selectedLanguageId: number = 1; // Default language (hidden from UI)
  currentFormData: MultilingualFormData = {
    name_en: '',
    name_ta: '',
    name_si: ''
  };
  
  displayedColumns: string[] = ['id', 'name_en', 'name_ta', 'name_si', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private levelApiService: LevelApiService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get dialogTitle(): string {
    return this.dialogMode === 'add' ? 'Add Level' : 'Edit Level';
  }

  loadData(): void {
    this.isLoading = true;
    this.levelApiService.getAll().toPromise()
      .then(levels => {
        this.levels = levels || [];
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      });
  }

  openAddDialog(): void {
    this.dialogMode = 'add';
    this.currentLevel = null;
    this.currentFormData = {
      name_en: '',
      name_ta: '',
      name_si: ''
    };
    this.showDialog = true;
  }

  openEditDialog(level: LevelResponse): void {
    this.dialogMode = 'edit';
    this.currentLevel = level;
    // Keep existing languageId internally but do not expose selector
    this.selectedLanguageId = level.languageId ?? 1;
    this.currentFormData = {
      name_en: level.name_en,
      name_ta: level.name_ta,
      name_si: level.name_si
    };
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.currentLevel = null;
  }

  onFormDataChange(formData: MultilingualFormData): void {
    this.currentFormData = formData;
  }

  isFormValid(): boolean {
    return !!(this.currentFormData.name_en || this.currentFormData.name_ta || this.currentFormData.name_si);
  }

  onSave(): void {
    if (!this.isFormValid()) {
      return;
    }

    const createDto: LevelCreateDto = {
      name_en: this.currentFormData.name_en,
      name_ta: this.currentFormData.name_ta,
      name_si: this.currentFormData.name_si,
      languageId: this.selectedLanguageId
    };

    if (this.dialogMode === 'add') {
      this.levelApiService.create(createDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.closeDialog();
            this.loadData();
          },
          error: (error) => {
            console.error('Error creating level:', error);
          }
        });
    } else if (this.dialogMode === 'edit' && this.currentLevel) {
      this.levelApiService.update(this.currentLevel.id, createDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.closeDialog();
            this.loadData();
          },
          error: (error) => {
            console.error('Error updating level:', error);
          }
        });
    }
  }

  deleteLevel(level: LevelResponse): void {
    if (confirm(`Are you sure you want to delete "${level.name_en}"?`)) {
      this.levelApiService.deleteItem(level.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting level:', error);
          }
        });
    }
  }
}
