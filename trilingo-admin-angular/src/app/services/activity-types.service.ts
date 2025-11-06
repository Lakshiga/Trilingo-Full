import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';

export interface ActivityType {
  id: number;
  name: string;
  code?: string;
}

export type ActivityTypeCreateDto = Omit<ActivityType, 'id'>;

@Injectable({ providedIn: 'root' })
export class ActivityTypesService {
  constructor(private http: HttpClientService) {}

  getAll(): Observable<ActivityType[]> {
    return this.http.get<ActivityType[]>('/activitytypes');
  }

  create(newItem: ActivityTypeCreateDto): Observable<ActivityType> {
    return this.http.post<ActivityType, ActivityTypeCreateDto>('/activitytypes', newItem);
  }

  update(id: number | string, item: Partial<ActivityTypeCreateDto>): Observable<void> {
    return this.http.put(`/activitytypes/${id}`, item);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete(`/activitytypes/${id}`);
  }
}


