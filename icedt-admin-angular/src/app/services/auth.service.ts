import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Router } from '@angular/router';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    userId: number;
    username: string;
    email: string;
    nativeLanguage: string;
    targetLanguage: string;
    currentLearningLanguage?: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nativeLanguage: string;
  targetLanguage: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private httpClient: HttpClientService,
    private router: Router
  ) {
    this.loadUserFromStorage();
    // Auto-login as admin for development
    this.autoLoginAsAdmin();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse, LoginRequest>('/auth/login', credentials);
  }

  register(userData: RegisterRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse, RegisterRequest>('/auth/register', userData);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setAuthData(token: string, user: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user data from storage:', error);
        this.logout();
      }
    }
  }

  // Admin-specific methods
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  // Language preference methods
  getPreferredLanguage(): string {
    const user = this.getCurrentUser();
    return user?.currentLearningLanguage || user?.targetLanguage || 'en';
  }

  updateLanguagePreference(language: string): Observable<any> {
    const user = this.getCurrentUser();
    if (user) {
      return this.httpClient.put(`/users/${user.userId}/language`, { 
        currentLearningLanguage: language 
      });
    }
    throw new Error('No authenticated user found');
  }

  private autoLoginAsAdmin(): void {
    // Auto-login as admin for development purposes
    if (!this.isAuthenticated()) {
      const mockAdminUser = {
        userId: 1,
        username: 'admin',
        email: 'admin@trillingo.com',
        role: 'admin',
        nativeLanguage: 'en',
        targetLanguage: 'ta',
        currentLearningLanguage: 'ta'
      };
      
      this.setAuthData('mock-admin-token', mockAdminUser);
    }
  }
}
