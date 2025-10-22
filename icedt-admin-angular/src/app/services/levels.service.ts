import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';

export interface Level {
  levelId: number;
  name: string;
}

export type LevelCreateDto = Omit<Level, 'levelId'>;

@Injectable({ providedIn: 'root' })
export class LevelsService {
  constructor(private http: HttpClientService) {}

  getAll(): Observable<Level[]> {
    return this.http.get<Level[]>('/levels');
  }

  create(newItem: LevelCreateDto): Observable<Level> {
    return this.http.post<Level, LevelCreateDto>('/levels', newItem);
  }

  update(id: number | string, item: Partial<LevelCreateDto>): Observable<void> {
    return this.http.put(`/levels/${id}`, item);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete(`/levels/${id}`);
  }
}


