import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, delay } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { LoginRequest, AuthResponse } from '../types/auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly endpoint = '/auth/login';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Mock credentials for development
  private readonly mockCredentials = {
    username: 'admin',
    password: 'admin123'
  };

  constructor(private httpClient: HttpClientService) {
    this.checkAuthStatus();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock authentication for development
    return new Observable<AuthResponse>(observer => {
      // Simulate network delay
      setTimeout(() => {
        if (credentials.username === this.mockCredentials.username && 
            credentials.password === this.mockCredentials.password) {
          // Successful login
          const mockResponse: AuthResponse = {
            isSuccess: true,
            message: 'Login successful',
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 1,
              username: credentials.username,
              email: 'admin@example.com',
              role: 'admin'
            }
          };
          observer.next(mockResponse);
          observer.complete();
        } else {
          // Failed login
          const mockResponse: AuthResponse = {
            isSuccess: false,
            message: 'Invalid username or password',
            token: null,
            user: null
          };
          observer.next(mockResponse);
          observer.complete();
        }
      }, 1000); // 1 second delay to simulate network request
    });
  }

  checkAuthStatus(): void {
    // Check if user is authenticated (e.g., check localStorage for token)
    const token = localStorage.getItem('authToken');
    this.isAuthenticatedSubject.next(!!token);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }
}
