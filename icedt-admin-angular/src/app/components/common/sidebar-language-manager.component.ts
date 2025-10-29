import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { LanguageCode, LanguageConfig } from '../../types/multilingual.types';

@Component({
  selector: 'app-sidebar-language-manager',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    
      

      
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
  constructor(private languageService: LanguageService) {}

  ngOnInit() {}
}
