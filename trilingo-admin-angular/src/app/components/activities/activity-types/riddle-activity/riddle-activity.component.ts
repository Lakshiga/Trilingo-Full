import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface RiddleChoice {
  id: number;
  text: string;
  imageUrl: string;
}

export interface RiddleContent {
  id: number;
  title: string;
  riddleText: string;
  riddleAudioUrl: string;
  choices: RiddleChoice[];
  correctChoiceId: number;
}

@Component({
  selector: 'app-riddle-activity',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './riddle-activity.component.html',
  styleUrls: ['./riddle-activity.component.css']
})
export class RiddleActivityComponent implements OnInit, OnDestroy {
  @Input() content!: RiddleContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  selectedId: number | null = null;
  showResult = false;
  private mediaBaseUrl = '';

  get isCorrect(): boolean {
    return this.selectedId === this.content.correctChoiceId;
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  playRiddleAudio(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = `${this.mediaBaseUrl}${this.content.riddleAudioUrl}`;
      this.audioElement.nativeElement.play().catch(e => 
        console.error("Audio playback failed:", e)
      );
    }
  }

  handleChoiceSelect(choiceId: number): void {
    if (this.showResult) return;
    
    this.selectedId = choiceId;
    this.showResult = true;
  }

  handleReset(): void {
    this.selectedId = null;
    this.showResult = false;
  }
}
