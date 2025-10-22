import React from 'react';
import { Button, Box } from '@mui/material';
import * as mediaApi from '../../api/mediaApi'; // You will create this

interface ImageUploadCellProps {
    value: string | null; // The current ImageUrl
    onUrlChange: (newUrl: string) => void;
}

const ImageUploadCell: React.FC<ImageUploadCellProps> = ({ value, onUrlChange }) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            //Step A: Upload the file to the media controller
            const response = await mediaApi.uploadSingleFile(file, 'levels'); // Folder name

            // Step B: Use the returned URL to update the parent form's state
            onUrlChange(response.url);

        } catch (error) {
            console.error("Upload failed", error);
            alert("File upload failed.");
        }
    };

    return (
        <Box>
            {value && <img src={value} alt="preview" width="50" style={{ marginRight: '10px' }} />}
            <Button variant="outlined" component="label" size="small">
                Upload
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
        </Box>
    );
};

export default ImageUploadCell;