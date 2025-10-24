import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.httpClient.get<MultilingualLesson[]>(`/levels/${levelId}/lessons`);
  }

  // POST a new lesson
  create(newItem: LessonCreateDto): Observable<MultilingualLesson> {
    return this.httpClient.post<MultilingualLesson, LessonCreateDto>(this.endpoint, newItem);
  }

  // PUT (update) an existing lesson
  update(id: number | string, itemToUpdate: Partial<LessonCreateDto>): Observable<MultilingualLesson> {
    return this.httpClient.put<MultilingualLesson, Partial<LessonCreateDto>>(`${this.endpoint}/${id}`, itemToUpdate);
  }

  // DELETE a lesson
  delete(id: number | string): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }

  // GET a single lesson by its ID (useful for getting the parent lesson name)
  getLessonById(lessonId: number | string): Observable<MultilingualLesson> {
    return this.httpClient.get<MultilingualLesson>(`${this.endpoint}/${lessonId}`);
  }

  // DELETE lesson (alias for delete)
  deleteItem(lessonId: number | string): Observable<void> {
    return this.delete(lessonId);
  }
}
