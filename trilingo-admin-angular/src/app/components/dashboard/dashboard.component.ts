import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalActivities = 0;
  totalGames = 0;
  totalUsers = 0;
  totalRevenue = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Simulate loading dashboard data
    // In a real application, this would fetch from APIs
    setTimeout(() => {
      this.totalActivities = 156;
      this.totalGames = 23;
      this.totalUsers = 1247;
      this.totalRevenue = 15680;
    }, 500);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
