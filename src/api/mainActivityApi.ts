import { MainActivity } from '../types/mainActivity';
import { apiClient } from './apiClient'; // Import the new client

const ENDPOINT = '/mainactivities';

export type MainActivityCreateDto = Omit<MainActivity, 'id'>;

// GET all main activities
export const getAll = (): Promise<MainActivity[]> => {
    return apiClient.get<MainActivity[]>(ENDPOINT);
};

// POST a new main activity
export const create = (newItem: MainActivityCreateDto): Promise<MainActivity> => {
    return apiClient.post<MainActivity, MainActivityCreateDto>(ENDPOINT, newItem);
};

// PUT (update) an existing main activity
export const update = (id: number | string, itemToUpdate: Partial<MainActivityCreateDto>): Promise<void> => {
    return apiClient.put(`${ENDPOINT}/${id}`, itemToUpdate);
};

// DELETE a main activity
export const deleteItem = (id: number | string): Promise<void> => {
    return apiClient.delete(`${ENDPOINT}/${id}`);
};