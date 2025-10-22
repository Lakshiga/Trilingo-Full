import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// MatTypographyModule is not available in Angular Material v19
import { MatCardModule } from '@angular/material/card';

export interface ColumnDef<T> {
  field: keyof T;
  headerName: string;
  type?: 'string' | 'number';
}

export interface DependentCrudApiService<T, TCreateDto> {
  getAllByParentId(parentId: number | string): Promise<T[]>;
  create(data: TCreateDto): Promise<T>;
  update(id: number | string, data: Partial<TCreateDto>): Promise<T>;
  delete(id: number | string): Promise<void>;
}

@Component({
  selector: 'app-dependent-inline-crud-table',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  template: `
    <mat-card class="crud-table-container">
      <mat-card-header>
        <div class="header-content">
          <button 
            mat-icon-button 
            (click)="navigateBack()" 
            class="back-button">
            <mat-icon>arrow_back</mat-icon>
            <span>Back to {{ parentName || 'Parent' }}</span>
          </button>
          
          <div class="title-section">
            <h1>Manage {{ entityName }}s for: "{{ parentName }}"</h1>
            <button 
              mat-raised-button 
              color="primary" 
              (click)="startAdding()"
              [disabled]="isAdding">
              <mat-icon>add</mat-icon>
              Add New {{ entityName }}
            </button>
          </div>
        </div>
      </mat-card-header>
      
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="dataSource" class="crud-table">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let element">
                {{ element[idField] }}
              </td>
            </ng-container>
            
            <!-- Dynamic Columns -->
            <ng-container *ngFor="let column of columns" [matColumnDef]="getColumnDef(column.field)">
              <th mat-header-cell *matHeaderCellDef>{{ column.headerName }}</th>
              <td mat-cell *matCellDef="let element; let i = index">
                <ng-container *ngIf="!isEditing(element[idField])">
                  {{ element[column.field] }}
                </ng-container>
                <ng-container *ngIf="isEditing(element[idField])">
                  <mat-form-field appearance="outline" class="inline-field">
                    <input 
                      matInput 
                      [name]="getColumnDef(column.field)"
                      [type]="column.type === 'number' ? 'number' : 'text'"
                      [value]="getEditedValue(column.field)"
                      (input)="onInputChange(column.field, $event)"
                      [placeholder]="column.headerName">
                  </mat-form-field>
                </ng-container>
              </td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let element; let i = index">
                <ng-container *ngIf="!isEditing(element[idField])">
                  <ng-container *ngIf="renderCustomActions">
                    <ng-container *ngTemplateOutlet="customActions; context: { $implicit: element }"></ng-container>
                  </ng-container>
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="startEditing(element)"
                    title="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    color="warn" 
                    (click)="deleteItem(element[idField])"
                    title="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </ng-container>
                <ng-container *ngIf="isEditing(element[idField])">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="saveEdit()"
                    title="Save">
                    <mat-icon>save</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    (click)="cancelEdit()"
                    title="Cancel">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </ng-container>
              </td>
            </ng-container>
            
            <!-- Add Row Column -->
            <ng-container matColumnDef="addRow">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let element; let i = index">
                <ng-container *ngIf="isAdding && i === items.length">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="saveAdd()"
                    title="Save">
                    <mat-icon>save</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    (click)="cancelAdd()"
                    title="Cancel">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </ng-container>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            
            <!-- Loading Row -->
            <tr *ngIf="isLoading" class="loading-row">
              <td [attr.colspan]="displayedColumns.length" class="loading-cell">
                <mat-spinner diameter="30"></mat-spinner>
              </td>
            </tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>
    
    <!-- Custom Actions Template -->
    <ng-template #customActions let-item>
      <ng-container *ngIf="renderCustomActions">
        <ng-container *ngTemplateOutlet="customActions; context: { $implicit: item }"></ng-container>
      </ng-container>
    </ng-template>
  `,
  styles: [`
    .crud-table-container {
      margin: 16px 0;
    }

    .header-content {
      width: 100%;
    }

    .back-button {
      margin-bottom: 16px;
    }

    .title-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .table-container {
      overflow-x: auto;
    }

    .crud-table {
      width: 100%;
    }

    .inline-field {
      width: 100%;
    }

    .loading-row {
      text-align: center;
    }

    .loading-cell {
      padding: 20px;
      text-align: center;
    }

    .add-row {
      background-color: #f5f5f5;
    }
  `]
})
export class DependentInlineCrudTableComponent<T extends Record<string, any>, TCreateDto extends object> 
  implements OnInit, OnChanges {
  
  @Input() entityName!: string;
  @Input() parentName?: string;
  @Input() parentRoute!: string;
  @Input() parentId!: number | string;
  @Input() apiService!: DependentCrudApiService<T, TCreateDto>;
  @Input() columns!: ColumnDef<T>[];
  @Input() idField!: keyof T;
  @Input() renderCustomActions?: (item: T) => any;
  @Input() initialData?: T[];

  items: T[] = [];
  isLoading = true;
  editRowId: number | string | null = null;
  editedRowData: Partial<TCreateDto> | null = null;
  isAdding = false;

  get dataSource(): T[] {
    return this.isAdding ? [...this.items, {} as T] : this.items;
  }

  get displayedColumns(): string[] {
    const cols = ['id', ...this.columns.map(c => String(c.field)), 'actions'];
    return this.isAdding ? [...cols, 'addRow'] : cols;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentId'] || changes['apiService']) {
      this.fetchData();
    }
  }

  private async fetchData(): Promise<void> {
    if (this.initialData && this.items.length > 0) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    try {
      const data = await this.apiService.getAllByParentId(this.parentId);
      this.items = data;
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  startEditing(item: T): void {
    this.editRowId = item[this.idField];
    const initialEditData: Partial<TCreateDto> = {};
    this.columns.forEach(col => {
      (initialEditData as any)[col.field] = item[col.field];
    });
    this.editedRowData = initialEditData;
  }

  cancelEdit(): void {
    this.editRowId = null;
    this.editedRowData = null;
    this.isAdding = false;
  }

  async saveEdit(): Promise<void> {
    if (!this.editRowId || !this.editedRowData) return;
    
    try {
      await this.apiService.update(this.editRowId, this.editedRowData);
      this.cancelEdit();
      await this.fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  startAdding(): void {
    this.isAdding = true;
    const initialAddData: Partial<TCreateDto> = {};
    this.columns.forEach(col => {
      (initialAddData as any)[col.field] = col.type === 'number' ? 0 : '';
    });
    this.editedRowData = initialAddData;
  }

  cancelAdd(): void {
    this.isAdding = false;
    this.editedRowData = null;
  }

  async saveAdd(): Promise<void> {
    if (!this.editedRowData) return;
    
    try {
      await this.apiService.create(this.editedRowData as TCreateDto);
      this.cancelAdd();
      await this.fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteItem(id: number | string): Promise<void> {
    if (confirm(`Are you sure you want to delete this ${this.entityName}?`)) {
      try {
        await this.apiService.delete(id);
        await this.fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  }

  onInputChange(field: keyof T, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const column = this.columns.find(c => c.field === field);
    const parsedValue = column?.type === 'number' ? parseInt(value, 10) || 0 : value;
    
    if (this.editedRowData) {
      (this.editedRowData as any)[field] = parsedValue;
    }
  }

  isEditing(id: number | string): boolean {
    return this.editRowId === id;
  }

  getEditedValue(field: keyof T): any {
    return (this.editedRowData as any)?.[field] ?? '';
  }

  navigateBack(): void {
    this.router.navigate([this.parentRoute]);
  }

  getColumnDef(field: keyof T): string {
    return String(field);
  }
}
