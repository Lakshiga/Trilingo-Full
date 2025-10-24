import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// MatTypographyModule is not available in Angular Material v19
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthApiService } from '../../services/auth-api.service';
import { LoginRequest } from '../../types/auth.types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-content>
          <h1>Admin Panel Sign In</h1>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username or Email</mat-label>
              <input 
                matInput 
                formControlName="identifier"
                type="text"
                autocomplete="username"
                required>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input 
                matInput 
                formControlName="password"
                type="password"
                autocomplete="current-password"
                required>
            </mat-form-field>
            
            <div class="error-message" *ngIf="error">
              {{ error }}
            </div>
            
            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              class="full-width login-button"
              [disabled]="isLoading || loginForm.invalid">
              <mat-spinner *ngIf="isLoading" diameter="24"></mat-spinner>
              <span *ngIf="!isLoading">Sign In</span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 16px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
    }

    .login-card h1 {
      text-align: center;
      margin-bottom: 24px;
      color: #1976d2;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .login-button {
      margin-top: 16px;
      height: 48px;
    }

    .error-message {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 8px;
      padding: 8px;
      background-color: #ffebee;
      border-radius: 4px;
      border: 1px solid #ffcdd2;
    }
  `]
})
export class LoginPageComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authApiService: AuthApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      identifier: ['admin', [Validators.required]],
      password: ['Admin123!', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const loginRequest: LoginRequest = {
      identifier: this.loginForm.value.identifier,
      password: this.loginForm.value.password
    };

    this.authApiService.login(loginRequest).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          localStorage.setItem('authToken', response.token || '');
          this.authApiService.checkAuthStatus();
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        } else {
          this.error = response.message || 'Login failed.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err instanceof Error ? err.message : 'An unexpected error occurred.';
        this.isLoading = false;
      }
    });
  }
}