// Create or update this file: activity-types/ReadingComprehensionMatch.tsx

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Box, Typography, Paper, Grid, Alert, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// --- Add/Update these types in your activityContentTypes.ts file ---

export interface ComprehensionQuestion {
    id: number;
    text: string;
    audioUrl: string; // ADDED: Audio for the question
}

export interface ComprehensionAnswer {
    id: number;
    text: string;
    matchId: number; 
}

export interface ReadingComprehensionContent {
    title: string;
    passage: string;
    passageAudioUrl: string; // ADDED: Audio for the full passage
    questions: ComprehensionQuestion[];
    answers: ComprehensionAnswer[];
}

interface ReadingComprehensionMatchProps {
    content: ReadingComprehensionContent;
}

const ReadingComprehensionMatch: React.FC<ReadingComprehensionMatchProps> = ({ content }) => {
    const [draggedItem, setDraggedItem] = useState<ComprehensionAnswer | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Record<number, number>>({}); // { questionId: answerId }
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    const shuffledAnswers = useMemo(() => {
        return [...content.answers].sort(() => Math.random() - 0.5);
    }, [content.answers]);

    // A single, reusable function to play any audio URL
    const playAudio = useCallback((audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(e => console.error("Audio playback error:", e));
        }
    }, []);

    const handleDragStart = (e: React.DragEvent, answer: ComprehensionAnswer) => {
        setDraggedItem(answer);
        e.dataTransfer.setData('answerId', answer.id.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, questionId: number) => {
        e.preventDefault();
        if (!draggedItem || matchedPairs[questionId]) return;

        if (draggedItem.matchId === questionId) {
            setMatchedPairs(prev => ({ ...prev, [questionId]: draggedItem.id }));
            // Optional: play a success sound
        }
        setDraggedItem(null);
    };

    const isComplete = Object.keys(matchedPairs).length === content.questions.length;

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
                {content.title}
            </Typography>
            
            {/* Reading Passage with Audio Button */}
            <Paper elevation={2} sx={{ p: 2, mb: 4, backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">Passage</Typography>
                    <IconButton onClick={() => playAudio(content.passageAudioUrl)} color="primary">
                        <VolumeUpIcon />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>Listen to Passage</Typography>
                    </IconButton>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'left' }}>
                    {content.passage}
                </Typography>
            </Paper>

            {isComplete && <Alert severity="success" sx={{ mb: 2 }}>Excellent! All questions answered correctly!</Alert>}

            <Grid container spacing={4} justifyContent="center">
                {/* Questions Column (Drop Targets) */}
                <Grid size={{xs:12,md:7}}>
                    <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>வினாக்கள் (Questions)</Typography>
                    {content.questions.map(question => (
                        <Paper
                            key={question.id}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, question.id)}
                            sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', border: '2px dashed #ccc', backgroundColor: matchedPairs[question.id] ? '#e8f5e9' : '#fafafa' }}
                        >
                            <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'left' }}>{question.text}</Typography>
                            <IconButton onClick={() => playAudio(question.audioUrl)} size="small" sx={{ mr: 1 }}><VolumeUpIcon /></IconButton>
                            {matchedPairs[question.id] && (
                                <Paper elevation={2} sx={{ p: 1, backgroundColor: '#4caf50', color: 'white' }}>
                                    <Typography sx={{ fontWeight: 'bold' }}>{content.answers.find(a => a.id === matchedPairs[question.id])?.text}</Typography>
                                </Paper>
                            )}
                        </Paper>
                    ))}
                </Grid>

                {/* Answers Column (Draggable Items) */}
                <Grid  size={{xs:12,md:4}}>
                    <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>பதில்கள் (Answers)</Typography>
                    {shuffledAnswers.map(answer => {
                        const isMatched = Object.values(matchedPairs).includes(answer.id);
                        if (isMatched) return null;
                        return (
                            <Paper key={answer.id} draggable onDragStart={(e) => handleDragStart(e, answer)} sx={{ p: 2, mb: 2, cursor: 'grab', backgroundColor: 'primary.main', color: 'white', textAlign: 'center' }}>
                                <Typography variant="h6">{answer.text}</Typography>
                            </Paper>
                        );
                    })}
                </Grid>
            </Grid>
            {/* Hidden audio element for playback */}
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default ReadingComprehensionMatch;