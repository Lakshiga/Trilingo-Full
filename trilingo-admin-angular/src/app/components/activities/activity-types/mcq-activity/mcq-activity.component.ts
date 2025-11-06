import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MCQContent, MCQChoice } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-mcq-activity',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './mcq-activity.component.html',
  styleUrls: ['./mcq-activity.component.css']
})
export class McqActivityComponent {
  @Input() content!: MCQContent;

  selectedChoiceId: string | number | null = null;
  isAnswered: boolean = false;

  handleChoiceClick(choice: MCQChoice): void {
    if (this.isAnswered) return; // Prevent changing answer
    this.selectedChoiceId = choice.id;
    this.isAnswered = true;
  }

  getButtonVariant(choice: MCQChoice): 'raised' | 'outlined' {
    if (!this.isAnswered) return 'outlined';
    if (choice.isCorrect) return 'raised'; // Always highlight the correct answer
    if (this.selectedChoiceId === choice.id && !choice.isCorrect) return 'raised'; // Highlight the user's wrong choice
    return 'outlined';
  }

  getButtonColor(choice: MCQChoice): 'primary' | 'accent' | 'warn' {
    if (!this.isAnswered) return 'primary';
    if (choice.isCorrect) return 'accent'; // Success color
    if (this.selectedChoiceId === choice.id && !choice.isCorrect) return 'warn'; // Error color
    return 'primary';
  }

  handleTryAgain(): void {
    this.isAnswered = false;
    this.selectedChoiceId = null;
  }
}