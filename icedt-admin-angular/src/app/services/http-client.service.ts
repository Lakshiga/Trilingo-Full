import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  result: T;
  isError: boolean;
  error: {
    title: string;
    details: string;
    statusCode: number;
  } | null;
}

export class ApiError extends Error {
  constructor(public title: string, public details: string, public statusCode: number) {
    super(details);
    this.name = 'ApiError';
  }
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private baseUrl = environment.apiUrl || 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // For development, use a mock token if no real token exists
    const authToken = token || 'mock-admin-token';
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    
    return headers;
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  post<T, TBody>(endpoint: string, body: TBody): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  put<T, TBody>(endpoint: string, body: TBody): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  delete(endpoint: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  private handleResponse<T>(response: ApiResponse<T>): T {
    if (response.isError) {
      if (response.error) {
        throw new ApiError(response.error.title, response.error.details, response.error.statusCode);
      }
      throw new Error('An unknown API error occurred.');
    }
    return response.result;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error?.isError && error.error?.error) {
      const apiError = error.error.error;
      return throwError(() => new ApiError(apiError.title, apiError.details, apiError.statusCode));
    }
    
    return throwError(() => new Error('A network or unknown error occurred.'));
  }
}