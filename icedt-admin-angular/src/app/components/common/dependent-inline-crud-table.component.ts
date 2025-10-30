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
    <mat-card class="crud-table-container rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <mat-card-header class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div class="header-content w-full">
          <button 
            mat-icon-button 
            (click)="navigateBack()" 
            class="back-button mb-4 text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
            <mat-icon>arrow_back</mat-icon>
            <span>Back to {{ parentName || 'Parent' }}</span>
          </button>
          
          <div class="title-section flex justify-between items-center w-full">
            <h1 class="text-2xl font-bold text-gray-800">Manage {{ entityName }}s for: "{{ parentName }}"</h1>
            <button 
              mat-raised-button 
              color="primary" 
              (click)="startAdding()"
              [disabled]="isAdding"
              class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
              <mat-icon>add</mat-icon>
              Add New {{ entityName }}
            </button>
          </div>
        </div>
      </mat-card-header>
      
      <mat-card-content class="p-0">
        <div class="table-container overflow-x-auto">
          <table mat-table [dataSource]="dataSource" class="crud-table min-w-full">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <td mat-cell *matCellDef="let element" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ element[idField] }}
              </td>
            </ng-container>
            
            <!-- Dynamic Columns -->
            <ng-container *ngFor="let column of columns" [matColumnDef]="getColumnDef(column.field)">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ column.headerName }}</th>
              <td mat-cell *matCellDef="let element; let i = index" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <ng-container *ngIf="!isEditing(element[idField])">
                  {{ element[column.field] }}
                </ng-container>
                <ng-container *ngIf="isEditing(element[idField])">
                  <mat-form-field appearance="outline" class="inline-field w-full">
                    <input 
                      matInput 
                      [name]="getColumnDef(column.field)"
                      [type]="column.type === 'number' ? 'number' : 'text'"
                      [value]="getEditedValue(column.field)"
                      (input)="onInputChange(column.field, $event)"
                      [placeholder]="column.headerName"
                      class="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                  </mat-form-field>
                </ng-container>
              </td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <td mat-cell *matCellDef="let element; let i = index" class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <ng-container *ngIf="!isEditing(element[idField])" class="flex space-x-2">
                  <ng-container *ngIf="renderCustomActions">
                    <ng-container *ngTemplateOutlet="customActions; context: { $implicit: element }"></ng-container>
                  </ng-container>
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="startEditing(element)"
                    title="Edit"
                    class="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    color="warn" 
                    (click)="deleteItem(element[idField])"
                    title="Delete"
                    class="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>delete</mat-icon>
                  </button>
                </ng-container>
                <ng-container *ngIf="isEditing(element[idField])" class="flex space-x-2">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="saveEdit()"
                    title="Save"
                    class="bg-green-100 hover:bg-green-200 text-green-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>save</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    (click)="cancelEdit()"
                    title="Cancel"
                    class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </ng-container>
              </td>
            </ng-container>
            
            <!-- Add Row Column -->
            <ng-container matColumnDef="addRow">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50"></th>
              <td mat-cell *matCellDef="let element; let i = index" class="px-6 py-4 whitespace-nowrap">
                <ng-container *ngIf="isAdding && i === items.length" class="flex space-x-2">
                  <button 
                    mat-icon-button 
                    color="primary" 
                    (click)="saveAdd()"
                    title="Save"
                    class="bg-green-100 hover:bg-green-200 text-green-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>save</mat-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    (click)="cancelAdd()"
                    title="Cancel"
                    class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </ng-container>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-gray-50"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="bg-white hover:bg-gray-50 transition-colors duration-150"></tr>
            
            <!-- Loading Row -->
            <tr *ngIf="isLoading" class="loading-row">
              <td [attr.colspan]="displayedColumns.length" class="loading-cell p-6 text-center">
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