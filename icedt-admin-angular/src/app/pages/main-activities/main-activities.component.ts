import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineCrudTableComponent } from '../../components/common/inline-crud-table.component';
import { MainActivityApiService, MainActivityCreateDto } from '../../services/main-activity-api.service';
import { MainActivity } from '../../types/main-activity.types';

@Component({
  selector: 'app-main-activities',
  imports: [CommonModule, InlineCrudTableComponent],
  template: `
    <app-inline-crud-table
      entityName="Main Activity"
      [apiService]="apiService"
      [columns]="columns"
      idField="id">
    </app-inline-crud-table>
  `
})
export class MainActivitiesPageComponent {
  columns = [
    { field: 'name' as keyof MainActivity, headerName: 'Activity Name', type: 'string' as const }
  ];

  constructor(public apiService: MainActivityApiService) {}
}


