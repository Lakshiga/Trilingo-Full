import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DropdownCompletionContent, DropdownBlank } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-dropdown-completion',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './dropdown-completion.component.html',
  styleUrls: ['./dropdown-completion.component.css']
})
export class DropdownCompletionComponent implements OnInit {
  @Input() content!: DropdownCompletionContent;

  answers: Record<number, string> = {};
  isComplete: boolean = false;

  get isAllCorrect(): boolean {
    return this.content.sentences.every((s: any) => this.answers[s.id] === s.correctAnswer);
  }

  ngOnInit(): void {
    this.handleReset();
  }

  onSelectChange(event: any, sentenceId: number): void {
    if (this.isComplete) return;
    this.answers[sentenceId] = event.value;
  }

  handleCheckAnswers(): void {
    this.isComplete = true;
  }

  handleReset(): void {
    this.answers = {};
    this.isComplete = false;
  }
}
