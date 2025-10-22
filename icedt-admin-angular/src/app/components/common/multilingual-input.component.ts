import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MultilingualText, LanguageCode, SUPPORTED_LANGUAGES } from '../../types/multilingual.types';

@Component({
  selector: 'app-multilingual-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="multilingual-input">
      <mat-tab-group class="language-tabs" (selectedTabChange)="onTabChange($event)">
        <mat-tab 
          *ngFor="let language of languages" 
          [label]="getLanguageLabel(language.code)"
          [disabled]="disabled">
          <div class="tab-content">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ label }} ({{ language.nativeName }})</mat-label>
              <input 
                matInput 
                [value]="getValue(language.code)"
                (input)="onInputChange($event, language.code)"
                [placeholder]="getPlaceholder(language.code)"
                [disabled]="disabled"
                [required]="required">
              <mat-icon matSuffix *ngIf="getValue(language.code)" class="content-indicator">
                check_circle
              </mat-icon>
            </mat-form-field>
          </div>
        </mat-tab>
      </mat-tab-group>
      
      <!-- Language completion indicator -->
      <div class="completion-indicator" *ngIf="showCompletionIndicator">
        <div class="language-status">
          <span 
            *ngFor="let language of languages" 
            class="language-dot"
            [class.completed]="hasContent(language.code)"
            [class.current]="currentLanguage === language.code"
            [matTooltip]="getLanguageLabel(language.code)">
          </span>
        </div>
        <span class="completion-text">
          {{ getCompletionText() }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .multilingual-input {
      width: 100%;
    }

    .language-tabs {
      margin-bottom: 16px;
    }

    .tab-content {
      padding: 16px 0;
    }

    .full-width {
      width: 100%;
    }

    .content-indicator {
      color: #4caf50;
      font-size: 20px;
    }

    .completion-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .language-status {
      display: flex;
      gap: 4px;
    }

    .language-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #ccc;
      transition: all 0.2s ease;
    }

    .language-dot.completed {
      background-color: #4caf50;
    }

    .language-dot.current {
      border: 2px solid #1976d2;
      transform: scale(1.2);
    }

    .completion-text {
      color: #666;
    }

    .mat-mdc-tab-group {
      --mdc-tab-indicator-active-indicator-color: #1976d2;
    }

    .mat-mdc-tab {
      min-width: 120px;
    }

    @media (max-width: 768px) {
      .mat-mdc-tab {
        min-width: 80px;
      }
      
      .completion-indicator {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class MultilingualInputComponent implements OnInit {
  @Input() value: MultilingualText = { ta: '', en: '', si: '' };
  @Input() label: string = 'Text';
  @Input() placeholder: MultilingualText = { ta: '', en: '', si: '' };
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showCompletionIndicator: boolean = true;
  @Input() currentLanguage: LanguageCode = 'en';

  @Output() valueChange = new EventEmitter<MultilingualText>();

  languages = SUPPORTED_LANGUAGES;

  ngOnInit() {
    // Initialize with empty values if not provided
    if (!this.value) {
      this.value = { ta: '', en: '', si: '' };
    }
  }

  getValue(languageCode: LanguageCode): string {
    return this.value[languageCode] || '';
  }

  onInputChange(event: Event, languageCode: LanguageCode): void {
    const target = event.target as HTMLInputElement;
    const newValue = { ...this.value, [languageCode]: target.value };
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  onTabChange(event: any): void {
    // Optional: Handle tab change if needed
  }

  getLanguageLabel(code: LanguageCode): string {
    const language = this.languages.find(lang => lang.code === code);
    return language ? `${language.flag} ${language.nativeName}` : code.toUpperCase();
  }

  getPlaceholder(code: LanguageCode): string {
    return this.placeholder[code] || `Enter ${this.label.toLowerCase()} in ${this.getLanguageLabel(code)}`;
  }

  hasContent(code: LanguageCode): boolean {
    return !!(this.value[code] && this.value[code].trim());
  }

  getCompletionText(): string {
    const completedCount = this.languages.filter(lang => this.hasContent(lang.code)).length;
    const totalCount = this.languages.length;
    return `${completedCount}/${totalCount} languages completed`;
  }
}
