import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Grid, IconButton} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// --- COLOCATED TYPES ---
export interface CharacterGridItem {
    id: number;
    character: string;
    audioUrl: string;
}

// This is the content for a SINGLE page/grid
export interface CharacterGridContent {
    title: string;
    gridItems: CharacterGridItem[];
    correctItemIds: number[];
}

// --- PROPS INTERFACE ---
interface CharacterGridProps {
    content: CharacterGridContent;
}

const CharacterGrid: React.FC<CharacterGridProps> = ({ content }) => {
    // State is now only for this single grid
    const [foundItems, setFoundItems] = useState<number[]>([]);
    const [currentItemToFindIndex, setCurrentItemToFindIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentCorrectIds = content.correctItemIds;
    const currentItemToFind = content.gridItems.find(item => item.id === currentCorrectIds[currentItemToFindIndex]);

    // Reset game when the content prop (a new grid) changes
    useEffect(() => {
        setFoundItems([]);
        setCurrentItemToFindIndex(0);
    }, [content]);

    // Autoplay the sound for the next item to find
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

    const handleCharacterClick = (clickedItemId: number) => {
        if (foundItems.includes(clickedItemId) || !currentItemToFind) return;

        if (clickedItemId === currentItemToFind.id) {
            setFoundItems(prev => [...prev, clickedItemId]);
            setCurrentItemToFindIndex(prev => prev + 1);
        }
    };

    const isComplete = foundItems.length === currentCorrectIds.length;

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
                <Grid container spacing={1} justifyContent="center" alignItems="center">
                    {content.gridItems.map(item => {
                        const isFound = foundItems.includes(item.id);
                        return (
                            <Grid  key={item.id} size={{xs:3, sm:2}}>
                                <Paper
                                    onClick={() => handleCharacterClick(item.id)}
                                    sx={{
                                        aspectRatio: '1 / 1', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', cursor: 'pointer', borderRadius: '8px',
                                        border: '2px solid', borderColor: isFound ? 'success.main' : 'grey.300',
                                        backgroundColor: isFound ? 'success.light' : 'white',
                                        transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' }
                                    }}
                                >
                                    <Typography variant="h3" fontWeight="bold">{item.character}</Typography>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
            
            <Box sx={{ height: '80px', mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isComplete && (
                    <Box textAlign="center">
                        <Typography variant="h5" color="success.main">Well Done!</Typography>
                    </Box>
                )}
            </Box>

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default CharacterGrid;