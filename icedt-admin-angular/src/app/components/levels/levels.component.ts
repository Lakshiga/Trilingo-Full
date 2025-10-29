import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelsTableComponent } from '../common/levels-table.component';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule, LevelsTableComponent],
  templateUrl: './levels.component.html'
})
export class LevelsComponent {
}