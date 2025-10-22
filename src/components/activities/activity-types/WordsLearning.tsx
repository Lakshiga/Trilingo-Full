import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Box, Typography, Button, CircularProgress, LinearProgress } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// --- TypeScript interfaces ---

// Individual letter/syllable in a word
export interface LetterItem {
    id: number;
    letter: string;
    audioUrl: string;
}

// Word with its breakdown
export interface WordItem {
    id: number;
    word: string;
    wordAudioUrl: string;
    letters: LetterItem[];
}

// Single activity with words
export interface SingleActivity {
    id: number;
    title?: string;
    description?: string;
    words: WordItem[];
}

// Content type for multiple activities
export interface WordsLearningContent {
    title?: string;
    description?: string;
    activities: SingleActivity[];
}

// Component props
interface WordsLearningProps {
    content: WordsLearningContent;
}

const WordsLearning: React.FC<WordsLearningProps> = ({ content }) => {
    // --- State Management ---
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(-1); // -1 means showing full word
    const [isPlaying, setIsPlaying] = useState(false);
    const [isActivityFinished, setIsActivityFinished] = useState(false);
    const [isAllFinished, setIsAllFinished] = useState(false);
    const [phase, setPhase] = useState<'word' | 'letters' | 'transition'>('word');

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';
    const activities = content.activities;
    const currentActivity = activities[currentActivityIndex];
    const wordsData = useMemo(() => currentActivity?.words || [], [currentActivity]);

    // --- Audio Playback ---
    const playAudio = useCallback((audioUrl: string, onEnded?: () => void) => {
        if (audioUrl && audioRef.current) {
            setIsPlaying(true);
            audioRef.current.src = `${mediaBaseUrl}${audioUrl}`;
            
            const handleEnded = () => {
                setIsPlaying(false);
                if (onEnded) onEnded();
                audioRef.current?.removeEventListener('ended', handleEnded);
            };
            
            audioRef.current.addEventListener('ended', handleEnded);
            audioRef.current.play().catch(e => {
                console.error("Audio playback failed:", e);
                setIsPlaying(false);
                if (onEnded) onEnded();
            });
        }
    }, [mediaBaseUrl]);

    // --- Activity Logic ---
    useEffect(() => {
        if (!wordsData || wordsData.length === 0) return;
        
        if (currentWordIndex >= wordsData.length) {
            setIsActivityFinished(true);
            return;
        }

        const currentWord = wordsData[currentWordIndex];
        
        if (phase === 'word') {
            setCurrentLetterIndex(-1);
            setTimeout(() => {
                playAudio(currentWord.wordAudioUrl, () => {
                    setPhase('letters');
                    setCurrentLetterIndex(0);
                });
            }, 500);
        }
    }, [currentWordIndex, phase, wordsData, playAudio]);

    // --- Letter-by-letter playback ---
    useEffect(() => {
        if (phase !== 'letters' || currentWordIndex >= wordsData.length) return;
        
        const currentWord = wordsData[currentWordIndex];
        
        if (currentLetterIndex >= 0 && currentLetterIndex < currentWord.letters.length) {
            const currentLetter = currentWord.letters[currentLetterIndex];
            
            setTimeout(() => {
                playAudio(currentLetter.audioUrl, () => {
                    if (currentLetterIndex < currentWord.letters.length - 1) {
                        setCurrentLetterIndex(prev => prev + 1);
                    } else {
                        setPhase('transition');
                        setTimeout(() => {
                            setCurrentWordIndex(prev => prev + 1);
                            setPhase('word');
                            setCurrentLetterIndex(-1);
                        }, 1000);
                    }
                });
            }, 800);
        }
    }, [currentLetterIndex, phase, currentWordIndex, wordsData, playAudio]);

    // --- Navigation Functions ---
    const handleNextActivity = () => {
        if (currentActivityIndex < activities.length - 1) {
            setCurrentActivityIndex(prev => prev + 1);
            setCurrentWordIndex(0);
            setCurrentLetterIndex(-1);
            setPhase('word');
            setIsActivityFinished(false);
        } else {
            setIsAllFinished(true);
        }
    };

    const restartAllActivities = () => {
        setCurrentActivityIndex(0);
        setCurrentWordIndex(0);
        setCurrentLetterIndex(-1);
        setPhase('word');
        setIsActivityFinished(false);
        setIsAllFinished(false);
        setIsPlaying(false);
    };

    // --- Render Logic ---
    if (isAllFinished) {
        return (
            <Box textAlign="center" p={4}>
                <Typography variant="h3" gutterBottom color="primary">🎉 வாழ்த்துக்கள்!</Typography>
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>அனைத்து பயிற்சிகளும் முடிந்தன!</Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>நீங்கள் {activities.length} செயல்பாடுகளை வெற்றிகரமாக முடித்துள்ளீர்கள்!</Typography>
                <Button variant="contained" onClick={restartAllActivities} sx={{ mt: 3, px: 4, py: 1.5, fontSize: '1.1rem' }} size="large">மீண்டும் முயற்சி செய்க</Button>
            </Box>
        );
    }

    if (isActivityFinished) {
        return (
            <Box textAlign="center" p={4}>
                <Typography variant="h4" gutterBottom color="success.main">✅ பயிற்சி முடிந்தது!</Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>பயிற்சி {currentActivityIndex + 1} / {activities.length} முடிந்தது</Typography>
                <Button variant="contained" onClick={handleNextActivity} endIcon={<NavigateNextIcon />} sx={{ mt: 3, px: 4, py: 1.5 }} size="large">
                    {currentActivityIndex === activities.length - 1 ? 'முடிவு' : 'அடுத்த பயிற்சி'}
                </Button>
            </Box>
        );
    }

    if (!currentActivity || !wordsData || wordsData.length === 0) {
        return <Box textAlign="center" p={4}><CircularProgress /></Box>;
    }

    const currentWord = wordsData[currentWordIndex];

    // --- தீர்வு: இங்கே பாதுகாப்புச் சோதனையைச் சேர்க்கவும் ---
    // currentWord கிடைக்கவில்லை என்றால், render-ஐத் தொடர்வதைத் தடுக்கவும்.
    // இது கடைசிச் சொல்லுக்குப் பிறகு ஏற்படும் தற்காலிக நிலையைக் கையாளுகிறது.
    if (!currentWord) {
        return <Box textAlign="center" p={4}><CircularProgress /></Box>;
    }

    const currentLetter = currentLetterIndex >= 0 ? currentWord.letters[currentLetterIndex] : null;

    return (
        <Box p={3} textAlign="center" minHeight="400px" display="flex" flexDirection="column" justifyContent="center">
            {/* Title and Description */}
            <Typography variant="h4" gutterBottom>{content.title || 'சொற்கள் கற்றல்'}</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 2 }}>{content.description || 'சொற்களையும் அவற்றின் எழுத்துக்களையும் கேட்டு கற்றுக்கொள்ளுங்கள்'}</Typography>

            {/* Activity Progress */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>பயிற்சி {currentActivityIndex + 1} / {activities.length}: {currentActivity.title || `பயிற்சி ${currentActivityIndex + 1}`}</Typography>
                <LinearProgress variant="determinate" value={((currentActivityIndex + 1) / activities.length) * 100} sx={{ mb: 2, height: 6, borderRadius: 3 }} />
            </Box>

            {/* Word Progress */}
            <Typography variant="body2" color="text.secondary" gutterBottom>சொல் {currentWordIndex + 1} / {wordsData.length}</Typography>

            {/* Main Content Area */}
            <Box sx={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', my: 4 }}>
                {phase === 'word' && (
                    <Box textAlign="center">
                        <Typography variant="h2" sx={{ fontSize: { xs: '3rem', md: '4rem' }, fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                            {currentWord.word}
                        </Typography>
                        {isPlaying && (
                            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                <VolumeUpIcon color="primary" />
                                <Typography variant="body1" color="primary">முழு சொல்லைக் கேளுங்கள்...</Typography>
                            </Box>
                        )}
                    </Box>
                )}

                {phase === 'letters' && currentLetter && (
                    <Box textAlign="center">
                        <Typography variant="h6" color="text.secondary" gutterBottom>எழுத்து எழுத்தாக:</Typography>
                        <Typography variant="h1" sx={{ fontSize: { xs: '4rem', md: '6rem' }, fontWeight: 'bold', color: 'secondary.main', mb: 2 }}>
                            {currentLetter.letter}
                        </Typography>
                        {isPlaying && (
                            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                <VolumeUpIcon color="secondary" />
                                <Typography variant="body1" color="secondary">எழுத்தைக் கேளுங்கள்...</Typography>
                            </Box>
                        )}
                        <Box mt={2}>
                            <Typography variant="body2" color="text.secondary">எழுத்து {currentLetterIndex + 1} / {currentWord.letters.length}</Typography>
                        </Box>
                    </Box>
                )}

                {phase === 'transition' && (
                    <Box textAlign="center">
                        <Typography variant="h5" color="success.main">✅ சொல் முடிந்தது!</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>அடுத்த சொல்லுக்குச் செல்கிறோம்...</Typography>
                    </Box>
                )}
            </Box>

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default WordsLearning;