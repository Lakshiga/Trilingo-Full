import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainActivitiesTableComponent } from '../../components/common/main-activities-table.component';

@Component({
  selector: 'app-main-activities',
  imports: [CommonModule, MainActivitiesTableComponent],
  templateUrl: './main-activities.component.html'
})
export class MainActivitiesPageComponent {
}


