import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper,IconButton, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// --- NEW: Type for Interactive Scene Finder Activity ---
export interface Hotspot {
    id: number;           // Unique ID for this object in the scene
    name: string;         // The name of the object, e.g., "ஆடு"
    audioUrl: string;     // The audio prompt that asks the user to find this object
    // Coordinates are percentages (0-100) for responsive design
    x: number;            // X-coordinate of the top-left corner
    y: number;            // Y-coordinate of the top-left corner
    width: number;        // Width of the tappable area
    height: number;       // Height of the tappable area
}

export interface SceneFinderContent {
    title: string;
    sceneImageUrl: string; // The main background image
    sceneAudioUrl?: string; // Optional ambient sound for the scene
    hotspots: Hotspot[];    // The list of all interactive objects in the scene
}

interface SceneFinderProps {
    content: SceneFinderContent;
}

const SceneFinder: React.FC<SceneFinderProps> = ({ content }) => {
    const [foundItems, setFoundItems] = useState<number[]>([]);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const itemsToFind = content.hotspots;
    const currentItem = itemsToFind[currentItemIndex];

    useEffect(() => {
        // Reset game when content changes
        setFoundItems([]);
        setCurrentItemIndex(0);
    }, [content]);

    useEffect(() => {
        // Autoplay the prompt for the current item to find
        if (currentItem?.audioUrl) {
            const timer = setTimeout(() => playAudio(currentItem.audioUrl), 500);
            return () => clearTimeout(timer);
        }
    }, [currentItem]);

    const playAudio = (audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(e => console.error(e));
        }
    };

    const handleHotspotClick = (hotspotId: number) => {
        if (foundItems.includes(hotspotId) || !currentItem) return;

        if (hotspotId === currentItem.id) {
            // Correct guess
            setFoundItems(prev => [...prev, hotspotId]);

            // Move to the next item
            if (currentItemIndex < itemsToFind.length - 1) {
                setCurrentItemIndex(prev => prev + 1);
            } else {
                // All items found
                setCurrentItemIndex(-1); // Sentinel value for completion
            }
        }
    };

    const handleReset = () => {
        setFoundItems([]);
        setCurrentItemIndex(0);
    };

    const isComplete = foundItems.length === itemsToFind.length;

    return (
        <Box p={2} sx={{ fontFamily: 'sans-serif', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h1" gutterBottom>{content.title}</Typography>
            
            <Paper elevation={2} sx={{ p: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography variant="h6">Find:</Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {isComplete ? "Well Done!" : currentItem?.name || "..."}
                </Typography>
                <IconButton onClick={() => currentItem && playAudio(currentItem.audioUrl)} disabled={isComplete}>
                    <VolumeUpIcon fontSize="large" />
                </IconButton>
            </Paper>

            {/* The Scene Container */}
            <Box sx={{ flexGrow: 1, position: 'relative', width: '100%', maxWidth: '800px', margin: 'auto' }}>
                <img src={content.sceneImageUrl} alt={content.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                
                {/* Overlay for Hotspots */}
                {itemsToFind.map(hotspot => {
                    const isFound = foundItems.includes(hotspot.id);
                    return (
                        <Box
                            key={hotspot.id}
                            onClick={() => handleHotspotClick(hotspot.id)}
                            sx={{
                                position: 'absolute',
                                top: `${hotspot.y}%`,
                                left: `${hotspot.x}%`,
                                width: `${hotspot.width}%`,
                                height: `${hotspot.height}%`,
                                cursor: isFound ? 'default' : 'pointer',
                                // For debugging, add a border:
                                // border: '1px dashed red', 
                            }}
                        >
                            {isFound && (
                                <Box sx={{ width: '100%', height: '100%', backgroundColor: 'rgba(46, 204, 113, 0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircleIcon sx={{ fontSize: 40, color: 'white' }} />
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
            
            <Box sx={{ height: '60px', mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {isComplete && (
                     <Button variant="contained" startIcon={<ReplayIcon />} onClick={handleReset}>
                        Play Again
                    </Button>
                )}
            </Box>
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default SceneFinder;