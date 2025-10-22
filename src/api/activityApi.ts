import { Activity } from '../types/activity';
import { apiClient } from './apiClient'; // Import the central client

// Define DTOs for creating and updating.
// These match the backend's expected request bodies.
export type ActivityCreateDto = Omit<Activity, 'activityId' | 'activityType' | 'mainActivity'>;
export type ActivityUpdateDto = Omit<Activity, 'activityId' | 'activityType' | 'mainActivity'>;

// GET all activities for a specific lesson
export const getActivitiesByLessonId = (lessonId: number | string): Promise<Activity[]> => {
    return apiClient.get<Activity[]>(`/lessons/${lessonId}/activities`);
};

// GET a single activity by its own ID
export const getActivityById = (activityId: number | string): Promise<Activity> => {
    return apiClient.get<Activity>(`/activities/${activityId}`);
};

// POST a new activity
export const create = (newItem: ActivityCreateDto): Promise<Activity> => {
    return apiClient.post<Activity, ActivityCreateDto>('/activities', newItem);
};

// PUT (update) an existing activity
export const update = (id: number | string, itemToUpdate: ActivityUpdateDto): Promise<void> => {
    return apiClient.put(`/activities/${id}`, itemToUpdate);
};

// DELETE an activity
export const deleteItem = (id: number | string): Promise<void> => {
    return apiClient.delete(`/activities/${id}`);
};