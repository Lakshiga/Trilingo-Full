// REVISED file: activity-types/PronunciationPractice.tsx

import React, { useState, useRef, useCallback} from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// --- In your types/activityContentTypes.ts file ---

// REVISED: This is now the main content type for this component.
// It represents a SINGLE pronunciation challenge.
export interface PronunciationPracticeContent {
    id: number;
    title: string;
    text: string;
    audioUrl: string;
}

interface PronunciationPracticeProps {
    content: PronunciationPracticeContent; // The prop is now a single challenge object
}

/**
 * A component for pronunciation practice of a SINGLE word or sentence.
 * It displays one item and allows the user to play its audio.
 */
const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({ content }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    /**
     * Plays an audio file from a given URL.
     */
    const playAudio = useCallback((audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            setIsPlaying(true);
            audioRef.current.play().catch(e => {
                console.error("Audio playback error:", e);
                setIsPlaying(false);
            });
            audioRef.current.onended = () => setIsPlaying(false);
        }
    }, []);

    /**
     * Handler to play the audio for the currently displayed item.
     */
    const handlePlayCurrent = () => {
        if (!isPlaying) {
            playAudio(content.audioUrl);
        }
    };

    if (!content) {
        return <Typography color="error">No item to display.</Typography>;
    }

    return (
        <Box 
            p={3} 
            sx={{ 
                fontFamily: 'sans-serif', 
                textAlign: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                justifyContent: 'center'
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom color="primary.main">
                {content.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                சொல்லைக் கேட்டு மீண்டும் கூறவும் (Listen to the sound and repeat)
            </Typography>
            
            {/* Main Display Area */}
            <Paper 
                elevation={4} 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 4, 
                    backgroundColor: '#f8f9fa',
                    minHeight: '250px',
                    borderRadius: '16px'
                }}
            >
                <Typography 
                    variant="h2" 
                    component="div" 
                    sx={{ 
                        fontWeight: 'bold', 
                        mb: 3, 
                        color: '#333'
                    }}
                >
                    {content.text}
                </Typography>
                <IconButton 
                    onClick={handlePlayCurrent} 
                    disabled={isPlaying} 
                    color="primary" 
                    sx={{ 
                        transform: 'scale(2.5)',
                        backgroundColor: '#e3f2fd',
                        '&:hover': {
                            backgroundColor: '#bbdefb'
                        }
                    }}
                >
                    <VolumeUpIcon fontSize="large" />
                </IconButton>
            </Paper>
            
            {/* The hidden audio element controlled by the component */}
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default PronunciationPractice;