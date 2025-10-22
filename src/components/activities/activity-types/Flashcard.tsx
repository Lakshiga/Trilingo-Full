import React, { useRef, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { Box, Typography, IconButton, Card, CardMedia, CardContent } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export interface FlashcardContent {
    title: string;
    word: string;
    imageUrl: string;
    audioUrl?: string;
}

// The component now expects props for a SINGLE flashcard.
interface FlashcardProps {
    content: FlashcardContent;
}

const Flashcard: React.FC<FlashcardProps> = ({ content }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 2. Wrap the playAudio function in useCallback.
    //    This function now depends on 'content', so we list it in the dependency array.
    const playAudio = useCallback(() => {
        if (content?.audioUrl && audioRef.current) {
            // Assuming REACT_APP_MEDIA_URL is a base URL for your S3 content
            const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';
            audioRef.current.src = `${mediaBaseUrl}${content.audioUrl}`;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    }, [content]); // This function will only be recreated if 'content' changes.

    // 3. Add the now-stable 'playAudio' function to the useEffect dependency array.
    useEffect(() => {
        // Add a small delay to allow the card to render before playing
        const timer = setTimeout(() => {
            playAudio();
        }, 300);
        return () => clearTimeout(timer);
    }, [content, playAudio]); // The dependency array is now complete and correct.

    if (!content) {
        return <Typography color="error">No flashcard content to display.</Typography>;
    }
    
    const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" component="h2" mb={3}>{content.title}</Typography>
            
            <Card sx={{ width: 320, boxShadow: 6 }}>
                <CardMedia
                    component="img"
                    height="240"
                    // Construct the full image URL
                    image={`${mediaBaseUrl}${content.imageUrl}`}
                    alt={content.word}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                     <Box display="flex" alignItems="center" justifyContent="center">
                        <Typography variant="h3" component="div">
                           {content.word}
                        </Typography>
                         {content.audioUrl && (
                             <IconButton onClick={playAudio} color="primary" sx={{ ml: 1 }}>
                                 <VolumeUpIcon fontSize="large" />
                             </IconButton>
                         )}
                     </Box>
                </CardContent>
            </Card>

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default Flashcard;