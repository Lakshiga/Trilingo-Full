import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TamilVowel, LettersDisplayContent } from '../../../../types/activity-content.types';

@Component({
  selector: 'app-tamil-vowels',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './tamil-vowels.component.html',
  styleUrls: ['./tamil-vowels.component.css']
})
export class TamilVowelsComponent implements OnInit, OnDestroy {
  @Input() content!: LettersDisplayContent;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  playingVowelId: number | null = null;
  playedVowels: number[] = [];
  currentSequenceIndex = 0;
  isSequencePlaying = false;
  private mediaBaseUrl = '';

  get vowelRows(): TamilVowel[][] {
    return this.arrangeInRows(this.content.vowels);
  }

  get allVowelsPlayed(): boolean {
    return this.playedVowels.length === this.content.vowels.length;
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  private arrangeInRows(vowels: TamilVowel[]): TamilVowel[][] {
    const rows = [];
    for (let i = 0; i < vowels.length; i += 4) {
      rows.push(vowels.slice(i, i + 4));
    }
    return rows;
  }

  private getFullUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `${this.mediaBaseUrl}/${url}`;
  }

  playAudio(audioUrl: string, vowelId: number): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.src = this.getFullUrl(audioUrl);
      this.playingVowelId = vowelId;

      this.audioElement.nativeElement.play()
        .then(() => {
          if (!this.playedVowels.includes(vowelId)) {
            this.playedVowels = [...this.playedVowels, vowelId];
          }
        })
        .catch(e => {
          console.error('Error playing audio:', e);
          this.playingVowelId = null;
        });

      this.audioElement.nativeElement.onended = () => {
        this.playingVowelId = null;
      };
    }
  }

  handleVowelClick(vowel: TamilVowel): void {
    this.playAudio(vowel.audioUrl, vowel.id);
  }

  async playSequence(): Promise<void> {
    if (this.isSequencePlaying) return;

    this.isSequencePlaying = true;
    this.currentSequenceIndex = 0;

    for (let i = 0; i < this.content.vowels.length; i++) {
      this.currentSequenceIndex = i;
      const vowel = this.content.vowels[i];

      await new Promise<void>((resolve) => {
        if (this.audioElement) {
          this.audioElement.nativeElement.src = this.getFullUrl(vowel.audioUrl);
          this.playingVowelId = vowel.id;

          this.audioElement.nativeElement.play().catch(e => 
            console.error('Error playing audio:', e)
          );

          this.audioElement.nativeElement.onended = () => {
            this.playingVowelId = null;
            if (!this.playedVowels.includes(vowel.id)) {
              this.playedVowels = [...this.playedVowels, vowel.id];
            }
            setTimeout(resolve, 500);
          };
        }
      });
    }

    this.isSequencePlaying = false;
    this.currentSequenceIndex = -1;
  }

  handleReset(): void {
    this.playedVowels = [];
    this.playingVowelId = null;
    this.currentSequenceIndex = 0;
    this.isSequencePlaying = false;
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
      this.audioElement.nativeElement.currentTime = 0;
    }
  }

  isCurrentInSequence(vowelId: number): boolean {
    return this.isSequencePlaying && 
           this.currentSequenceIndex === this.content.vowels.findIndex((v: any) => v.id === vowelId);
  }
}
