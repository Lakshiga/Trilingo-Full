import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { LanguageService } from '../../services/language.service';
import { LanguageCode, LanguageConfig, SUPPORTED_LANGUAGES } from '../../types/multilingual.types';

@Component({
  selector: 'app-sidebar-language-manager',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  template: `
    <div class="language-manager">
      <div class="language-manager-header">
        <mat-icon class="language-icon">🌐</mat-icon>
        <span class="language-title">Language Management</span>
      </div>
      
      <div class="language-switcher">
        <mat-form-field appearance="outline" class="language-select-field">
          <mat-label>Current Language</mat-label>
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
      </div>

      <mat-expansion-panel class="language-config-panel">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <mat-icon>settings</mat-icon>
            JSON Configuration
          </mat-panel-title>
        </mat-expansion-panel-header>
        
        <div class="language-config-content">
          <div class="config-info">
            <p class="config-description">
              The system supports three languages with JSON-based configuration:
            </p>
            <div class="language-list">
              <div *ngFor="let language of supportedLanguages" class="language-item">
                <span class="language-flag">{{ language.flag }}</span>
                <span class="language-code">{{ language.code }}</span>
                <span class="language-name">{{ language.nativeName }}</span>
                <span class="language-english">({{ language.name }})</span>
              </div>
            </div>
          </div>
          
          <div class="json-example">
            <h4>Example JSON Structure:</h4>
            <pre class="json-code">{{ getJsonExample() }}</pre>
          </div>
          
          <div class="language-actions">
            <button mat-raised-button color="primary" (click)="showAllLanguages()">
              <mat-icon>visibility</mat-icon>
              View All Languages
            </button>
            <button mat-stroked-button (click)="resetToDefault()">
              <mat-icon>refresh</mat-icon>
              Reset to Default
            </button>
          </div>
        </div>
      </mat-expansion-panel>
    </div>
  `,
  styles: [`
    .language-manager {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
    }

    .language-manager-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .language-icon {
      font-size: 20px;
    }

    .language-title {
      font-weight: 600;
      font-size: 14px;
      color: white;
    }

    .language-switcher {
      margin-bottom: 16px;
    }

    .language-select-field {
      width: 100%;
    }

    .language-select-field .mat-mdc-form-field {
      color: white;
    }

    .language-select-field .mat-mdc-form-field-label {
      color: rgba(255,255,255,0.7);
    }

    .language-select-field .mat-mdc-select-value {
      color: white;
    }

    .language-select-field .mat-mdc-select-arrow {
      color: white;
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

    .language-config-panel {
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
    }

    .language-config-panel .mat-expansion-panel-header {
      padding: 12px 16px;
      background: rgba(255,255,255,0.1);
    }

    .language-config-panel .mat-expansion-panel-header-title {
      color: white;
      font-weight: 500;
    }

    .language-config-panel .mat-expansion-panel-header mat-icon {
      color: white;
      margin-right: 8px;
    }

    .language-config-content {
      padding: 16px;
      background: rgba(255,255,255,0.05);
    }

    .config-info {
      margin-bottom: 16px;
    }

    .config-description {
      color: rgba(255,255,255,0.8);
      font-size: 14px;
      margin-bottom: 12px;
    }

    .language-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .language-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
    }

    .language-code {
      font-family: monospace;
      background: rgba(255,255,255,0.2);
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: bold;
    }

    .json-example {
      margin-bottom: 16px;
    }

    .json-example h4 {
      color: white;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .json-code {
      background: rgba(0,0,0,0.3);
      color: #4CAF50;
      padding: 12px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 1.4;
      overflow-x: auto;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .language-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .language-actions button {
      flex: 1;
      min-width: 120px;
    }

    .language-actions button mat-icon {
      margin-right: 4px;
    }

    @media (max-width: 768px) {
      .language-manager {
        padding: 12px;
      }
      
      .language-actions {
        flex-direction: column;
      }
      
      .language-actions button {
        width: 100%;
      }
    }
  `]
})
export class SidebarLanguageManagerComponent implements OnInit {
  currentLanguage: LanguageCode = 'en';
  supportedLanguages: LanguageConfig[] = [];

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.supportedLanguages = this.languageService.getSupportedLanguages();
    this.currentLanguage = this.languageService.getCurrentLanguage();
    
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(language => {
      this.currentLanguage = language;
    });
  }

  onLanguageChange(language: LanguageCode) {
    this.languageService.setLanguage(language);
  }

  getJsonExample(): string {
    return `{
  "title": {
    "ta": "உடல் உறுப்புகள்",
    "en": "Body Parts", 
    "si": "ශරීරයේ කොටස්"
  },
  "word": {
    "ta": "கண்",
    "en": "Eye",
    "si": "ඇස"
  },
  "audioUrl": {
    "ta": "/audio/kan.mp3",
    "en": "/audio/eye.mp3", 
    "si": "/audio/esa.mp3"
  }
}`;
  }

  showAllLanguages() {
    // This could open a modal or navigate to a detailed language management page
    console.log('Show all languages clicked');
    // TODO: Implement detailed language view
  }

  resetToDefault() {
    this.languageService.setLanguage('en');
    console.log('Reset to default language (English)');
  }
}
