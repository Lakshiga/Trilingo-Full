import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Button, Card, CardContent } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// --- Type definitions for Equation Learn Activity ---
export interface UyirMeiEquation {
    id: number;
    consonant: string;          // The consonant, e.g., "க்"
    consonantAudioUrl: string;  // Audio for consonant
    vowel: string;              // The vowel, e.g., "அ"
    vowelAudioUrl: string;      // Audio for vowel
    result: string;             // The combined result, e.g., "க"
    resultAudioUrl: string;     // Audio for the result
    romanization?: string;      // Optional romanization, e.g., "ka"
}

export interface EquationLernContent {
    title: string;
    description?: string;
    equations: UyirMeiEquation[]; // Array of consonant + vowel combinations
    introAudioUrl?: string;       // Optional intro audio
}

interface EquationLernProps {
    content: EquationLernContent;
}

const EquationLern: React.FC<EquationLernProps> = ({ content }) => {
    const [currentEquationIndex, setCurrentEquationIndex] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState<'consonant' | 'vowel' | 'result' | 'complete'>('consonant');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';
    const currentEquation = content.equations[currentEquationIndex];

    const getFullUrl = useCallback((url: string) => {
        if (url.startsWith('http')) return url;
        return `${mediaBaseUrl}/${url}`;
    }, [mediaBaseUrl]);

    const playAudio = useCallback((audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = getFullUrl(audioUrl);
            setIsPlaying(true);
            
            audioRef.current.play()
                .then(() => {
                    // Audio started playing successfully
                })
                .catch(e => {
                    console.error('Error playing audio:', e);
                    setIsPlaying(false);
                });

            audioRef.current.onended = () => {
                setIsPlaying(false);
            };
        }
    }, [getFullUrl]);

    // Auto-play audio and auto-progress through steps
    useEffect(() => {
        if (currentEquation) {
            const timer = setTimeout(() => {
                switch (currentStep) {
                    case 'consonant':
                        playAudio(currentEquation.consonantAudioUrl);
                        // Auto-progress to vowel after 2 seconds
                        setTimeout(() => setCurrentStep('vowel'), 2000);
                        break;
                    case 'vowel':
                        playAudio(currentEquation.vowelAudioUrl);
                        // Auto-progress to result after 2 seconds
                        setTimeout(() => setCurrentStep('result'), 2000);
                        break;
                    case 'result':
                        playAudio(currentEquation.resultAudioUrl);
                        // Auto-progress to complete after 2 seconds
                        setTimeout(() => {
                            setCurrentStep('complete');
                        }, 2000);
                        break;
                }
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [currentStep, currentEquationIndex, currentEquation, playAudio]);

    const handleNext = () => {
        // Only handle navigation between equation IDs
        if (currentEquationIndex < content.equations.length - 1) {
            setCurrentEquationIndex(prev => prev + 1);
            setCurrentStep('consonant');
        }
    };

    const handlePrevious = () => {
        // Only handle navigation between equation IDs
        if (currentEquationIndex > 0) {
            setCurrentEquationIndex(prev => prev - 1);
            setCurrentStep('consonant');
        }
    };

    const handleReset = () => {
        setCurrentEquationIndex(0);
        setCurrentStep('consonant');
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const handlePlayCurrentAudio = () => {
        if (currentEquation) {
            switch (currentStep) {
                case 'consonant':
                    playAudio(currentEquation.consonantAudioUrl);
                    break;
                case 'vowel':
                    playAudio(currentEquation.vowelAudioUrl);
                    break;
                case 'result':
                case 'complete':
                    playAudio(currentEquation.resultAudioUrl);
                    break;
            }
        }
    };

    const isLastEquation = currentEquationIndex === content.equations.length - 1;

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary.main">
                {content.title}
            </Typography>
            
            {content.description && (
                <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                    {content.description}
                </Typography>
            )}

            {/* Progress indicator */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    {currentEquationIndex + 1} / {content.equations.length}
                </Typography>
            </Box>

            {/* Main equation display */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: '#f8f9fa', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        
                        {/* Consonant */}
                        <Card sx={{
                            width: 120,
                            height: 120,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: currentStep === 'consonant' ? '#2196F3' : currentStep === 'vowel' || currentStep === 'result' || currentStep === 'complete' ? '#E3F2FD' : '#FAFAFA',
                            border: currentStep === 'consonant' ? '3px solid #1976D2' : '2px solid #E0E0E0',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }
                        }} onClick={() => currentStep !== 'consonant' && playAudio(currentEquation.consonantAudioUrl)}>
                            <CardContent sx={{ p: 1 }}>
                                <Typography 
                                    variant="h2" 
                                    sx={{ 
                                        fontWeight: 'bold',
                                        color: currentStep === 'consonant' ? 'white' : 'primary.main'
                                    }}
                                >
                                    {currentEquation.consonant}
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Plus symbol */}
                        <Typography 
                            variant="h1" 
                            sx={{ 
                                color: currentStep === 'vowel' || currentStep === 'result' || currentStep === 'complete' ? '#2196F3' : '#BDBDBD',
                                fontWeight: 'bold',
                                transition: 'color 0.3s ease'
                            }}
                        >
                            +
                        </Typography>

                        {/* Vowel - Always centered and prominent as constant */}
                        <Card sx={{
                            width: 140,
                            height: 140,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#4CAF50',
                            border: '4px solid #388E3C',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            position: 'relative',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                            }
                        }} onClick={() => playAudio(currentEquation.vowelAudioUrl)}>
                            <CardContent sx={{ p: 1 }}>
                                <Typography 
                                    variant="h1" 
                                    sx={{ 
                                        fontWeight: 'bold',
                                        color: 'white',
                                        fontSize: '3rem'
                                    }}
                                >
                                    {currentEquation.vowel}
                                </Typography>
                            </CardContent>
                            {/* Constant label */}
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    position: 'absolute',
                                    bottom: 8,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.7rem'
                                }}
                            >
                            </Typography>
                        </Card>

                        {/* Equals symbol */}
                        <Typography 
                            variant="h1" 
                            sx={{ 
                                color: currentStep === 'result' || currentStep === 'complete' ? '#4CAF50' : '#BDBDBD',
                                fontWeight: 'bold',
                                transition: 'color 0.3s ease'
                            }}
                        >
                            =
                        </Typography>

                        {/* Result */}
                        <Card sx={{
                            width: 120,
                            height: 120,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: currentStep === 'result' || currentStep === 'complete' ? '#4CAF50' : '#FAFAFA',
                            border: currentStep === 'result' || currentStep === 'complete' ? '3px solid #388E3C' : '2px solid #E0E0E0',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            opacity: currentStep === 'consonant' || currentStep === 'vowel' ? 0.3 : 1,
                            '&:hover': {
                                transform: (currentStep === 'result' || currentStep === 'complete') ? 'scale(1.05)' : 'none',
                                boxShadow: (currentStep === 'result' || currentStep === 'complete') ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                            }
                        }} onClick={() => (currentStep === 'result' || currentStep === 'complete') && playAudio(currentEquation.resultAudioUrl)}>
                            <CardContent sx={{ p: 1 }}>
                                <Typography 
                                    variant="h2" 
                                    sx={{ 
                                        fontWeight: 'bold',
                                        color: (currentStep === 'result' || currentStep === 'complete') ? 'white' : 'text.disabled'
                                    }}
                                >
                                    {(currentStep === 'result' || currentStep === 'complete') ? currentEquation.result : '?'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Paper>

                {/* Romanization */}
                {currentEquation.romanization && (currentStep === 'result' || currentStep === 'complete') && (
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        ({currentEquation.romanization})
                    </Typography>
                )}
            </Box>

            {/* Control buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<NavigateBeforeIcon />}
                    onClick={handlePrevious}
                    disabled={currentEquationIndex === 0}
                >
                    Previous Equation
                </Button>

                <Button
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    onClick={handlePlayCurrentAudio}
                    disabled={isPlaying}
                    color="primary"
                >
                    {isPlaying ? 'Playing...' : 'Replay Sound'}
                </Button>

                {!isLastEquation && (
                    <Button
                        variant="contained"
                        endIcon={<NavigateNextIcon />}
                        onClick={handleNext}
                        color="success"
                    >
                        Next Equation
                    </Button>
                )}

                <Button
                    variant="outlined"
                    startIcon={<ReplayIcon />}
                    onClick={handleReset}
                >
                    Reset All
                </Button>
            </Box>

            {/* Completion message */}
            {currentStep === 'complete' && isLastEquation && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5" color="success.main">
                        🎉 Excellent! You've learned all Uyir-Mei combinations!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        You now understand how consonants and vowels combine to form syllables in Tamil.
                    </Typography>
                </Box>
            )}

            {/* Instructions */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    மெய்யும் உயிரும் சேர்ந்து உயிர்மெய் எழுத்தாகும் (Consonant + Vowel = Syllable)
                </Typography>
            </Box>
            
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default EquationLern;
