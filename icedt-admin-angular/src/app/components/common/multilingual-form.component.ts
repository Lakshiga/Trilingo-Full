import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../types/multilingual.types';

export interface MultilingualFormData {
  name_en: string;
  name_ta: string;
  name_si: string;
  description_en?: string;
  description_ta?: string;
  description_si?: string;
}

@Component({
  selector: 'app-multilingual-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ title }}</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <mat-tab-group [(selectedIndex)]="selectedTabIndex" (selectedIndexChange)="onTabChange($event)">
          <mat-tab *ngFor="let lang of languages" [label]="lang.nativeName + ' ' + lang.flag">
            <div class="tab-content">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>{{ fieldLabel }} ({{ lang.nativeName }})</mat-label>
                <input 
                  matInput 
                  [(ngModel)]="formData[lang.code === 'ta' ? 'name_ta' : lang.code === 'si' ? 'name_si' : 'name_en']"
                  (ngModelChange)="onFieldChange()"
                  [placeholder]="'Enter ' + fieldLabel + ' in ' + lang.name"
                />
                <mat-icon matSuffix *ngIf="isFieldComplete(lang.code)" color="primary">check_circle</mat-icon>
              </mat-form-field>
              
              <div *ngIf="showDescription" class="description-field">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ descriptionLabel }} ({{ lang.nativeName }})</mat-label>
                  <textarea 
                    matInput 
                    [(ngModel)]="formData[lang.code === 'ta' ? 'description_ta' : lang.code === 'si' ? 'description_si' : 'description_en']"
                    (ngModelChange)="onFieldChange()"
                    [placeholder]="'Enter ' + descriptionLabel + ' in ' + lang.name"
                    rows="3"
                  ></textarea>
                  <mat-icon matSuffix *ngIf="isDescriptionComplete(lang.code)" color="primary">check_circle</mat-icon>
                </mat-form-field>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
        
        <div class="completion-status">
          <div class="status-item">
            <span class="status-label">{{ fieldLabel }}:</span>
            <span class="status-dots">
              <span *ngFor="let lang of languages" 
                    class="dot" 
                    [class.completed]="isFieldComplete(lang.code)"
                    [class.pending]="!isFieldComplete(lang.code)">
              </span>
            </span>
            <span class="status-text">{{ getCompletionText() }}</span>
          </div>
          
          <div *ngIf="showDescription" class="status-item">
            <span class="status-label">{{ descriptionLabel }}:</span>
            <span class="status-dots">
              <span *ngFor="let lang of languages" 
                    class="dot" 
                    [class.completed]="isDescriptionComplete(lang.code)"
                    [class.pending]="!isDescriptionComplete(lang.code)">
              </span>
            </span>
            <span class="status-text">{{ getDescriptionCompletionText() }}</span>
          </div>
        </div>
      </mat-card-content>
      
      <mat-card-actions *ngIf="showActions">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button 
                color="primary" 
                (click)="onSave()"
                [disabled]="!isFormValid()">
          {{ saveButtonText }}
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .tab-content {
      padding: 16px 0;
    }
    
    .full-width {
      width: 100%;
    }
    
    .description-field {
      margin-top: 16px;
    }
    
    .completion-status {
      margin-top: 24px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    
    .status-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .status-item:last-child {
      margin-bottom: 0;
    }
    
    .status-label {
      font-weight: 500;
      margin-right: 12px;
      min-width: 120px;
    }
    
    .status-dots {
      display: flex;
      gap: 8px;
      margin-right: 12px;
    }
    
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      transition: all 0.3s ease;
    }
    
    .dot.completed {
      background-color: #4caf50;
    }
    
    .dot.pending {
      background-color: #e0e0e0;
    }
    
    .status-text {
      font-size: 14px;
      color: #666;
    }
    
    mat-card-actions {
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class MultilingualFormComponent implements OnInit {
  @Input() title: string = 'Add Item';
  @Input() fieldLabel: string = 'Name';
  @Input() descriptionLabel: string = 'Description';
  @Input() showDescription: boolean = false;
  @Input() showActions: boolean = true;
  @Input() saveButtonText: string = 'Save';
  @Input() initialData: Partial<MultilingualFormData> = {};
  
  @Output() save = new EventEmitter<MultilingualFormData>();
  @Output() cancel = new EventEmitter<void>();
  @Output() dataChange = new EventEmitter<MultilingualFormData>();

  languages = SUPPORTED_LANGUAGES;
  selectedTabIndex = 0;
  
  formData: MultilingualFormData = {
    name_en: '',
    name_ta: '',
    name_si: '',
    description_en: '',
    description_ta: '',
    description_si: ''
  };

  ngOnInit(): void {
    if (this.initialData) {
      this.formData = {
        name_en: this.initialData.name_en || '',
        name_ta: this.initialData.name_ta || '',
        name_si: this.initialData.name_si || '',
        description_en: this.initialData.description_en || '',
        description_ta: this.initialData.description_ta || '',
        description_si: this.initialData.description_si || ''
      };
    }
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  onFieldChange(): void {
    this.dataChange.emit(this.formData);
  }

  isFieldComplete(langCode: LanguageCode): boolean {
    const fieldName = langCode === 'ta' ? 'name_ta' : langCode === 'si' ? 'name_si' : 'name_en';
    return !!(this.formData[fieldName] && this.formData[fieldName].trim());
  }

  isDescriptionComplete(langCode: LanguageCode): boolean {
    if (!this.showDescription) return true;
    const fieldName = langCode === 'ta' ? 'description_ta' : langCode === 'si' ? 'description_si' : 'description_en';
    return !!(this.formData[fieldName as keyof MultilingualFormData] && 
              this.formData[fieldName as keyof MultilingualFormData]?.trim());
  }

  getCompletionText(): string {
    const completed = this.languages.filter(lang => this.isFieldComplete(lang.code)).length;
    return `${completed}/${this.languages.length} languages completed`;
  }

  getDescriptionCompletionText(): string {
    if (!this.showDescription) return 'N/A';
    const completed = this.languages.filter(lang => this.isDescriptionComplete(lang.code)).length;
    return `${completed}/${this.languages.length} languages completed`;
  }

  isFormValid(): boolean {
    return this.languages.every(lang => this.isFieldComplete(lang.code));
  }

  onSave(): void {
    if (this.isFormValid()) {
      this.save.emit(this.formData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
