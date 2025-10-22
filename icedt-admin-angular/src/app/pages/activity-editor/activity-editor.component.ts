import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// MatTypographyModule is not available in Angular Material v19
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivityFormComponent } from '../../components/activities/activity-form.component';
import { DevicePreviewComponent } from '../../components/activities/device-preview.component';
import { ExerciseEditorComponent } from '../../components/activities/exercise-editor.component';
import { LanguageSelectorComponent } from '../../components/common/language-selector.component';
import { MultilingualActivityTemplates } from '../../services/multilingual-activity-templates.service';
import { ActivityApiService, MultilingualActivity } from '../../services/activity-api.service';
import { MainActivityApiService } from '../../services/main-activity-api.service';
import { ActivityTypeApiService } from '../../services/activity-type-api.service';
import { Activity } from '../../types/activity.types';
import { MainActivity } from '../../types/main-activity.types';
import { ActivityType } from '../../types/activity-type.types';
import { MultilingualText } from '../../types/multilingual.types';
import { Subscription } from 'rxjs';

interface ActivityCreateDto {
  title: MultilingualText;
  sequenceOrder: number;
  contentJson: string;
  lessonId: number;
  activityTypeId: number;
  mainActivityId: number;
}

@Component({
  selector: 'app-activity-editor',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatGridListModule,
    ActivityFormComponent,
    DevicePreviewComponent,
    ExerciseEditorComponent,
    LanguageSelectorComponent
  ],
  template: `
    <div class="activity-editor-page">
      <div class="header">
        <h1>{{ isEditMode ? 'Edit Activity #' + activityId : 'Add New Activity' }}</h1>
        
        <div class="actions">
          <button 
            mat-button 
            (click)="goBack()">
            ← BACK TO LIST
          </button>
          <button 
            mat-raised-button 
            color="primary"
            (click)="handleSave()">
            💾 SAVE ENTIRE ACTIVITY
          </button>
        </div>
      </div>
      
      <div class="content" *ngIf="!isLoading && activity">
        <div class="grid-container">
          <!-- Column 1: Activity Details Form -->
          <div class="form-column">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Activity Details</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <app-activity-form
                  [activityData]="activity"
                  [mainActivities]="mainActivities"
                  [activityTypes]="activityTypes"
                  (onDataChange)="handleFormChangeWrapper($event)">
                </app-activity-form>
              </mat-card-content>
            </mat-card>
          </div>
          
          <!-- Column 2: JSON Template & Exercises -->
          <div class="editor-column">
            <div class="template-section">
              <div class="template-header">
                <h3>JSON Template</h3>
                <button 
                  mat-button 
                  (click)="handleCopyTemplate()"
                  [disabled]="!activity.activityTypeId">
                  COPY TEMPLATE
                </button>
              </div>
              <p class="template-description">
                This is the required structure for the selected Activity Type.
              </p>
              <div class="template-content">
                <pre><code>{{ getActivityTemplate(activity.activityTypeId || 0) }}</code></pre>
              </div>
            </div>
            
            <div class="exercises-section">
              <h3>Exercises</h3>
              <app-exercise-editor
                [activityData]="activity"
                (onDataChange)="handleFormChangeWrapper($event)"
                (onPreviewExercise)="handlePreviewExerciseWrapper($event)"
                [expandedExercise]="expandedExercise"
                (onExpansionChange)="handleExpansionChangeWrapper($event)"
                (onSetExpanded)="handleSetExpandedWrapper($event)">
              </app-exercise-editor>
            </div>
          </div>
          
          <!-- Column 3: Device Preview -->
          <div class="preview-column">
            <div class="device-selectors">
              <div class="device-icon active">📱</div>
              <div class="device-icon">📱</div>
              <div class="device-icon">📱</div>
              <div class="device-icon">📱</div>
            </div>
            <div class="preview-content">
              <p>Select an activity type and provide JSON.</p>
              <app-device-preview 
                *ngIf="previewContent"
                [activityData]="previewContent">
              </app-device-preview>
            </div>
          </div>
        </div>
      </div>
      
      <mat-spinner *ngIf="isLoading" class="loading-spinner"></mat-spinner>
    </div>
  `,
  styles: [`
    .activity-editor-page {
      padding: 0;
      background: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 20px 20px 0 20px;
    }

    .header h1 {
      margin: 0;
      color: #333;
      font-size: 24px;
      font-weight: bold;
    }

    .actions {
      display: flex;
      gap: 16px;
    }

    .content {
      padding: 0 20px 20px 20px;
    }

    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr;
      gap: 24px;
      align-items: start;
    }

    .form-column {
      position: sticky;
      top: 24px;
    }

    .editor-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .preview-column {
      position: sticky;
      top: 24px;
      height: calc(100vh - 120px);
    }

    .template-section {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
    }

    .template-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .template-header h3 {
      margin: 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .template-description {
      margin: 0 0 16px 0;
      color: #666;
      font-size: 0.875rem;
    }

    .template-content {
      max-height: 300px;
      overflow-y: auto;
      background: white;
      padding: 16px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .template-content pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 0.75rem;
    }

    .exercises-section h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }

    .device-selectors {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .device-icon {
      width: 40px;
      height: 40px;
      border: 2px solid #ddd;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .device-icon.active {
      border-color: #1976d2;
      background-color: #e3f2fd;
    }

    .device-icon:hover {
      border-color: #1976d2;
    }

    .preview-content {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .preview-content p {
      color: #666;
      margin: 0 0 20px 0;
    }

    .loading-spinner {
      margin: 32px auto;
    }

    @media (max-width: 1200px) {
      .grid-container {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .form-column,
      .preview-column {
        position: static;
      }
    }
  `]
})
export class ActivityEditorPageComponent implements OnInit, OnDestroy {
  activityId: string | null = null;
  lessonId: string | null = null;
  isEditMode = false;
  
  activity: Partial<MultilingualActivity> | null = null;
  previewContent: Partial<MultilingualActivity> | null = null;
  isLoading = true;
  expandedExercise: number | false = 0;
  
  mainActivities: MainActivity[] = [];
  activityTypes: ActivityType[] = [];
  
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activityApiService: ActivityApiService,
    private mainActivityApiService: MainActivityApiService,
    private activityTypeApiService: ActivityTypeApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.activityId = params['activityId'];
      this.lessonId = params['lessonId'];
      this.isEditMode = !!this.activityId;
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private async loadData(): Promise<void> {
    this.isLoading = true;
    try {
      const mainActivitiesPromise = this.mainActivityApiService.getAll().toPromise();
      const activityTypesPromise = this.activityTypeApiService.getAll().toPromise();
      let activityPromise: Promise<Partial<MultilingualActivity>>;

      if (this.isEditMode && this.activityId) {
        activityPromise = this.activityApiService.getById(parseInt(this.activityId, 10)).toPromise() as Promise<Partial<MultilingualActivity>>;
      } else {
        activityPromise = Promise.resolve({
          title: { ta: '', en: '', si: '' },
          sequenceOrder: 1,
          mainActivityId: 0,
          activityTypeId: 0,
          contentJson: '[{}]',
          lessonId: parseInt(this.lessonId || '0', 10)
        });
      }

      const [mainActs, actTypes, loadedActivity] = await Promise.all([
        mainActivitiesPromise,
        activityTypesPromise,
        activityPromise
      ]);

      this.mainActivities = mainActs || [];
      this.activityTypes = actTypes || [];

      let exercises: any[] = [];
      try {
        const parsedContent = JSON.parse(loadedActivity?.contentJson || '[]');
        exercises = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
        if (exercises.length === 0) exercises.push({});
      } catch {
        exercises = [{}];
      }

      if (loadedActivity) {
        loadedActivity.contentJson = JSON.stringify(exercises, null, 2);
        this.activity = loadedActivity;
        this.previewContent = { ...loadedActivity, contentJson: JSON.stringify(exercises[0] || {}, null, 2) };
      }
    } catch (error) {
      console.error("Failed to load data", error);
      this.snackBar.open('Failed to load data', 'Close', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  handleFormChange(updatedActivityData: Partial<MultilingualActivity>): void {
    this.activity = updatedActivityData;
  }

  handlePreviewExercise(exerciseJsonString: string): void {
    if (!this.activity) return;
    this.previewContent = { ...this.activity, contentJson: exerciseJsonString };
  }

  async handleSave(): Promise<void> {
    if (!this.activity || !this.activity.contentJson) return;

    // Validate JSON content
    try {
      JSON.parse(this.activity.contentJson);
    } catch (error) {
      this.snackBar.open('An exercise contains invalid JSON. Please fix it before saving.', 'Close', { duration: 5000 });
      return;
    }

    // Construct payload
    const payload: ActivityCreateDto = {
      title: this.activity.title || { ta: '', en: '', si: '' },
      sequenceOrder: Number(this.activity.sequenceOrder),
      contentJson: this.activity.contentJson,
      lessonId: Number(this.activity.lessonId),
      activityTypeId: Number(this.activity.activityTypeId),
      mainActivityId: Number(this.activity.mainActivityId)
    };

    // Validate required IDs
    if (!payload.lessonId || !payload.activityTypeId || !payload.mainActivityId) {
      this.snackBar.open('Lesson, Activity Type, and Main Activity must be selected.', 'Close', { duration: 5000 });
      return;
    }

    try {
      if (this.isEditMode && this.activityId) {
        await this.activityApiService.update(parseInt(this.activityId, 10), payload).toPromise();
      } else {
        await this.activityApiService.create(payload).toPromise();
      }
      
      this.snackBar.open('Activity saved successfully!', 'Close', { duration: 3000 });
      this.goBack();
    } catch (error) {
      console.error("Failed to save activity", error);
      this.snackBar.open('An error occurred while saving.', 'Close', { duration: 5000 });
    }
  }

  handleExpansionChange(panelIndex: number): void {
    this.expandedExercise = this.expandedExercise === panelIndex ? false : panelIndex;
  }

  handleSetExpanded(index: number): void {
    this.expandedExercise = index;
  }

  async handleCopyTemplate(): Promise<void> {
    try {
      const templateJson = this.getActivityTemplate(this.activity?.activityTypeId || 0);
      await navigator.clipboard.writeText(templateJson);
      this.snackBar.open('Template JSON copied to clipboard!', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Failed to copy template:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = this.getActivityTemplate(this.activity?.activityTypeId || 0);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.snackBar.open('Template JSON copied to clipboard!', 'Close', { duration: 3000 });
    }
  }

  getActivityTemplate(activityTypeId: number): string {
    return MultilingualActivityTemplates.getTemplate(activityTypeId);
  }

  goBack(): void {
    const backUrl = `/activities?lessonId=${this.activity?.lessonId || this.lessonId}`;
    this.router.navigate([backUrl]);
  }

  // Wrapper methods to handle type conversion
  handleFormChangeWrapper(event: any): void {
    this.handleFormChange(event as Partial<MultilingualActivity>);
  }

  handlePreviewExerciseWrapper(event: any): void {
    this.handlePreviewExercise(event as string);
  }

  handleExpansionChangeWrapper(event: any): void {
    this.handleExpansionChange(event as number);
  }

  handleSetExpandedWrapper(event: any): void {
    this.handleSetExpanded(event as number);
  }
}