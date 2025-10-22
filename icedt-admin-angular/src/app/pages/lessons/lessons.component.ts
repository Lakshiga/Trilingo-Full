import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
// MatTypographyModule is not available in Angular Material v19
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DependentInlineCrudTableComponent } from '../../components/common/dependent-inline-crud-table.component';
import { LessonApiService } from '../../services/lesson-api.service';
import { Lesson } from '../../types/lesson.types';
import { Subscription } from 'rxjs';

interface LessonCreateDto {
  lessonName: string;
  description?: string;
  sequenceOrder: number;
  slug: string;
  levelId: number;
}

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    DependentInlineCrudTableComponent
  ],
  template: `
    <div class="lessons-page" *ngIf="levelId && apiService">
      <app-dependent-inline-crud-table
        entityName="Lesson"
        [parentName]="'Level #' + levelId"
        parentRoute="/levels"
        [parentId]="levelId"
        [apiService]="apiService"
        [columns]="columns"
        idField="lessonId"
        [renderCustomActions]="renderCustomLessonActions">
      </app-dependent-inline-crud-table>
    </div>
    
    <div class="error-page" *ngIf="!levelId || !apiService">
      <mat-card>
        <mat-card-content>
          <h2>Error: No Level ID provided.</h2>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="goBackToLevels()">
            <mat-icon>arrow_back</mat-icon>
            Back to Levels
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .lessons-page {
      padding: 24px;
    }

    .error-page {
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .error-page mat-card {
      max-width: 400px;
      text-align: center;
    }

    .error-page h2 {
      color: #f44336;
      margin-bottom: 16px;
    }
  `]
})
export class LessonsPageComponent implements OnInit, OnDestroy {
  levelId: string | null = null;
  apiService: any = null;
  private routeSubscription?: Subscription;

  columns = [
    { field: 'lessonName' as keyof Lesson, headerName: 'Lesson Name', type: 'string' as const },
    { field: 'slug' as keyof Lesson, headerName: 'Slug', type: 'string' as const },
    { field: 'description' as keyof Lesson, headerName: 'Description', type: 'string' as const },
    { field: 'sequenceOrder' as keyof Lesson, headerName: 'Sequence Order', type: 'number' as const }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lessonApiService: LessonApiService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.levelId = params['levelId'];
      this.setupApiService();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private setupApiService(): void {
    if (!this.levelId) {
      this.apiService = null;
      return;
    }

    const numericLevelId = parseInt(this.levelId, 10);
    this.apiService = {
      getAllByParentId: () => this.lessonApiService.getLessonsByLevelId(numericLevelId),
      create: (newItem: LessonCreateDto) => this.lessonApiService.create({ 
        ...newItem, 
        levelId: numericLevelId,
        description: newItem.description ?? null
      }),
      update: (id: number, item: Lesson) => this.lessonApiService.update(id, item),
      deleteItem: (id: number) => this.lessonApiService.deleteItem(id)
    };
  }

  renderCustomLessonActions = (lesson: Lesson) => {
    return `<a mat-button routerLink="/activities" [queryParams]="{lessonId: ${lesson.lessonId}}" class="manage-activities-btn">
      Manage Activities
    </a>`;
  };

  goBackToLevels(): void {
    this.router.navigate(['/levels']);
  }
}