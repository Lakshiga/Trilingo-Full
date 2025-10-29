import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';

// Backend-compatible interfaces
export interface ActivityTypeResponse {
  id: number;
  name_en: string;
  name_ta: string;
  name_si: string;
}

export interface ActivityTypeCreateDto {
  name_en: string;
  name_ta: string;
  name_si: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityTypeApiService {
  private readonly endpoint = '/ActivityTypes';

  constructor(private httpClient: HttpClientService) {}

  getAll(): Observable<ActivityTypeResponse[]> {
    return this.httpClient.get<ActivityTypeResponse[]>(this.endpoint);
  }

  create(newItem: ActivityTypeCreateDto): Observable<ActivityTypeResponse> {
    return this.httpClient.post<ActivityTypeResponse, ActivityTypeCreateDto>(this.endpoint, newItem);
  }

  update(id: number, itemToUpdate: Partial<ActivityTypeCreateDto>): Observable<ActivityTypeResponse> {
    return this.httpClient.put<ActivityTypeResponse, Partial<ActivityTypeCreateDto>>(`${this.endpoint}/${id}`, itemToUpdate);
  }

  deleteItem(id: number): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
}