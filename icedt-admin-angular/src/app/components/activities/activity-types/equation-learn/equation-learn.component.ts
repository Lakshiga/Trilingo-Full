import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UyirMeiEquation, EquationLernContent } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-equation-learn',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './equation-learn.component.html',
  styleUrls: ['./equation-learn.component.css']
})
export class EquationLearnComponent implements OnInit, OnDestroy {
  @Input() content!: EquationLernContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  currentEquationIndex = 0;
  currentStep: 'consonant' | 'vowel' | 'result' | 'complete' = 'consonant';
  isPlaying = false;
  private mediaBaseUrl = '';

  get currentEquation(): UyirMeiEquation {
    return this.content.equations[this.currentEquationIndex];
  }

  get isLastEquation(): boolean {
    return this.currentEquationIndex === this.content.equations.length - 1;
  }

  ngOnInit(): void {
    this.startAutoSequence();
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  private getFullUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `${this.mediaBaseUrl}/${url}`;
  }

  private playAudio(audioUrl: string): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = this.getFullUrl(audioUrl);
      this.isPlaying = true;
      
      this.audioElement.nativeElement.play()
        .then(() => {
          // Audio started playing successfully
        })
        .catch(e => {
          console.error('Error playing audio:', e);
          this.isPlaying = false;
        });

      this.audioElement.nativeElement.onended = () => {
        this.isPlaying = false;
      };
    }
  }

  private startAutoSequence(): void {
    if (this.currentEquation) {
      setTimeout(() => {
        switch (this.currentStep) {
          case 'consonant':
            this.playAudio(this.currentEquation.consonantAudioUrl);
            setTimeout(() => this.currentStep = 'vowel', 2000);
            break;
          case 'vowel':
            this.playAudio(this.currentEquation.vowelAudioUrl);
            setTimeout(() => this.currentStep = 'result', 2000);
            break;
          case 'result':
            this.playAudio(this.currentEquation.resultAudioUrl);
            setTimeout(() => this.currentStep = 'complete', 2000);
            break;
        }
      }, 500);
    }
  }

  playConsonantAudio(): void {
    if (this.currentStep !== 'consonant') {
      this.playAudio(this.currentEquation.consonantAudioUrl);
    }
  }

  playVowelAudio(): void {
    this.playAudio(this.currentEquation.vowelAudioUrl);
  }

  playResultAudio(): void {
    if (this.currentStep === 'result' || this.currentStep === 'complete') {
      this.playAudio(this.currentEquation.resultAudioUrl);
    }
  }

  handlePlayCurrentAudio(): void {
    if (this.currentEquation) {
      switch (this.currentStep) {
        case 'consonant':
          this.playAudio(this.currentEquation.consonantAudioUrl);
          break;
        case 'vowel':
          this.playAudio(this.currentEquation.vowelAudioUrl);
          break;
        case 'result':
        case 'complete':
          this.playAudio(this.currentEquation.resultAudioUrl);
          break;
      }
    }
  }

  handleNext(): void {
    if (this.currentEquationIndex < this.content.equations.length - 1) {
      this.currentEquationIndex++;
      this.currentStep = 'consonant';
      this.startAutoSequence();
    }
  }

  handlePrevious(): void {
    if (this.currentEquationIndex > 0) {
      this.currentEquationIndex--;
      this.currentStep = 'consonant';
      this.startAutoSequence();
    }
  }

  handleReset(): void {
    this.currentEquationIndex = 0;
    this.currentStep = 'consonant';
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
      this.audioElement.nativeElement.currentTime = 0;
    }
    this.startAutoSequence();
  }
}
