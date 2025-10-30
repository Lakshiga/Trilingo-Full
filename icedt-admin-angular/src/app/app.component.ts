import { Component, OnInit, HostListener } from '@angular/core';
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
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      min-width: 14rem;
      opacity: 0;
      visibility: hidden;
      transform: scale(0.95);
      transition: all 0.2s ease;
      z-index: 1001;
      overflow: hidden;
      transform-origin: top right;
    }

    .dropdown-menu.show, .dropdown-menu.opacity-100 {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }

    .dropdown-arrow.rotate-180 {
      transform: rotate(180deg);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: #374151;
      text-decoration: none;
      transition: all 0.2s;
      border-bottom: 1px solid #f3f4f6;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover {
      background-color: #f3f4f6;
      color: #4f46e5;
    }

    .dropdown-icon {
      font-size: 16px;
    }

    .content-wrapper {
      display: flex;
      flex: 1;
    }

    .sidebar {
      width: 250px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-menu li {
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .nav-menu a {
      display: block;
      padding: 15px 20px;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    .nav-menu a:hover {
      background-color: rgba(255,255,255,0.1);
      padding-left: 25px;
    }

    .nav-menu a.active {
      background-color: rgba(255,255,255,0.2);
      border-right: 3px solid #fff;
    }

    .language-section-separator {
      height: 1px;
      background: rgba(255,255,255,0.1);
      margin: 20px 0;
    }

    .main-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f5f5;
    }

    @media (max-width: 768px) {
      .navbar-content {
        padding: 0 16px;
      }

      .admin-title {
        font-size: 20px;
      }

      .sidebar {
        width: 240px;
      }

      .main-content {
        padding: 20px 16px;
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown && !profileDropdown.contains(event.target as Node)) {
      this.showProfileDropdown = false;
    }
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