import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
// MatTypographyModule is not available in Angular Material v19
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthApiService } from './services/auth-api.service';
import { SidebarLanguageManagerComponent } from './components/common/sidebar-language-manager.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SidebarLanguageManagerComponent
  ],
  templateUrl: './app.component.html',
  styles: [`
    .admin-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .top-navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1000;
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      height: 60px;
    }

    .navbar-left {
      flex: 1;
    }

    .admin-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: white;
    }

    .navbar-right {
      position: relative;
    }

    .profile-dropdown {
      position: relative;
      cursor: pointer;
    }

    .profile-icon {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background-color 0.2s;
    }

    .profile-icon:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .user-avatar {
      font-size: 20px;
    }

    .user-name {
      font-weight: 500;
    }

    .dropdown-arrow {
      font-size: 12px;
      transition: transform 0.2s;
    }

    .profile-dropdown:hover .dropdown-arrow {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 180px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      z-index: 1001;
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      color: #333;
      text-decoration: none;
      transition: background-color 0.2s;
      border-bottom: 1px solid #f0f0f0;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover {
      background-color: #f8f9fa;
    }

    .dropdown-icon {
      font-size: 16px;
    }

    .content-wrapper {
      display: flex;
      flex: 1;
    }

    .sidebar {
      width: 280px;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 0;
      box-shadow: 2px 0 4px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 0 20px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 20px;
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
      flex: 1;
    }

    .nav-menu li {
      margin: 0;
    }

    .nav-menu a {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: white;
      text-decoration: none;
      transition: all 0.2s;
      border-left: 3px solid transparent;
    }

    .nav-menu a:hover {
      background-color: rgba(255,255,255,0.1);
      border-left-color: white;
    }

    .nav-menu a.active {
      background-color: rgba(255,255,255,0.2);
      border-left-color: white;
      font-weight: 600;
    }

    .language-section-separator {
      height: 1px;
      background: rgba(255,255,255,0.1);
      margin: 20px 0;
    }

    .main-content {
      flex: 1;
      padding: 30px;
      background-color: #f8f9fa;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .navbar-content {
        padding: 0 15px;
      }

      .admin-title {
        font-size: 20px;
      }

      .sidebar {
        width: 220px;
      }

      .main-content {
        padding: 20px 15px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  showProfileDropdown = false;

  constructor(
    private authApiService: AuthApiService,
    public router: Router
  ) {
    this.isAuthenticated$ = this.authApiService.isAuthenticated$;
  }

  ngOnInit(): void {
    // Check authentication status on app initialization
    this.authApiService.checkAuthStatus();
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  updateProfile(): void {
    this.showProfileDropdown = false;
    // TODO: Implement profile update functionality
    console.log('Update profile clicked');
  }

  logout(): void {
    this.showProfileDropdown = false;
    this.authApiService.logout();
    this.router.navigate(['/login']);
  }
}