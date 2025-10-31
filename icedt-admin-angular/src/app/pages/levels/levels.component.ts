import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { InlineCrudTableComponent } from '../../components/common/inline-crud-table.component';
import { LevelApiService } from '../../services/level-api.service';
import { Level } from '../../types/level.types';

interface LevelCreateDto {
  name_en: string;
  name_ta: string;
  name_si: string;
  languageId: number;
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
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css']
})

export class LevelsPageComponent {
  columns = [
    { field: 'name_en' as keyof Level, headerName: 'English Name', type: 'string' as const },
    { field: 'name_ta' as keyof Level, headerName: 'Tamil Name', type: 'string' as const },
    { field: 'name_si' as keyof Level, headerName: 'Sinhala Name', type: 'string' as const },
    { field: 'languageId' as keyof Level, headerName: 'Language ID', type: 'number' as const }
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