import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private baseUrl = environment.apiUrl || 'http://localhost:5166/api';

  constructor(private http: HttpClient) {
    // Allow runtime override via localStorage (helps when backend runs on a different port)
    // Key: "apiUrl" e.g. http://localhost:64288/api
    const storedUrl = (typeof window !== 'undefined') ? localStorage.getItem('apiUrl') : null;
    if (storedUrl && storedUrl.startsWith('http')) {
      this.baseUrl = storedUrl.replace(/\/$/, '');
      // console.info(`[HttpClientService] Using apiUrl from localStorage: ${this.baseUrl}`);
    } else if (typeof window !== 'undefined') {
      // If running on localhost but not the Angular dev port (4200), prefer same-origin API.
      // This covers cases where the admin app is hosted by the backend (e.g., http://localhost:64288).
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const port = window.location.port;
      if (isLocalhost && port && port !== '4200') {
        this.baseUrl = `${window.location.origin.replace(/\/$/, '')}/api`;
      } else if (!environment.apiUrl) {
        // Final fallback
        this.baseUrl = `${window.location.origin.replace(/\/$/, '')}/api`;
      }
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  post<T, TBody>(endpoint: string, body: TBody): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  put<T, TBody>(endpoint: string, body: TBody): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  delete(endpoint: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'A network or unknown error occurred.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}