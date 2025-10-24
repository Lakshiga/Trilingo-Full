import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MainActivityApiService, MainActivityResponse, MainActivityCreateDto } from '../../services/main-activity-api.service';
import { MultilingualFormComponent, MultilingualFormData } from './multilingual-form.component';

@Component({
  selector: 'app-main-activities-table',
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
    <mat-card>
      <mat-card-header>
        <mat-card-title>Main Activities Management</mat-card-title>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add Main Activity
        </button>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="!isLoading" class="table-container">
          <table mat-table [dataSource]="activities" class="activities-table">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let activity">{{ activity.id }}</td>
            </ng-container>

            <!-- English Name Column -->
            <ng-container matColumnDef="name_en">
              <th mat-header-cell *matHeaderCellDef>English Name</th>
              <td mat-cell *matCellDef="let activity">{{ activity.name_en }}</td>
            </ng-container>

            <!-- Tamil Name Column -->
            <ng-container matColumnDef="name_ta">
              <th mat-header-cell *matHeaderCellDef>தமிழ் Name</th>
              <td mat-cell *matCellDef="let activity">{{ activity.name_ta }}</td>
            </ng-container>

            <!-- Sinhala Name Column -->
            <ng-container matColumnDef="name_si">
              <th mat-header-cell *matHeaderCellDef>සිංහල Name</th>
              <td mat-cell *matCellDef="let activity">{{ activity.name_si }}</td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let activity">
                <button mat-icon-button (click)="openEditDialog(activity)" color="primary">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteActivity(activity)" color="warn">
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
          [fieldLabel]="'Activity Name'"
          [showDescription]="false"
          [showActions]="true"
          [saveButtonText]="dialogMode === 'add' ? 'Add Main Activity' : 'Update Main Activity'"
          [initialData]="dialogMode === 'edit' && currentActivity ? {
            name_en: currentActivity.name_en,
            name_ta: currentActivity.name_ta,
            name_si: currentActivity.name_si
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

    .activities-table {
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
export class MainActivitiesTableComponent implements OnInit, OnDestroy {
  activities: MainActivityResponse[] = [];
  isLoading = false;
  showDialog = false;
  dialogMode: 'add' | 'edit' = 'add';
  currentActivity: MainActivityResponse | null = null;
  
  displayedColumns: string[] = ['id', 'name_en', 'name_ta', 'name_si', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(private apiService: MainActivityApiService) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get dialogTitle(): string {
    return this.dialogMode === 'add' ? 'Add Main Activity' : 'Edit Main Activity';
  }

  loadActivities(): void {
    this.isLoading = true;
    this.apiService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.activities = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading activities:', error);
          this.isLoading = false;
        }
      });
  }

  openAddDialog(): void {
    this.dialogMode = 'add';
    this.currentActivity = null;
    this.showDialog = true;
  }

  openEditDialog(activity: MainActivityResponse): void {
    this.dialogMode = 'edit';
    this.currentActivity = activity;
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.currentActivity = null;
  }

  onSave(formData: MultilingualFormData): void {
    const createDto: MainActivityCreateDto = {
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
            this.loadActivities();
          },
          error: (error) => {
            console.error('Error creating main activity:', error);
          }
        });
    } else if (this.dialogMode === 'edit' && this.currentActivity) {
      this.apiService.update(this.currentActivity.id, createDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.closeDialog();
            this.loadActivities();
          },
          error: (error) => {
            console.error('Error updating main activity:', error);
          }
        });
    }
  }

  deleteActivity(activity: MainActivityResponse): void {
    if (confirm(`Are you sure you want to delete "${activity.name_en}"?`)) {
      this.apiService.deleteItem(activity.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadActivities();
          },
          error: (error) => {
            console.error('Error deleting main activity:', error);
          }
        });
    }
  }
}
