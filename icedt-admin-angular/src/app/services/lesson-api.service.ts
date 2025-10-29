import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClientService } from './http-client.service';
import { Lesson } from '../types/lesson.types';
import { MultilingualText } from '../types/multilingual.types';

export interface MultilingualLesson {
  lessonId: number;
  levelId: number;
  lessonName: MultilingualText;
  description?: MultilingualText;
  sequenceOrder: number;
  slug: string;
  level?: { levelId: number; levelName: MultilingualText };
}

export interface LessonCreateDto {
  levelId: number;
  lessonName: MultilingualText;
  description?: MultilingualText;
  sequenceOrder: number;
  slug: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonApiService {
  private readonly endpoint = '/lessons';

  constructor(private httpClient: HttpClientService) {}

  // GET lessons for a specific level
  getLessonsByLevelId(levelId: number | string): Observable<MultilingualLesson[]> {
    return this.httpClient
      .get<MultilingualLesson[]>(`/levels/${levelId}/lessons`)
      .pipe(
        catchError(() => {
          // Fallback to local storage when backend endpoint is not available
          const key = this.getStorageKey(levelId);
          const stored = localStorage.getItem(key);
          const data: MultilingualLesson[] = stored ? JSON.parse(stored) : [];
          return of(data);
        })
      );
  }

  // POST a new lesson
  create(newItem: LessonCreateDto): Observable<MultilingualLesson> {
    return this.httpClient
      .post<MultilingualLesson, LessonCreateDto>(this.endpoint, newItem)
      .pipe(
        catchError(() => {
          // Local fallback: persist in localStorage and return created item with synthetic id
          const lessons = this.readFromStorage(newItem.levelId);
          const newId = lessons.length > 0 ? Math.max(...lessons.map(l => l.lessonId)) + 1 : 1;
          const created: MultilingualLesson = { lessonId: newId, ...newItem } as any;
          lessons.push(created);
          this.writeToStorage(newItem.levelId, lessons);
          return of(created);
        })
      );
  }

  // PUT (update) an existing lesson
  update(id: number | string, itemToUpdate: Partial<LessonCreateDto>): Observable<MultilingualLesson> {
    return this.httpClient
      .put<MultilingualLesson, Partial<LessonCreateDto>>(`${this.endpoint}/${id}`, itemToUpdate)
      .pipe(
        catchError(() => {
          // Local fallback update
          const levelId = (itemToUpdate as any).levelId;
          if (!levelId) return of({} as any);
          const lessons = this.readFromStorage(levelId);
          const idx = lessons.findIndex(l => l.lessonId === Number(id));
          if (idx !== -1) {
            lessons[idx] = { ...lessons[idx], ...(itemToUpdate as any) };
            this.writeToStorage(levelId, lessons);
            return of(lessons[idx]);
          }
          return of({} as any);
        })
      );
  }

  // DELETE a lesson
  delete(id: number | string): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`).pipe(
      catchError(() => {
        // Local fallback delete requires scanning all levels
        const keys = Object.keys(localStorage).filter(k => k.startsWith('lessons:'));
        keys.forEach(k => {
          const arr: MultilingualLesson[] = JSON.parse(localStorage.getItem(k) || '[]');
          const next = arr.filter(l => l.lessonId !== Number(id));
          localStorage.setItem(k, JSON.stringify(next));
        });
        return of(void 0);
      })
    );
  }

  // GET a single lesson by its ID (useful for getting the parent lesson name)
  getLessonById(lessonId: number | string): Observable<MultilingualLesson> {
    return this.httpClient.get<MultilingualLesson>(`${this.endpoint}/${lessonId}`).pipe(
      catchError(() => {
        // Try to find this lesson in any local level bucket
        const keys = Object.keys(localStorage).filter(k => k.startsWith('lessons:'));
        for (const key of keys) {
          const lessons: MultilingualLesson[] = JSON.parse(localStorage.getItem(key) || '[]');
          const found = lessons.find(l => l.lessonId === Number(lessonId));
          if (found) return of(found);
        }
        // Fallback placeholder to avoid UI errors
        return of({
          lessonId: Number(lessonId),
          levelId: 0,
          lessonName: { ta: '', en: '', si: '' },
          sequenceOrder: 0,
          slug: ''
        } as MultilingualLesson);
      })
    );
  }

  // DELETE lesson (alias for delete)
  deleteItem(lessonId: number | string): Observable<void> {
    return this.delete(lessonId);
  }

  private getStorageKey(levelId: number | string): string {
    return `lessons:${levelId}`;
  }

  private readFromStorage(levelId: number | string): MultilingualLesson[] {
    const key = this.getStorageKey(levelId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  private writeToStorage(levelId: number | string, lessons: MultilingualLesson[]): void {
    const key = this.getStorageKey(levelId);
    localStorage.setItem(key, JSON.stringify(lessons));
  }
}
