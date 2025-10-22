import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Grid, IconButton, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// --- REFINED: Type for Recognition Grid Activity ---
// This now represents a SINGLE grid/exercise.
export interface GridItem {
    id: number;
    imageUrl: string;
    audioUrl: string;
}

export interface RecognitionGridContent {
    title: string;
    gridItems: GridItem[];
    correctItemIds: number[];
}
interface RecognitionGridProps {
    content: RecognitionGridContent;
}

const RecognitionGrid: React.FC<RecognitionGridProps> = ({ content }) => {
    // State is now simpler: just for the items found in THIS grid
    const [foundItems, setFoundItems] = useState<number[]>([]);
    const [currentItemToFindIndex, setCurrentItemToFindIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const itemsToFind = content.correctItemIds;
    const currentItemToFind = content.gridItems.find(item => item.id === itemsToFind[currentItemToFindIndex]);

    // Reset the game when the content prop changes
    useEffect(() => {
        setFoundItems([]);
        setCurrentItemToFindIndex(0);
    }, [content]);

    // Automatically play the sound for the next item to find
    useEffect(() => {
        if (currentItemToFind?.audioUrl) {
            const timer = setTimeout(() => playAudio(currentItemToFind.audioUrl), 500);
            return () => clearTimeout(timer);
        }
    }, [currentItemToFind]);

    const playAudio = (audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    const handleImageClick = (clickedItemId: number) => {
        if (foundItems.includes(clickedItemId) || !currentItemToFind) return;

        if (clickedItemId === currentItemToFind.id) {
            // Correct guess
            setFoundItems(prev => [...prev, clickedItemId]);
            // Move to the next item to find on this page
            setCurrentItemToFindIndex(prev => prev + 1);
        }
        // Optional: Add feedback for incorrect clicks here
    };

    const handleReset = () => {
        setFoundItems([]);
        setCurrentItemToFindIndex(0);
    };

    const isComplete = foundItems.length === itemsToFind.length;

    return (
        <Box p={2} sx={{ fontFamily: 'sans-serif', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h1" gutterBottom>{content.title}</Typography>

            <Paper elevation={2} sx={{ p: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography variant="h6">Listen:</Typography>
                <IconButton onClick={() => currentItemToFind && playAudio(currentItemToFind.audioUrl)} disabled={isComplete}>
                    <VolumeUpIcon fontSize="large" color="primary" />
                </IconButton>
            </Paper>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    {content.gridItems.map(item => (
                        <Grid key={item.id} size={{ xs: 6, sm: 4 }}>
                            <Paper
                                onClick={() => handleImageClick(item.id)}
                                sx={{
                                    position: 'relative', cursor: 'pointer', overflow: 'hidden',
                                    borderRadius: '8px', border: '2px solid transparent',
                                    transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }
                                }}
                            >
                                <img src={item.imageUrl} alt={`item ${item.id}`} style={{ width: '100%', display: 'block' }} />
                                {foundItems.includes(item.id) && (
                                    <Box sx={{ /* Checkmark overlay styles */ }}>
                                        <CheckCircleIcon sx={{ fontSize: 60, color: 'white' }} />
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box sx={{ height: '80px', mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isComplete && (
                    <Box textAlign="center">
                        <Typography variant="h5" color="success.main">Well Done!</Typography>
                        <Button startIcon={<ReplayIcon />} onClick={handleReset}>
                            Play Again
                        </Button>
                    </Box>
                )}
            </Box>

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default RecognitionGrid;