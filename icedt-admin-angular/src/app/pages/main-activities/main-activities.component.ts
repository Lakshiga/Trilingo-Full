import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainActivitiesTableComponent } from '../../components/common/main-activities-table.component';

@Component({
  selector: 'app-main-activities',
  imports: [CommonModule, MainActivitiesTableComponent],
  template: `
    <app-main-activities-table></app-main-activities-table>
  `
})
export class MainActivitiesPageComponent {
}


