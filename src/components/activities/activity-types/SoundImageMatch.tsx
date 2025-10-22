// Create this new file: activity-types/SoundImageMatch.tsx

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Box, Typography, Paper, Grid, Card, CardMedia, IconButton, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// --- Add these types to your activityContentTypes.ts file ---

// Represents a draggable sound source
export interface SoundSource {
    id: number;
    // Text for accessibility or a subtle label
    text: string; 
    audioUrl: string;
    // The id of the ImageTarget that this sound correctly matches
    matchId: number; 
}

// Represents a static image drop target
export interface ImageTarget {
    id: number;
    // The name of the object in the image, for alt text
    name: string;      
    imageUrl: string;
}

export interface SoundImageMatchContent {
    title: string;
    // An array of the draggable sound items
    soundSources: SoundSource[];
    // An array of the image drop zones
    imageTargets: ImageTarget[];
}

interface SoundImageMatchProps {
    content: SoundImageMatchContent;
}

const SoundImageMatch: React.FC<SoundImageMatchProps> = ({ content }) => {
    const [draggedItem, setDraggedItem] = useState<SoundSource | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Record<number, number>>({}); // { imageId: soundId }
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const shuffledSounds = useMemo(() => {
        return [...content.soundSources].sort(() => Math.random() - 0.5);
    }, [content.soundSources]);

    const playAudio = useCallback((audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(e => console.error("Audio playback error:", e));
        }
    }, []);

    const handleDragStart = (e: React.DragEvent, sound: SoundSource) => {
        setDraggedItem(sound);
        e.dataTransfer.setData('soundId', sound.id.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, imageId: number) => {
        e.preventDefault();
        if (!draggedItem || matchedPairs[imageId]) return;

        if (draggedItem.matchId === imageId) {
            setMatchedPairs(prev => ({ ...prev, [imageId]: draggedItem.id }));
            playAudio(draggedItem.audioUrl);
        }
        setDraggedItem(null);
    };

    const isComplete = Object.keys(matchedPairs).length === content.imageTargets.length;

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">{content.title}</Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Drag the correct sound and drop it onto the matching image.
            </Typography>

            {isComplete && <Alert severity="success" sx={{ justifyContent: 'center', mb: 2 }}>Well done! All sounds matched correctly.</Alert>}

            <Grid container spacing={4} justifyContent="center">
                {/* Image Targets (Drop Zones) */}
                <Grid size={{xs:12,md:7}}>
                    <Grid container spacing={2}>
                        {content.imageTargets.map(image => (
                            <Grid size={{xs:6}} key={image.id}>
                                <Card
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, image.id)}
                                    sx={{ 
                                        position: 'relative',
                                        border: '2px dashed #ccc',
                                        backgroundColor: matchedPairs[image.id] ? '#e8f5e9' : '#fafafa',
                                    }}
                                >
                                    <CardMedia component="img" height="150" image={image.imageUrl} alt={image.name} />
                                    {matchedPairs[image.id] && (
                                        <CheckCircleIcon sx={{ position: 'absolute', top: 8, right: 8, fontSize: 40, color: 'success.main' }} />
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Sound Sources (Draggable Items) */}
                <Grid size={{xs:12,md:4}}>
                    <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {shuffledSounds.map(sound => {
                            const isMatched = Object.values(matchedPairs).includes(sound.id);
                            if (isMatched) return null;

                            return (
                                <Paper
                                    key={sound.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, sound)}
                                    sx={{ p: 1, cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <IconButton onClick={() => playAudio(sound.audioUrl)} color="primary">
                                        <VolumeUpIcon />
                                    </IconButton>
                                    <Typography variant="body1">{sound.text}</Typography>
                                </Paper>
                            );
                        })}
                    </Paper>
                </Grid>
            </Grid>
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default SoundImageMatch;