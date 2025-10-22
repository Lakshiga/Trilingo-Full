import React, { useState, useEffect, useMemo } from 'react';
import {
    Modal, Box, Paper, Typography, ToggleButtonGroup, ToggleButton, IconButton,
    Button, CircularProgress, Backdrop, Fade
} from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

import { Activity } from '../../types/activity';
import ActivityRenderer from './ActivityRenderer';



interface ActivityPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    activity: Activity | null;
    isLoading: boolean;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'transparent',
    border: 'none',
    boxShadow: 24,
};

const ActivityPlayerModal: React.FC<ActivityPlayerModalProps> = ({ isOpen, onClose, activity, isLoading }) => {

    const [device, setDevice] = useState<'phone' | 'tablet'>('phone');
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

    const exercises = useMemo(() => {
        if (!activity?.contentJson) return [];
        try {
            const parsedContent = JSON.parse(activity.contentJson);
            return Array.isArray(parsedContent) ? parsedContent : [parsedContent];
        } catch {
            return [{ error: "Invalid Activity JSON format." }];
        }
    }, [activity?.contentJson]);

    // Reset index when the modal opens or the activity itself changes
    useEffect(() => {
        if (isOpen) {
            setCurrentExerciseIndex(0);
        }
    }, [isOpen, activity?.activityId]);

    if (!isOpen) {
        return null;
    }

    console.log(exercises);
    const currentExerciseData = exercises[currentExerciseIndex] || {};
    const isActivityPaginated = exercises.length > 1;

    const goToNextExercise = () => setCurrentExerciseIndex(prev => Math.min(prev + 1, exercises.length - 1));
    const goToPrevExercise = () => setCurrentExerciseIndex(prev => Math.max(prev - 1, 0));

    const deviceStyles = {
        phone: { width: '375px', height: '667px' },
        tablet: { width: '540px', height: '720px' }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={isOpen}>
                <Box sx={modalStyle}>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <ToggleButtonGroup value={device} exclusive onChange={(e, newDevice) => newDevice && setDevice(newDevice)} sx={{ bgcolor: 'background.paper', borderRadius: '20px' }}>
                            <ToggleButton value="phone" aria-label="phone"><PhoneIphoneIcon /></ToggleButton>
                            <ToggleButton value="tablet" aria-label="tablet"><TabletMacIcon /></ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Paper elevation={8} sx={{ ...deviceStyles[device], borderRadius: '40px', border: '12px solid #333', bgcolor: 'white', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', transition: 'width 0.3s, height 0.3s' }}>
                        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, zIndex: 10, color: '#aaa', backgroundColor: 'rgba(0,0,0,0.1)' }}><CloseIcon /></IconButton>

                        <Box sx={{ p: 2, borderBottom: '1px solid #eee', textAlign: 'center', flexShrink: 0 }}>
                            <Typography variant="subtitle1" fontWeight="bold">{activity?.title}</Typography>
                        </Box>

                        {isActivityPaginated && (
                            <Box sx={{ p: 1, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, bgcolor: '#f9f9f9' }}>

                                <Typography variant="caption">Exercise {currentExerciseIndex + 1} of {exercises.length}</Typography>

                            </Box>
                        )}
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isLoading ? (
                                <CircularProgress />
                            ) : activity ? (
                                <ActivityRenderer
                                    activityTypeId={activity.activityTypeId}
                                    content={currentExerciseData}
                                />
                            ) : (
                                <Typography color="error">Could not load activity.</Typography>
                            )}
                        </Box>

                        {isActivityPaginated && (
                            <Box sx={{ p: 1, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, bgcolor: '#f9f9f9' }}>
                                <Button onClick={goToPrevExercise} disabled={currentExerciseIndex === 0} startIcon={<ArrowBackIosNewIcon />}>Prev Exercise</Button>
                                <Button onClick={goToNextExercise} disabled={currentExerciseIndex >= exercises.length - 1} endIcon={<ArrowForwardIosIcon />}>Next Exercise</Button>
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Fade>
        </Modal>
    );
};

export default ActivityPlayerModal;