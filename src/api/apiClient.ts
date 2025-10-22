import axiosClient from './axiosClient'; // Import our new internal client
import { AxiosError } from 'axios';

// The interfaces remain the same as they define your backend's contract.
interface ApiResponse<T> {
    result: T;
    isError: boolean;
    error: {
        title: string;
        details: string;
        statusCode: number;
    } | null;
}

export class ApiError extends Error {
    constructor(public title: string, public details: string, public statusCode: number) {
        super(details);
        this.name = 'ApiError';
    }
}

// This function will handle unwrapping and error standardization.
async function handleRequest<T>(requestPromise: Promise<any>): Promise<T> {
    try {
        const response = await requestPromise;
        const apiResponse = response.data as ApiResponse<T>;

        if (apiResponse.isError) {
            if (apiResponse.error) {
                throw new ApiError(apiResponse.error.title, apiResponse.error.details, apiResponse.error.statusCode);
            }
            throw new Error('An unknown API error occurred.');
        }

        return apiResponse.result;

    } catch (error) {
        if (error instanceof ApiError) {
            throw error; // Re-throw our custom error
        }
        
        if (error instanceof AxiosError && error.response) {
            // Handle errors that might not have been wrapped by our middleware (e.g., 500 from server crash)
            const apiResponse = error.response.data as ApiResponse<T>;
            if (apiResponse?.isError && apiResponse.error) {
                throw new ApiError(apiResponse.error.title, apiResponse.error.details, apiResponse.error.statusCode);
            }
        }

        // Fallback for network errors etc.
        throw new Error('A network or unknown error occurred.');
    }
}

// Your public apiClient now delegates to the internal axiosClient.
export const apiClient = {
    get<T>(endpoint: string): Promise<T> {
        return handleRequest<T>(axiosClient.get(endpoint));
    },
    
    post<T, TBody>(endpoint: string, body: TBody): Promise<T> {
        return handleRequest<T>(axiosClient.post(endpoint, body));
    },
    
    put<TBody>(endpoint: string, body: TBody): Promise<void> {
        // For void promises, we can adjust the return type.
        return handleRequest<void>(axiosClient.put(endpoint, body));
    },

    delete(endpoint: string): Promise<void> {
        return handleRequest<void>(axiosClient.delete(endpoint));
    },
};