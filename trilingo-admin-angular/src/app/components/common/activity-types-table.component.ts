import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ActivityTypeApiService, ActivityTypeResponse, ActivityTypeCreateDto } from '../../services/activity-type-api.service';
import { MultilingualFormComponent, MultilingualFormData } from '../common/multilingual-form.component';

@Component({
  selector: 'app-activity-types-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MultilingualFormComponent
  ],
  template: `
    <mat-card class="rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <mat-card-header class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <mat-card-title class="text-2xl font-bold text-gray-800">Activity Types Management</mat-card-title>
        <div class="spacer"></div>
        <button mat-raised-button 
                class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add Activity Type
        </button>
      </mat-card-header>
      
      <mat-card-content class="p-0">
        <div *ngIf="isLoading" class="loading-container flex justify-center items-center p-12">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="!isLoading" class="table-container overflow-x-auto">
          <table mat-table [dataSource]="activityTypes" class="activity-types-table min-w-full">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <td mat-cell *matCellDef="let type" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ type.id }}</td>
            </ng-container>

            <!-- English Name Column -->
            <ng-container matColumnDef="name_en">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English Name</th>
              <td mat-cell *matCellDef="let type" class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ type.name_en }}</td>
            </ng-container>

            <!-- Tamil Name Column -->
            <ng-container matColumnDef="name_ta">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">தமிழ் Name</th>
              <td mat-cell *matCellDef="let type" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ type.name_ta }}</td>
            </ng-container>

            <!-- Sinhala Name Column -->
            <ng-container matColumnDef="name_si">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">සිංහල Name</th>
              <td mat-cell *matCellDef="let type" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ type.name_si }}</td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <td mat-cell *matCellDef="let type" class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button mat-icon-button 
                          (click)="openEditDialog(type)" 
                          color="primary"
                          class="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button 
                          (click)="deleteActivityType(type)" 
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
          [fieldLabel]="'Activity Type Name'"
          [showDescription]="false"
          [showActions]="true"
          [saveButtonText]="dialogMode === 'add' ? 'Add Activity Type' : 'Update Activity Type'"
          [initialData]="dialogMode === 'edit' && currentActivityType ? {
            name_en: currentActivityType.name_en,
            name_ta: currentActivityType.name_ta,
            name_si: currentActivityType.name_si
          } : {}"
          (save)="onSave($event)"
          (cancel)="closeDialog()">
        </app-multilingual-form>
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

    .activity-types-table {
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
  `]
})
export class ActivityTypesTableComponent implements OnInit, OnDestroy {
  activityTypes: ActivityTypeResponse[] = [];
  isLoading = false;
  showDialog = false;
  dialogMode: 'add' | 'edit' = 'add';
  currentActivityType: ActivityTypeResponse | null = null;
  
  displayedColumns: string[] = ['id', 'name_en', 'name_ta', 'name_si', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(private apiService: ActivityTypeApiService) {}

  ngOnInit(): void {
    this.loadActivityTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get dialogTitle(): string {
    return this.dialogMode === 'add' ? 'Add Activity Type' : 'Edit Activity Type';
  }

  loadActivityTypes(): void {
    this.isLoading = true;
    this.apiService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.activityTypes = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading activity types:', error);
          this.isLoading = false;
        }
      });
  }

  openAddDialog(): void {
    this.dialogMode = 'add';
    this.currentActivityType = null;
    this.showDialog = true;
  }

  openEditDialog(type: ActivityTypeResponse): void {
    this.dialogMode = 'edit';
    this.currentActivityType = type;
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.currentActivityType = null;
  }

  onSave(formData: MultilingualFormData): void {
    const createDto: ActivityTypeCreateDto = {
      name_en: formData.name_en,
      name_ta: formData.name_ta,
      name_si: formData.name_si
    };

    if (this.dialogMode === 'add') {
      this.apiService.create(createDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.closeDialog();
            this.loadActivityTypes();
          },
          error: (error) => {
            console.error('Error creating activity type:', error);
          }
        });
    } else if (this.dialogMode === 'edit' && this.currentActivityType) {
      this.apiService.update(this.currentActivityType.id, createDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.closeDialog();
            this.loadActivityTypes();
          },
          error: (error) => {
            console.error('Error updating activity type:', error);
          }
        });
    }
  }

  deleteActivityType(type: ActivityTypeResponse): void {
    if (confirm(`Are you sure you want to delete "${type.name_en}"?`)) {
      this.apiService.deleteItem(type.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadActivityTypes();
          },
          error: (error) => {
            console.error('Error deleting activity type:', error);
          }
        });
    }
  }
}