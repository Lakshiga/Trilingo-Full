import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AudioTextImageSelectionContent } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-audio-text-image-selection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatSnackBarModule],
  templateUrl: './audio-text-image-selection.component.html',
  styleUrls: ['./audio-text-image-selection.component.css']
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
    const selectedImage = this.content.images.find((img: any) => img.id === imageId);
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