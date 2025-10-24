import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  // GET all activities for a specific lesson
  getActivitiesByLessonId(lessonId: number | string): Observable<MultilingualActivity[]> {
    return this.httpClient.get<MultilingualActivity[]>(`/lessons/${lessonId}/activities`);
  }

  // GET a single activity by its own ID
  getActivityById(activityId: number | string): Observable<MultilingualActivity> {
    return this.httpClient.get<MultilingualActivity>(`${this.endpoint}/${activityId}`);
  }

  // POST a new activity
  create(newItem: ActivityCreateDto): Observable<MultilingualActivity> {
    return this.httpClient.post<MultilingualActivity, ActivityCreateDto>(this.endpoint, newItem);
  }

  // PUT (update) an existing activity
  update(id: number | string, itemToUpdate: ActivityUpdateDto): Observable<MultilingualActivity> {
    return this.httpClient.put<MultilingualActivity, ActivityUpdateDto>(`${this.endpoint}/${id}`, itemToUpdate);
  }

  // DELETE an activity
  delete(id: number | string): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
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
}
