import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-highlight',
  standalone: true,
  templateUrl: './highlight.component.html'
})
export class HighlightComponent {
  // Accept content input for preview wiring
  @Input() content: any;
}


