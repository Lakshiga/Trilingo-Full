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
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      color: #334155;
      padding: 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      z-index: 1000;
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      height: 72px;
    }

    .navbar-left {
      flex: 1;
    }

    .admin-title {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      color: transparent;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      -webkit-background-clip: text;
      background-clip: text;
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
      gap: 12px;
      padding: 10px 16px;
      border-radius: 9999px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .profile-icon:hover {
      background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%);
      box-shadow: 0 4px 6px rgba(0,0,0,0.08);
      transform: translateY(-1px);
    }

    .user-avatar {
      font-size: 24px;
    }

    .user-name {
      font-weight: 600;
      color: #334155;
    }

    .dropdown-arrow {
      font-size: 14px;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: #64748b;
    }

    .profile-dropdown:hover .dropdown-arrow {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 1rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
      min-width: 15rem;
      opacity: 0;
      visibility: hidden;
      transform: scale(0.95);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1001;
      overflow: hidden;
      transform-origin: top right;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(0,0,0,0.05);
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
      padding: 14px 20px;
      color: #374151;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border-bottom: 1px solid #f1f5f9;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover {
      background-color: #f1f5f9;
      color: #4f46e5;
      transform: translateX(4px);
    }

    .dropdown-icon {
      font-size: 18px;
    }

    .content-wrapper {
      display: flex;
      flex: 1;
    }

    .sidebar {
      width: 256px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 0;
      box-shadow: 4px 0 15px rgba(0,0,0,0.15);
    }

    .sidebar-header {
      padding: 24px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-menu li {
      border-bottom: 1px solid rgba(255,255,255,0.05);
      margin-bottom: 4px;
    }

    .nav-menu a {
      display: block;
      padding: 16px 20px;
      color: white;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 1rem;
      font-weight: 500;
      border-radius: 0 9999px 9999px 0;
      margin: 0 8px;
    }

    .nav-menu a:hover {
      background-color: rgba(255,255,255,0.1);
      padding-left: 28px;
      transform: translateX(4px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .nav-menu a.active {
      background-color: rgba(255,255,255,0.15);
      border-right: 4px solid #fff;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
    }

    .language-section-separator {
      height: 1px;
      background: rgba(255,255,255,0.1);
      margin: 24px 0;
    }

    .main-content {
      flex: 1;
      padding: 24px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }

    @media (max-width: 768px) {
      .navbar-content {
        padding: 0 16px;
      }

      .admin-title {
        font-size: 24px;
      }

      .sidebar {
        width: 240px;
      }

      .main-content {
        padding: 20px 16px;
      }
      
      .nav-menu {
        display: flex;
        overflow-x: auto;
      }
      
      .nav-menu li {
        border-bottom: none;
        border-right: 1px solid rgba(255,255,255,0.1);
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