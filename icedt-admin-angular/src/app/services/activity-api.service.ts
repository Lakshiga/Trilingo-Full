import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClientService } from './http-client.service';
import { Activity } from '../types/activity.types';
import { MultilingualText } from '../types/multilingual.types';

export interface MultilingualActivity {
  activityId: number;
  lessonId: number;
  title: MultilingualText;
  sequenceOrder: number;
  activityTypeId: number;
  mainActivityId: number;
  contentJson: string;
  activityType?: { activityTypeId: number; activityName: string; title?: MultilingualText };
  mainActivity?: { id: number; name: string; title?: MultilingualText };
}

export interface ActivityCreateDto {
  lessonId: number;
  activityTypeId: number;
  title: MultilingualText;
  sequenceOrder: number;
  contentJson: string;
  mainActivityId: number;
}

export type ActivityUpdateDto = ActivityCreateDto;

@Injectable({
  providedIn: 'root'
})
export class ActivityApiService {
  private readonly endpoint = '/Activities';

  constructor(private httpClient: HttpClientService) {}

  // Backend DTOs
  private toFrontend(dto: any): MultilingualActivity {
    return {
      activityId: dto?.id ?? dto?.activityId,
      lessonId: dto?.stageId ?? dto?.lessonId ?? 0,
      title: { ta: '', en: '', si: '' },
      sequenceOrder: 1,
      activityTypeId: dto?.activityTypeId ?? 0,
      mainActivityId: dto?.mainActivityId ?? 0,
      contentJson: dto?.details_JSON ?? dto?.contentJson ?? '[]'
    } as MultilingualActivity;
  }

  private toCreateDto(item: ActivityCreateDto): any {
    return {
      details_JSON: item.contentJson,
      stageId: item.lessonId,
      mainActivityId: item.mainActivityId,
      activityTypeId: item.activityTypeId
    };
  }

  private toUpdateDto(item: ActivityUpdateDto): any {
    return this.toCreateDto(item as ActivityCreateDto);
  }

  // GET all activities for a specific lesson (filter client-side from backend list)
  getActivitiesByLessonId(lessonId: number | string): Observable<MultilingualActivity[]> {
    return this.httpClient.get<any[]>(this.endpoint).pipe(
      map(list => (list || []).map(a => this.toFrontend(a)).filter(a => String(a.lessonId) === String(lessonId))),
      catchError(() => {
        const data = this.readFromStorage(lessonId);
        return of(data);
      })
    );
  }

  // GET a single activity by its own ID
  getActivityById(activityId: number | string): Observable<MultilingualActivity> {
    return this.httpClient.get<any>(`${this.endpoint}/${activityId}`).pipe(
      map(dto => this.toFrontend(dto)),
      catchError(() => {
        // Fallback: scan all lesson buckets in localStorage
        const keys = Object.keys(localStorage).filter(k => k.startsWith('activities:'));
        for (const key of keys) {
          try {
            const arr: MultilingualActivity[] = JSON.parse(localStorage.getItem(key) || '[]');
            const found = arr.find(a => a.activityId === Number(activityId));
            if (found) return of(found);
          } catch {
            // ignore and continue scanning
          }
        }
        return of({} as any);
      })
    );
  }

  // POST a new activity
  create(newItem: ActivityCreateDto): Observable<MultilingualActivity> {
    const dto = this.toCreateDto(newItem);
    return this.httpClient.post<any, any>(this.endpoint, dto).pipe(
      map(res => this.toFrontend(res)),
      catchError(() => {
        const arr = this.readFromStorage(newItem.lessonId);
        const newId = arr.length > 0 ? Math.max(...arr.map(a => a.activityId)) + 1 : 1;
        const created: MultilingualActivity = {
          activityId: newId,
          lessonId: newItem.lessonId,
          title: newItem.title,
          sequenceOrder: newItem.sequenceOrder,
          contentJson: newItem.contentJson,
          activityTypeId: newItem.activityTypeId,
          mainActivityId: newItem.mainActivityId
        } as any;
        arr.push(created);
        this.writeToStorage(newItem.lessonId, arr);
        return of(created);
      })
    );
  }

  // PUT (update) an existing activity
  update(id: number | string, itemToUpdate: ActivityUpdateDto): Observable<MultilingualActivity> {
    const dto = this.toUpdateDto(itemToUpdate);
    return this.httpClient.put<any, any>(`${this.endpoint}/${id}`, dto).pipe(
      map(res => this.toFrontend(res)),
      catchError(() => {
        const arr = this.readFromStorage(itemToUpdate.lessonId);
        const idx = arr.findIndex(a => a.activityId === Number(id));
        if (idx !== -1) {
          arr[idx] = { ...arr[idx], ...(itemToUpdate as any) };
          this.writeToStorage(itemToUpdate.lessonId, arr);
          return of(arr[idx]);
        }
        return of({} as any);
      })
    );
  }

  // DELETE an activity
  delete(id: number | string): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`).pipe(
      catchError(() => {
        // scan all lesson keys
        const keys = Object.keys(localStorage).filter(k => k.startsWith('activities:'));
        keys.forEach(k => {
          const arr: MultilingualActivity[] = JSON.parse(localStorage.getItem(k) || '[]');
          const next = arr.filter(a => a.activityId !== Number(id));
          localStorage.setItem(k, JSON.stringify(next));
        });
        return of(void 0);
      })
    );
  }

  // GET all activities by lesson ID (alias for getActivitiesByLessonId)
  getAllByLessonId(lessonId: number | string): Observable<MultilingualActivity[]> {
    return this.getActivitiesByLessonId(lessonId);
  }

  // GET activity by ID (alias for getActivityById)
  getById(activityId: number | string): Observable<MultilingualActivity> {
    return this.getActivityById(activityId);
  }

  // DELETE activity (alias for delete)
  deleteItem(activityId: number | string): Observable<void> {
    return this.delete(activityId);
  }

  private storageKey(lessonId: number | string): string {
    return `activities:${lessonId}`;
  }
  private readFromStorage(lessonId: number | string): MultilingualActivity[] {
    const key = this.storageKey(lessonId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }
  private writeToStorage(lessonId: number | string, arr: MultilingualActivity[]): void {
    const key = this.storageKey(lessonId);
    localStorage.setItem(key, JSON.stringify(arr));
  }
}
