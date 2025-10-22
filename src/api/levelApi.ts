import { Level } from '../types/level';
import { apiClient } from './apiClient'; // Import the new client

const ENDPOINT = '/levels';

export type LevelCreateDto = Omit<Level, 'levelId'>;

export const getAll = (): Promise<Level[]> => {
    return apiClient.get<Level[]>(ENDPOINT);
};

export const create = (newItem: LevelCreateDto): Promise<Level> => {
    return apiClient.post<Level, LevelCreateDto>(ENDPOINT, newItem);
};

export const update = (id: number | string, itemToUpdate: Partial<LevelCreateDto>): Promise<void> => {
    return apiClient.put(`${ENDPOINT}/${id}`, itemToUpdate);
};

export const deleteItem = (id: number | string): Promise<void> => {
    return apiClient.delete(`${ENDPOINT}/${id}`);
};