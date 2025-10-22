import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineCrudTableComponent } from '../../components/common/inline-crud-table.component';
import { ActivityTypeApiService } from '../../services/activity-type-api.service';
import { ActivityType } from '../../types/activity-type.types';

interface ActivityTypeCreateDto {
  activityName: string;
}

@Component({
  selector: 'app-activity-types',
  standalone: true,
  imports: [
    CommonModule,
    InlineCrudTableComponent
  ],
  template: `
    <app-inline-crud-table
      entityName="Activity Type"
      [apiService]="apiService"
      [columns]="columns"
      idField="activityTypeId">
    </app-inline-crud-table>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
    }
  `]
})
export class ActivityTypesPageComponent {
  columns = [
    { field: 'activityName' as keyof ActivityType, headerName: 'Activity Type Name', type: 'string' as const }
  ];

  apiService = {
    getAll: () => this.activityTypeApiService.getAll(),
    create: (item: ActivityTypeCreateDto) => this.activityTypeApiService.create(item),
    update: (id: number, item: Partial<ActivityTypeCreateDto>) => this.activityTypeApiService.update(id, item),
    deleteItem: (id: number) => this.activityTypeApiService.deleteItem(id)
  };

  constructor(private activityTypeApiService: ActivityTypeApiService) {}
}