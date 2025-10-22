import React, { useRef } from 'react';
import { Box, Typography, Paper, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

interface MediaSpotlightItem {
    text: string;
    imageUrl: string;
    audioUrl?: string;
}
export interface MediaSpotlightMultipleContent {
    title: string; // e.g., "உயிர் எழுத்து"
    spotlightLetter: string;
    items: MediaSpotlightItem[];
}


// We can reuse the HighlightedWord helper component
const HighlightedWord: React.FC<{ word: string; letter: string }> = ({ word, letter }) => {
    const parts = word.split(new RegExp(`(${letter})`, 'gi'));
    return (
        <Typography variant="h5" component="span" fontWeight="bold">
            {parts.map((part, index) =>
                part.toLowerCase() === letter.toLowerCase() ? (
                    <Typography key={index} component="span" variant="h5" color="error" fontWeight="bold">
                        {part}
                    </Typography>
                ) : (
                    part
                )
            )}
        </Typography>
    );
};

interface MediaSpotlightMultipleProps {
    content: MediaSpotlightMultipleContent;
}

const MediaSpotlightMultiple: React.FC<MediaSpotlightMultipleProps> = ({ content }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playAudio = (audioUrl?: string) => {
        if (audioUrl && audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    return (
        <Box p={2} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>{content.title}</Typography>
            
            {/* Spotlight Letter */}
            <Paper
                elevation={4}
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'secondary.main',
                    color: 'white',
                    borderRadius: '50%',
                    mb: 3
                }}
            >
                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                    {content.spotlightLetter}
                </Typography>
            </Paper>

            {/* Grid of all word cards */}
            <Grid container spacing={2} justifyContent="center">
                {content.items.map((item, index) => (
                    <Grid  key={index} size={{xs:6,sm:4, md:3}}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="120"
                                image={`${process.env.REACT_APP_MEDIA_URL}/${item.imageUrl}`}
                                alt={item.text}
                                sx={{ objectFit: 'contain', p: 1 }}
                            />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <HighlightedWord word={item.text} letter={content.spotlightLetter} />
                                    {item.audioUrl && (
                                        <IconButton onClick={() => playAudio(item.audioUrl)} color="primary" size="small" sx={{ ml: 0.5 }}>
                                            <VolumeUpIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default MediaSpotlightMultiple;