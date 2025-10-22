import { MediaUploadResponse, MediaFile } from '../types/media';

const API_BASE_URL = '/api/media';

/**
 * Uploads a single file to a structured path in S3.
 * @param file The file object to upload.
 * @param levelId The ID of the parent level.
 * @param lessonId The ID of the parent lesson.
 * @param mediaType The category folder (e.g., 'images', 'audio').
 * @returns A promise that resolves with the details of the uploaded file.
 */
export const uploadSingleFile = async (
    file: File, 
    folderName: string, 
): Promise<MediaUploadResponse> => {

    // FormData is the standard way to send files and form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('levels',folderName);
    // formData.append('lessonId', lessonId.toString());
    // formData.append('mediaType', mediaType);

    const response = await fetch(`${API_BASE_URL}/upload-single`, {
        method: 'POST',
        body: formData,
        // IMPORTANT: Do NOT set the 'Content-Type' header manually for FormData.
        // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || 'Failed to upload file');
    }

    return response.json();
};

/**
 * Uploads multiple files to a structured path in S3.
 * @param files A list of file objects to upload.
 * @param levelId The ID of the parent level.
 * @param lessonId The ID of the parent lesson.
 * @param mediaType The category folder (e.g., 'images', 'audio').
 * @returns A promise that resolves with a list of details for the uploaded files.
 */
export const uploadMultipleFiles = async (
    files: File[],
    levelId: number,
    lessonId: number,
    mediaType: 'images' | 'audio' | 'videos'
): Promise<MediaUploadResponse[]> => {

    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file); // Note the key is 'files' to match the API
    });
    formData.append('levelId', levelId.toString());
    formData.append('lessonId', lessonId.toString());
    formData.append('mediaType', mediaType);

    const response = await fetch(`${API_BASE_URL}/upload-multiple`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || 'Failed to upload files');
    }

    return response.json();
};


/**
 * Lists all files in a specific media folder for a given lesson.
 * @param levelId The ID of the parent level.
 * @param lessonId The ID of the parent lesson.
 * @param mediaType The category folder to list (e.g., 'images', 'audio').
 * @returns A promise that resolves with a list of file objects.
 */
export const listFiles = async (
    levelId: number, 
    lessonId: number, 
    mediaType: 'images' | 'audio' | 'videos'
): Promise<MediaFile[]> => {
    
    // Parameters are sent as a query string for a GET request
    const queryParams = new URLSearchParams({
        levelId: levelId.toString(),
        lessonId: lessonId.toString(),
        mediaType: mediaType,
    });

    const response = await fetch(`${API_BASE_URL}/list?${queryParams.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to list files from the specified folder');
    }

    return response.json();
};