import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Observable, Subject, takeUntil } from 'rxjs';

export interface ColumnDef<T, TCreateDto> {
  field: keyof T;
  headerName: string;
  type?: 'string' | 'number';
  renderCell?: (value: any, row: T) => string;
  renderEditCell?: (value: any, onChange: (field: keyof TCreateDto, value: any) => void) => string;
}

export interface CrudApiService<T, TCreateDto> {
  getAll(): Observable<T[]>;
  create(item: TCreateDto): Observable<T>;
  update(id: number | string, item: Partial<TCreateDto>): Observable<void>;
  deleteItem(id: number | string): Observable<void>;
}

@Component({
  selector: 'app-inline-crud-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  template: `
    <mat-card class="rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <mat-card-header class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <mat-card-title class="text-2xl font-bold text-gray-800">{{ entityName }} Management</mat-card-title>
        <div class="spacer"></div>
        <button mat-raised-button 
                class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                (click)="startAdding()" 
                [disabled]="isAdding || editRowId !== null">
          <mat-icon>add</mat-icon>
          Add {{ entityName }}
        </button>
      </mat-card-header>
      
      <mat-card-content class="p-0">
        <div *ngIf="isLoading" class="loading-container flex justify-center items-center p-12">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="!isLoading" class="table-container overflow-x-auto">
          <table mat-table [dataSource]="items" class="crud-table min-w-full">
            <!-- Display columns -->
            <ng-container *ngFor="let column of columns" [matColumnDef]="getColumnDef(column)">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ column.headerName }}</th>
              <td mat-cell *matCellDef="let row" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div *ngIf="editRowId !== row[idField] && !isAdding">
                  {{ getDisplayValue(row, column) }}
                </div>
                <div *ngIf="editRowId === row[idField] || (isAdding && row === newItem)">
                  <mat-form-field appearance="outline" class="edit-field w-full">
                    <input
                      matInput
                      [type]="column.type === 'number' ? 'number' : 'text'"
                      [value]="getEditValue(row, column)"
                      (input)="onEditValueChange(column.field, $event)"
                      class="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </mat-form-field>
                </div>
              </td>
            </ng-container>

            <!-- Actions column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="px-6 py-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <td mat-cell *matCellDef="let row" class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div *ngIf="editRowId !== row[idField] && !isAdding" class="flex space-x-2">
                  <button mat-icon-button 
                          (click)="startEditing(row)" 
                          color="primary"
                          class="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button 
                          (click)="deleteItem(row)" 
                          color="warn"
                          class="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>delete</mat-icon>
                  </button>
                  <ng-container *ngIf="renderCustomActions">
                    <span>{{ renderCustomActions(row) }}</span>
                  </ng-container>
                </div>
                <div *ngIf="editRowId === row[idField] || (isAdding && row === newItem)" class="flex space-x-2">
                  <button mat-icon-button 
                          (click)="saveRow(row)" 
                          color="primary"
                          class="bg-green-100 hover:bg-green-200 text-green-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>save</mat-icon>
                  </button>
                  <button mat-icon-button 
                          (click)="cancelEdit()" 
                          color="warn"
                          class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors duration-200">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-gray-50"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="bg-white hover:bg-gray-50 transition-colors duration-150"></tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>

  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 32px;
    }

    .table-container {
      overflow-x: auto;
    }

    .crud-table {
      width: 100%;
    }

    .edit-field {
      width: 100%;
      min-width: 120px;
    }

    mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .mat-mdc-cell, .mat-mdc-header-cell {
      padding: 8px 16px;
    }
  `]
})
export class InlineCrudTableComponent<T extends Record<string, any>, TCreateDto extends object> implements OnInit, OnDestroy {
  @Input() entityName!: string;
  @Input() apiService!: CrudApiService<T, TCreateDto>;
  @Input() columns!: ColumnDef<T, TCreateDto>[];
  @Input() idField!: keyof T;
  @Input() renderCustomActions?: (item: T) => any;

  items: T[] = [];
  isLoading = false;
  editRowId: number | string | null = null;
  editedRowData: Partial<TCreateDto> | null = null;
  isAdding = false;
  newItem: T | null = null;

  displayedColumns: string[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.displayedColumns = [...this.columns.map(col => col.field as string), 'actions'];
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.isLoading = true;
    this.apiService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.items = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.isLoading = false;
        }
      });
  }

  startEditing(row: T): void {
    this.editRowId = row[this.idField] as number | string;
    this.editedRowData = { ...row } as Partial<TCreateDto>;
  }

  startAdding(): void {
    this.isAdding = true;
    this.newItem = {} as T;
    this.editedRowData = {};
  }

  cancelEdit(): void {
    this.editRowId = null;
    this.editedRowData = null;
    this.isAdding = false;
    this.newItem = null;
  }

  saveRow(row: T): void {
    if (!this.editedRowData) return;

    if (this.isAdding) {
      this.apiService.create(this.editedRowData as TCreateDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cancelEdit();
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error creating data:', error);
          }
        });
    } else {
      this.apiService.update(row[this.idField] as number | string, this.editedRowData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cancelEdit();
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error updating data:', error);
          }
        });
    }
  }

  deleteItem(row: T): void {
    if (confirm(`Are you sure you want to delete this ${this.entityName.toLowerCase()}?`)) {
      this.apiService.deleteItem(row[this.idField] as number | string)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error deleting data:', error);
          }
        });
    }
  }


  getDisplayValue(row: T, column: ColumnDef<T, TCreateDto>): string {
    if (column.renderCell) {
      return column.renderCell(row[column.field], row);
    }
    return String(row[column.field] || '');
  }

  getEditValue(row: T, column: ColumnDef<T, TCreateDto>): any {
    if (this.editedRowData && column.field in this.editedRowData) {
      return this.editedRowData[column.field as keyof TCreateDto];
    }
    return row[column.field] || '';
  }

  getColumnDef(column: ColumnDef<T, TCreateDto>): string {
    return String(column.field);
  }

  onEditValueChange(field: keyof T, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    if (!this.editedRowData) {
      this.editedRowData = {};
    }
    
    this.editedRowData[field as keyof TCreateDto] = value as any;
  }
}