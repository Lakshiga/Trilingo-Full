// Create this new file: activity-types/RiddleActivity.tsx

import React, { useState, useRef, useCallback } from 'react';
import { Box, Typography, Paper, IconButton, Card, CardMedia, Button, Alert, Grid } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ReplayIcon from '@mui/icons-material/Replay';

// --- Add these types to your activityContentTypes.ts file ---

export interface RiddleChoice {
    id: number;
    text: string;      // The name of the object in the image (for alt text)
    imageUrl: string;
}

export interface RiddleContent {
    id: number;
    title: string;
    riddleText: string;
    riddleAudioUrl: string;
    choices: RiddleChoice[];
    correctChoiceId: number;
}

interface RiddleActivityProps {
    content: RiddleContent;
}

const RiddleActivity: React.FC<RiddleActivityProps> = ({ content }) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const isCorrect = selectedId === content.correctChoiceId;

    const playRiddleAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.src = content.riddleAudioUrl;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    }, [content.riddleAudioUrl]);

    const handleChoiceSelect = (choiceId: number) => {
        if (showResult) return; // Don't allow changing the answer after selection
        setSelectedId(choiceId);
        setShowResult(true);
        // Optional: Play a success or failure sound
    };

    const handleReset = () => {
        setSelectedId(null);
        setShowResult(false);
    };

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary.main">
                {content.title}
            </Typography>
            
            {/* Riddle Display */}
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 3, 
                    mb: 4, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 2,
                    backgroundColor: '#e3f2fd'
                }}
            >
                <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
                    {content.riddleText}
                </Typography>
                <IconButton onClick={playRiddleAudio} color="primary" size="large">
                    <VolumeUpIcon fontSize="large" />
                </IconButton>
            </Paper>

            {/* Result Feedback */}
            <Box sx={{ minHeight: '60px', mb: 2 }}>
                {showResult && (
                    <Alert severity={isCorrect ? "success" : "error"}>
                        {isCorrect ? "சரியான விடை!" : "தவறான விடை, மீண்டும் முயற்சிக்கவும்."}
                    </Alert>
                )}
            </Box>

            {/* Image Choices */}
            <Grid container spacing={3} justifyContent="center">
                {content.choices.map(choice => {
                    const isSelected = selectedId === choice.id;
                    const isTheCorrectAnswer = content.correctChoiceId === choice.id;

                    let borderStyle = '2px solid transparent';
                    if (showResult) {
                        if (isSelected && isCorrect) borderStyle = '4px solid #4caf50'; // Green for correct selected
                        if (isSelected && !isCorrect) borderStyle = '4px solid #f44336'; // Red for incorrect selected
                        if (!isSelected && isCorrect) borderStyle = '4px solid #4caf50'; // Green outline for correct answer if user was wrong
                    }

                    return (
                        <Grid  key={choice.id} size={{xs:6,md:4}}>
                            
                            <Card
                                onClick={() => handleChoiceSelect(choice.id)}
                                sx={{
                                    cursor: showResult ? 'default' : 'pointer',
                                    border: borderStyle,
                                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                    opacity: showResult && !isTheCorrectAnswer ? 0.6 : 1,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: showResult ? 3 : 6,
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={choice.imageUrl}
                                    alt={choice.text}
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Action Buttons */}
            {showResult && (
                <Button 
                    variant="contained" 
                    startIcon={<ReplayIcon />} 
                    onClick={handleReset}
                    sx={{ mt: 4 }}
                >
                    மீண்டும் முயற்சி செய் (Try Again)
                </Button>
            )}

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default RiddleActivity;