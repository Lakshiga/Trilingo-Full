import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelsTableComponent } from '../common/levels-table.component';

@Component({
  selector: 'app-levels',
  imports: [CommonModule, LevelsTableComponent],
  template: `
    <app-levels-table></app-levels-table>
  `
})
export class LevelsComponent {
}