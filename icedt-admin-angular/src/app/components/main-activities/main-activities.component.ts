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
  templateUrl: './main-activities.component.html',
  styleUrls: ['./main-activities.component.css']
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