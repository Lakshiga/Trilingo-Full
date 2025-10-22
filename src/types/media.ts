// Represents the successful response from an upload
export interface MediaUploadResponse {
    url: string;
    key: string;
    fileName: string;
}

// Represents a single file object when listing files from S3
export interface MediaFile {
    key: string;
    url: string;
    fileName: string;
    size: number;
    lastModified: string; // Comes as an ISO date string
}