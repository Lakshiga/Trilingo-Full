import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
// MatTypographyModule is not available in Angular Material v19
import { MatCardModule } from '@angular/material/card';
import { Activity } from '../../types/activity.types';
import { ActivityRendererComponent } from './activity-renderer.component';

@Component({
  selector: 'app-device-preview',
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCardModule,
    ActivityRendererComponent
  ],
  template: `
    <div class="device-preview">
      <div class="controls">
        <mat-button-toggle-group 
          [value]="device" 
          (change)="onDeviceChange($event)"
          class="control-group">
          <mat-button-toggle value="phone">
            <mat-icon>phone_iphone</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="tablet">
            <mat-icon>tablet_mac</mat-icon>
          </mat-button-toggle>
        </mat-button-toggle-group>
        
        <mat-button-toggle-group 
          [value]="orientation" 
          (change)="onOrientationChange($event)"
          class="control-group">
          <mat-button-toggle value="portrait">
            <mat-icon>stay_current_portrait</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="landscape">
            <mat-icon>stay_current_landscape</mat-icon>
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>
      
      <div class="preview-container">
        <mat-card 
          class="device-frame" 
          [ngClass]="[device, orientation]"
          [style]="getFrameStyles()">
          <div class="content-area">
            <app-activity-renderer 
              *ngIf="activityData.activityTypeId && parsedContent" 
              [activityTypeId]="activityData.activityTypeId"
              [content]="parsedContent">
            </app-activity-renderer>
            <p *ngIf="!activityData.activityTypeId || !parsedContent" class="placeholder">
              Select an activity type and provide JSON.
            </p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .device-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .controls {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .control-group {
      background-color: white;
    }

    .preview-container {
      display: flex;
      justify-content: center;
    }

    .device-frame {
      border-radius: 8px;
      overflow: hidden;
      transition: width 0.4s ease, height 0.4s ease;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .content-area {
      width: 100%;
      height: 100%;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .placeholder {
      padding: 16px;
      text-align: center;
      color: #666;
    }

    /* Device dimensions */
    .device-frame.phone.portrait {
      width: 375px;
      height: 667px;
    }

    .device-frame.phone.landscape {
      width: 667px;
      height: 375px;
    }

    .device-frame.tablet.portrait {
      width: 540px;
      height: 720px;
    }

    .device-frame.tablet.landscape {
      width: 720px;
      height: 540px;
    }
  `]
})
export class DevicePreviewComponent {
  @Input() activityData: Partial<Activity> = {};

  device: 'phone' | 'tablet' = 'phone';
  orientation: 'portrait' | 'landscape' = 'portrait';

  get parsedContent(): any {
    if (!this.activityData.contentJson) {
      return null;
    }

    try {
      return JSON.parse(this.activityData.contentJson);
    } catch (e) {
      return { error: 'Invalid JSON' };
    }
  }

  onDeviceChange(event: any): void {
    this.device = event.value;
  }

  onOrientationChange(event: any): void {
    this.orientation = event.value;
  }

  getFrameStyles(): string {
    const deviceDimensions = {
      phone: { width: 375, height: 667 },
      tablet: { width: 540, height: 720 }
    };

    const currentDimensions = deviceDimensions[this.device];
    const isLandscape = this.orientation === 'landscape';

    const width = isLandscape ? currentDimensions.height : currentDimensions.width;
    const height = isLandscape ? currentDimensions.width : currentDimensions.height;

    return `width: ${width}px; height: ${height}px;`;
  }
}
