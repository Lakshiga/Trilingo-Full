export interface CrudApiService<T, TCreateDto> {
    getAll: () => Promise<T[]>;
    create: (newItem: TCreateDto) => Promise<T>;
    update: (id: number | string, itemToUpdate: Partial<TCreateDto>) => Promise<void>;
    delete: (id: number | string) => Promise<void>;
}

// --- NEW INTERFACE ---
export interface DependentCrudApiService<T, TCreateDto> {
    getAllByParentId: (parentId: number | string) => Promise<T[]>;
    create: (newItem: TCreateDto) => Promise<T>;
    update: (id: number | string, itemToUpdate: Partial<TCreateDto>) => Promise<void>;
    delete: (id: number | string) => Promise<void>;
}