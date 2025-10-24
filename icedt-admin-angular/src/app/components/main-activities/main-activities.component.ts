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
import { MainActivityApiService, MainActivityCreateDto, MainActivityResponse } from '../../services/main-activity-api.service';
import { LanguageService } from '../../services/language.service';
import { MultilingualFormComponent, MultilingualFormData } from '../common/multilingual-form.component';

@Component({
  selector: 'app-main-activities',
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
    MultilingualFormComponent
  ],
  template: `
    <div class="main-activities-container">
      <div class="header">
        <h2>Manage Main Activitys</h2>
        <button mat-raised-button color="primary" (click)="openAddMainActivityDialog()" [disabled]="isLoading">
          + ADD NEW MAIN ACTIVITY
        </button>
      </div>

      <div class="content">
        <div class="loading-container" *ngIf="isLoading">
          <mat-spinner></mat-spinner>
          <p>Loading main activities...</p>
        </div>
        
        <div class="error-message" *ngIf="error">
          <p>{{ error }}</p>
          <button mat-button color="primary" (click)="loadMainActivities()">Retry</button>
        </div>
        
        <div class="table-container" *ngIf="!isLoading && !error">
          <table mat-table [dataSource]="mainActivities" class="main-activities-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let activity">{{ activity.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name_en">
              <th mat-header-cell *matHeaderCellDef>English Name</th>
              <td mat-cell *matCellDef="let activity">{{ activity.name_en }}</td>
            </ng-container>

            <ng-container matColumnDef="name_ta">
              <th mat-header-cell *matHeaderCellDef>தமிழ் Name</th>
              <td mat-cell *matCellDef="let activity">{{ activity.name_ta }}</td>
            </ng-container>

            <ng-container matColumnDef="name_si">
              <th mat-header-cell *matHeaderCellDef>සිංහල Name</th>
              <td mat-cell *matCellDef="let activity">{{ activity.name_si }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let activity">
                <button mat-icon-button color="primary" (click)="editMainActivity(activity)" [disabled]="isLoading">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteMainActivity(activity)" [disabled]="isLoading">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          
          <div class="no-data" *ngIf="mainActivities.length === 0">
            <p>No main activities found. Create your first main activity!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Main Activity Dialog -->
    <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ isEditing ? 'Edit Main Activity' : 'Add New Main Activity' }}</h3>
          <button mat-icon-button (click)="closeDialog()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <app-multilingual-form
          [title]="isEditing ? 'Edit Main Activity' : 'Add New Main Activity'"
          [fieldLabel]="'Activity Name'"
          [showDescription]="false"
          [showActions]="true"
          [saveButtonText]="isEditing ? 'Update Main Activity' : 'Add Main Activity'"
          [initialData]="currentMainActivity"
          (save)="onSave($event)"
          (cancel)="closeDialog()">
        </app-multilingual-form>
      </div>
    </div>
  `,
  styles: [`
    .main-activities-container {
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

    .main-activities-table {
      width: 100%;
      border-collapse: collapse;
    }

    .main-activities-table th,
    .main-activities-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .main-activities-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }

    .main-activities-table tr:hover {
      background-color: #f9f9f9;
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

    .main-activity-form {
      padding: 20px;
    }

    .main-activity-form mat-form-field {
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
export class MainActivitiesComponent implements OnInit {
  mainActivities: MainActivityResponse[] = [];
  displayedColumns: string[] = ['id', 'name_en', 'name_ta', 'name_si', 'actions'];
  showDialog = false;
  isEditing = false;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  
  currentMainActivity: MultilingualFormData = {
    name_en: '',
    name_ta: '',
    name_si: ''
  };

  constructor(
    private mainActivityApiService: MainActivityApiService,
    private snackBar: MatSnackBar,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.loadMainActivities();
  }

  async loadMainActivities() {
    this.isLoading = true;
    this.error = null;
    
    try {
      this.mainActivities = await this.mainActivityApiService.getAll().toPromise() || [];
    } catch (err) {
      console.error('Error loading main activities:', err);
      this.error = err instanceof Error ? err.message : 'Failed to load main activities';
      this.snackBar.open(this.error, 'Close', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  getDisplayText(activity: MainActivityResponse): string {
    return activity.name_en || activity.name_ta || activity.name_si || '';
  }

  openAddMainActivityDialog() {
    this.isEditing = false;
    this.currentMainActivity = {
      name_en: '',
      name_ta: '',
      name_si: ''
    };
    this.showDialog = true;
  }

  editMainActivity(activity: MainActivityResponse) {
    this.isEditing = true;
    this.currentMainActivity = {
      name_en: activity.name_en,
      name_ta: activity.name_ta,
      name_si: activity.name_si
    };
    this.showDialog = true;
  }

  async deleteMainActivity(activity: MainActivityResponse) {
    const activityName = this.getDisplayText(activity);
    if (confirm(`Are you sure you want to delete "${activityName}"?`)) {
      try {
        await this.mainActivityApiService.deleteItem(activity.id).toPromise();
        this.mainActivities = this.mainActivities.filter(a => a.id !== activity.id);
        this.snackBar.open('Main activity deleted successfully', 'Close', { duration: 3000 });
      } catch (err) {
        console.error('Error deleting main activity:', err);
        this.snackBar.open(
          err instanceof Error ? err.message : 'Failed to delete main activity',
          'Close',
          { duration: 5000 }
        );
      }
    }
  }

  async onSave(formData: MultilingualFormData) {
    if (!formData.name_en && !formData.name_ta && !formData.name_si) {
      this.snackBar.open('Activity name is required in at least one language', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    
    try {
      const createDto: MainActivityCreateDto = {
        name_en: formData.name_en,
        name_ta: formData.name_ta,
        name_si: formData.name_si
      };

      if (this.isEditing) {
        // Find the main activity to update
        const activityToUpdate = this.mainActivities.find(a => 
          a.name_en === this.currentMainActivity.name_en && 
          a.name_ta === this.currentMainActivity.name_ta && 
          a.name_si === this.currentMainActivity.name_si
        );
        if (activityToUpdate) {
          await this.mainActivityApiService.update(activityToUpdate.id, createDto).toPromise();
          // Update local array
          const index = this.mainActivities.findIndex(a => a.id === activityToUpdate.id);
          if (index !== -1) {
            this.mainActivities[index] = { ...this.mainActivities[index], ...createDto };
          }
        }
        this.snackBar.open('Main activity updated successfully', 'Close', { duration: 3000 });
      } else {
        const newMainActivity = await this.mainActivityApiService.create(createDto).toPromise();
        if (newMainActivity) {
          this.mainActivities.push(newMainActivity);
          this.snackBar.open('Main activity created successfully', 'Close', { duration: 3000 });
        }
      }
      this.closeDialog();
    } catch (err) {
      console.error('Error saving main activity:', err);
      this.snackBar.open(
        err instanceof Error ? err.message : 'Failed to save main activity',
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
    this.currentMainActivity = {
      name_en: '',
      name_ta: '',
      name_si: ''
    };
  }
}
