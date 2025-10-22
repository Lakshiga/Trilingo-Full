import { Component, Input, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LanguageService } from '../../../services/language.service';
import { MultilingualText, MultilingualAudio, LanguageCode } from '../../../types/multilingual.types';

export interface WordChoice {
  id: string;
  text: MultilingualText;
}

export interface SentenceItem {
  id: string;
  preBlankText: MultilingualText;
  postBlankText?: MultilingualText;
  audioUrl: MultilingualAudio;
  correctWordId: string;
}

export interface ListeningMatchingContent {
  title: MultilingualText;
  introduction: MultilingualText;
  sentences: SentenceItem[];
  words: WordChoice[];
}

@Component({
  selector: 'app-listening-matching-drag-and-drop',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container" *ngIf="!isActivityFinished; else completedTemplate">
      <h2 class="title">{{ getText(content.title) }}</h2>
      
      <mat-card class="intro-card">
        <mat-card-content>
          <p>{{ getText(content.introduction) }}</p>
        </mat-card-content>
      </mat-card>

      <!-- Word Choices Pool -->
      <h3 class="instruction">{{ getText({ta: 'பொருத்தமான சொல்லை இழுத்துவிடவும்', en: 'Drag and drop the correct word', si: 'නිවැරදි වචනය ඇද දමන්න'}) }}</h3>
      <mat-card class="word-pool" 
                (dragover)="handleDragOver($event)"
                (drop)="handleDrop($event, 'pool')">
        <mat-card-content>
          <mat-chip-listbox>
            <mat-chip-option 
              *ngFor="let word of wordChoices" 
              [draggable]="true"
              (dragstart)="handleDragStart($event, word)"
              class="draggable-chip">
              {{ getText(word.text) }}
            </mat-chip-option>
          </mat-chip-listbox>
        </mat-card-content>
      </mat-card>

      <!-- Sentences with Blanks -->
      <div class="sentences-container">
        <mat-card *ngFor="let sentence of content.sentences; let i = index" 
                  class="sentence-card"
                  (dragover)="handleDragOver($event)"
                  (drop)="handleDrop($event, sentence.id)">
          <mat-card-content>
            <div class="sentence-content">
              <span class="sentence-text">{{ getText(sentence.preBlankText) }}</span>
              <div class="blank-space" 
                   [class.filled]="getSelectedWordForSentence(sentence.id)"
                   [class.correct]="isCorrectAnswer(sentence.id)"
                   [class.incorrect]="isIncorrectAnswer(sentence.id)">
                <span *ngIf="getSelectedWordForSentence(sentence.id)">
                  {{ getText(getSelectedWordForSentence(sentence.id)!.text) }}
                </span>
                <span *ngIf="!getSelectedWordForSentence(sentence.id)" class="blank-placeholder">
                  ___
                </span>
              </div>
              <span class="sentence-text" *ngIf="sentence.postBlankText">{{ getText(sentence.postBlankText) }}</span>
              <button mat-icon-button 
                      color="primary" 
                      (click)="playAudio(sentence.audioUrl)"
                      class="audio-button">
                <mat-icon>volume_up</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Submit Button -->
      <div class="submit-container">
        <button mat-raised-button 
                color="primary" 
                (click)="submitAnswers()"
                [disabled]="!canSubmit()">
          சரிபார்க்க
        </button>
      </div>

      <audio #audioRef style="display: none;"></audio>
    </div>

    <!-- Completed Template -->
    <ng-template #completedTemplate>
      <div class="completion-container">
        <mat-card class="completion-card">
          <mat-card-content>
            <div class="completion-content">
              <mat-icon class="completion-icon" [class.success]="allCorrect" [class.error]="!allCorrect">
                {{ allCorrect ? 'check_circle' : 'error' }}
              </mat-icon>
              <h3 class="completion-title">
                {{ allCorrect ? getText({ta: 'வாழ்த்துக்கள்!', en: 'Congratulations!', si: 'සුභ පැතුම්!'}) : getText({ta: 'மீண்டும் முயற்சிக்கவும்', en: 'Try Again', si: 'නැවත උත්සාහ කරන්න'}) }}
              </h3>
              <p class="completion-message">
                {{ allCorrect ? getText({ta: 'அனைத்து பதில்களும் சரியானவை!', en: 'All answers are correct!', si: 'සියලු පිළිතුරු නිවැරදිය!'}) : getText({ta: 'சில பதில்கள் தவறானவை. மீண்டும் முயற்சிக்கவும்.', en: 'Some answers are incorrect. Please try again.', si: 'සමහර පිළිතුරු වැරදිය. නැවත උත්සාහ කරන්න.'}) }}
              </p>
              <div class="score-display">
                <h4>
                  {{ getText({ta: 'மதிப்பெண்', en: 'Score', si: 'ලකුණු'}) }}: {{ correctAnswers }}/{{ content.sentences.length }}
                </h4>
              </div>
              <button mat-raised-button 
                      color="primary" 
                      (click)="resetActivity()"
                      class="reset-button">
                {{ getText({ta: 'மீண்டும் முயற்சிக்கவும்', en: 'Try Again', si: 'නැවත උත්සාහ කරන්න'}) }}
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </ng-template>
  `,
  styles: [`
    .container {
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }

    .title {
      text-align: center;
      margin-bottom: 24px;
      color: #1976d2;
    }

    .intro-card {
      margin-bottom: 24px;
      background-color: #f5f5f5;
    }

    .instruction {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
      color: #333;
    }

    .word-pool {
      margin-bottom: 32px;
      background-color: #e3f2fd;
    }

    .draggable-chip {
      cursor: grab;
      margin: 4px;
      transition: all 0.2s ease;
    }

    .draggable-chip:hover {
      background-color: #1976d2;
      color: white;
    }

    .draggable-chip:active {
      cursor: grabbing;
    }

    .sentences-container {
      margin-bottom: 32px;
    }

    .sentence-card {
      margin-bottom: 16px;
      transition: all 0.2s ease;
    }

    .sentence-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .sentence-content {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .sentence-text {
      font-size: 16px;
      line-height: 1.5;
    }

    .blank-space {
      min-width: 80px;
      min-height: 40px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      background-color: #fafafa;
      transition: all 0.2s ease;
    }

    .blank-space.filled {
      border-style: solid;
      background-color: #fff;
    }

    .blank-space.correct {
      border-color: #4caf50;
      background-color: #e8f5e8;
    }

    .blank-space.incorrect {
      border-color: #f44336;
      background-color: #ffebee;
    }

    .blank-placeholder {
      color: #999;
      font-style: italic;
    }

    .audio-button {
      margin-left: 8px;
    }

    .submit-container {
      text-align: center;
      margin-top: 32px;
    }

    .completion-container {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .completion-card {
      text-align: center;
    }

    .completion-content {
      padding: 32px;
    }

    .completion-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .completion-icon.success {
      color: #4caf50;
    }

    .completion-icon.error {
      color: #f44336;
    }

    .completion-title {
      margin-bottom: 16px;
    }

    .completion-message {
      margin-bottom: 24px;
      color: #666;
    }

    .score-display {
      margin-bottom: 24px;
    }

    .reset-button {
      margin-top: 16px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 8px;
      }
      
      .sentence-content {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .blank-space {
        width: 100%;
        min-width: unset;
      }
    }
  `]
})
export class ListenAndMatchComponent implements OnInit, OnDestroy {
  @Input() content!: ListeningMatchingContent;
  @ViewChild('audioRef') audioRef!: ElementRef<HTMLAudioElement>;

  wordChoices: WordChoice[] = [];
  selectedWords: { [sentenceId: string]: WordChoice } = {};
  isActivityFinished = false;
  allCorrect = false;
  correctAnswers = 0;
  private draggedWord: WordChoice | null = null;
  currentLanguage: LanguageCode = 'en';

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.initializeWordChoices();
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  private initializeWordChoices() {
    this.wordChoices = [...this.content.words];
  }

  handleDragStart(event: DragEvent, word: WordChoice) {
    this.draggedWord = word;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', word.id);
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  handleDrop(event: DragEvent, targetId: string) {
    event.preventDefault();
    
    if (targetId === 'pool') {
      // Return word to pool
      if (this.draggedWord) {
        this.returnWordToPool(this.draggedWord);
      }
    } else {
      // Drop on sentence
      if (this.draggedWord) {
        this.assignWordToSentence(targetId, this.draggedWord);
      }
    }
    
    this.draggedWord = null;
  }

  private assignWordToSentence(sentenceId: string, word: WordChoice) {
    // Remove word from pool
    this.wordChoices = this.wordChoices.filter(w => w.id !== word.id);
    
    // If sentence already has a word, return it to pool
    const existingWord = this.selectedWords[sentenceId];
    if (existingWord) {
      this.wordChoices.push(existingWord);
    }
    
    // Assign new word
    this.selectedWords[sentenceId] = word;
  }

  private returnWordToPool(word: WordChoice) {
    // Remove from any sentence
    Object.keys(this.selectedWords).forEach(sentenceId => {
      if (this.selectedWords[sentenceId]?.id === word.id) {
        delete this.selectedWords[sentenceId];
      }
    });
    
    // Add back to pool if not already there
    if (!this.wordChoices.find(w => w.id === word.id)) {
      this.wordChoices.push(word);
    }
  }

  getSelectedWordForSentence(sentenceId: string): WordChoice | undefined {
    return this.selectedWords[sentenceId];
  }

  isCorrectAnswer(sentenceId: string): boolean {
    const selectedWord = this.selectedWords[sentenceId];
    const sentence = this.content.sentences.find(s => s.id === sentenceId);
    return !!(selectedWord && sentence && selectedWord.id === sentence.correctWordId);
  }

  isIncorrectAnswer(sentenceId: string): boolean {
    const selectedWord = this.selectedWords[sentenceId];
    const sentence = this.content.sentences.find(s => s.id === sentenceId);
    return !!(selectedWord && sentence && selectedWord.id !== sentence.correctWordId);
  }

  canSubmit(): boolean {
    return Object.keys(this.selectedWords).length === this.content.sentences.length;
  }

  submitAnswers() {
    this.correctAnswers = 0;
    
    this.content.sentences.forEach(sentence => {
      const selectedWord = this.selectedWords[sentence.id];
      if (selectedWord && selectedWord.id === sentence.correctWordId) {
        this.correctAnswers++;
      }
    });
    
    this.allCorrect = this.correctAnswers === this.content.sentences.length;
    this.isActivityFinished = true;
  }

  getText(text: MultilingualText): string {
    return this.languageService.getText(text, this.currentLanguage);
  }

  playAudio(audioUrl: MultilingualAudio) {
    if (this.audioRef) {
      const audioSrc = this.languageService.getAudio(audioUrl, this.currentLanguage);
      if (audioSrc) {
        this.audioRef.nativeElement.src = audioSrc;
        this.audioRef.nativeElement.play().catch(e => 
          console.error("Audio playback failed:", e)
        );
      }
    }
  }

  resetActivity() {
    this.selectedWords = {};
    this.wordChoices = [...this.content.words];
    this.isActivityFinished = false;
    this.allCorrect = false;
    this.correctAnswers = 0;
    this.draggedWord = null;
  }
}
