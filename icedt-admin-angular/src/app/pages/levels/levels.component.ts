import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { InlineCrudTableComponent } from '../../components/common/inline-crud-table.component';
import { LevelApiService } from '../../services/level-api.service';
import { Level } from '../../types/level.types';

interface LevelCreateDto {
  levelName: string;
  description?: string;
  sequenceOrder: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink,
    InlineCrudTableComponent
  ],
  template: `
    <app-inline-crud-table
      entityName="Level"
      [apiService]="apiService"
      [columns]="columns"
      idField="levelId"
      [renderCustomActions]="renderCustomLevelActions">
    </app-inline-crud-table>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
    }
  `]
})
export class LevelsPageComponent {
  columns = [
    { field: 'levelName' as keyof Level, headerName: 'Level Name', type: 'string' as const },
    { field: 'description' as keyof Level, headerName: 'Description', type: 'string' as const },
    { field: 'sequenceOrder' as keyof Level, headerName: 'Sequence Order', type: 'number' as const }
  ];

  apiService = {
    getAll: () => this.levelApiService.getAll(),
    create: (item: LevelCreateDto) => this.levelApiService.create(item),
    update: (id: number, item: Partial<LevelCreateDto>) => this.levelApiService.update(id, item),
    deleteItem: (id: number) => this.levelApiService.deleteItem(id)
  };

  renderCustomLevelActions = (level: Level) => {
    return `<a mat-button routerLink="/lessons" [queryParams]="{levelId: ${level.levelId}}" class="manage-lessons-btn">
      Manage Lessons
    </a>`;
  };

  constructor(private levelApiService: LevelApiService) {}
}