import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { MainActivity } from '../types/main-activity.types';
import { MultilingualText } from '../types/multilingual.types';

export interface MultilingualMainActivity {
  id: number;
  name: string;
  title?: MultilingualText;
  description?: MultilingualText;
}

export interface MainActivityCreateDto {
  name: string;
  title?: MultilingualText;
  description?: MultilingualText;
}

@Injectable({
  providedIn: 'root'
})
export class MainActivityApiService {
  private readonly endpoint = '/MainActivities';

  constructor(private httpClient: HttpClientService) {}

  // GET all main activities
  getAll(): Observable<MultilingualMainActivity[]> {
    return this.httpClient.get<MultilingualMainActivity[]>(this.endpoint);
  }

  // POST a new main activity
  create(newItem: MainActivityCreateDto): Observable<MultilingualMainActivity> {
    return this.httpClient.post<MultilingualMainActivity, MainActivityCreateDto>(this.endpoint, newItem);
  }

  // PUT (update) an existing main activity
  update(id: number | string, itemToUpdate: Partial<MainActivityCreateDto>): Observable<MultilingualMainActivity> {
    return this.httpClient.put<MultilingualMainActivity, Partial<MainActivityCreateDto>>(`${this.endpoint}/${id}`, itemToUpdate);
  }

  // DELETE a main activity
  deleteItem(id: number | string): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
}
