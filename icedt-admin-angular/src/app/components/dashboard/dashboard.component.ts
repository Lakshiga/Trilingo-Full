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
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p class="welcome-message">Welcome back! Here's what's happening with your Tamil learning platform.</p>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>extension</mat-icon>
              </div>
              <div class="card-info">
                <h3>TOTAL ACTIVITIES</h3>
                <div class="card-value">{{ totalActivities }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>games</mat-icon>
              </div>
              <div class="card-info">
                <h3>TOTAL GAMES</h3>
                <div class="card-value">{{ totalGames }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="card-info">
                <h3>TOTAL USERS</h3>
                <div class="card-value">{{ totalUsers }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>attach_money</mat-icon>
              </div>
              <div class="card-info">
                <h3>TOTAL REVENUE</h3>
                <div class="card-value">{{ totalRevenue }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Activities Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container">
              <div class="chart-placeholder">
                <mat-icon>show_chart</mat-icon>
                <p>Activities Growth Chart</p>
                <div class="chart-data">
                  <div class="chart-line"></div>
                  <div class="chart-points">
                    <span class="point" style="left: 10%; bottom: 20%;"></span>
                    <span class="point" style="left: 30%; bottom: 40%;"></span>
                    <span class="point" style="left: 50%; bottom: 60%;"></span>
                    <span class="point" style="left: 70%; bottom: 80%;"></span>
                    <span class="point" style="left: 90%; bottom: 70%;"></span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>User Engagement Distribution</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container">
              <div class="pie-chart-placeholder">
                <div class="pie-chart">
                  <div class="pie-slice slice-1" style="--percentage: 60%; --color: #4CAF50;"></div>
                  <div class="pie-slice slice-2" style="--percentage: 25%; --color: #2196F3;"></div>
                  <div class="pie-slice slice-3" style="--percentage: 15%; --color: #FF9800;"></div>
                </div>
                <div class="pie-legend">
                  <div class="legend-item">
                    <span class="legend-color" style="background: #4CAF50;"></span>
                    <span>Active Users (60%)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color" style="background: #2196F3;"></span>
                    <span>New Users (25%)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color" style="background: #FF9800;"></span>
                    <span>Returning Users (15%)</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button mat-raised-button color="primary" (click)="navigateTo('/levels')">
            <mat-icon>school</mat-icon>
            Manage Levels
          </button>
          <button mat-raised-button color="accent" (click)="navigateTo('/main-activities')">
            <mat-icon>extension</mat-icon>
            Manage Activities
          </button>
          <button mat-raised-button color="warn" (click)="navigateTo('/games')">
            <mat-icon>games</mat-icon>
            Manage Games
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0;
      background: white;
    }

    .dashboard-header {
      margin-bottom: 30px;
    }

    .dashboard-header h1 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 28px;
      font-weight: bold;
    }

    .welcome-message {
      color: #666;
      font-size: 16px;
      margin: 0;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .card-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .card-icon {
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-icon mat-icon {
      font-size: 30px;
      width: 30px;
      height: 30px;
    }

    .card-info h3 {
      margin: 0 0 5px 0;
      font-size: 14px;
      font-weight: 500;
      opacity: 0.9;
    }

    .card-value {
      font-size: 32px;
      font-weight: bold;
      margin: 0;
    }

    .charts-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    .chart-card {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .chart-container {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chart-placeholder {
      text-align: center;
      color: #666;
    }

    .chart-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 10px;
      color: #1976d2;
    }

    .chart-data {
      position: relative;
      width: 200px;
      height: 100px;
      margin: 20px auto;
    }

    .chart-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #1976d2, #42a5f5);
      transform: translateY(-50%);
    }

    .chart-points {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .point {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #1976d2;
      border-radius: 50%;
      transform: translate(-50%, 50%);
    }

    .pie-chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .pie-chart {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: conic-gradient(
        #4CAF50 0deg 216deg,
        #2196F3 216deg 306deg,
        #FF9800 306deg 360deg
      );
      position: relative;
    }

    .pie-legend {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .quick-actions {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
    }

    .quick-actions h2 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 20px;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .summary-cards {
        grid-template-columns: 1fr;
      }

      .charts-section {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
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
