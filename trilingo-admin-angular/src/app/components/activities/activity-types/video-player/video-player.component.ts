import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// MatTypographyModule is not available in Angular Material v19

export interface VideoPlayerContent {
  title: string;
  description?: string;
  videoUrl: string;
}

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {
  @Input() content!: VideoPlayerContent;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  playing = false;

  togglePlay(): void {
    if (this.videoPlayer?.nativeElement) {
      if (this.playing) {
        this.videoPlayer.nativeElement.pause();
        this.playing = false;
      } else {
        this.videoPlayer.nativeElement.play().catch(err => 
          console.error("Video play failed:", err)
        );
        this.playing = true;
      }
    }
  }
}