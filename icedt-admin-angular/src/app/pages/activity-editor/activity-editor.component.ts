import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// MatTypographyModule is not available in Angular Material v19
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivityFormComponent } from '../../components/activities/activity-form/activity-form.component';
import { DevicePreviewComponent } from '../../components/activities/device-preview/device-preview.component';
import { ExerciseEditorComponent } from '../../components/activities/exercise-editor/exercise-editor.component';
import { MultilingualActivityTemplates } from '../../services/multilingual-activity-templates.service';
import { SidebarLanguageManagerComponent } from '../../components/common/sidebar-language-manager.component';
import { ActivityApiService, MultilingualActivity } from '../../services/activity-api.service';
import { MainActivityApiService, MainActivityResponse } from '../../services/main-activity-api.service';
import { ActivityTypeApiService, ActivityTypeResponse } from '../../services/activity-type-api.service';
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
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatGridListModule,
    ActivityFormComponent,
    DevicePreviewComponent,
    ExerciseEditorComponent,
    SidebarLanguageManagerComponent,
  ],
  templateUrl: './activity-editor.component.html',
  styleUrls: ['./activity-editor.component.css']
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
  private lastActivityTypeId: number | null = null;

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

      this.mainActivities = (mainActs || []).map(ma => ({
        id: ma.id,
        name: ma.name_en || ma.name_ta || ma.name_si || '',
        title: { ta: ma.name_ta, en: ma.name_en, si: ma.name_si },
        description: undefined
      }));
      this.activityTypes = (actTypes || []).map(at => ({
        activityTypeId: at.id,
        activityName: at.name_en || at.name_ta || at.name_si || '',
        title: { ta: at.name_ta, en: at.name_en, si: at.name_si },
        description: undefined
      }));

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
        // Ensure all IDs are properly converted to numbers
        if (loadedActivity.mainActivityId) {
          loadedActivity.mainActivityId = Number(loadedActivity.mainActivityId);
        }
        if (loadedActivity.activityTypeId) {
          loadedActivity.activityTypeId = Number(loadedActivity.activityTypeId);
        }
        if (loadedActivity.lessonId) {
          loadedActivity.lessonId = Number(loadedActivity.lessonId);
        }
        if (loadedActivity.sequenceOrder) {
          loadedActivity.sequenceOrder = Number(loadedActivity.sequenceOrder);
        }
        
        this.activity = loadedActivity;
        this.previewContent = { ...loadedActivity, contentJson: JSON.stringify(exercises[0] || {}, null, 2) };
        // Track initial type to detect changes later
        this.lastActivityTypeId = Number(loadedActivity.activityTypeId || 0) || null;
        
        // If this is a new activity and an activity type is already selected, auto-populate the template
        if (!this.isEditMode && this.activity.activityTypeId && this.activity.activityTypeId > 0) {
          this.autoPopulateTemplate(this.activity.activityTypeId);
        }

        // Apply sensible defaults when creating new activity
        if (!this.isEditMode) {
          if (!this.activity.activityTypeId || this.activity.activityTypeId <= 0) {
            const firstTypeId = this.activityTypes[0]?.activityTypeId;
            if (firstTypeId) {
              this.activity.activityTypeId = firstTypeId;
              this.autoPopulateTemplate(firstTypeId);
            }
          }

          if (!this.activity.mainActivityId || this.activity.mainActivityId <= 0) {
            const firstMainId = this.mainActivities[0]?.id;
            if (firstMainId) {
              this.activity.mainActivityId = firstMainId;
            }
          }
        }
      }
      
      // console.log('Loaded data:', { mainActivities: this.mainActivities, activityTypes: this.activityTypes, activity: this.activity });
    } catch (error) {
      console.error("Failed to load data", error);
      this.snackBar.open('Failed to load data', 'Close', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  handleFormChange(updatedActivityData: Partial<MultilingualActivity>): void {
    // console.log('Activity form changed:', updatedActivityData);
    const previousTypeId = this.lastActivityTypeId;
    const nextTypeId = Number(updatedActivityData.activityTypeId || (this.activity?.activityTypeId || 0));

    // Merge instead of replace to avoid losing required IDs
    const current = this.activity || {
      title: { ta: '', en: '', si: '' },
      sequenceOrder: 1,
      mainActivityId: 0,
      activityTypeId: 0,
      contentJson: '[]',
      lessonId: parseInt(this.lessonId || '0', 10)
    } as Partial<MultilingualActivity>;
    
    // Ensure all IDs are properly converted to numbers
    const mergedData = { ...current, ...updatedActivityData };
    if (mergedData.mainActivityId !== undefined && mergedData.mainActivityId !== null) {
      mergedData.mainActivityId = Number(mergedData.mainActivityId);
    }
    if (mergedData.activityTypeId !== undefined && mergedData.activityTypeId !== null) {
      mergedData.activityTypeId = Number(mergedData.activityTypeId);
    }
    if (mergedData.lessonId !== undefined && mergedData.lessonId !== null) {
      mergedData.lessonId = Number(mergedData.lessonId);
    }
    if (mergedData.sequenceOrder !== undefined && mergedData.sequenceOrder !== null) {
      mergedData.sequenceOrder = Number(mergedData.sequenceOrder);
    }
    
    this.activity = mergedData;

    // Auto-generate template when activity type changes
    // Only auto-populate if we have a valid activity type ID
    if (nextTypeId && nextTypeId > 0 && previousTypeId !== nextTypeId) {
      // console.log('Activity type changed, auto-populating template:', nextTypeId);
      this.autoPopulateTemplate(nextTypeId);
    }

    this.lastActivityTypeId = nextTypeId || null;
  }

  private autoPopulateTemplate(activityTypeId: number): void {
    // Ensure we have a valid activity type ID
    if (!activityTypeId || activityTypeId <= 0) {
      return;
    }
    
    try {
      const templateString = MultilingualActivityTemplates.getTemplate(activityTypeId);
      const templateObject = JSON.parse(templateString);
      const exercisesArray = [templateObject];
      const prettyArray = JSON.stringify(exercisesArray, null, 2);
      this.activity = { ...this.activity, activityTypeId: activityTypeId, contentJson: prettyArray };

      // Update preview to first exercise immediately
      this.previewContent = this.activity ? { ...this.activity, contentJson: JSON.stringify(templateObject, null, 2) } : null;
      this.expandedExercise = 0;
      
      // Show a message to the user that the template has been auto-populated
      const activityType = this.activityTypes.find(at => at.activityTypeId === activityTypeId);
      const activityTypeName = activityType ? activityType.activityName : 'selected';
      this.snackBar.open(`Activity template for ${activityTypeName} auto-populated`, 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Failed to auto-populate template:', error);
      // If template parse fails, keep whatever user has
      this.snackBar.open('Failed to auto-populate template. Using existing content.', 'Close', { duration: 3000 });
    }
  }

  handlePreviewExercise(exerciseJsonString: string): void {
    // console.log('Preview exercise updated:', exerciseJsonString);
    if (!this.activity) return;
    
    try {
      // Parse the exercise JSON to validate it
      JSON.parse(exerciseJsonString);
      this.previewContent = { ...this.activity, contentJson: exerciseJsonString };
      this.snackBar.open('Preview updated', 'Close', { duration: 1500 });
    } catch (error) {
      this.snackBar.open('Invalid JSON - preview not updated', 'Close', { duration: 3000 });
    }
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

    // Construct payload with strong coercion and fallbacks
    const coercedLessonId = Number(this.activity.lessonId || this.lessonId || 0);
    const coercedActivityTypeId = Number(this.activity.activityTypeId || 0);
    const coercedMainActivityId = Number(this.activity.mainActivityId || 0);
    
    const payload: ActivityCreateDto = {
      title: this.activity.title || { ta: '', en: '', si: '' },
      sequenceOrder: Number(this.activity.sequenceOrder || 1),
      contentJson: this.activity.contentJson,
      lessonId: coercedLessonId,
      activityTypeId: coercedActivityTypeId,
      mainActivityId: coercedMainActivityId
    };

    // Validate required IDs (check for null, undefined, or invalid values)
    // IDs should be greater than 0 to be valid
    if (!coercedLessonId || coercedLessonId <= 0) {
      this.snackBar.open('Please select a valid Lesson.', 'Close', { duration: 5000 });
      return;
    }
    
    if (!coercedActivityTypeId || coercedActivityTypeId <= 0) {
      this.snackBar.open('Please select a valid Activity Type.', 'Close', { duration: 5000 });
      return;
    }
    
    if (!coercedMainActivityId || coercedMainActivityId <= 0) {
      this.snackBar.open('Please select a valid Main Activity.', 'Close', { duration: 5000 });
      return;
    }

    try {
      if (this.isEditMode && this.activityId) {
        await this.activityApiService.update(parseInt(this.activityId, 10), payload).toPromise();
      } else {
        await this.activityApiService.create(payload).toPromise();
      }
      
      this.snackBar.open('Activity saved successfully!', 'Close', { duration: 3000 });
      // Add a small delay to ensure the activity is properly stored before navigating back
      setTimeout(() => {
        this.goBack();
      }, 500);
    } catch (error) {
      console.error("Failed to save activity", error);
      this.snackBar.open('An error occurred while saving.', 'Close', { duration: 5000 });
    }
  }

  // --- JSON Editor helpers ---
  onJsonChanged(value: string): void {
    // Lightweight live parse to update first-exercise preview safely
    try {
      const parsed = JSON.parse(value || '[]');
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const first = arr[0] || {};
      this.previewContent = this.activity ? { ...this.activity, contentJson: JSON.stringify(first, null, 2) } : null;
    } catch {
      // ignore typing errors; keep previous preview
    }
  }

  formatJson(): void {
    if (!this.activity) return;
    try {
      const parsed = JSON.parse(this.activity.contentJson || '[]');
      const pretty = JSON.stringify(parsed, null, 2);
      this.activity.contentJson = pretty;
      this.snackBar.open('JSON formatted', 'Close', { duration: 1500 });
    } catch (e) {
      this.snackBar.open('Invalid JSON - cannot format', 'Close', { duration: 3000 });
    }
  }

  validateJson(): void {
    if (!this.activity) return;
    try {
      JSON.parse(this.activity.contentJson || '[]');
      this.snackBar.open('JSON is valid', 'Close', { duration: 1500 });
    } catch (e: any) {
      this.snackBar.open(`Invalid JSON: ${e?.message || ''}`.trim(), 'Close', { duration: 4000 });
    }
  }

  applyJsonToPreview(): void {
    if (!this.activity) return;
    try {
      const parsed = JSON.parse(this.activity.contentJson || '[]');
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const first = arr[0] || {};
      this.previewContent = { ...this.activity, contentJson: JSON.stringify(first, null, 2) };
      this.snackBar.open('Preview updated from JSON', 'Close', { duration: 1500 });
    } catch {
      this.snackBar.open('Invalid JSON - preview not updated', 'Close', { duration: 3000 });
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
      const typeId = this.activity?.activityTypeId || 0;
      if (!typeId || typeId <= 0) {
        this.snackBar.open('Select an Activity Type to copy its template.', 'Close', { duration: 3000 });
        return;
      }
      const templateJson = this.getActivityTemplate(typeId);
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
    if (!activityTypeId || activityTypeId <= 0) {
      return '{}';
    }
    return MultilingualActivityTemplates.getTemplate(activityTypeId);
  }

  goBack(): void {
    const lessonId = this.activity?.lessonId || this.lessonId;
    if (lessonId) {
      const backUrl = `/activities?lessonId=${lessonId}`;
      this.router.navigate([backUrl]);
    } else {
      // Fallback to lessons page if no lesson ID
      this.router.navigate(['/lessons']);
    }
  }

  // Wrapper methods to handle type conversion
  handleFormChangeWrapper(event: any): void {
    // console.log('Form change wrapper called:', event);
    this.handleFormChange(event as Partial<MultilingualActivity>);
  }

  handlePreviewExerciseWrapper(event: any): void {
    // console.log('Preview exercise wrapper called:', event);
    this.handlePreviewExercise(event as string);
  }

  handleExpansionChangeWrapper(event: any): void {
    this.handleExpansionChange(event as number);
  }

  handleSetExpandedWrapper(event: any): void {
    this.handleSetExpanded(event as number);
  }
}