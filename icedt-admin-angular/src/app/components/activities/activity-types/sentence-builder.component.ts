import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface SentencePart {
  text: string;
  audioUrl: string;
  imageUrl?: string;
}

export interface SentenceBuilderContent {
  id: number;
  title: string;
  imageWord: SentencePart;
  suffix: SentencePart;
  predicate: SentencePart;
  fullSentenceText: string;
  fullSentenceAudioUrl: string;
}

@Component({
  selector: 'app-sentence-builder',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="sentence-builder-container">
      <h1 class="title">{{ content.title }}</h1>
      <p class="instruction">
        சொற்களை சரியான வரிசையில் அழுத்தி வாக்கியத்தை முடிக்கவும் (Click the parts in order to build the sentence)
      </p>
      
      <div class="sentence-parts">
        <mat-card
          class="sentence-part-card image-word-card"
          [class.clicked]="clickedParts.includes('imageWord')"
          [class.next]="sequence[clickedParts.length] === 'imageWord'"
          [class.disabled]="!isClickable('imageWord')"
          (click)="handlePartClick('imageWord', content.imageWord.audioUrl)"
        >
          <img
            mat-card-image
            [src]="content.imageWord.imageUrl"
            [alt]="content.imageWord.text"
            class="part-image"
          />
          <mat-card-content>
            <p class="part-text">{{ content.imageWord.text }}</p>
          </mat-card-content>
        </mat-card>

        <div class="plus-symbol">+</div>
        
        <mat-card
          class="sentence-part-card suffix-card"
          [class.clicked]="clickedParts.includes('suffix')"
          [class.next]="sequence[clickedParts.length] === 'suffix'"
          [class.disabled]="!isClickable('suffix')"
          (click)="handlePartClick('suffix', content.suffix.audioUrl)"
        >
          <mat-card-content>
            <p class="part-text">{{ content.suffix.text }}</p>
          </mat-card-content>
        </mat-card>
        
        <div class="plus-symbol">+</div>

        <mat-card
          class="sentence-part-card predicate-card"
          [class.clicked]="clickedParts.includes('predicate')"
          [class.next]="sequence[clickedParts.length] === 'predicate'"
          [class.disabled]="!isClickable('predicate')"
          (click)="handlePartClick('predicate', content.predicate.audioUrl)"
        >
          <mat-card-content>
            <p class="part-text">{{ content.predicate.text }}</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="feedback-area">
        <div *ngIf="error" class="error-message">
          தவறான வரிசை. மீண்டும் முயற்சிக்கவும். (Wrong order. Try again.)
        </div>
        <div *ngIf="isComplete" class="success-message">
          <mat-icon>check_circle</mat-icon>
          <p class="sentence-text">{{ content.fullSentenceText }}</p>
        </div>
      </div>

      <div class="controls">
        <button mat-stroked-button (click)="handleReset()">
          <mat-icon>replay</mat-icon>
          மீண்டும் முயற்சி
        </button>
      </div>
      
      <audio #audioElement style="display: none;"></audio>
    </div>
  `,
  styles: [`
    .sentence-builder-container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .title {
      color: #1976d2;
      margin-bottom: 16px;
      margin-top: 0;
    }

    .instruction {
      color: #666;
      margin-bottom: 24px;
    }

    .sentence-parts {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .sentence-part-card {
      transition: all 0.3s ease;
      cursor: pointer;
      border: 2px solid #e0e0e0;
    }

    .sentence-part-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .sentence-part-card.next {
      border: 3px solid #2196f3;
      cursor: pointer;
    }

    .sentence-part-card.clicked {
      border: 3px solid #4caf50;
      transform: scale(1.05);
    }

    .sentence-part-card.disabled {
      opacity: 0.5;
      cursor: default;
    }

    .image-word-card {
      width: 200px;
    }

    .part-image {
      height: 150px;
      object-fit: cover;
    }

    .suffix-card {
      width: 120px;
      height: 222px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .predicate-card {
      width: 200px;
      height: 222px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .part-text {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0;
    }

    .suffix-card .part-text {
      font-size: 2rem;
    }

    .predicate-card .part-text {
      font-size: 1.5rem;
    }

    .plus-symbol {
      font-size: 2rem;
      color: #666;
      font-weight: bold;
    }

    .feedback-area {
      min-height: 100px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .error-message {
      color: #f44336;
      background-color: #ffebee;
      border: 1px solid #f44336;
      border-radius: 4px;
      padding: 12px;
    }

    .success-message {
      color: #4caf50;
      background-color: #e8f5e8;
      border: 1px solid #4caf50;
      border-radius: 4px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sentence-text {
      font-size: 1.2rem;
      margin: 0;
    }

    .controls {
      display: flex;
      gap: 16px;
    }
  `]
})
export class SentenceBuilderComponent implements OnInit, OnDestroy {
  @Input() content!: SentenceBuilderContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  clickedParts: string[] = [];
  isComplete = false;
  error = false;
  sequence = ['imageWord', 'suffix', 'predicate'];

  ngOnInit(): void {
    this.resetState();
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  private resetState(): void {
    this.clickedParts = [];
    this.isComplete = false;
    this.error = false;
  }

  private playAudio(audioUrl: string): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = audioUrl;
      this.audioElement.nativeElement.play().catch(e => 
        console.error("Audio playback error:", e)
      );
    }
  }

  handlePartClick(partKey: 'imageWord' | 'suffix' | 'predicate', partAudioUrl: string): void {
    if (this.isComplete) return;

    if (this.sequence[this.clickedParts.length] === partKey) {
      this.error = false;
      this.clickedParts = [...this.clickedParts, partKey];
      this.playAudio(partAudioUrl);

      if (this.clickedParts.length === this.sequence.length) {
        this.isComplete = true;
        setTimeout(() => {
          this.playAudio(this.content.fullSentenceAudioUrl);
        }, 1000);
      }
    } else {
      this.error = true;
      setTimeout(() => this.error = false, 1500);
    }
  }

  isClickable(partKey: string): boolean {
    return !this.isComplete && this.sequence[this.clickedParts.length] === partKey;
  }

  handleReset(): void {
    this.resetState();
  }
}
