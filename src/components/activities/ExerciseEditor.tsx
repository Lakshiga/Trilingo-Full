import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails, TextField, Button, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Activity } from '../../types/activity';

interface ExerciseEditorProps {
    activityData: Partial<Activity>;
    onDataChange: (updatedData: Partial<Activity>) => void;
    onPreviewExercise: (exerciseJson: string) => void;
    expandedExercise: number | false;
    onExpansionChange: (panelIndex: number) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    onSetExpanded: (index: number) => void;
}

const ExerciseEditor: React.FC<ExerciseEditorProps> = ({
    activityData, onDataChange, onPreviewExercise,
    expandedExercise, onExpansionChange, onSetExpanded
}) => {
    const [exercises, setExercises] = useState<string[]>(['{}']);
    const [jsonErrors, setJsonErrors] = useState<string[]>(['']);

    useEffect(() => {
        try {
            const parsed = JSON.parse(activityData.contentJson || '[]');
            const exerciseArray = Array.isArray(parsed) ? parsed : [parsed];
            const stringifiedExercises = exerciseArray.map(ex => JSON.stringify(ex, null, 2));
            setExercises(stringifiedExercises);
            setJsonErrors(new Array(stringifiedExercises.length).fill(''));
        } catch {
            setExercises(['{}']);
            setJsonErrors(['']);
        }
    }, [activityData.contentJson]);

    const triggerParentUpdate = (updatedExercises: string[]) => {
        try {
            const parsedObjects = updatedExercises.map(exStr => JSON.parse(exStr));
            const combinedJsonString = JSON.stringify(parsedObjects, null, 2);
            onDataChange({ ...activityData, contentJson: combinedJsonString });
        } catch {
            // If there's an error, we still pass the raw string up so the user can see the error
            const rawCombined = `[${updatedExercises.join(',')}]`;
            onDataChange({ ...activityData, contentJson: rawCombined });
        }
    };

    const handleExerciseChange = (index: number, value: string) => {
        const updatedExercises = [...exercises];
        updatedExercises[index] = value;
        setExercises(updatedExercises);

        const updatedErrors = [...jsonErrors];
        try {
            JSON.parse(value);
            updatedErrors[index] = '';
        } catch {
            updatedErrors[index] = 'Invalid JSON';
        }
        setJsonErrors(updatedErrors);
        triggerParentUpdate(updatedExercises);
    };

    const addExercise = () => {
        const newExercises = [...exercises, '{}'];
        setExercises(newExercises);
        setJsonErrors([...jsonErrors, '']);
        triggerParentUpdate(newExercises);
        onSetExpanded(newExercises.length - 1);
    };

    const removeExercise = (index: number) => {
        if (exercises.length <= 1) {
            alert("An activity must have at least one exercise.");
            return;
        }
        const newExercises = exercises.filter((_, i) => i !== index);
        const newErrors = jsonErrors.filter((_, i) => i !== index);
        setExercises(newExercises);
        setJsonErrors(newErrors);
        triggerParentUpdate(newExercises);
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Exercises</Typography>
            {exercises.map((exerciseJson, index) => (
                <Accordion key={index} expanded={expandedExercise === index} onChange={onExpansionChange(index)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} component="div">
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                            <Typography fontWeight="bold">Exercise #{index + 1}</Typography>
                            <Box>
                                <Button
                                    variant="outlined" size="small" startIcon={<PreviewIcon />}
                                    onClick={(e) => { e.stopPropagation(); onPreviewExercise(exerciseJson); }}
                                    sx={{ mr: 1 }} disabled={!!jsonErrors[index]}
                                >
                                    Preview
                                </Button>
                                <IconButton
                                    onClick={(e) => { e.stopPropagation(); removeExercise(index); }}
                                    color="error" disabled={exercises.length <= 1}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                        <TextField
                            fullWidth multiline rows={15}
                            value={exerciseJson}
                            onChange={(e) => handleExerciseChange(index, e.target.value)}
                            required error={!!jsonErrors[index]}
                            helperText={jsonErrors[index]}
                            variant="outlined" sx={{ fontFamily: 'monospace' }}
                        />
                    </AccordionDetails>
                </Accordion>
            ))}
            <Button fullWidth variant="outlined" onClick={addExercise} startIcon={<AddCircleOutlineIcon />} sx={{ mt: 2 }}>
                Add Another Exercise
            </Button>
        </Paper>
    );
};

export default ExerciseEditor;