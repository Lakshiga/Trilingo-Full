import { Lesson } from '../types/lesson';
import { apiClient } from './apiClient'; // Import the new client

// Define the DTO for creating/updating. The 'levelId' will be added by the component.
export type LessonCreateDto = Omit<Lesson, 'lessonId' | 'levelId' | 'level'>;

// GET lessons for a specific level
export const getLessonsByLevelId = (levelId: number | string): Promise<Lesson[]> => {
    // The apiClient handles the base URL and unwraps the "result" property
    return apiClient.get<Lesson[]>(`/levels/${levelId}/lessons`);
};

// POST a new lesson
export const create = (newItem: LessonCreateDto & { levelId: number }): Promise<Lesson> => {
    return apiClient.post<Lesson, typeof newItem>('/lessons', newItem);
};

// PUT (update) an existing lesson
export const update = (id: number | string, itemToUpdate: Partial<LessonCreateDto>): Promise<void> => {
    return apiClient.put(`/lessons/${id}`, itemToUpdate);
};

// DELETE a lesson
export const deleteItem = (id: number | string): Promise<void> => {
    return apiClient.delete(`/lessons/${id}`);
};

// GET a single lesson by its ID (useful for getting the parent lesson name)
export const getLessonById = (lessonId: number | string): Promise<Lesson> => {
    return apiClient.get<Lesson>(`/lessons/${lessonId}`);
};