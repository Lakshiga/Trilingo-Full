import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// MatTypographyModule is not available in Angular Material v19
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Activity } from '../../types/activity.types';
import { ActivityRendererComponent } from './activity-renderer.component';

@Component({
  selector: 'app-activity-player-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    ActivityRendererComponent
  ],
  template: `
    <div class="modal-container" *ngIf="isOpen">
      <div class="device-toggle">
        <mat-button-toggle-group 
          [value]="device" 
          (change)="onDeviceChange($event)"
          class="device-toggle-group">
          <mat-button-toggle value="phone">
            <mat-icon>phone_iphone</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="tablet">
            <mat-icon>tablet_mac</mat-icon>
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <div class="device-frame" [ngClass]="device" [style]="getDeviceStyles()">
        <button 
          mat-icon-button 
          class="close-button" 
          (click)="onClose()"
          aria-label="Close">
          <mat-icon>close</mat-icon>
        </button>

        <div class="header">
          <h3>{{ activity?.title }}</h3>
        </div>

        <div class="exercise-info" *ngIf="isActivityPaginated">
          <span>Exercise {{ currentExerciseIndex + 1 }} of {{ exercises.length }}</span>
        </div>

        <div class="content-area">
          <mat-spinner *ngIf="isLoading"></mat-spinner>
          <app-activity-renderer 
            *ngIf="!isLoading && activity" 
            [activityTypeId]="activity.activityTypeId"
            [content]="currentExerciseData">
          </app-activity-renderer>
          <p *ngIf="!isLoading && !activity" class="error-message">
            Could not load activity.
          </p>
        </div>

        <div class="navigation" *ngIf="isActivityPaginated">
          <button 
            mat-button 
            (click)="goToPrevExercise()" 
            [disabled]="currentExerciseIndex === 0">
            <mat-icon>arrow_back_ios</mat-icon>
            Prev Exercise
          </button>
          <button 
            mat-button 
            (click)="goToNextExercise()" 
            [disabled]="currentExerciseIndex >= exercises.length - 1">
            Next Exercise
            <mat-icon>arrow_forward_ios</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .device-toggle {
      margin-bottom: 16px;
    }

    .device-toggle-group {
      background-color: white;
      border-radius: 20px;
    }

    .device-frame {
      border-radius: 40px;
      border: 12px solid #333;
      background-color: white;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      transition: width 0.3s, height 0.3s;
    }

    .device-frame.phone {
      width: 375px;
      height: 667px;
    }

    .device-frame.tablet {
      width: 540px;
      height: 720px;
    }

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 10;
      color: #aaa;
      background-color: rgba(0, 0, 0, 0.1);
    }

    .header {
      padding: 16px;
      border-bottom: 1px solid #eee;
      text-align: center;
      flex-shrink: 0;
    }

    .header h3 {
      margin: 0;
      font-weight: bold;
    }

    .exercise-info {
      padding: 8px;
      border-top: 1px solid #eee;
      background-color: #f9f9f9;
      text-align: center;
      flex-shrink: 0;
      font-size: 0.875rem;
    }

    .content-area {
      flex-grow: 1;
      overflow-y: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .error-message {
      color: #f44336;
      text-align: center;
    }

    .navigation {
      padding: 8px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      background-color: #f9f9f9;
    }
  `]
})
export class ActivityPlayerModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() activity: Activity | null = null;
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();

  device: 'phone' | 'tablet' = 'phone';
  currentExerciseIndex: number = 0;
  exercises: any[] = [];

  get isActivityPaginated(): boolean {
    return this.exercises.length > 1;
  }

  get currentExerciseData(): any {
    return this.exercises[this.currentExerciseIndex] || {};
  }

  ngOnInit(): void {
    this.parseExercises();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.currentExerciseIndex = 0;
    }
    if (changes['activity']) {
      this.parseExercises();
    }
  }

  private parseExercises(): void {
    if (!this.activity?.contentJson) {
      this.exercises = [];
      return;
    }

    try {
      const parsedContent = JSON.parse(this.activity.contentJson);
      this.exercises = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
    } catch {
      this.exercises = [{ error: "Invalid Activity JSON format." }];
    }
  }

  onDeviceChange(event: any): void {
    this.device = event.value;
  }

  getDeviceStyles(): string {
    const styles = this.device === 'phone' 
      ? 'width: 375px; height: 667px;' 
      : 'width: 540px; height: 720px;';
    return styles;
  }

  goToNextExercise(): void {
    this.currentExerciseIndex = Math.min(this.currentExerciseIndex + 1, this.exercises.length - 1);
  }

  goToPrevExercise(): void {
    this.currentExerciseIndex = Math.max(this.currentExerciseIndex - 1, 0);
  }

  onClose(): void {
    this.close.emit();
  }
}
