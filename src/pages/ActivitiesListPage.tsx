import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, IconButton, Box, Typography, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { Activity } from '../types/activity';
import { Lesson } from '../types/lesson';
import * as activityApi from '../api/activityApi';
import * as lessonApi from '../api/lessonApi';

import ActivityPlayerModal from '../components/activities/ActivityPlayerModal';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ActivitiesListPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const lessonId = query.get('lessonId');
    
    const [activities, setActivities] = useState<Activity[]>([]);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State for the Preview Modal
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
    const [activityToPreview, setActivityToPreview] = useState<Activity | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!lessonId) {
            setError("Error: No Lesson ID provided.");
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const lessonPromise = lessonApi.getLessonById(lessonId);
                const activitiesPromise = activityApi.getActivitiesByLessonId(lessonId);
                const [lessonData, activitiesData] = await Promise.all([lessonPromise, activitiesPromise]);

                setLesson(lessonData);
                setActivities(activitiesData);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "Failed to load data for this lesson.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [lessonId]);

    const handleDelete = async (activityId: number) => {
        if (window.confirm("Are you sure you want to delete this activity?")) {
            try {
                await activityApi.deleteItem(activityId);
                setActivities(prev => prev.filter(act => act.activityId !== activityId));
            } catch (err) {
                console.error(err);
                alert(err instanceof Error ? err.message : "Failed to delete activity.");
            }
        }
    };

    // --- ON-DEMAND FETCH FOR PREVIEW ---
    const handleOpenPreview = async (activityId: number) => {
        setIsPreviewOpen(true);
        setIsPreviewLoading(true);
        try {
            const fullActivityData = await activityApi.getActivityById(activityId);
            setActivityToPreview(fullActivityData);
        } catch (err) {
            console.error("Failed to fetch activity details for preview", err);
            alert("Could not load activity preview.");
            setIsPreviewOpen(false); // Close modal on error
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setActivityToPreview(null);
    };

    if (error) {
        return <Typography color="error" p={3}>{error}</Typography>;
    }

    const backToLessonsUrl = lesson ? `/lessons?levelId=${lesson.levelId}` : '/levels';

    return (
        <Box p={3}>
            <IconButton onClick={() => navigate(backToLessonsUrl)} sx={{ mb: 2 }} disabled={isLoading}>
                <ArrowBackIcon />
                <Typography variant="button" sx={{ ml: 1 }}>Back to Lessons</Typography>
            </IconButton>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">
                    {isLoading ? "Loading..." : `Activities for: "${lesson?.lessonName}"`}
                </Typography>
                <Button 
                    component={RouterLink} 
                    to={`/activity-edit?lessonId=${lessonId}`}
                    variant="contained" 
                    startIcon={<AddIcon />}
                    disabled={!lessonId || isLoading}
                >
                    Add New Activity
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Order</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : (
                           activities.map(activity => (
                               <TableRow key={activity.activityId}>
                                   <TableCell>{activity.activityId}</TableCell>
                                   <TableCell>{activity.title}</TableCell>
                                   <TableCell>{activity.sequenceOrder}</TableCell>
                                   <TableCell>
                                       <IconButton onClick={() => handleOpenPreview(activity.activityId)} color="info" title="Preview Activity">
                                           <VisibilityIcon />
                                       </IconButton>
                                       <IconButton 
                                           component={RouterLink} 
                                           to={`/activity-edit?activityId=${activity.activityId}`}
                                           color="primary"
                                        >
                                           <EditIcon />
                                       </IconButton>
                                       <IconButton onClick={() => handleDelete(activity.activityId)} color="error">
                                           <DeleteIcon />
                                       </IconButton>
                                   </TableCell>
                               </TableRow>
                           ))
                        )}
                         { !isLoading && activities.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No activities found for this lesson.</TableCell>
                            </TableRow>
                         )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ActivityPlayerModal
                isOpen={isPreviewOpen}
                onClose={handleClosePreview}
                activity={activityToPreview}
                isLoading={isPreviewLoading}
            />
        </Box>
    );
};

export default ActivitiesListPage;