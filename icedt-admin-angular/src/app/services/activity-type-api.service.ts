import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { ActivityType } from '../types/activity-type.types';
import { MultilingualText } from '../types/multilingual.types';

export interface ActivityTypeCreateDto {
  activityName: string;
  title?: MultilingualText;
  description?: MultilingualText;
}

export interface MultilingualActivityType {
  activityTypeId: number;
  activityName: string;
  title?: MultilingualText;
  description?: MultilingualText;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityTypeApiService {
  private readonly endpoint = '/multilingual/activitytypes';

  constructor(private httpClient: HttpClientService) {}

  getAll(): Observable<MultilingualActivityType[]> {
    return this.httpClient.get<MultilingualActivityType[]>(this.endpoint);
  }

  create(newItem: ActivityTypeCreateDto): Observable<MultilingualActivityType> {
    return this.httpClient.post<MultilingualActivityType, ActivityTypeCreateDto>(this.endpoint, newItem);
  }

  update(id: number, itemToUpdate: Partial<ActivityTypeCreateDto>): Observable<MultilingualActivityType> {
    return this.httpClient.put<MultilingualActivityType, Partial<ActivityTypeCreateDto>>(`${this.endpoint}/${id}`, itemToUpdate);
  }

  deleteItem(id: number): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
}
