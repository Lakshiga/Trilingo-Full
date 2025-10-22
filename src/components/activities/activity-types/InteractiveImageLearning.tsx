import React, { useState, useRef } from 'react';
import { Box, Typography, Paper, IconButton, Button } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ReplayIcon from '@mui/icons-material/Replay';

// --- Type definitions for Interactive Image Learning Activity ---
export interface InteractiveObject {
    id: number;           // Unique ID for this clickable object
    name: string;         // The name/text of the object, e.g., "மரம்" (Tree)
    audioUrl: string;     // Audio file to play when clicked
    // Coordinates are percentages (0-100) for responsive design
    x: number;            // X-coordinate of the top-left corner
    y: number;            // Y-coordinate of the top-left corner
    width: number;        // Width of the clickable area
    height: number;       // Height of the clickable area
}

export interface InteractiveImageLearningContent {
    title: string;
    imageUrl: string;           // The main learning image
    backgroundAudioUrl?: string; // Optional background/ambient audio
    objects: InteractiveObject[]; // All clickable objects in the image
}

interface InteractiveImageLearningProps {
    content: InteractiveImageLearningContent;
}

const InteractiveImageLearning: React.FC<InteractiveImageLearningProps> = ({ content }) => {
    const [clickedObjects, setClickedObjects] = useState<number[]>([]);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
    const [showObjectName, setShowObjectName] = useState<{ id: number; name: string } | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';

    const getFullUrl = (url: string) => {
        if (url.startsWith('http')) return url;
        return `${mediaBaseUrl}/${url}`;
    };

    const playAudio = (audioUrl: string, objectId: number, objectName: string) => {
        if (audioRef.current) {
            audioRef.current.src = getFullUrl(audioUrl);
            setCurrentlyPlaying(objectId);
            setShowObjectName({ id: objectId, name: objectName });
            
            audioRef.current.play()
                .then(() => {
                    // Audio started playing successfully
                })
                .catch(e => {
                    console.error('Error playing audio:', e);
                    setCurrentlyPlaying(null);
                    setShowObjectName(null);
                });

            // Clear the playing state when audio ends
            audioRef.current.onended = () => {
                setCurrentlyPlaying(null);
                setTimeout(() => setShowObjectName(null), 1000); // Keep text visible for 1 second after audio ends
            };
        }
    };

    const handleObjectClick = (object: InteractiveObject) => {
        // Mark as clicked if not already clicked
        if (!clickedObjects.includes(object.id)) {
            setClickedObjects(prev => [...prev, object.id]);
        }
        
        // Play audio and show text
        playAudio(object.audioUrl, object.id, object.name);
    };

    const handleReset = () => {
        setClickedObjects([]);
        setCurrentlyPlaying(null);
        setShowObjectName(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const allObjectsClicked = clickedObjects.length === content.objects.length;

    return (
        <Box p={2} sx={{ fontFamily: 'sans-serif', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h1" gutterBottom>
                {content.title}
            </Typography>
            
            {/* Display current object name and audio controls */}
            <Paper elevation={2} sx={{ p: 2, mb: 2, minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                {showObjectName ? (
                    <>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                            {showObjectName.name}
                        </Typography>
                        <IconButton 
                            onClick={() => {
                                const obj = content.objects.find(o => o.id === showObjectName.id);
                                if (obj) playAudio(obj.audioUrl, obj.id, obj.name);
                            }}
                            color="primary"
                        >
                            <VolumeUpIcon fontSize="large" />
                        </IconButton>
                    </>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        படத்தில் உள்ள பொருட்களை அழுத்தி கேளுங்கள் (Click on objects in the image to learn)
                    </Typography>
                )}
            </Paper>

            {/* Progress indicator */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Progress: {clickedObjects.length} / {content.objects.length} objects explored
                </Typography>
            </Box>

            {/* The Interactive Image Container */}
            <Box sx={{ flexGrow: 1, position: 'relative', width: '100%', maxWidth: '800px', margin: 'auto' }}>
                <img 
                    src={getFullUrl(content.imageUrl)} 
                    alt={content.title} 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }} 
                />
                
                {/* Overlay for Interactive Objects */}
                {content.objects.map(object => {
                    const isClicked = clickedObjects.includes(object.id);
                    const isCurrentlyPlaying = currentlyPlaying === object.id;
                    
                    return (
                        <Box
                            key={object.id}
                            onClick={() => handleObjectClick(object)}
                            sx={{
                                position: 'absolute',
                                top: `${object.y}%`,
                                left: `${object.x}%`,
                                width: `${object.width}%`,
                                height: `${object.height}%`,
                                cursor: 'pointer',
                                borderRadius: '50%',
                                transition: 'all 0.3s ease',
                                // Visual feedback for clickable areas
                                backgroundColor: isCurrentlyPlaying 
                                    ? 'rgba(33, 150, 243, 0.4)' 
                                    : isClicked 
                                        ? 'rgba(76, 175, 80, 0.3)' 
                                        : 'rgba(255, 255, 255, 0.1)',
                                border: isCurrentlyPlaying 
                                    ? '3px solid #2196F3' 
                                    : isClicked 
                                        ? '2px solid #4CAF50' 
                                        : '2px solid rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                    border: '2px solid #2196F3',
                                    transform: 'scale(1.05)',
                                },
                                // Pulsing animation for currently playing
                                ...(isCurrentlyPlaying && {
                                    animation: 'pulse 1.5s infinite',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 0.6 },
                                        '50%': { opacity: 1 },
                                        '100%': { opacity: 0.6 },
                                    },
                                }),
                            }}
                        >
                            {/* Optional: Add a small icon or indicator */}
                            {isClicked && !isCurrentlyPlaying && (
                                <Box sx={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: '#4CAF50',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    ✓
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
            
            {/* Control buttons */}
            <Box sx={{ height: '60px', mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Button 
                    variant="outlined" 
                    startIcon={<ReplayIcon />} 
                    onClick={handleReset}
                    disabled={clickedObjects.length === 0}
                >
                    Reset
                </Button>
                
                {allObjectsClicked && (
                    <Typography variant="h6" color="success.main" sx={{ ml: 2 }}>
                        🎉 All objects explored! Well done!
                    </Typography>
                )}
            </Box>
            
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default InteractiveImageLearning;
