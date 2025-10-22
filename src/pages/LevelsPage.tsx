import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';
import InlineCrudTable, { ColumnDef } from '../components/common/InlineCrudTable';
import ImageUploadCell from '../components/common/ImageUploadCell'; // Assuming this exists
import { Level } from '../types/level';
import * as levelApi from '../api/levelApi';
import { LevelCreateDto } from '../api/levelApi';

const LevelsPage: React.FC = () => {
    
    // Define the columns using the now-generic ColumnDef type
    const columns: ColumnDef<Level, LevelCreateDto>[] = [
        { 
            field: 'levelName', 
            headerName: 'Level Name', 
            type: 'string' 
        },
        { 
            field: 'slug', 
            headerName: 'Slug (for URLs)', 
            type: 'string' 
        },
        { 
            field: 'sequenceOrder', 
            headerName: 'Sequence Order', 
            type: 'number' 
        },
        {
            field: 'imageUrl',
            headerName: 'Image',
            // Render an <img> tag in display mode
            renderCell: (value) => 
                value ? <img src={value as string} alt="Level" style={{ height: '40px', width: 'auto' }} /> : 'No Image',
            // Render our custom ImageUploadCell component in edit mode
            renderEditCell: (value, onChange) => (
                <ImageUploadCell 
                    value={value as string | null} 
                    onUrlChange={(newUrl) => onChange('imageUrl', newUrl)}
                />
            )
        }
    ];

    const apiService = {
        getAll: levelApi.getAll,
        create: levelApi.create,
        update: levelApi.update,
        delete: levelApi.deleteItem
    };

    const renderCustomLevelActions = (level: Level) => (
        <Button 
            component={RouterLink} 
            to={`/lessons?levelId=${level.levelId}`}
            variant="outlined" 
            size="small"
            sx={{ mr: 1 }}
        >
            Manage Lessons
        </Button>
    );

    return (
        <InlineCrudTable<Level, LevelCreateDto>
            entityName="Level"
            apiService={apiService}
            columns={columns}
            idField="levelId"
            renderCustomActions={renderCustomLevelActions}
        />
    );
};

export default LevelsPage;