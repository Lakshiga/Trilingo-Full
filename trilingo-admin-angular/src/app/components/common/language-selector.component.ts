import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language.service';
import { LanguageCode, LanguageConfig } from '../../types/multilingual.types';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule
  ],
  template: `
    <mat-form-field appearance="outline" class="language-selector">
      <mat-label>Preview Language</mat-label>
      <mat-select 
        [value]="currentLanguage" 
        (selectionChange)="onLanguageChange($event.value)"
        class="language-select">
        <mat-option 
          *ngFor="let language of supportedLanguages" 
          [value]="language.code"
          class="language-option">
          <span class="language-flag">{{ language.flag }}</span>
          <span class="language-name">{{ language.nativeName }}</span>
          <span class="language-english">({{ language.name }})</span>
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    .language-selector {
      min-width: 200px;
    }

    .language-select {
      width: 100%;
    }

    .language-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .language-flag {
      font-size: 1.2em;
    }

    .language-name {
      font-weight: 500;
    }

    .language-english {
      color: #666;
      font-size: 0.9em;
    }

    @media (max-width: 768px) {
      .language-selector {
        min-width: 150px;
      }
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  currentLanguage: LanguageCode = 'en';
  supportedLanguages: LanguageConfig[] = [];

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.supportedLanguages = this.languageService.getSupportedLanguages();
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  onLanguageChange(language: LanguageCode) {
    this.languageService.setLanguage(language);
    this.currentLanguage = language;
  }
}
