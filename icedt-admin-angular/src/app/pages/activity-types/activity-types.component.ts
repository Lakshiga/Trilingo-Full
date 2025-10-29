import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineCrudTableComponent } from '../../components/common/inline-crud-table.component';
import { ActivityTypeApiService } from '../../services/activity-type-api.service';
import { ActivityType } from '../../types/activity-type.types';

interface ActivityTypeCreateDto {
  name_en: string;
  name_ta: string;
  name_si: string;
}

@Component({
  selector: 'app-activity-types',
  standalone: true,
  imports: [
    CommonModule,
    InlineCrudTableComponent
  ],
  templateUrl: './activity-types.component.html',
  styleUrls: ['./activity-types.component.css']
})
export class ActivityTypesPageComponent {
  columns = [
    { field: 'name_en' as keyof ActivityType, headerName: 'English Name', type: 'string' as const },
    { field: 'name_ta' as keyof ActivityType, headerName: 'Tamil Name', type: 'string' as const },
    { field: 'name_si' as keyof ActivityType, headerName: 'Sinhala Name', type: 'string' as const }
  ];

  apiService = {
    getAll: () => this.activityTypeApiService.getAll(),
    create: (item: ActivityTypeCreateDto) => this.activityTypeApiService.create(item),
    update: (id: number, item: Partial<ActivityTypeCreateDto>) => this.activityTypeApiService.update(id, item),
    deleteItem: (id: number) => this.activityTypeApiService.deleteItem(id)
  };

  constructor(private activityTypeApiService: ActivityTypeApiService) {}
}