import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Box, Typography, Card, CardMedia, Button, Alert, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import { DragDropImageMatchingContent, DragDropImageItem } from '../../../types/activityContentTypes';

interface DragDropImageMatchingProps {
    content: DragDropImageMatchingContent;
}

const DragDropImageMatching: React.FC<DragDropImageMatchingProps> = ({ content }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [draggedItem, setDraggedItem] = useState<DragDropImageItem | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
    const [dragOverTarget, setDragOverTarget] = useState<number | null>(null);
    const [showResult, setShowResult] = useState<{ success: boolean; message: string } | null>(null);

    // Generate left and right images from the single images array
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Create left images (original)
    const leftImages = content.images;
    
    // Create right images (duplicates with new IDs, shuffled) - memoized to prevent continuous shuffling
    const rightImages = useMemo(() => {
        return shuffleArray(content.images.map(img => ({
            ...img,
            id: img.id + 100, // Offset IDs to avoid conflicts
            matchId: img.id   // Point back to original left image
        })));
    }, [content.images]);

    const playAudio = useCallback((audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(e => {
                console.warn("Audio playback failed:", e);
            });
        }
    }, []);

    const handleDragStart = (e: React.DragEvent, item: DragDropImageItem) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', item.id.toString());
    };

    const handleDragOver = (e: React.DragEvent, targetItem: DragDropImageItem) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverTarget(targetItem.id);
    };

    const handleDragLeave = () => {
        setDragOverTarget(null);
    };

    const handleDrop = (e: React.DragEvent, targetItem: DragDropImageItem) => {
        e.preventDefault();
        setDragOverTarget(null);

        if (!draggedItem) return;

        // Check if it's a correct match
        // draggedItem is from left side, targetItem is from right side
        // Right side items have matchId pointing to left side items
        if (draggedItem.id === targetItem.matchId) {
            // Correct match
            setMatchedPairs(prev => [...prev, draggedItem.id, targetItem.id]);
            setShowResult({ success: true, message: "சரியான பொருத்தம்! (Correct Match!)" });
            playAudio(targetItem.audioUrl);
        } else {
            // Incorrect match
            setShowResult({ success: false, message: "தவறான பொருத்தம். மீண்டும் முயற்சி செய்யுங்கள். (Wrong Match. Try Again.)" });
        }

        setDraggedItem(null);
        
        // Clear result message after 2 seconds
        setTimeout(() => setShowResult(null), 2000);
    };

    const handleImageClick = (item: DragDropImageItem) => {
        playAudio(item.audioUrl);
    };

    const resetActivity = () => {
        setMatchedPairs([]);
        setDraggedItem(null);
        setDragOverTarget(null);
        setShowResult(null);
    };

    const isComplete = matchedPairs.length === content.images.length * 2;
    const getAvailableLeftImages = () => leftImages.filter((item: DragDropImageItem) => !matchedPairs.includes(item.id));
    const getAvailableRightImages = () => rightImages.filter((item: DragDropImageItem) => !matchedPairs.includes(item.id));

    return (
        <Box 
            p={3} 
            sx={{ 
                fontFamily: 'sans-serif', 
                textAlign: 'center',
                minHeight: '600px'
            }}
        >
            {/* Title */}
            <Typography variant="h5" component="h2" mb={3}>
                {content.title}
            </Typography>

            {/* Instructions */}
            <Typography variant="body1" mb={3} color="text.secondary">
                படங்களை இழுத்து சரியான இடத்தில் விடுங்கள் (Drag images to match them correctly)
            </Typography>

            {/* Result Display */}
            {showResult && (
                <Alert 
                    severity={showResult.success ? "success" : "error"} 
                    sx={{ mb: 3, fontSize: '1.1rem' }}
                >
                    {showResult.message}
                </Alert>
            )}

            {/* Completion Message */}
            {isComplete && (
                <Alert severity="success" sx={{ mb: 3, fontSize: '1.2rem' }}>
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    அனைத்து படங்களும் சரியாக பொருத்தப்பட்டன! (All images matched correctly!)
                </Alert>
            )}

            {/* Main Game Area */}
            <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
                {/* Left Side - Draggable Images */}
                <Grid size={{xs: 5}}>
                    <Typography variant="h6" mb={2} color="primary">
                        இழுக்கவும் (Drag From)
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {getAvailableLeftImages().map((item: DragDropImageItem) => (
                            <Card
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item)}
                                onClick={() => handleImageClick(item)}
                                sx={{
                                    cursor: 'grab',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 6
                                    },
                                    '&:active': {
                                        cursor: 'grabbing'
                                    },
                                    opacity: draggedItem?.id === item.id ? 0.5 : 1
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="120"
                                    image={item.imageUrl}
                                    alt={`Draggable item ${item.id}`}
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Card>
                        ))}
                    </Box>
                </Grid>

                {/* Right Side - Drop Targets */}
                <Grid size={{xs: 5}}>
                    <Typography variant="h6" mb={2} color="secondary">
                        விடவும் (Drop Here)
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {getAvailableRightImages().map((item: DragDropImageItem) => (
                            <Card
                                key={item.id}
                                onDragOver={(e) => handleDragOver(e, item)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, item)}
                                onClick={() => handleImageClick(item)}
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    border: dragOverTarget === item.id ? '3px dashed #1976d2' : '2px solid transparent',
                                    backgroundColor: dragOverTarget === item.id ? '#e3f2fd' : 'white',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="120"
                                    image={item.imageUrl}
                                    alt={`Drop target ${item.id}`}
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Card>
                        ))}
                    </Box>
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="center" gap={2} mt={4}>
                <Button 
                    variant="outlined" 
                    onClick={resetActivity}
                    startIcon={<ReplayIcon />}
                    sx={{ 
                        fontSize: '1.1rem',
                        padding: '10px 20px'
                    }}
                >
                    மீண்டும் தொடங்கு (Reset)
                </Button>
            </Box>

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default DragDropImageMatching;
