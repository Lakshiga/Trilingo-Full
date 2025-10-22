import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivityTypeApiService, ActivityTypeCreateDto } from '../../services/activity-type-api.service';
import { ActivityType } from '../../types/activity-type.types';

@Component({
  selector: 'app-activity-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="activity-types-container">
      <div class="header">
        <h2>Manage Activity Types</h2>
        <button mat-raised-button color="primary" (click)="openAddActivityTypeDialog()" [disabled]="isLoading">
          + ADD NEW ACTIVITY TYPE
        </button>
      </div>

      <div class="content">
        <div class="loading-container" *ngIf="isLoading">
          <mat-spinner></mat-spinner>
          <p>Loading activity types...</p>
        </div>
        
        <div class="error-message" *ngIf="error">
          <p>{{ error }}</p>
          <button mat-button color="primary" (click)="loadActivityTypes()">Retry</button>
        </div>
        
        <div class="table-container" *ngIf="!isLoading && !error">
          <table mat-table [dataSource]="activityTypes" class="activity-types-table">
            <ng-container matColumnDef="activityTypeId">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let type">{{ type.activityTypeId }}</td>
            </ng-container>

            <ng-container matColumnDef="activityName">
              <th mat-header-cell *matHeaderCellDef>Activity Type Name</th>
              <td mat-cell *matCellDef="let type">{{ type.activityName }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let type">
                <button mat-icon-button color="primary" (click)="editActivityType(type)" [disabled]="isLoading">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteActivityType(type)" [disabled]="isLoading">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          
          <div class="no-data" *ngIf="activityTypes.length === 0">
            <p>No activity types found. Create your first activity type!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Activity Type Dialog -->
    <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ isEditing ? 'Edit Activity Type' : 'Add New Activity Type' }}</h3>
          <button mat-icon-button (click)="closeDialog()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <form class="activity-type-form" (ngSubmit)="saveActivityType()">
          <mat-form-field appearance="outline">
            <mat-label>Activity Name</mat-label>
            <input matInput [(ngModel)]="currentActivityType.activityName" name="activityName" required>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="closeDialog()" [disabled]="isSaving">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="isSaving">
              <mat-spinner *ngIf="isSaving" diameter="20"></mat-spinner>
              {{ isEditing ? 'Update' : 'Add' }} Activity Type
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .activity-types-container {
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

    .activity-types-table {
      width: 100%;
      border-collapse: collapse;
    }

    .activity-types-table th,
    .activity-types-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .activity-types-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }

    .activity-types-table tr:hover {
      background-color: #f9f9f9;
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

    .activity-type-form {
      padding: 20px;
    }

    .activity-type-form mat-form-field {
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
export class ActivityTypesComponent implements OnInit {
  activityTypes: ActivityType[] = [];
  displayedColumns: string[] = ['activityTypeId', 'activityName', 'actions'];
  showDialog = false;
  isEditing = false;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  
  currentActivityType: ActivityTypeCreateDto = {
    activityName: ''
  };

  constructor(
    private activityTypeApiService: ActivityTypeApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadActivityTypes();
  }

  async loadActivityTypes() {
    this.isLoading = true;
    this.error = null;
    
    try {
      this.activityTypes = await this.activityTypeApiService.getAll().toPromise() || [];
    } catch (err) {
      console.error('Error loading activity types:', err);
      this.error = err instanceof Error ? err.message : 'Failed to load activity types';
      this.snackBar.open(this.error, 'Close', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  openAddActivityTypeDialog() {
    this.isEditing = false;
    this.currentActivityType = {
      activityName: ''
    };
    this.showDialog = true;
  }

  editActivityType(type: ActivityType) {
    this.isEditing = true;
    this.currentActivityType = {
      activityName: type.activityName
    };
    this.showDialog = true;
  }

  async deleteActivityType(type: ActivityType) {
    if (confirm(`Are you sure you want to delete "${type.activityName}"?`)) {
      try {
        await this.activityTypeApiService.deleteItem(type.activityTypeId).toPromise();
        this.activityTypes = this.activityTypes.filter(t => t.activityTypeId !== type.activityTypeId);
        this.snackBar.open('Activity type deleted successfully', 'Close', { duration: 3000 });
      } catch (err) {
        console.error('Error deleting activity type:', err);
        this.snackBar.open(
          err instanceof Error ? err.message : 'Failed to delete activity type',
          'Close',
          { duration: 5000 }
        );
      }
    }
  }

  async saveActivityType() {
    if (!this.currentActivityType.activityName) {
      this.snackBar.open('Activity name is required', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    
    try {
      if (this.isEditing) {
        // Find the activity type to update
        const typeToUpdate = this.activityTypes.find(t => t.activityName === this.currentActivityType.activityName);
        if (typeToUpdate) {
          await this.activityTypeApiService.update(typeToUpdate.activityTypeId, this.currentActivityType).toPromise();
          // Update local array
          const index = this.activityTypes.findIndex(t => t.activityTypeId === typeToUpdate.activityTypeId);
          if (index !== -1) {
            this.activityTypes[index] = { ...this.activityTypes[index], ...this.currentActivityType };
          }
        }
        this.snackBar.open('Activity type updated successfully', 'Close', { duration: 3000 });
      } else {
        const newActivityType = await this.activityTypeApiService.create(this.currentActivityType).toPromise();
        if (newActivityType) {
          this.activityTypes.push(newActivityType);
          this.snackBar.open('Activity type created successfully', 'Close', { duration: 3000 });
        }
      }
      this.closeDialog();
    } catch (err) {
      console.error('Error saving activity type:', err);
      this.snackBar.open(
        err instanceof Error ? err.message : 'Failed to save activity type',
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
    this.currentActivityType = {
      activityName: ''
    };
  }
}
