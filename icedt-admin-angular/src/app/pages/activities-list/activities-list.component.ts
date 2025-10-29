import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// MatTypographyModule is not available in Angular Material v19
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ActivityPlayerModalComponent } from '../../components/activities/activity-player-modal/activity-player-modal.component';
import { SidebarLanguageManagerComponent } from '../../components/common/sidebar-language-manager.component';
import { ActivityApiService, MultilingualActivity } from '../../services/activity-api.service';
import { LessonApiService, MultilingualLesson } from '../../services/lesson-api.service';
import { Activity } from '../../types/activity.types';
import { Lesson } from '../../types/lesson.types';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink,
    ActivityPlayerModalComponent,
    SidebarLanguageManagerComponent
  ],
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.css']
})
export class ActivitiesListPageComponent implements OnInit, OnDestroy {
  lessonId: string | null = null;
  activities: MultilingualActivity[] = [];
  lesson: MultilingualLesson | null = null;
  isLoading = true;
  error: string | null = null;
  
  isPreviewOpen = false;
  activityToPreview: MultilingualActivity | null = null;
  isPreviewLoading = false;
  
  displayedColumns: string[] = ['id', 'title', 'order', 'actions'];
  
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activityApiService: ActivityApiService,
    private lessonApiService: LessonApiService,
    private snackBar: MatSnackBar,
    public languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.lessonId = params['lessonId'];
      // Clear existing data before loading new data
      this.activities = [];
      this.lesson = null;
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private async loadData(): Promise<void> {
    if (!this.lessonId) {
      this.error = "Error: No Lesson ID provided.";
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    try {
      const lessonObservable = this.lessonApiService.getLessonById(parseInt(this.lessonId, 10));
      const activitiesObservable = this.activityApiService.getAllByLessonId(parseInt(this.lessonId, 10));
      
      const [lessonData, activitiesData] = await Promise.all([
        lessonObservable.toPromise(),
        activitiesObservable.toPromise()
      ]);
      
      this.lesson = lessonData!;
      this.activities = activitiesData!;
      
      // Log the activities for debugging
      console.log('Loaded activities:', this.activities);
    } catch (err) {
      console.error(err);
      this.error = err instanceof Error ? err.message : "Failed to load data for this lesson.";
    } finally {
      this.isLoading = false;
    }
  }

  getDisplayText(content: any): string {
    if (typeof content === 'string') return content;
    if (content && typeof content === 'object') {
      return this.languageService.getText(content);
    }
    return '';
  }

  async deleteActivity(activityId: number): Promise<void> {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        await this.activityApiService.deleteItem(activityId);
        this.activities = this.activities.filter(act => act.activityId !== activityId);
        this.snackBar.open('Activity deleted successfully', 'Close', { duration: 3000 });
      } catch (err) {
        console.error(err);
        this.snackBar.open(
          err instanceof Error ? err.message : "Failed to delete activity.",
          'Close',
          { duration: 5000 }
        );
      }
    }
  }

  async openPreview(activityId: number): Promise<void> {
    this.isPreviewOpen = true;
    this.isPreviewLoading = true;
    
    try {
      const fullActivityData = await this.activityApiService.getById(activityId).toPromise();
      this.activityToPreview = fullActivityData!;
    } catch (err) {
      console.error("Failed to fetch activity details for preview", err);
      this.snackBar.open("Could not load activity preview.", 'Close', { duration: 5000 });
      this.isPreviewOpen = false;
    } finally {
      this.isPreviewLoading = false;
    }
  }

  closePreview(): void {
    this.isPreviewOpen = false;
    this.activityToPreview = null;
  }

  goBack(): void {
    const backToLessonsUrl = this.lesson ? 
      `/lessons?levelId=${this.lesson.levelId}` : 
      '/levels';
    this.router.navigate([backToLessonsUrl]);
  }
}