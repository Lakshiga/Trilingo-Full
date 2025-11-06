import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityTypesTableComponent } from '../common/activity-types-table.component';

@Component({
  selector: 'app-activity-types',
  standalone: true,
  imports: [CommonModule, ActivityTypesTableComponent],
  template: '<app-activity-types-table></app-activity-types-table>'
})
export class ActivityTypesComponent {
}