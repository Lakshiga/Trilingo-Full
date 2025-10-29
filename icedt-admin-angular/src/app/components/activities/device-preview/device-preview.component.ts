import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Activity } from '../../../types/activity.types';
import { ActivityRendererComponent } from '../activity-renderer/activity-renderer.component';

@Component({
  selector: 'app-device-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCardModule,
    ActivityRendererComponent
  ],
  templateUrl: './device-preview.component.html',
  styleUrls: ['./device-preview.component.css']
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
      const parsed = JSON.parse(this.activityData.contentJson);
      return Array.isArray(parsed) ? (parsed[0] || null) : parsed;
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