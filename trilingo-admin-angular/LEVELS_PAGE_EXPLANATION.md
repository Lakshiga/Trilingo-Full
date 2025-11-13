# Levels Page - Complete Explanation (Tamil)

## Overview

Levels page ஒரு **CRUD (Create, Read, Update, Delete)** management page. இதில் Levels-ஐ manage செய்யலாம்.

---

## 📁 File Structure

```
trilingo-admin-angular/src/app/components/common/levels-table/
├── levels-table.component.ts    (TypeScript logic)
├── levels-table.component.html  (Template/UI)
└── levels-table.component.css   (Styling)
```

---

## 🎯 Component Structure

### 1. **TypeScript Component** (`levels-table.component.ts`)

#### Properties (Variables):

```typescript
levels: LevelResponse[] = []           // Table-ல் show செய்ய வேண்டிய levels data
isLoading = false                       // Loading state (spinner show/hide)
showDialog = false                      // Dialog open/close state
dialogMode: 'add' | 'edit' = 'add'      // Dialog mode (add or edit)
currentLevel: LevelResponse | null      // Currently editing level
selectedLanguageId: number = 1          // Default language ID (hidden)
currentFormData: MultilingualFormData   // Form data (name_en, name_ta, name_si)
displayedColumns: string[]              // Table columns: ['id', 'name_en', 'name_ta', 'name_si', 'manageLessons', 'actions']
```

#### Lifecycle Hooks:

1. **`ngOnInit()`** - Component load ஆகும்போது:
   - `loadData()` call செய்கிறது
   - API-லிருந்து levels data fetch செய்கிறது

2. **`ngOnDestroy()`** - Component destroy ஆகும்போது:
   - RxJS subscriptions-ஐ cleanup செய்கிறது (memory leak prevent)

#### Main Methods:

##### 1. `loadData()`
```typescript
loadData(): void {
  this.isLoading = true;                    // Loading start
  this.levelApiService.getAll().toPromise()  // API call
    .then(levels => {
      this.levels = levels || [];           // Data store
      this.isLoading = false;                // Loading stop
    })
    .catch(error => {
      console.error('Error loading data:', error);
      this.isLoading = false;
    });
}
```
**பணி**: API-லிருந்து levels-ஐ fetch செய்து table-ல் display செய்கிறது

##### 2. `openAddDialog()`
```typescript
openAddDialog(): void {
  this.dialogMode = 'add';                  // Add mode set
  this.currentLevel = null;                  // No current level
  this.currentFormData = {                   // Empty form
    name_en: '',
    name_ta: '',
    name_si: ''
  };
  this.showDialog = true;                    // Dialog show
}
```
**பணி**: New level add செய்ய dialog-ஐ open செய்கிறது

##### 3. `openEditDialog(level: LevelResponse)`
```typescript
openEditDialog(level: LevelResponse): void {
  this.dialogMode = 'edit';                  // Edit mode set
  this.currentLevel = level;                 // Current level store
  this.selectedLanguageId = level.languageId ?? 1;
  this.currentFormData = {                   // Existing data load
    name_en: level.name_en,
    name_ta: level.name_ta,
    name_si: level.name_si
  };
  this.showDialog = true;                    // Dialog show
}
```
**பணி**: Existing level-ஐ edit செய்ய dialog-ஐ open செய்கிறது

##### 4. `closeDialog()`
```typescript
closeDialog(): void {
  this.showDialog = false;                  // Dialog hide
  this.currentLevel = null;                  // Clear current level
}
```
**பணி**: Dialog-ஐ close செய்கிறது

##### 5. `onFormDataChange(formData: MultilingualFormData)`
```typescript
onFormDataChange(formData: MultilingualFormData): void {
  this.currentFormData = formData;           // Form data update
}
```
**பணி**: Form-ல் data change ஆகும்போது currentFormData-ஐ update செய்கிறது

##### 6. `isFormValid()`
```typescript
isFormValid(): boolean {
  return !!(this.currentFormData.name_en || 
            this.currentFormData.name_ta || 
            this.currentFormData.name_si);
}
```
**பணி**: Form valid-ஆ இருக்கிறதா check செய்கிறது (எந்த ஒரு language-ல் name இருக்கணும்)

##### 7. `onSave()`
```typescript
onSave(): void {
  if (!this.isFormValid()) return;          // Validation check

  const createDto: LevelCreateDto = {
    name_en: this.currentFormData.name_en,
    name_ta: this.currentFormData.name_ta,
    name_si: this.currentFormData.name_si,
    languageId: this.selectedLanguageId
  };

  if (this.dialogMode === 'add') {
    // CREATE new level
    this.levelApiService.create(createDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeDialog();
          this.loadData();                   // Refresh table
        },
        error: (error) => {
          console.error('Error creating level:', error);
        }
      });
  } else if (this.dialogMode === 'edit' && this.currentLevel) {
    // UPDATE existing level
    this.levelApiService.update(this.currentLevel.id, createDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeDialog();
          this.loadData();                   // Refresh table
        },
        error: (error) => {
          console.error('Error updating level:', error);
        }
      });
  }
}
```
**பணி**: 
- Add mode-ல்: New level create செய்கிறது
- Edit mode-ல்: Existing level update செய்கிறது
- Success-க்கு பிறகு dialog close செய்து table refresh செய்கிறது

##### 8. `deleteLevel(level: LevelResponse)`
```typescript
deleteLevel(level: LevelResponse): void {
  if (confirm(`Are you sure you want to delete "${level.name_en}"?`)) {
    this.levelApiService.deleteItem(level.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadData();                   // Refresh table
        },
        error: (error) => {
          console.error('Error deleting level:', error);
        }
      });
  }
}
```
**பணி**: Level-ஐ delete செய்கிறது (confirmation dialog-க்கு பிறகு)

---

### 2. **HTML Template** (`levels-table.component.html`)

#### Structure:

```
1. Card Header
   ├── Title: "Levels Management"
   └── Button: "Add Levels" (opens dialog)

2. Card Content
   ├── Loading Spinner (if isLoading = true)
   └── Table (if isLoading = false)
       ├── ID Column
       ├── English Name Column
       ├── Tamil Name Column
       ├── Sinhala Name Column
       ├── Manage Lessons Column (button to navigate)
       └── Actions Column (Edit & Delete buttons)

3. Dialog (if showDialog = true)
   ├── Multilingual Form Component
   └── Action Buttons (Cancel & Save)
```

#### Key Sections:

##### A. Table Header
```html
<mat-card-header>
  <mat-card-title>Levels Management</mat-card-title>
  <button (click)="openAddDialog()">Add Levels</button>
</mat-card-header>
```

##### B. Table Columns
```html
<!-- ID Column -->
<ng-container matColumnDef="id">
  <th mat-header-cell>ID</th>
  <td mat-cell>{{ level.id }}</td>
</ng-container>

<!-- English Name Column -->
<ng-container matColumnDef="name_en">
  <th mat-header-cell>English Name</th>
  <td mat-cell>{{ level.name_en }}</td>
</ng-container>

<!-- Tamil Name Column -->
<ng-container matColumnDef="name_ta">
  <th mat-header-cell>தமிழ் Name</th>
  <td mat-cell>{{ level.name_ta }}</td>
</ng-container>

<!-- Sinhala Name Column -->
<ng-container matColumnDef="name_si">
  <th mat-header-cell>සිංහල Name</th>
  <td mat-cell>{{ level.name_si }}</td>
</ng-container>
```

##### C. Manage Lessons Button
```html
<ng-container matColumnDef="manageLessons">
  <td mat-cell>
    <button mat-button 
            [routerLink]="['/lessons']" 
            [queryParams]="{ levelId: level.id }">
      MANAGE LESSONS
    </button>
  </td>
</ng-container>
```
**பணி**: Lessons page-க்கு navigate செய்கிறது (levelId-ஐ query param-ஆ pass செய்கிறது)

##### D. Actions Column
```html
<ng-container matColumnDef="actions">
  <td mat-cell>
    <button (click)="openEditDialog(level)">Edit</button>
    <button (click)="deleteLevel(level)">Delete</button>
  </td>
</ng-container>
```

##### E. Dialog (Add/Edit Form)
```html
<div *ngIf="showDialog" class="dialog-overlay">
  <div class="dialog-content">
    <app-multilingual-form
      [title]="dialogTitle"
      [fieldLabel]="'Level Name'"
      [initialData]="currentFormData"
      (dataChange)="onFormDataChange($event)">
    </app-multilingual-form>
    
    <div class="dialog-actions">
      <button (click)="closeDialog()">Cancel</button>
      <button (click)="onSave()" [disabled]="!isFormValid()">
        {{ dialogMode === 'add' ? 'Add Level' : 'Update Level' }}
      </button>
    </div>
  </div>
</div>
```

---

### 3. **CSS Styling** (`levels-table.component.css`)

#### Key Styles:

1. **Card Layout**: Full width, rounded corners, shadow
2. **Table Styling**: 
   - Fixed column widths
   - Hover effects
   - Responsive design
3. **Dialog Styling**: 
   - Overlay (semi-transparent background)
   - Centered modal
   - Rounded corners

---

## 🔄 Data Flow

### 1. **Page Load**
```
Component Init → loadData() → API Call → levels[] populated → Table Display
```

### 2. **Add New Level**
```
Click "Add Levels" → openAddDialog() → Dialog Opens → 
Fill Form → Click "Add Level" → onSave() → API Create → 
Dialog Closes → loadData() → Table Refreshes
```

### 3. **Edit Level**
```
Click Edit Button → openEditDialog(level) → Dialog Opens with Data → 
Modify Form → Click "Update Level" → onSave() → API Update → 
Dialog Closes → loadData() → Table Refreshes
```

### 4. **Delete Level**
```
Click Delete Button → Confirm Dialog → deleteLevel() → 
API Delete → loadData() → Table Refreshes
```

### 5. **Navigate to Lessons**
```
Click "MANAGE LESSONS" → Router Navigate → /lessons?levelId=123
```

---

## 📊 API Integration

### LevelApiService Methods:

1. **`getAll()`**: GET `/Levels` - All levels fetch
2. **`create(dto)`**: POST `/Levels` - New level create
3. **`update(id, dto)`**: PUT `/Levels/{id}` - Level update
4. **`deleteItem(id)`**: DELETE `/Levels/{id}` - Level delete

### Data Structure:

```typescript
LevelResponse {
  id: number;
  name_en: string;      // English name
  name_ta: string;      // Tamil name
  name_si: string;      // Sinhala name
  languageId: number;   // Language ID (default: 1)
}

LevelCreateDto {
  name_en: string;
  name_ta: string;
  name_si: string;
  languageId: number;
}
```

---

## 🎨 UI Features

1. **Loading State**: Spinner display during API calls
2. **Dialog-based Editing**: Modal form for add/edit
3. **Multilingual Support**: English, Tamil, Sinhala names
4. **Responsive Design**: Works on all screen sizes
5. **Hover Effects**: Visual feedback on interactions
6. **Confirmation Dialogs**: Delete confirmation

---

## 🔗 Navigation

- **Route**: `/levels` (defined in `app.routes.ts`)
- **To Lessons**: `/lessons?levelId={id}` (query parameter)

---

## 💡 Key Points

1. **Dialog-based CRUD**: Inline editing இல்லை, dialog-ல் form
2. **Multilingual Form**: `MultilingualFormComponent` use செய்கிறது
3. **RxJS Management**: `takeUntil` pattern use செய்து memory leaks prevent
4. **Form Validation**: At least one language name required
5. **Error Handling**: Console error logging

---

## 🛠️ Dependencies

- Angular Material (Table, Card, Button, Dialog, etc.)
- RxJS (Observables, Subjects)
- Router (Navigation)
- MultilingualFormComponent (Custom component)

---

## Summary

Levels page ஒரு complete CRUD management interface:
- ✅ View all levels in table
- ✅ Add new levels (multilingual)
- ✅ Edit existing levels
- ✅ Delete levels
- ✅ Navigate to lessons for each level

All operations use dialog-based forms with multilingual support!

