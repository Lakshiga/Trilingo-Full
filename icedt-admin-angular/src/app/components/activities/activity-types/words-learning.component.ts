import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTypographyModule } from '@angular/material/typography';
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
    MatTypographyModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  template: `
    <div class="words-learning" *ngIf="!isAllFinished">
      <h1>{{ content.title || 'சொற்கள் கற்றல்' }}</h1>
      <p>{{ content.description || 'சொற்களையும் அவற்றின் எழுத்துக்களையும் கேட்டு கற்றுக்கொள்ளுங்கள்' }}</p>
      
      <!-- Activity Progress -->
      <div class="activity-progress">
        <p>பயிற்சி {{ currentActivityIndex + 1 }} / {{ content.activities.length }}: {{ currentActivity?.title || `பயிற்சி ${currentActivityIndex + 1}` }}</p>
        <mat-progress-bar 
          mode="determinate" 
          [value]="((currentActivityIndex + 1) / content.activities.length) * 100">
        </mat-progress-bar>
      </div>
      
      <!-- Word Progress -->
      <p class="word-progress">சொல் {{ currentWordIndex + 1 }} / {{ currentWords.length }}</p>
      
      <!-- Main Content Area -->
      <div class="content-area">
        <div *ngIf="phase === 'word'" class="word-phase">
          <h2 class="word-display">{{ currentWord?.word }}</h2>
          <div *ngIf="isPlaying" class="playing-indicator">
            <mat-icon color="primary">volume_up</mat-icon>
            <span>முழு சொல்லைக் கேளுங்கள்...</span>
          </div>
        </div>
        
        <div *ngIf="phase === 'letters' && currentLetter" class="letters-phase">
          <p>எழுத்து எழுத்தாக:</p>
          <h1 class="letter-display">{{ currentLetter.letter }}</h1>
          <div *ngIf="isPlaying" class="playing-indicator">
            <mat-icon color="accent">volume_up</mat-icon>
            <span>எழுத்தைக் கேளுங்கள்...</span>
          </div>
          <p class="letter-progress">எழுத்து {{ currentLetterIndex + 1 }} / {{ currentWord?.letters.length }}</p>
        </div>
        
        <div *ngIf="phase === 'transition'" class="transition-phase">
          <h3 class="success-message">✅ சொல் முடிந்தது!</h3>
          <p>அடுத்த சொல்லுக்குச் செல்கிறோம்...</p>
        </div>
      </div>
      
      <audio #audioPlayer style="display: none;"></audio>
    </div>
    
    <!-- Activity Finished Screen -->
    <div class="activity-finished" *ngIf="isActivityFinished && !isAllFinished">
      <h2>✅ பயிற்சி முடிந்தது!</h2>
      <p>பயிற்சி {{ currentActivityIndex + 1 }} / {{ content.activities.length }} முடிந்தது</p>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="handleNextActivity()">
        {{ currentActivityIndex === content.activities.length - 1 ? 'முடிவு' : 'அடுத்த பயிற்சி' }}
      </button>
    </div>
    
    <!-- All Finished Screen -->
    <div class="all-finished" *ngIf="isAllFinished">
      <h1>🎉 வாழ்த்துக்கள்!</h1>
      <h2>அனைத்து பயிற்சிகளும் முடிந்தன!</h2>
      <p>நீங்கள் {{ content.activities.length }} செயல்பாடுகளை வெற்றிகரமாக முடித்துள்ளீர்கள்!</p>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="restartAllActivities()">
        மீண்டும் முயற்சி செய்க
      </button>
    </div>
    
    <mat-spinner *ngIf="!currentActivity || !currentWords || currentWords.length === 0" class="loading-spinner"></mat-spinner>
  `,
  styles: [`
    .words-learning {
      padding: 24px;
      text-align: center;
      font-family: sans-serif;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    h1 {
      margin-bottom: 16px;
      font-size: 2rem;
    }

    p {
      margin-bottom: 16px;
      color: #666;
    }

    .activity-progress {
      margin-bottom: 24px;
    }

    .word-progress {
      margin-bottom: 32px;
      font-size: 0.9rem;
      color: #888;
    }

    .content-area {
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin: 32px 0;
    }

    .word-phase .word-display {
      font-size: 4rem;
      font-weight: bold;
      color: #1976d2;
      margin-bottom: 16px;
    }

    .letters-phase .letter-display {
      font-size: 6rem;
      font-weight: bold;
      color: #f44336;
      margin-bottom: 16px;
    }

    .playing-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .letter-progress {
      font-size: 0.9rem;
      color: #888;
    }

    .transition-phase .success-message {
      color: #4caf50;
      margin-bottom: 8px;
    }

    .activity-finished, .all-finished {
      padding: 48px 24px;
      text-align: center;
    }

    .activity-finished h2 {
      color: #4caf50;
      margin-bottom: 16px;
    }

    .all-finished h1 {
      color: #1976d2;
      margin-bottom: 16px;
    }

    .all-finished h2 {
      margin-bottom: 16px;
    }

    .loading-spinner {
      margin: 32px auto;
    }

    @media (max-width: 768px) {
      .word-phase .word-display {
        font-size: 3rem;
      }
      
      .letters-phase .letter-display {
        font-size: 4rem;
      }
    }
  `]
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
