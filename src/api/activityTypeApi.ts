import { ActivityType } from '../types/activityType';
import { apiClient } from './apiClient'; // Import the new client

const ENDPOINT = '/activitytypes';

export type ActivityTypeCreateDto = Omit<ActivityType, 'id'>;

// GET all activity types
export const getAll = (): Promise<ActivityType[]> => {
    return apiClient.get<ActivityType[]>(ENDPOINT);
};

// POST a new activity type
export const create = (newItem: ActivityTypeCreateDto): Promise<ActivityType> => {
    return apiClient.post<ActivityType, ActivityTypeCreateDto>(ENDPOINT, newItem);
};

// PUT (update) an existing activity type
export const update = (id: number | string, itemToUpdate: Partial<ActivityTypeCreateDto>): Promise<void> => {
    return apiClient.put(`${ENDPOINT}/${id}`, itemToUpdate);
};

// DELETE an activity type
export const deleteItem = (id: number | string): Promise<void> => {
    return apiClient.delete(`${ENDPOINT}/${id}`);
};