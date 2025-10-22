import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AudioTextImageSelectionContent } from '../../../types/activity-content.types';

@Component({
  selector: 'app-audio-text-image-selection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="container" *ngIf="content; else noContent">
      <!-- Title -->
      <h2 class="title">{{ content.title }}</h2>

      <!-- Text Display with Audio Button -->
      <div class="text-audio-container">
        <div class="text-display">{{ content.text }}</div>
        <button
          mat-icon-button
          color="primary"
          (click)="playAudio()"
          class="audio-button"
        >
          <mat-icon>volume_up</mat-icon>
        </button>
      </div>

      <!-- Result Display -->
      <div class="result-alert" *ngIf="showResult" [class.success]="isCorrect" [class.error]="!isCorrect">
        <mat-icon>{{ isCorrect ? 'check_circle' : 'cancel' }}</mat-icon>
        <span>{{ isCorrect ? 'சரியான பதில்! (Correct Answer!)' : 'தவறான பதில். மீண்டும் முயற்சி செய்யுங்கள். (Wrong Answer. Try Again.)' }}</span>
      </div>

      <!-- Images Display -->
      <div class="images-container">
        <mat-card
          *ngFor="let image of content.images"
          class="image-card"
          [class.selected]="selectedImageId === image.id"
          [class.matched]="showResult"
          [class.correct]="showResult && image.isCorrect"
          [class.incorrect]="showResult && !image.isCorrect"
          (click)="!showResult && handleImageSelect(image.id)"
        >
          <img mat-card-image [src]="image.imageUrl" [alt]="'Option ' + image.id">
        </mat-card>
      </div>

      <!-- Action Buttons -->
      <div class="actions">
        <button
          *ngIf="showResult"
          mat-raised-button
          color="primary"
          (click)="resetActivity()"
          class="action-button"
        >
          மீண்டும் முயற்சி செய் (Try Again)
        </button>
        <button
          mat-stroked-button
          (click)="playAudio()"
          class="action-button"
        >
          <mat-icon>volume_up</mat-icon>
          மீண்டும் கேள் (Listen Again)
        </button>
      </div>

      <audio #audioPlayer style="display: none;"></audio>
    </div>

    <ng-template #noContent>
      <div class="error-message">No content to display.</div>
    </ng-template>
  `,
  styles: [`
    .container {
      padding: 24px;
      font-family: sans-serif;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 500px;
    }

    .title {
      margin-bottom: 16px;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .text-audio-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px;
      background-color: #f5f5f5;
      padding: 24px;
      border-radius: 8px;
      min-width: 400px;
    }

    .text-display {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      margin-right: 16px;
    }

    .audio-button {
      background-color: #e3f2fd;
    }

    .audio-button:hover {
      background-color: #bbdefb;
    }

    .result-alert {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 24px;
      font-size: 1.1rem;
      padding: 12px 24px;
      border-radius: 4px;
    }

    .result-alert.success {
      background-color: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #4caf50;
    }

    .result-alert.error {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #f44336;
    }

    .images-container {
      display: flex;
      gap: 32px;
      justify-content: center;
      align-items: center;
      margin-bottom: 24px;
    }

    .image-card {
      width: 250px;
      height: 250px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .image-card:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .image-card.selected {
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      border: 3px solid #1976d2;
      transform: scale(1.05);
    }

    .image-card.matched {
      cursor: default;
    }

    .image-card.correct {
      border: 3px solid #4caf50;
    }

    .image-card.incorrect {
      opacity: 0.6;
      filter: grayscale(50%);
    }

    .image-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .actions {
      display: flex;
      gap: 16px;
    }

    .action-button {
      font-size: 1.1rem;
      padding: 10px 20px;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      padding: 24px;
    }
  `]
})
export class AudioTextImageSelectionComponent implements OnInit {
  @Input() content!: AudioTextImageSelectionContent;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  selectedImageId: number | null = null;
  showResult: boolean = false;
  isCorrect: boolean = false;

  ngOnInit(): void {
    if (this.content?.audioUrl && this.audioPlayer) {
      this.audioPlayer.nativeElement.src = this.content.audioUrl;
    }
  }

  playAudio(): void {
    if (this.content?.audioUrl && this.audioPlayer) {
      this.audioPlayer.nativeElement.src = this.content.audioUrl;
      this.audioPlayer.nativeElement.play().catch(e => {
        console.warn("Audio autoplay blocked by browser:", e);
      });
    }
  }

  handleImageSelect(imageId: number): void {
    this.selectedImageId = imageId;
    const selectedImage = this.content.images.find(img => img.id === imageId);
    if (selectedImage) {
      this.isCorrect = selectedImage.isCorrect;
      this.showResult = true;
    }
  }

  resetActivity(): void {
    this.selectedImageId = null;
    this.showResult = false;
    this.isCorrect = false;
  }
}