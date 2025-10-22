import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Box, Typography, IconButton, Card, CardMedia, Button, Alert } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { AudioTextImageSelectionContent } from '../../../types/activityContentTypes';

interface AudioTextImageSelectionProps {
    content: AudioTextImageSelectionContent;
}

const AudioTextImageSelection: React.FC<AudioTextImageSelectionProps> = ({ content }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);

    const playAudio = useCallback(() => {
        if (content?.audioUrl && audioRef.current) {
            audioRef.current.src = content.audioUrl;
            audioRef.current.play().catch(e => {
                console.warn("Audio autoplay blocked by browser:", e);
                // Silently fail - this is expected behavior in most browsers
            });
        }
    }, [content]);

    useEffect(() => {
        // Set audio source when component loads
        if (content?.audioUrl && audioRef.current) {
            audioRef.current.src = content.audioUrl;
        }
    }, [content]);

    const handleImageSelect = (imageId: number) => {
        setSelectedImageId(imageId);
        const selectedImage = content.images.find(img => img.id === imageId);
        if (selectedImage) {
            setIsCorrect(selectedImage.isCorrect);
            setShowResult(true);
        }
    };

    const resetActivity = () => {
        setSelectedImageId(null);
        setShowResult(false);
        setIsCorrect(false);
    };

    if (!content) {
        return <Typography color="error">No content to display.</Typography>;
    }

    return (
        <Box
            p={3}
            sx={{
                fontFamily: 'sans-serif',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '500px'
            }}
        >
            {/* Title */}
            <Typography variant="h5" component="h2" mb={2}>
                {content.title}
            </Typography>

            {/* Text Display with Audio Button */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: 3,
                    borderRadius: 2,
                    minWidth: '400px'
                }}
            >
                <Typography
                    variant="h4"
                    component="div"
                    sx={{
                        fontWeight: 'bold',
                        color: '#333',
                        mr: 2
                    }}
                >
                    {content.text}
                </Typography>
                <IconButton
                    onClick={playAudio}
                    color="primary"
                    size="large"
                    sx={{
                        backgroundColor: '#e3f2fd',
                        '&:hover': {
                            backgroundColor: '#bbdefb'
                        }
                    }}
                >
                    <VolumeUpIcon fontSize="large" />
                </IconButton>
            </Box>

            {/* Result Display */}
            {showResult && (
                <Alert
                    severity={isCorrect ? "success" : "error"}
                    sx={{ mb: 3, fontSize: '1.1rem' }}
                >
                    {isCorrect ? "சரியான பதில்! (Correct Answer!)" : "தவறான பதில். மீண்டும் முயற்சி செய்யுங்கள். (Wrong Answer. Try Again.)"}
                </Alert>
            )}

            {/* Images Display */}
            <Box
                display="flex"
                gap={4}
                justifyContent="center"
                alignItems="center"
                mb={3}
            >
                {content.images.map((image) => (
                    <Card
                        key={image.id}
                        sx={{
                            width: 250,
                            height: 250,
                            cursor: showResult ? 'default' : 'pointer',
                            boxShadow: selectedImageId === image.id ? 8 : 3,
                            border: selectedImageId === image.id ? '3px solid #1976d2' : 'none',
                            opacity: showResult && !image.isCorrect ? 0.6 : 1,
                            transform: selectedImageId === image.id ? 'scale(1.05)' : 'scale(1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: showResult ? 'scale(1)' : 'scale(1.02)',
                                boxShadow: showResult ? 3 : 6
                            }
                        }}
                        onClick={() => !showResult && handleImageSelect(image.id)}
                    >
                        <CardMedia
                            component="img"
                            height="250"
                            image={image.imageUrl}
                            alt={`Option ${image.id}`}
                            sx={{
                                objectFit: 'cover',
                                filter: showResult && !image.isCorrect ? 'grayscale(50%)' : 'none'
                            }}
                        />
                    </Card>
                ))}
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={2}>
                {showResult && (
                    <Button
                        variant="contained"
                        onClick={resetActivity}
                        sx={{
                            fontSize: '1.1rem',
                            padding: '10px 20px'
                        }}
                    >
                        மீண்டும் முயற்சி செய் (Try Again)
                    </Button>
                )}
                <Button
                    variant="outlined"
                    onClick={playAudio}
                    startIcon={<VolumeUpIcon />}
                    sx={{
                        fontSize: '1.1rem',
                        padding: '10px 20px'
                    }}
                >
                    மீண்டும் கேள் (Listen Again)
                </Button>
            </Box>

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default AudioTextImageSelection;