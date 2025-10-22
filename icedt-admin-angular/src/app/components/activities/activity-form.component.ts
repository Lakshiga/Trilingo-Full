import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Activity } from '../../types/activity.types';
import { MainActivity } from '../../types/main-activity.types';
import { ActivityType } from '../../types/activity-type.types';
import { MultilingualText, MultilingualUtils } from '../../types/multilingual.types';
import { MultilingualInputComponent } from '../common/multilingual-input.component';

@Component({
  selector: 'app-activity-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatCardModule,
    MultilingualInputComponent
  ],
  template: `
    <mat-card class="activity-form-card">
      <mat-card-content>
        <h2>Activity Details</h2>
        
        <!-- Multilingual Activity Title -->
        <div class="form-section">
          <app-multilingual-input
            [value]="getTitleValue()"
            [label]="'Activity Title'"
            [placeholder]="getTitlePlaceholder()"
            [required]="true"
            (valueChange)="onTitleChange($event)">
          </app-multilingual-input>
        </div>
        
        <!-- Sequence Order -->
        <div class="form-section">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Sequence Order</mat-label>
            <input 
              matInput 
              type="number" 
              name="sequenceOrder" 
              [(ngModel)]="activityData.sequenceOrder" 
              (ngModelChange)="onDataChange()"
              placeholder="Enter sequence order"
              required>
          </mat-form-field>
        </div>
        
        <!-- Main Activity Category -->
        <div class="form-section">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Main Activity Category</mat-label>
            <mat-select 
              name="mainActivityId" 
              [(ngModel)]="activityData.mainActivityId" 
              (ngModelChange)="onDataChange()"
              required>
              <mat-option *ngFor="let ma of mainActivities" [value]="ma.id">
                {{ ma.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <!-- Activity Type -->
        <div class="form-section">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Activity Type</mat-label>
            <mat-select 
              name="activityTypeId" 
              [(ngModel)]="activityData.activityTypeId" 
              (ngModelChange)="onDataChange()"
              required>
              <mat-option *ngFor="let at of activityTypes" [value]="at.activityTypeId">
                {{ at.activityName }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .activity-form-card {
      margin: 16px 0;
    }
    
    .form-section {
      margin-bottom: 24px;
    }
    
    .full-width {
      width: 100%;
    }
    
    h2 {
      margin: 0 0 24px 0;
      font-weight: 500;
      color: #1976d2;
    }
  `]
})
export class ActivityFormComponent {
  @Input() activityData: Partial<Activity> = {};
  @Input() mainActivities: MainActivity[] = [];
  @Input() activityTypes: ActivityType[] = [];
  @Output() dataChange = new EventEmitter<Partial<Activity>>();

  onDataChange(): void {
    this.dataChange.emit({ ...this.activityData });
  }

  getTitleValue(): MultilingualText {
    return this.activityData.title || { ta: '', en: '', si: '' };
  }

  getTitlePlaceholder(): MultilingualText {
    return {
      ta: 'செயல்பாட்டின் தலைப்பை உள்ளிடவும்',
      en: 'Enter activity title',
      si: 'ක්‍රියාකාරකමේ මාතෘකාව ඇතුළත් කරන්න'
    };
  }

  onTitleChange(newTitle: MultilingualText): void {
    this.activityData = { ...this.activityData, title: newTitle };
    this.onDataChange();
  }
}
