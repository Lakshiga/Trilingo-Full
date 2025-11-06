import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface LetterItem {
  id: number;
  letter: string;
  audioUrl: string;
}

interface WordItem {
  id: number;
  word: string;
  wordAudioUrl: string;
  letters: LetterItem[];
}

interface SingleActivity {
  id: number;
  title?: string;
  description?: string;
  words: WordItem[];
}

export interface WordsLearningContent {
  title?: string;
  description?: string;
  activities: SingleActivity[];
}

@Component({
  selector: 'app-words-learning',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './words-learning.component.html',
  styleUrls: ['./words-learning.component.css']
})
export class WordsLearningComponent implements OnInit, OnChanges {
  @Input() content!: WordsLearningContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  currentActivityIndex = 0;
  currentWordIndex = 0;
  currentLetterIndex = -1;
  isPlaying = false;
  isActivityFinished = false;
  isAllFinished = false;
  phase: 'word' | 'letters' | 'transition' = 'word';

  get currentActivity(): SingleActivity | undefined {
    return this.content.activities[this.currentActivityIndex];
  }

  get currentWords(): WordItem[] {
    return this.currentActivity?.words || [];
  }

  get currentWord(): WordItem | undefined {
    return this.currentWords[this.currentWordIndex];
  }

  get currentLetter(): LetterItem | undefined {
    return this.currentWord?.letters[this.currentLetterIndex];
  }

  ngOnInit(): void {
    this.initializeActivity();
  }

  ngOnChanges(): void {
    this.initializeActivity();
  }

  private initializeActivity(): void {
    if (this.content?.activities && this.content.activities.length > 0) {
      this.currentActivityIndex = 0;
      this.currentWordIndex = 0;
      this.currentLetterIndex = -1;
      this.phase = 'word';
      this.isActivityFinished = false;
      this.isAllFinished = false;
      this.isPlaying = false;
      this.startWordPhase();
    }
  }

  private startWordPhase(): void {
    if (!this.currentWord) return;

    this.phase = 'word';
    this.currentLetterIndex = -1;
    
    setTimeout(() => {
      this.playAudio(this.currentWord!.wordAudioUrl, () => {
        this.phase = 'letters';
        this.currentLetterIndex = 0;
        this.startLetterPhase();
      });
    }, 500);
  }

  private startLetterPhase(): void {
    if (!this.currentWord || this.currentLetterIndex < 0 || this.currentLetterIndex >= this.currentWord.letters.length) {
      this.phase = 'transition';
      setTimeout(() => {
        this.currentWordIndex++;
        if (this.currentWordIndex >= this.currentWords.length) {
          this.isActivityFinished = true;
        } else {
          this.startWordPhase();
        }
      }, 1000);
      return;
    }

    const currentLetter = this.currentWord.letters[this.currentLetterIndex];
    
    setTimeout(() => {
      this.playAudio(currentLetter.audioUrl, () => {
        if (this.currentLetterIndex < this.currentWord!.letters.length - 1) {
          this.currentLetterIndex++;
          this.startLetterPhase();
        } else {
          this.phase = 'transition';
          setTimeout(() => {
            this.currentWordIndex++;
            if (this.currentWordIndex >= this.currentWords.length) {
              this.isActivityFinished = true;
            } else {
              this.startWordPhase();
            }
          }, 1000);
        }
      });
    }, 800);
  }

  playAudio(audioUrl: string, onEnded?: () => void): void {
    if (audioUrl && this.audioPlayer?.nativeElement) {
      this.isPlaying = true;
      this.audioPlayer.nativeElement.src = audioUrl;
      
      const handleEnded = () => {
        this.isPlaying = false;
        if (onEnded) onEnded();
        this.audioPlayer.nativeElement?.removeEventListener('ended', handleEnded);
      };
      
      this.audioPlayer.nativeElement.addEventListener('ended', handleEnded);
      this.audioPlayer.nativeElement.play().catch(e => {
        console.error("Audio playback failed:", e);
        this.isPlaying = false;
        if (onEnded) onEnded();
      });
    }
  }

  handleNextActivity(): void {
    if (this.currentActivityIndex < this.content.activities.length - 1) {
      this.currentActivityIndex++;
      this.currentWordIndex = 0;
      this.currentLetterIndex = -1;
      this.phase = 'word';
      this.isActivityFinished = false;
      this.startWordPhase();
    } else {
      this.isAllFinished = true;
    }
  }

  restartAllActivities(): void {
    this.initializeActivity();
  }
}
