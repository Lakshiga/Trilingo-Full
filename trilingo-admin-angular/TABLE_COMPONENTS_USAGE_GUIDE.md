# Table Components Usage Guide (Tamil)

## Overview

இந்த project-ல் இரண்டு reusable table components உள்ளன:

1. **`inline-crud-table`** - Standalone entities-க்கு (parent இல்லாத entities)
2. **`dependent-inline-crud-table`** - Parent entity-க்கு dependent entities-க்கு

---

## 1. `inline-crud-table` Component

### எங்கே பயன்படுத்தப்படுகிறது?
- **`levels.component.html`** - Levels management-க்கு

### எப்போது பயன்படுத்த வேண்டும்?
- Parent entity இல்லாத standalone entities-க்கு
- Example: Levels, Languages, Categories (parent இல்லாதவை)

### எப்படி பயன்படுத்துவது?

#### Step 1: Component-ஐ import செய்யவும்

```typescript
import { InlineCrudTableComponent } from '../../components/common/inline-crud-table/inline-crud-table.component';
```

#### Step 2: HTML-ல் component-ஐ add செய்யவும்

```html
<app-inline-crud-table
  entityName="Level"
  [apiService]="apiService"
  [columns]="columns"
  idField="levelId"
  [renderCustomActions]="renderCustomLevelActions">
</app-inline-crud-table>
```

#### Step 3: TypeScript-ல் setup செய்யவும்

```typescript
export class YourComponent {
  // 1. Columns definition
  columns = [
    { field: 'name_en' as keyof YourType, headerName: 'English Name', type: 'string' as const },
    { field: 'name_ta' as keyof YourType, headerName: 'Tamil Name', type: 'string' as const },
    { field: 'languageId' as keyof YourType, headerName: 'Language ID', type: 'number' as const }
  ];

  // 2. API Service wrapper (Observable-based)
  apiService = {
    getAll: () => this.yourApiService.getAll(),
    create: (item: YourCreateDto) => this.yourApiService.create(item),
    update: (id: number, item: Partial<YourCreateDto>) => 
      this.yourApiService.update(id, item),
    deleteItem: (id: number) => this.yourApiService.deleteItem(id)
  };

  // 3. Optional: Custom actions (e.g., navigation buttons)
  renderCustomLevelActions = (item: YourType) => {
    return `<a mat-button routerLink="/some-route" [queryParams]="{id: ${item.id}}">
      Manage Items
    </a>`;
  };

  constructor(private yourApiService: YourApiService) {}
}
```

### Required Inputs:
- `entityName`: string - Table title-க்கு (e.g., "Level")
- `apiService`: CrudApiService - API methods (Observable-based)
- `columns`: ColumnDef[] - Table columns definition
- `idField`: keyof T - ID field name (e.g., "levelId")

### Optional Inputs:
- `renderCustomActions`: Function - Custom action buttons render செய்ய

---

## 2. `dependent-inline-crud-table` Component

### எங்கே பயன்படுத்தப்படுகிறது?
- **`lessons.component.html`** - Lessons management-க்கு (Level-க்கு dependent)

### எப்போது பயன்படுத்த வேண்டும்?
- Parent entity-க்கு dependent entities-க்கு
- Example: Lessons (Level-க்கு dependent), Activities (Lesson-க்கு dependent)

### எப்படி பயன்படுத்துவது?

#### Step 1: Component-ஐ import செய்யவும்

```typescript
import { DependentInlineCrudTableComponent } from '../../components/common/dependent-inline-crud-table/dependent-inline-crud-table.component';
```

#### Step 2: HTML-ல் component-ஐ add செய்யவும்

```html
<app-dependent-inline-crud-table
  entityName="Lesson"
  [parentName]="'Level #' + levelId"
  parentRoute="/levels"
  [parentId]="levelId"
  [apiService]="apiService"
  [columns]="columns"
  idField="lessonId"
  [renderCustomActions]="renderCustomLessonActions">
</app-dependent-inline-crud-table>
```

#### Step 3: TypeScript-ல் setup செய்யவும்

```typescript
export class YourComponent implements OnInit {
  parentId: string | null = null;
  apiService: any = null;

  columns = [
    { field: 'name' as keyof YourType, headerName: 'Name', type: 'string' as const },
    { field: 'order' as keyof YourType, headerName: 'Order', type: 'number' as const }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private yourApiService: YourApiService
  ) {}

  ngOnInit(): void {
    // Parent ID-ஐ route params-லிருந்து get செய்யவும்
    this.route.queryParams.subscribe(params => {
      this.parentId = params['parentId'];
      this.setupApiService();
    });
  }

  private setupApiService(): void {
    if (!this.parentId) {
      this.apiService = null;
      return;
    }

    const numericParentId = parseInt(this.parentId, 10);
    
    // API Service wrapper (Promise-based)
    this.apiService = {
      getAllByParentId: () => 
        this.yourApiService.getItemsByParentId(numericParentId).toPromise(),
      create: (newItem: YourCreateDto) => 
        this.yourApiService.create({ 
          ...newItem, 
          parentId: numericParentId
        }).toPromise(),
      update: (id: number, item: Partial<YourCreateDto>) => 
        this.yourApiService.update(id, item).toPromise(),
      delete: (id: number) => 
        this.yourApiService.deleteItem(id).toPromise()
    };
  }

  renderCustomLessonActions = (item: YourType) => {
    return `<a mat-button routerLink="/child-route" [queryParams]="{id: ${item.id}}">
      Manage Child Items
    </a>`;
  };
}
```

### Required Inputs:
- `entityName`: string - Table title-க்கு
- `parentRoute`: string - Back button-க்கு route (e.g., "/levels")
- `parentId`: number | string - Parent entity ID
- `apiService`: DependentCrudApiService - API methods (Promise-based)
- `columns`: ColumnDef[] - Table columns definition
- `idField`: keyof T - ID field name

### Optional Inputs:
- `parentName`: string - Parent name display-க்கு
- `renderCustomActions`: Function - Custom action buttons
- `initialData`: T[] - Pre-loaded data

---

## Key Differences

| Feature | `inline-crud-table` | `dependent-inline-crud-table` |
|---------|---------------------|-------------------------------|
| **Parent Entity** | ❌ இல்லை | ✅ Required |
| **API Type** | Observable | Promise |
| **Back Button** | ❌ இல்லை | ✅ உள்ளது |
| **Use Case** | Standalone entities | Dependent entities |
| **Example** | Levels, Languages | Lessons, Activities |

---

## API Service Requirements

### For `inline-crud-table` (Observable-based):
```typescript
interface CrudApiService<T, TCreateDto> {
  getAll(): Observable<T[]>;
  create(item: TCreateDto): Observable<any>;
  update(id: number | string, item: Partial<TCreateDto>): Observable<any>;
  deleteItem(id: number | string): Observable<any>;
}
```

### For `dependent-inline-crud-table` (Promise-based):
```typescript
interface DependentCrudApiService<T, TCreateDto> {
  getAllByParentId(parentId: number | string): Promise<T[]>;
  create(data: TCreateDto): Promise<T>;
  update(id: number | string, data: Partial<TCreateDto>): Promise<T>;
  delete(id: number | string): Promise<void>;
}
```

---

## Complete Example: New Entity Management

### Scenario: Activities Management (Lesson-க்கு dependent)

#### 1. Create API Service (`activity-api.service.ts`)
```typescript
@Injectable({ providedIn: 'root' })
export class ActivityApiService {
  private endpoint = '/Activities';

  constructor(private httpClient: HttpClientService) {}

  getActivitiesByLessonId(lessonId: number): Observable<Activity[]> {
    return this.httpClient.get<Activity[]>(`${this.endpoint}?lessonId=${lessonId}`);
  }

  create(item: ActivityCreateDto): Observable<Activity> {
    return this.httpClient.post<Activity, ActivityCreateDto>(this.endpoint, item);
  }

  update(id: number, item: Partial<ActivityCreateDto>): Observable<Activity> {
    return this.httpClient.put<Activity, Partial<ActivityCreateDto>>(
      `${this.endpoint}/${id}`, 
      item
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
}
```

#### 2. Create Component (`activities.component.ts`)
```typescript
@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [DependentInlineCrudTableComponent],
  templateUrl: './activities.component.html'
})
export class ActivitiesComponent implements OnInit {
  lessonId: string | null = null;
  apiService: any = null;

  columns = [
    { field: 'activityName' as keyof Activity, headerName: 'Activity Name', type: 'string' },
    { field: 'sequenceOrder' as keyof Activity, headerName: 'Order', type: 'number' }
  ];

  constructor(
    private route: ActivatedRoute,
    private activityApiService: ActivityApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.lessonId = params['lessonId'];
      this.setupApiService();
    });
  }

  private setupApiService(): void {
    if (!this.lessonId) return;
    
    const numericLessonId = parseInt(this.lessonId, 10);
    this.apiService = {
      getAllByParentId: () => 
        this.activityApiService.getActivitiesByLessonId(numericLessonId).toPromise(),
      create: (item: ActivityCreateDto) => 
        this.activityApiService.create({ ...item, lessonId: numericLessonId }).toPromise(),
      update: (id: number, item: Partial<ActivityCreateDto>) => 
        this.activityApiService.update(id, item).toPromise(),
      delete: (id: number) => 
        this.activityApiService.deleteItem(id).toPromise()
    };
  }
}
```

#### 3. Create Template (`activities.component.html`)
```html
<div *ngIf="lessonId && apiService">
  <app-dependent-inline-crud-table
    entityName="Activity"
    [parentName]="'Lesson #' + lessonId"
    parentRoute="/lessons"
    [parentId]="lessonId"
    [apiService]="apiService"
    [columns]="columns"
    idField="activityId">
  </app-dependent-inline-crud-table>
</div>
```

---

## Tips

1. **Observable vs Promise**: 
   - `inline-crud-table` uses Observable
   - `dependent-inline-crud-table` uses Promise (`.toPromise()` use செய்யவும்)

2. **Parent ID**: 
   - Route query params-லிருந்து get செய்யவும்
   - `ngOnInit`-ல் setup செய்யவும்

3. **Custom Actions**: 
   - HTML string return செய்யவும்
   - RouterLink-ஐ use செய்யலாம்

4. **Error Handling**: 
   - Component automatically error handle செய்கிறது
   - Console-ல் error log செய்யும்

---

## Summary

- **Standalone entity** (parent இல்லை) → `inline-crud-table` use செய்யவும்
- **Dependent entity** (parent உள்ளது) → `dependent-inline-crud-table` use செய்யவும்

இரண்டும் reusable components, CRUD operations automatically handle செய்கிறது!

