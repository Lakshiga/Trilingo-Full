import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Grid, Button, Container, Paper, Snackbar, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save'; // Import the Save icon
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { Activity } from '../types/activity';
import { MainActivity } from '../types/mainActivity';
import { ActivityType } from '../types/activityType';

import * as activityApi from '../api/activityApi';
import * as mainActivityApi from '../api/mainActivityApi';
import * as activityTypeApi from '../api/activityTypeApi';

import ActivityForm from '../components/activities/ActivityForm';
import DevicePreview from '../components/activities/DevicePreview';
import { getActivityTemplate } from '../components/activities/activityTemplates'; // Import the new helper
import ExerciseEditor from '../components/activities/ExerciseEditor';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const TOP_OFFSET = 88; // Adjusted for a standard AppBar

const ActivityEditorPage: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const activityId = query.get('activityId');
    const lessonId = query.get('lessonId');
    const isEditMode = !!activityId;

    const [activity, setActivity] = useState<Partial<Activity> | null>(null);
    const [previewContent, setPreviewContent] = useState<Partial<Activity> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [expandedExercise, setExpandedExercise] = useState<number | false>(0);
    const [copySnackbarOpen, setCopySnackbarOpen] = useState<boolean>(false);

    const [mainActivities, setMainActivities] = useState<MainActivity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);

    const backUrl = `/activities?lessonId=${activity?.lessonId || lessonId}`;

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const mainActivitiesPromise = mainActivityApi.getAll();
            const activityTypesPromise = activityTypeApi.getAll();
            let activityPromise: Promise<Partial<Activity>>;

            if (isEditMode && activityId) {
                activityPromise = activityApi.getActivityById(activityId);
            } else {
                activityPromise = Promise.resolve({
                    title: '', sequenceOrder: 1, mainActivityId: 0,
                    activityTypeId: 0, contentJson: '[{}]',
                    lessonId: parseInt(lessonId || '0', 10)
                });
            }

            const [mainActs, actTypes, loadedActivity] = await Promise.all([mainActivitiesPromise, activityTypesPromise, activityPromise]);

            setMainActivities(mainActs);
            setActivityTypes(actTypes);

            let exercises: any[] = [];
            try {
                const parsedContent = JSON.parse(loadedActivity.contentJson || '[]');
                exercises = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
                if (exercises.length === 0) exercises.push({});
            } catch { exercises = [{}]; }

            loadedActivity.contentJson = JSON.stringify(exercises, null, 2);
            setActivity(loadedActivity);

            setPreviewContent({ ...loadedActivity, contentJson: JSON.stringify(exercises[0] || {}, null, 2) });
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoading(false);
        }
    }, [activityId, isEditMode, lessonId]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleFormChange = (updatedActivityData: Partial<Activity>) => {
        setActivity(updatedActivityData);
    };

    const handlePreviewExercise = (exerciseJsonString: string) => {
        if (!activity) return;
        setPreviewContent({ ...activity, contentJson: exerciseJsonString });
    };

    const handleSave = async () => {
        if (!activity || !activity.contentJson) return;
        // 1. Validate the JSON content before proceeding.
        try {
            // This ensures the string is valid JSON, but we use the string itself in the payload.
            JSON.parse(activity.contentJson);
        } catch (error) {
            alert("An exercise contains invalid JSON. Please fix it before saving.");
            return;
        }

        // 2. Construct the payload with the exact shape the API expects (ActivityCreateDto/UpdateDto).
        const payload = {
            title: activity.title || null, // Ensure title is not undefined
            sequenceOrder: Number(activity.sequenceOrder),
            contentJson: activity.contentJson,
            lessonId: Number(activity.lessonId),
            activityTypeId: Number(activity.activityTypeId),
            mainActivityId: Number(activity.mainActivityId)
        };

        // 3. Validate that required IDs are present.
        if (!payload.lessonId || !payload.activityTypeId || !payload.mainActivityId) {
            alert("Lesson, Activity Type, and Main Activity must be selected.");
            return;
        }

        try {

            if (isEditMode && activityId) {
                await activityApi.update(activityId, payload as any);
                await activityApi.update(activityId, payload as any);
            } else {
                await activityApi.create(payload as any);
                await activityApi.create(payload as any);
            }
            alert('Activity saved successfully!');
            navigate(backUrl);

        } catch (error) {
            console.error("Failed to save activity", error);
            alert("An error occurred while saving.");
        }
    };

    const handleExpansionChange = (panelIndex: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedExercise(isExpanded ? panelIndex : false);
    };
    const handleSetExpanded = (index: number) => {
        setExpandedExercise(index);
    };

    const handleCopyTemplate = async () => {
        try {
            const templateJson = getActivityTemplate(activity?.activityTypeId || 0);
            await navigator.clipboard.writeText(templateJson);
            setCopySnackbarOpen(true);
        } catch (error) {
            console.error('Failed to copy template:', error);
            // Fallback for browsers that don't support clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = getActivityTemplate(activity?.activityTypeId || 0);
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopySnackbarOpen(true);
        }
    };

    const handleCloseCopySnackbar = () => {
        setCopySnackbarOpen(false);
    };

    if (isLoading || !activity) {
        return <CircularProgress />;
    }

    return (
        // Use a wider container for the 3-column layout
        <Container maxWidth={false} sx={{ mt: 3, px: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">
                    {isEditMode ? `Edit Activity #${activityId}` : `Add New Activity`}
                </Typography>

                <Box>
                    <Button
                        onClick={() => navigate(backUrl)}
                        startIcon={<ArrowBackIcon />}
                        sx={{ mr: 2 }}
                    >
                        Back to List
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                    >
                        Save Entire Activity
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* --- COLUMN 1: Metadata Form & Template Viewer --- */}
                <Grid size={{ xs: 12, lg: 3 }}>
                    <Paper sx={{ p: 2, position: 'sticky', top: '24px' }}>
                        {/* The form no longer needs the onSave prop */}
                        <ActivityForm
                            activityData={activity}
                            mainActivities={mainActivities}
                            activityTypes={activityTypes}
                            onDataChange={handleFormChange}
                        />
                        {/* JSON Template Viewer */}

                    </Paper>
                </Grid>

                {/* --- COLUMN 2: Exercises Accordion Editor --- */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    {/* This component will be created next */}

                    <Box mt={3}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h6">JSON Template</Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ContentCopyIcon />}
                                onClick={handleCopyTemplate}
                                disabled={!activity?.activityTypeId}
                            >
                                Copy Template
                            </Button>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            This is the required structure for the selected Activity Type.
                        </Typography>
                        <Paper variant="outlined" sx={{ mt: 1, p: 2, maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                <code>
                                    {getActivityTemplate(activity.activityTypeId || 0)}
                                </code>
                            </pre>
                        </Paper>
                    </Box>

                    <ExerciseEditor
                        activityData={activity}
                        onDataChange={handleFormChange}
                        onPreviewExercise={handlePreviewExercise}
                        expandedExercise={expandedExercise}
                        onExpansionChange={handleExpansionChange}
                        onSetExpanded={handleSetExpanded}
                    />


                </Grid>

                {/* --- COLUMN 3: The STICKY Device Preview --- */}
                <Grid size={{ xs: 12, lg: 4 }} sx={{
                    position: 'sticky',
                    top: `24px`,
                    height: `calc(100vh - ${TOP_OFFSET}px)`,
                }}>
                    {previewContent && <DevicePreview activityData={previewContent} />}
                </Grid>
            </Grid>
            
            {/* Snackbar for copy confirmation */}
            <Snackbar
                open={copySnackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseCopySnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseCopySnackbar} severity="success" sx={{ width: '100%' }}>
                    Template JSON copied to clipboard!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ActivityEditorPage;