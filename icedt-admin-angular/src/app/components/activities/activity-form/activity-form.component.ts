import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { Activity } from '../../../types/activity.types';
import { MainActivity } from '../../../types/main-activity.types';
import { ActivityType } from '../../../types/activity-type.types';
import { MultilingualText } from '../../../types/multilingual.types';
import { MultilingualInputComponent } from '../../common/multilingual-input.component';

@Component({
  selector: 'app-activity-form',
  standalone: true,
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
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
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