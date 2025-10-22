import React, { useMemo } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DependentInlineCrudTable from '../components/common/DependentInlineCrudTable';
import { Lesson } from '../types/lesson';
import * as lessonApi from '../api/lessonApi';
import { LessonCreateDto } from '../api/lessonApi';

// A custom hook to easily get URL query parameters
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const LessonsPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const levelId = query.get('levelId');

    const apiService = useMemo(() => {
        // If levelId is null, we can return a "dummy" or null service.
        if (!levelId) return null;

        const numericLevelId = parseInt(levelId, 10);
        return {
            getAllByParentId: () => lessonApi.getLessonsByLevelId(numericLevelId),
            create: (newItem: LessonCreateDto) => lessonApi.create({ ...newItem, levelId: numericLevelId }),
            update: lessonApi.update,
            delete: lessonApi.deleteItem
        };
    }, [levelId]); // The dependency array is correct.

    // --- STEP 2: PERFORM THE CONDITIONAL RETURN AFTER ALL HOOKS ---
    // Handle the error case where levelId or the apiService is missing.
    if (!levelId || !apiService) {
        return (
            <Box p={3}>
                <Typography variant="h5" color="error">Error: No Level ID provided.</Typography>
                <Button
                    startIcon={<ArrowBackIcon />}
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={() => navigate('/levels')}
                >
                    Back to Levels
                </Button>
            </Box>
        );
    }

    // Define the columns for the table.
    const columns = [
        { field: 'lessonName' as keyof Lesson, headerName: 'Lesson Name', type: 'string' as const },
        { field: 'slug' as keyof Lesson, headerName: 'Slug', type: 'string' as const },
        { field: 'description' as keyof Lesson, headerName: 'Description', type: 'string' as const },
        { field: 'sequenceOrder' as keyof Lesson, headerName: 'Sequence Order', type: 'number' as const }
    ];

    // Define the custom "Manage Activities" link.
    const renderCustomLessonActions = (lesson: Lesson) => (
        <Button
            component={RouterLink}
            to={`/activities?lessonId=${lesson.lessonId}`}
            variant="outlined" size="small" sx={{ mr: 1 }}
        >
            Manage Activities
        </Button>
    );

    return (
        <DependentInlineCrudTable<Lesson, LessonCreateDto>
            entityName="Lesson"
            parentName={`Level #${levelId}`} // Simplified title, clean and requires no extra API call
            parentRoute="/levels"
            parentId={levelId}
            apiService={apiService}
            columns={columns}
            idField="lessonId"
            renderCustomActions={renderCustomLessonActions}
        />
    );
};

export default LessonsPage;