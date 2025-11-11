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
import { LessonApiService, LessonCreateDto, MultilingualLesson } from '../../services/lesson-api.service';
import { MultilingualText } from '../../types/multilingual.types';
import { LanguageService } from '../../services/language.service';
import { MultilingualInputComponent } from '../common/multilingual-input/multilingual-input.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lessons',
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
    MultilingualInputComponent
  ],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {
  lessons: MultilingualLesson[] = [];
  displayedColumns: string[] = ['lessonId', 'lessonName', 'sequenceOrder', 'manageActivities', 'actions'];
  showDialog = false;
  isEditing = false;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  levelId: number = 1; // Default level ID
  
  currentLesson: {
    lessonName: MultilingualText;
    sequenceOrder: number;
    levelId: number;
  } = {
    lessonName: { en: '', ta: '', si: '' },
    sequenceOrder: 0,
    levelId: 1
  };

  constructor(
    private lessonApiService: LessonApiService,
    private snackBar: MatSnackBar,
    private languageService: LanguageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const paramId = parseInt(params['levelId'] ?? '1', 10);
      this.levelId = Number.isNaN(paramId) ? 1 : paramId;
      this.loadLessons();
    });
  }

  async loadLessons() {
    this.isLoading = true;
    this.error = null;
    try {
      const lessons = await this.lessonApiService.getLessonsByLevelId(this.levelId).toPromise();
      this.lessons = lessons || [];
    } catch (err) {
      console.error('Error loading lessons:', err);
      this.error = err instanceof Error ? err.message : 'Failed to load lessons';
      this.snackBar.open(this.error, 'Close', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  getDisplayText(content: MultilingualText | undefined): string {
    if (!content) return '';
    return content.en || content.ta || content.si || '';
  }

  goBack() {
    try {
      // Navigate back to levels page
      this.router.navigate(['levels']).catch(err => {
        console.error('Navigation error:', err);
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
    return false; // Prevent default anchor behavior
  }

  openAddLessonDialog() {
    this.isEditing = false;
    this.currentLesson = {
      lessonName: { en: '', ta: '', si: '' },
      sequenceOrder: 0,
      levelId: this.levelId
    };
    this.showDialog = true;
  }

  editLesson(lesson: MultilingualLesson) {
    this.isEditing = true;
    this.currentLesson = {
      lessonName: lesson.lessonName,
      sequenceOrder: lesson.sequenceOrder,
      levelId: lesson.levelId
    };
    this.showDialog = true;
  }

  async deleteLesson(lesson: MultilingualLesson) {
    const lessonName = this.getDisplayText(lesson.lessonName);
    if (confirm(`Are you sure you want to delete "${lessonName}"?`)) {
      try {
        await this.lessonApiService.deleteItem(lesson.lessonId).toPromise();
        this.lessons = this.lessons.filter(l => l.lessonId !== lesson.lessonId);
        this.snackBar.open('Lesson deleted successfully', 'Close', { duration: 3000 });
      } catch (err) {
        console.error('Error deleting lesson:', err);
        this.snackBar.open(
          err instanceof Error ? err.message : 'Failed to delete lesson',
          'Close',
          { duration: 5000 }
        );
      }
    }
  }

  manageActivities(lesson: MultilingualLesson) {
    // Navigate to activities page for this lesson
    this.router.navigate(['/activities'], { queryParams: { lessonId: lesson.lessonId } });
  }

  async saveLesson() {
    if (!this.currentLesson.lessonName.en && !this.currentLesson.lessonName.ta && !this.currentLesson.lessonName.si) {
      this.snackBar.open('Lesson name is required in at least one language', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    
    try {
      const createDto: LessonCreateDto = {
        lessonName: this.currentLesson.lessonName,
        sequenceOrder: this.currentLesson.sequenceOrder,
        levelId: this.currentLesson.levelId
      };

      if (this.isEditing) {
        // Find the lesson to update
        const lessonToUpdate = this.lessons.find(l => 
          l.lessonName.en === this.currentLesson.lessonName.en && 
          l.lessonName.ta === this.currentLesson.lessonName.ta && 
          l.lessonName.si === this.currentLesson.lessonName.si &&
          l.levelId === this.currentLesson.levelId
        );
        if (lessonToUpdate) {
          await this.lessonApiService.update(lessonToUpdate.lessonId, createDto).toPromise();
          // Update local array
          const index = this.lessons.findIndex(l => l.lessonId === lessonToUpdate.lessonId);
          if (index !== -1) {
            this.lessons[index] = { ...this.lessons[index], lessonName: createDto.lessonName, sequenceOrder: createDto.sequenceOrder, levelId: createDto.levelId } as any;
          }
        }
        this.snackBar.open('Lesson updated successfully', 'Close', { duration: 3000 });
      } else {
        const newLesson = await this.lessonApiService.create(createDto).toPromise();
        if (newLesson) {
          this.lessons.push(newLesson);
          this.snackBar.open('Lesson created successfully', 'Close', { duration: 3000 });
        }
      }
      this.closeDialog();
    } catch (err) {
      console.error('Error saving lesson:', err);
      this.snackBar.open(
        err instanceof Error ? err.message : 'Failed to save lesson',
        'Close',
        { duration: 5000 }
      );
    } finally {
      this.isSaving = false;
    }
  }

  onLessonNameChange(value: MultilingualText) {
    this.currentLesson.lessonName = value;
  }

  closeDialog() {
    this.showDialog = false;
    this.isEditing = false;
    this.currentLesson = {
      lessonName: { en: '', ta: '', si: '' },
      sequenceOrder: 0,
      levelId: this.levelId
    };
  }
}