import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface WordChoice {
  id: string;
  text: string;
}

export interface SentenceItem {
  id: string;
  preBlankText: string;
  postBlankText?: string;
  audioUrl: string;
  correctWordId: string;
}

export interface ListeningMatchingContent {
  title: string;
  introduction: string;
  sentences: SentenceItem[];
  words: WordChoice[];
}

@Component({
  selector: 'app-listening-matching-drag-and-drop',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="listening-matching-container" *ngIf="!isActivityFinished; else completedTemplate">
      <h2 class="title">{{ content.title }}</h2>
      
      <mat-card class="introduction-card">
        <mat-card-content>
          <p>{{ content.introduction }}</p>
        </mat-card-content>
      </mat-card>

      <!-- Word Choices Pool -->
      <div class="word-pool-section">
        <h3 class="pool-title">பொருத்தமான சொல்லை இழுத்துவிடவும்:</h3>
        <mat-card class="word-pool-card">
          <mat-card-content>
            <div class="word-chips">
              <mat-chip
                *ngFor="let word of wordChoices"
                [draggable]="true"
                (dragstart)="handleDragStart($event, word)"
                class="word-chip"
              >
                {{ word.text }}
              </mat-chip>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Sentences Area -->
      <div class="sentences-section">
        <mat-card
          *ngFor="let sentence of content.sentences; let index = index"
          [class.current-sentence]="index === currentSentenceIndex"
          [class.completed-sentence]="!!droppedWords[sentence.id]"
          class="sentence-card"
        >
          <mat-card-content>
            <div class="sentence-content">
              <mat-icon *ngIf="index === currentSentenceIndex && isPlaying" class="playing-icon">volume_up</mat-icon>
              <mat-icon *ngIf="!!droppedWords[sentence.id]" class="completed-icon">check_circle</mat-icon>
              
              <div class="sentence-text">
                <span>{{ sentence.preBlankText }}</span>
                <div
                  class="drop-zone"
                  [class.current-drop-zone]="index === currentSentenceIndex"
                  [class.completed-drop-zone]="!!droppedWords[sentence.id]"
                  [class.incorrect-feedback]="index === currentSentenceIndex && feedback === 'incorrect'"
                  (dragover)="handleDragOver($event)"
                  (drop)="handleDrop($event, sentence.id)"
                >
                  <mat-chip
                    *ngIf="droppedWords[sentence.id]"
                    color="primary"
                    class="dropped-word-chip"
                  >
                    {{ droppedWords[sentence.id]?.text }}
                  </mat-chip>
                  <span
                    *ngIf="!droppedWords[sentence.id] && index === currentSentenceIndex"
                    class="drop-hint"
                  >
                    இங்கே இழுத்துவிடவும்
                  </span>
                </div>
                <span *ngIf="sentence.postBlankText">{{ sentence.postBlankText }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <audio #audioElement style="display: none;"></audio>
    </div>

    <ng-template #completedTemplate>
      <div class="completion-message">
        <h1>🎉 வாழ்த்துக்கள்! சிறப்பாகச் செய்தீர்கள்! 🎉</h1>
        <p>இந்தச் செயல்பாட்டை வெற்றிகரமாக முடித்துவிட்டீர்கள்.</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .listening-matching-container {
      padding: 16px;
      font-family: sans-serif;
      max-width: 900px;
      margin: auto;
    }

    .title {
      text-align: center;
      margin-bottom: 16px;
      font-weight: bold;
      font-size: 1.5rem;
    }

    .introduction-card {
      margin-bottom: 24px;
      background-color: #f0f7ff;
    }

    .word-pool-section {
      margin-bottom: 32px;
    }

    .pool-title {
      text-align: center;
      margin-bottom: 8px;
      font-weight: bold;
    }

    .word-pool-card {
      padding: 16px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      align-items: center;
      min-height: 60px;
      border: 2px dashed #ccc;
    }

    .word-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }

    .word-chip {
      cursor: grab;
      font-size: 1.1rem;
    }

    .sentence-card {
      margin-bottom: 16px;
      transition: all 0.3s;
      border-left: 5px solid transparent;
    }

    .sentence-card.current-sentence {
      background-color: #e3f2fd;
      border-left-color: #0288D1;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .sentence-card.completed-sentence {
      background-color: #f5f5f5;
    }

    .sentence-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .playing-icon {
      color: #0288D1;
    }

    .completed-icon {
      color: #2e7d32;
    }

    .sentence-text {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 1.25rem;
    }

    .drop-zone {
      min-width: 150px;
      height: 40px;
      border: 2px dashed #ccc;
      border-radius: 16px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      transition: background-color 0.3s;
    }

    .drop-zone.current-drop-zone {
      border-color: #0288D1;
    }

    .drop-zone.completed-drop-zone {
      border: none;
    }

    .drop-zone.incorrect-feedback {
      background-color: #ffebee;
    }

    .dropped-word-chip {
      font-size: 1rem;
    }

    .drop-hint {
      color: #666;
      font-size: 0.875rem;
    }

    .completion-message {
      text-align: center;
      padding: 32px;
    }

    .completion-message h1 {
      color: #2e7d32;
      margin-bottom: 16px;
    }
  `]
})
export class ListeningMatchingDragAndDropComponent implements OnInit, OnDestroy {
  @Input() content!: ListeningMatchingContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  currentSentenceIndex = 0;
  wordChoices: WordChoice[] = [];
  droppedWords: Record<string, WordChoice | null> = {};
  isPlaying = false;
  isActivityFinished = false;
  feedback: 'correct' | 'incorrect' | null = null;

  private audioTimeout?: number;

  ngOnInit() {
    this.resetState();
    this.startCurrentSentence();
  }

  ngOnDestroy() {
    if (this.audioTimeout) {
      clearTimeout(this.audioTimeout);
    }
  }

  private resetState() {
    this.currentSentenceIndex = 0;
    this.wordChoices = [...this.content.words];
    this.droppedWords = {};
    this.isPlaying = false;
    this.isActivityFinished = false;
    this.feedback = null;
  }

  private startCurrentSentence() {
    if (this.currentSentenceIndex >= this.content.sentences.length) {
      this.isActivityFinished = true;
      return;
    }

    const currentSentence = this.content.sentences[this.currentSentenceIndex];
    this.audioTimeout = window.setTimeout(() => {
      this.playAudio(currentSentence.audioUrl);
    }, 500);
  }

  private playAudio(audioUrl: string) {
    if (this.audioElement?.nativeElement) {
      this.isPlaying = true;
      this.audioElement.nativeElement.src = audioUrl;
      
      const handleEnded = () => {
        this.isPlaying = false;
        this.audioElement.nativeElement.removeEventListener('ended', handleEnded);
      };
      
      this.audioElement.nativeElement.addEventListener('ended', handleEnded);
      this.audioElement.nativeElement.play().catch(e => {
        console.error("Audio playback failed:", e);
        this.isPlaying = false;
      });
    }
  }

  handleDragStart(event: DragEvent, word: WordChoice) {
    if (event.dataTransfer) {
      event.dataTransfer.setData("wordId", word.id);
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleDrop(event: DragEvent, sentenceId: string) {
    event.preventDefault();
    const currentSentence = this.content.sentences[this.currentSentenceIndex];

    // Only allow dropping on the CURRENT active sentence
    if (sentenceId !== currentSentence.id || this.isPlaying) {
      return;
    }

    const wordId = event.dataTransfer?.getData("wordId");
    const droppedWord = this.wordChoices.find(w => w.id === wordId);

    if (droppedWord) {
      if (droppedWord.id === currentSentence.correctWordId) {
        // Correct Answer
        this.feedback = 'correct';
        this.droppedWords = { ...this.droppedWords, [sentenceId]: droppedWord };
        this.wordChoices = this.wordChoices.filter(w => w.id !== wordId);

        // After showing feedback, move to the next sentence
        setTimeout(() => {
          this.feedback = null;
          this.currentSentenceIndex++;
          this.startCurrentSentence();
        }, 1200);
      } else {
        // Incorrect Answer
        this.feedback = 'incorrect';
        setTimeout(() => this.feedback = null, 1000);
      }
    }
  }
}
