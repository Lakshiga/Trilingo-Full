import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Level } from '../types/level.types';
import { MultilingualText } from '../types/multilingual.types';

export interface MultilingualLevel {
  levelId: number;
  levelName: MultilingualText;
  description?: MultilingualText;
  sequenceOrder: number;
  slug: string;
  imageUrl?: string;
  barcode: string;
}

export interface LevelCreateDto {
  levelName: MultilingualText;
  description?: MultilingualText;
  sequenceOrder: number;
  slug: string;
  coverImageUrl?: string;
  barcode: string;
}

@Injectable({
  providedIn: 'root'
})
export class LevelApiService {
  private readonly endpoint = '/multilingual/levels';

  constructor(private httpClient: HttpClientService) {}

  getAll(): Observable<MultilingualLevel[]> {
    return this.httpClient.get<MultilingualLevel[]>(this.endpoint);
  }

  create(newItem: LevelCreateDto): Observable<MultilingualLevel> {
    return this.httpClient.post<MultilingualLevel, LevelCreateDto>(this.endpoint, newItem);
  }

  update(id: number, itemToUpdate: Partial<LevelCreateDto>): Observable<void> {
    return this.httpClient.put(`${this.endpoint}/${id}`, itemToUpdate);
  }

  deleteItem(id: number): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }

  uploadCoverImage(levelId: number, file: File): Observable<MultilingualLevel> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.httpClient.post<MultilingualLevel, FormData>(
      `${this.endpoint}/${levelId}/cover-image`, 
      formData
    );
  }
}