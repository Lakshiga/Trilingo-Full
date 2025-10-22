// REVISED file: activity-types/SentenceBuilder.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Button, Card, CardMedia, CardContent, Alert } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- In your types/activityContentTypes.ts file ---

// This remains the same
export interface SentencePart {
    text: string;
    audioUrl: string;
    imageUrl?: string; // Only used for the main noun/object
}

// REVISED: This is now the main content type for the component.
// It represents a SINGLE challenge.
export interface SentenceBuilderContent {
    id: number;
    title: string; // Add a title for display in the previewer
    imageWord: SentencePart;
    suffix: SentencePart;
    predicate: SentencePart;
    fullSentenceText: string;
    fullSentenceAudioUrl: string;
}

interface SentenceBuilderProps {
    content: SentenceBuilderContent; // The prop is now a single challenge object
}

const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ content }) => {
    // State is now simpler: it only pertains to the CURRENT challenge being displayed.
    const [clickedParts, setClickedParts] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const sequence = ['imageWord', 'suffix', 'predicate'];

    // Reset state whenever the `content` prop changes (i.e., when ActivityPlayer loads a new exercise)
    useEffect(() => {
        setClickedParts([]);
        setIsComplete(false);
        setError(false);
    }, [content.id]); // Reset based on the unique ID of the challenge

    const playAudio = useCallback((audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(e => console.error("Audio playback error:", e));
        }
    }, []);

    // Play the full sentence audio when the sequence is complete
    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => {
                playAudio(content.fullSentenceAudioUrl);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isComplete, content.fullSentenceAudioUrl, playAudio]);

    const handlePartClick = (partKey: 'imageWord' | 'suffix' | 'predicate', partAudioUrl: string) => {
        if (isComplete) return;

        if (sequence[clickedParts.length] === partKey) {
            setError(false);
            const newClickedParts = [...clickedParts, partKey];
            setClickedParts(newClickedParts);
            playAudio(partAudioUrl);

            if (newClickedParts.length === sequence.length) {
                setIsComplete(true);
            }
        } else {
            setError(true);
            setTimeout(() => setError(false), 1500);
        }
    };

    const handleReset = () => {
        setClickedParts([]);
        setIsComplete(false);
        setError(false);
    };

    // Style logic remains the same
    const getPartStyle = (partKey: string) => {
        const isClicked = clickedParts.includes(partKey);
        const isNext = sequence[clickedParts.length] === partKey;
        const isClickable = !isComplete && isNext;

        return {
            cursor: isClickable ? 'pointer' : 'default',
            border: isClicked ? '3px solid #4CAF50' : (isClickable ? '3px solid #2196F3' : '2px solid #E0E0E0'),
            opacity: isComplete || isClicked ? 1 : (isClickable ? 1 : 0.5),
            transform: isClicked ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: isClickable ? 6 : 1,
            },
        };
    };

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary.main">
                {content.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                சொற்களை சரியான வரிசையில் அழுத்தி வாக்கியத்தை முடிக்கவும் (Click the parts in order to build the sentence)
            </Typography>
            
            <Paper elevation={3} sx={{ p: 4, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Card 
                    sx={getPartStyle('imageWord')}
                    onClick={() => handlePartClick('imageWord', content.imageWord.audioUrl)}
                >
                    <CardMedia component="img" height="150" image={content.imageWord.imageUrl} alt={content.imageWord.text} />
                    <CardContent>
                        <Typography variant="h5">{content.imageWord.text}</Typography>
                    </CardContent>
                </Card>

                <Typography variant="h2" color="text.secondary">+</Typography>
                
                <Card 
                    sx={{ ...getPartStyle('suffix'), width: 120, height: 222, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => handlePartClick('suffix', content.suffix.audioUrl)}
                >
                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>{content.suffix.text}</Typography>
                </Card>
                
                <Typography variant="h2" color="text.secondary">+</Typography>

                <Card 
                    sx={{ ...getPartStyle('predicate'), width: 200, height: 222, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => handlePartClick('predicate', content.predicate.audioUrl)}
                >
                    <Typography variant="h4">{content.predicate.text}</Typography>
                </Card>
            </Paper>

            <Box sx={{ minHeight: '100px', mb: 2 }}>
                {error && <Alert severity="error">தவறான வரிசை. மீண்டும் முயற்சிக்கவும். (Wrong order. Try again.)</Alert>}
                {isComplete && (
                    <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h5">
                            {content.fullSentenceText}
                        </Typography>
                    </Alert>
                )}
            </Box>

            <Box display="flex" gap={2}>
                <Button variant="outlined" startIcon={<ReplayIcon />} onClick={handleReset}>
                    மீண்டும் முயற்சி
                </Button>
                {/* The "Next" button is REMOVED. ActivityPlayerModal handles this. */}
            </Box>
            
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default SentenceBuilder;