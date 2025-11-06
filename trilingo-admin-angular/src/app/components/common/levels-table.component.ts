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
    <mat-card class="rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <mat-card-header class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <mat-card-title class="text-2xl font-bold text-gray-800">Levels Management</mat-card-title>
        <div class="spacer"></div>
        <button mat-raised-button 
                class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add Level
        </button>
      </mat-card-header>
      
      <mat-card-content class="p-0">
        <div *ngIf="isLoading" class="loading-container flex justify-center items-center p-12">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="!isLoading" class="table-container overflow-x-auto">
          <table mat-table [dataSource]="levels" class="levels-table min-w-full">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <td mat-cell *matCellDef="let level" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ level.id }}</td>
            </ng-container>

            <!-- English Name Column -->
            <ng-container matColumnDef="name_en">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English Name</th>
              <td mat-cell *matCellDef="let level" class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ level.name_en }}</td>
            </ng-container>

            <!-- Tamil Name Column -->
            <ng-container matColumnDef="name_ta">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">தமிழ் Name</th>
              <td mat-cell *matCellDef="let level" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ level.name_ta }}</td>
            </ng-container>

            <!-- Sinhala Name Column -->
            <ng-container matColumnDef="name_si">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">සිංහල Name</th>
              <td mat-cell *matCellDef="let level" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ level.name_si }}</td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <td mat-cell *matCellDef="let level" class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button mat-button 
                          color="primary" 
                          [routerLink]="['/lessons']" 
                          [queryParams]="{ levelId: level.id }"
                          class="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-full px-4 py-2 transition-colors duration-200">
                    MANAGE LESSONS
                  </button>
                  <button mat-icon-button 
                          (click)="openEditDialog(level)" 
                          color="primary"
                          class="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button 
                          (click)="deleteLevel(level)" 
                          color="warn"
                          class="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-gray-50"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="bg-white hover:bg-gray-50 transition-colors duration-150"></tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- Add/Edit Dialog -->
    <div *ngIf="showDialog" class="dialog-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="closeDialog()">
      <div class="dialog-content bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
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
        
        <div class="dialog-actions p-6 border-t border-gray-200">
          <div class="action-buttons flex justify-end space-x-3">
            <button mat-button 
                    class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    (click)="closeDialog()">Cancel</button>
            <button mat-raised-button 
                    color="primary" 
                    class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
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