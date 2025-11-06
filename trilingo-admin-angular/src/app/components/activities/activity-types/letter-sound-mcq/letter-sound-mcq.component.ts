import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface OptionItem {
  id: number;
  letter: string;
  imageUrl: string;
}

interface QuestionItem {
  id: number;
  questionAudioUrl: string;
  correctAnswerId: number;
  options: OptionItem[];
}

export interface LetterSoundMcqContent {
  title?: string;
  description?: string;
  questions: QuestionItem[];
}

@Component({
  selector: 'app-letter-sound-mcq',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './letter-sound-mcq.component.html',
  styleUrls: ['./letter-sound-mcq.component.css']
})
export class LetterSoundMcqComponent implements OnInit, OnChanges {
  @Input() content!: LetterSoundMcqContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  currentQuestionIndex = 0;
  currentOptions: OptionItem[] = [];
  score = 0;
  isAnswered = false;
  selectedOptionId: number | null = null;
  isFinished = false;

  get currentQuestion(): QuestionItem | undefined {
    return this.content.questions[this.currentQuestionIndex];
  }

  ngOnInit(): void {
    this.initializeGame();
  }

  ngOnChanges(): void {
    this.initializeGame();
  }

  private initializeGame(): void {
    if (this.content?.questions && this.content.questions.length > 0) {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.isFinished = false;
      this.loadCurrentQuestion();
    }
  }

  private loadCurrentQuestion(): void {
    if (this.currentQuestionIndex >= this.content.questions.length) {
      this.isFinished = true;
      return;
    }

    const currentQuestion = this.content.questions[this.currentQuestionIndex];
    if (!currentQuestion) return;

    // Shuffle options
    this.currentOptions = [...currentQuestion.options].sort(() => 0.5 - Math.random());
    
    // Reset states
    this.isAnswered = false;
    this.selectedOptionId = null;

    // Play question audio
    this.playAudio(currentQuestion.questionAudioUrl);
  }

  handleOptionClick(option: OptionItem): void {
    if (this.isAnswered) return;

    this.isAnswered = true;
    this.selectedOptionId = option.id;

    if (option.id === this.currentQuestion?.correctAnswerId) {
      this.score++;
    }

    // Move to next question after delay
    setTimeout(() => {
      this.currentQuestionIndex++;
      this.loadCurrentQuestion();
    }, 1500);
  }

  playAudio(audioUrl?: string): void {
    if (audioUrl && this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.src = audioUrl;
      this.audioPlayer.nativeElement.play().catch(e => 
        console.error("Audio playback failed:", e)
      );
    }
  }

  getImageUrl(imageUrl: string): string {
    // Assuming you have a media base URL
    return imageUrl;
  }

  restartGame(): void {
    this.initializeGame();
  }
}
