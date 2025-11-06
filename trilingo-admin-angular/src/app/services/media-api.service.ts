import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MediaUploadResponse {
  success: boolean;
  message: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface MediaFile {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  lastModified: string;
}

@Injectable({
  providedIn: 'root'
})
export class MediaApiService {
  private readonly apiBaseUrl = '/api/media';

  constructor(private http: HttpClient) {}

  uploadSingleFile(file: File, folderName: string): Observable<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('levels', folderName);

    return this.http.post<MediaUploadResponse>(`${this.apiBaseUrl}/upload-single`, formData);
  }

  uploadMultipleFiles(
    files: File[],
    levelId: number,
    lessonId: number,
    mediaType: 'images' | 'audio' | 'videos'
  ): Observable<MediaUploadResponse[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('levelId', levelId.toString());
    formData.append('lessonId', lessonId.toString());
    formData.append('mediaType', mediaType);

    return this.http.post<MediaUploadResponse[]>(`${this.apiBaseUrl}/upload-multiple`, formData);
  }

  listFiles(
    levelId: number,
    lessonId: number,
    mediaType: 'images' | 'audio' | 'videos'
  ): Observable<MediaFile[]> {
    const params = {
      levelId: levelId.toString(),
      lessonId: lessonId.toString(),
      mediaType: mediaType
    };

    return this.http.get<MediaFile[]>(`${this.apiBaseUrl}/list`, { params });
  }
}
