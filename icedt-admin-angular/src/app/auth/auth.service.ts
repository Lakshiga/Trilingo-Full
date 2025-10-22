import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';
import { AuthResponse, LoginRequest } from '../types/auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);

  readonly isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  readonly isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(private authApi: AuthApiService) {}

  async login(username: string, password: string): Promise<AuthResponse> {
    this.isLoadingSubject.next(true);
    
    try {
      const credentials: LoginRequest = { username, password };
      const response = await firstValueFrom(this.authApi.login(credentials));
      
      if (response.isSuccess && response.token) {
        this.saveTokens(response);
        this.isAuthenticatedSubject.next(true);
      }
      
      return response;
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  logout(): void {
    this.clearTokens();
    this.isAuthenticatedSubject.next(false);
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get isLoading(): boolean {
    return this.isLoadingSubject.value;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  private saveTokens(tokens: AuthResponse): void {
    if (tokens.token) {
      localStorage.setItem(this.TOKEN_KEY, tokens.token);
    }
    if (tokens.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  }

  private clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}


