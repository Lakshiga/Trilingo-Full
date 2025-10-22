import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-image-upload-cell',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="image-upload-container">
      <img 
        *ngIf="value" 
        [src]="value" 
        alt="preview" 
        class="preview-image"
      />
      <button mat-stroked-button type="button" class="upload-button">
        Upload
        <input 
          type="file" 
          class="file-input"
          (change)="onFileSelected($event)"
          accept="image/*"
        />
      </button>
    </div>
  `,
  styles: [`
    .image-upload-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .preview-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }

    .upload-button {
      position: relative;
      overflow: hidden;
    }

    .file-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  `]
})
export class ImageUploadCellComponent {
  @Input() value: string | null = null;
  @Output() urlChange = new EventEmitter<string>();

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;

    // For now, we'll just create a placeholder URL
    // In a real implementation, you would upload the file to your media service
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      this.urlChange.emit(result);
    };
    reader.readAsDataURL(file);

    // TODO: Implement actual file upload to media service
    // this.uploadFile(file);
  }

  private async uploadFile(file: File): Promise<void> {
    try {
      // This would be implemented with your media API service
      // const response = await this.mediaApiService.uploadSingleFile(file, 'levels');
      // this.urlChange.emit(response.url);
    } catch (error) {
      console.error('Upload failed', error);
      alert('File upload failed.');
    }
  }
}
