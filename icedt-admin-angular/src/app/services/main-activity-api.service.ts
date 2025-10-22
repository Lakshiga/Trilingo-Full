import { Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
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
  private readonly primaryEndpoint = '/multilingual/mainactivities';
  // Common fallback endpoints some backends may expose
  private readonly fallbackEndpoints = ['/mainactivities', '/main-activities'];

  constructor(private httpClient: HttpClientService) {}

  // GET all main activities (with endpoint fallback handling)
  getAll(): Observable<MultilingualMainActivity[]> {
    return this.httpClient.get<MultilingualMainActivity[]>(this.primaryEndpoint).pipe(
      catchError(err => {
        // Try fallbacks in sequence if endpoint not found
        return this.tryFallbacks<MultilingualMainActivity[]>('get');
      })
    );
  }

  // POST a new main activity
  create(newItem: MainActivityCreateDto): Observable<MultilingualMainActivity> {
    return this.httpClient.post<MultilingualMainActivity, MainActivityCreateDto>(this.primaryEndpoint, newItem).pipe(
      catchError(() => this.tryFallbacks<MultilingualMainActivity>('post', newItem))
    );
  }

  // PUT (update) an existing main activity
  update(id: number | string, itemToUpdate: Partial<MainActivityCreateDto>): Observable<MultilingualMainActivity> {
    return this.httpClient
      .put<MultilingualMainActivity, Partial<MainActivityCreateDto>>(`${this.primaryEndpoint}/${id}`, itemToUpdate)
      .pipe(catchError(() => this.tryFallbacks<MultilingualMainActivity>('put', itemToUpdate, id)));
  }

  // DELETE a main activity
  deleteItem(id: number | string): Observable<void> {
    return this.httpClient.delete(`${this.primaryEndpoint}/${id}`).pipe(
      catchError(() => this.tryFallbacks<void>('delete', undefined, id))
    );
  }

  private tryFallbacks<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    body?: any,
    id?: number | string
  ): Observable<T> {
    // Attempt each fallback endpoint until one succeeds
    let attemptIndex = 0;
    const attemptNext = (): Observable<T> => {
      if (attemptIndex >= this.fallbackEndpoints.length) {
        return throwError(() => new Error('The requested endpoint was not found on the server.'));
      }
      const base = this.fallbackEndpoints[attemptIndex++];
      switch (method) {
        case 'get':
          return this.httpClient.get<T>(base).pipe(catchError(() => attemptNext()));
        case 'post':
          return this.httpClient.post<T, any>(base, body).pipe(catchError(() => attemptNext()));
        case 'put':
          return this.httpClient
            .put<T, any>(`${base}/${id}`, body)
            .pipe(catchError(() => attemptNext()));
        case 'delete':
          return (this.httpClient.delete(`${base}/${id}`) as unknown as Observable<T>).pipe(
            catchError(() => attemptNext())
          );
      }
    };
    return attemptNext();
  }
}
