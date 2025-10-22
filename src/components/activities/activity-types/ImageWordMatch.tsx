// Create this new file: activity-types/ImageWordMatch.tsx

import React, { useState, useMemo} from 'react';
import { Box, Typography, Paper, Grid, Card, CardMedia, Alert } from '@mui/material';

// --- Add these types to your activityContentTypes.ts file ---

export interface ImagePrompt {
    id: number;
    // The name of the animal, for alt text
    name: string; 
    imageUrl: string;
}

export interface WordAnswer {
    id: number;
    text: string;
    audioUrl?: string; // Optional audio for the answer
    // The id of the ImagePrompt that this word correctly matches
    matchId: number; 
}

export interface ImageWordMatchContent {
    title: string;
    prompts: ImagePrompt[];
    answers: WordAnswer[];
}

interface ImageWordMatchProps {
    content: ImageWordMatchContent;
}

const ImageWordMatch: React.FC<ImageWordMatchProps> = ({ content }) => {
    const [draggedItem, setDraggedItem] = useState<WordAnswer | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Record<number, number>>({}); // { promptId: answerId }

    const shuffledAnswers = useMemo(() => {
        return [...content.answers].sort(() => Math.random() - 0.5);
    }, [content.answers]);

    const handleDragStart = (e: React.DragEvent, answer: WordAnswer) => {
        setDraggedItem(answer);
        e.dataTransfer.setData('answerId', answer.id.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, promptId: number) => {
        e.preventDefault();
        if (!draggedItem || matchedPairs[promptId]) return;

        if (draggedItem.matchId === promptId) {
            setMatchedPairs(prev => ({ ...prev, [promptId]: draggedItem.id }));
        }
        setDraggedItem(null);
    };

    const isComplete = Object.keys(matchedPairs).length === content.prompts.length;

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">{content.title}</Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Drag the correct sound to the matching animal.
            </Typography>

            {isComplete && <Alert severity="success" sx={{ justifyContent: 'center' }}>Well done! All matched correctly.</Alert>}

            {/* Matching Area */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {content.prompts.map(prompt => (
                    <Grid  size={{xs:12}} key={prompt.id}>
                        <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Card sx={{ width: 100, height: 100 }}>
                                <CardMedia component="img" image={prompt.imageUrl} alt={prompt.name} sx={{ objectFit: 'cover', height: '100%' }} />
                            </Card>
                            <Box
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, prompt.id)}
                                sx={{
                                    flexGrow: 1,
                                    minHeight: 80,
                                    border: '2px dashed #ccc',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: matchedPairs[prompt.id] ? '#e8f5e9' : '#fafafa',
                                }}
                            >
                                {matchedPairs[prompt.id] ? (
                                    <Paper elevation={2} sx={{ p: '8px 16px', backgroundColor: 'success.main', color: 'white' }}>
                                        <Typography variant="h6">
                                            {content.answers.find(a => a.id === matchedPairs[prompt.id])?.text}
                                        </Typography>
                                    </Paper>
                                ) : (
                                    <Typography color="text.secondary">Drop Here</Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Draggable Answers Pool */}
            <Paper elevation={2} sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                {shuffledAnswers.map(answer => {
                    const isMatched = Object.values(matchedPairs).includes(answer.id);
                    if (isMatched) return null;

                    return (
                        <Paper
                            key={answer.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, answer)}
                            sx={{ p: '8px 16px', cursor: 'grab', backgroundColor: 'secondary.main', color: 'white' }}
                        >
                            <Typography variant="h6">{answer.text}</Typography>
                        </Paper>
                    );
                })}
            </Paper>
        </Box>
    );
};

export default ImageWordMatch;