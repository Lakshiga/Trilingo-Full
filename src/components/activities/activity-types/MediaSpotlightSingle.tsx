import React, { useRef, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, IconButton, Card, CardMedia, CardContent } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// --- NEW: Type for Media Spotlight Activity (Carousel) ---
interface MediaSpotlightItem {
    text: string;
    imageUrl: string;
    audioUrl?: string;
}

// --- The content for a SINGLE MediaSpotlight exercise ---
export interface MediaSpotlightSingleContent {
    title: string;
    spotlightLetter: string;
    item: MediaSpotlightItem; // It now contains a single 'item', not an array 'items'
}

// The HighlightedWord helper can be reused from LetterSpotlight.tsx
// Or copied here if you prefer to keep components fully separate.
const HighlightedWord: React.FC<{ word: string; letter: string }> = ({ word, letter }) => {
    const parts = word.split(new RegExp(`(${letter})`, 'gi'));
    return (
        <Typography variant="h4" component="span" fontWeight="bold">
            {parts.map((part, index) =>
                part.toLowerCase() === letter.toLowerCase() ? (
                    <Typography key={index} component="span" variant="h4" color="error" fontWeight="bold">
                        {part}
                    </Typography>
                ) : (
                    part
                )
            )}
        </Typography>
    );
};

interface MediaSpotlightProps {
    content: MediaSpotlightSingleContent;
}

const MediaSpotlightSingle: React.FC<MediaSpotlightProps> = ({ content }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 2. Wrap the playAudio function in useCallback.
    //    Its behavior depends on the 'content' prop, so 'content' is its dependency.
    const playAudio = useCallback(() => {
        if (content?.item?.audioUrl && audioRef.current) {
            const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';
            audioRef.current.src = `${mediaBaseUrl}${content.item.audioUrl}`;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    }, [content]); // This function will be recreated only when the 'content' prop changes.

    // 3. Add the now-stable 'playAudio' function to the useEffect dependency array.
    useEffect(() => {
        const timer = setTimeout(() => playAudio(), 300);
        return () => clearTimeout(timer);
    }, [content, playAudio]); // The dependency array is now complete. The warning will disappear.
    
    if (!content || !content.item) {
        return <Typography color="error">Invalid MediaSpotlight content.</Typography>;
    }

    const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';

    return (
        <Box p={2} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Paper
                elevation={4}
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '120px',
                    height: '120px',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    mb: 3
                }}
            >
                <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 'bold' }}>
                    {content.spotlightLetter}
                </Typography>
            </Paper>

            <Box display="flex" alignItems="center" justifyContent="center">
                <Card sx={{ minWidth: 250, mx: 1 }}>
                    <CardMedia
                        component="img"
                        height="180"
                        image={`${mediaBaseUrl}${content.item.imageUrl}`}
                        alt={content.item.text}
                        sx={{ objectFit: 'contain', p: 1 }}
                    />
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <HighlightedWord word={content.item.text} letter={content.spotlightLetter} />
                         {content.item.audioUrl && (
                             <IconButton onClick={playAudio} color="primary" sx={{ ml: 1 }}>
                                 <VolumeUpIcon />
                             </IconButton>
                         )}
                    </CardContent>
                </Card>
            </Box>

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default MediaSpotlightSingle;