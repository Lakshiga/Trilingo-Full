import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Equation } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-equations',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './equations.component.html',
  styleUrls: ['./equations.component.css']
})
export class EquationsComponent {
  @Input() content!: Equation;

  userAnswer: string | null = null;
  isAnswered: boolean = false;

  get isCorrect(): boolean {
    return this.userAnswer === this.content.correctAnswer;
  }

  handleOptionClick(option: string): void {
    if (this.isAnswered) return;
    this.userAnswer = option;
    this.isAnswered = true;
  }

  handleReset(): void {
    this.userAnswer = null;
    this.isAnswered = false;
  }
}