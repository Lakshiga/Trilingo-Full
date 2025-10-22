import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Card, CardMedia, Grid, IconButton, Button, CircularProgress } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// --- புதிய JSON வடிவமைப்பிற்கான TypeScript வகைகள் ---

// ஒரு தேர்வுக்கான (option) வகை
export interface OptionItem {
    id: number;
    letter: string;
    imageUrl: string;
}

// ஒரு கேள்விக்கான வகை
export interface QuestionItem {
    id: number;
    questionAudioUrl: string;
    correctAnswerId: number;
    options: OptionItem[];
}

// Content type for the activity data
export interface LetterSoundMcqContent {
    title?: string;
    description?: string;
    questions: QuestionItem[];
}

// இந்த கூறின் props-ன் வகை
interface LetterSoundMcqProps {
    content: LetterSoundMcqContent;
}

const LetterSoundMcq: React.FC<LetterSoundMcqProps> = ({ content }) => {
    const activityData = content.questions;
    // --- State Management ---
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentOptions, setCurrentOptions] = useState<OptionItem[]>([]);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';

    // --- Audio Playback ---
    const playAudio = useCallback((audioUrl: string) => {
        if (audioUrl && audioRef.current) {
            audioRef.current.src = `${mediaBaseUrl}${audioUrl}`;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    }, [mediaBaseUrl]);

    // --- Game Logic (புதிய JSON-க்கு ஏற்ப மாற்றப்பட்டது) ---
    useEffect(() => {
        if (!activityData || activityData.length === 0) return;

        if (currentQuestionIndex >= activityData.length) {
            setIsFinished(true);
            return;
        }

        const currentQuestion = activityData[currentQuestionIndex];
        
        // பதில்களைக் கலைத்து state-ல் சேமித்தல்
        const shuffledOptions = [...currentQuestion.options].sort(() => 0.5 - Math.random());
        setCurrentOptions(shuffledOptions);
        
        // பழைய நிலைகளை மீட்டமைத்தல் (Resetting old states)
        setIsAnswered(false);
        setSelectedOptionId(null);

        // கேள்விக்கான ஒலியை இயக்குதல்
        playAudio(currentQuestion.questionAudioUrl);

    }, [currentQuestionIndex, activityData, playAudio]);

    // --- User Interaction (புதிய JSON-க்கு ஏற்ப மாற்றப்பட்டது) ---
    const handleOptionClick = (selectedOption: OptionItem) => {
        if (isAnswered) return;

        setIsAnswered(true);
        setSelectedOptionId(selectedOption.id);
        
        const currentQuestion = activityData[currentQuestionIndex];

        if (selectedOption.id === currentQuestion.correctAnswerId) {
            setScore(prevScore => prevScore + 1);
            // வேண்டுமானால் சரியான பதிலுக்கான ஒலியை இங்கே இயக்கலாம்
        } else {
            // வேண்டுமானால் தவறான பதிலுக்கான ஒலியை இங்கே இயக்கலாம்
        }

        setTimeout(() => {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }, 1500); // 1.5 வினாடிக்குப் பிறகு அடுத்த கேள்வி
    };
    
    // --- Restart Game ---
    const restartGame = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsFinished(false);
    };

    // --- Render Logic ---
    if (isFinished) {
        return (
            <Box textAlign="center" p={4}>
                <Typography variant="h4" gutterBottom>விளையாட்டு முடிந்தது!</Typography>
                <Typography variant="h5">உங்கள் இறுதி மதிப்பெண்: {score} / {activityData.length}</Typography>
                <Button variant="contained" onClick={restartGame} sx={{ mt: 3 }}>மீண்டும் விளையாடு</Button>
            </Box>
        );
    }
    
    if (currentOptions.length === 0 || !activityData || currentQuestionIndex >= activityData.length) {
        return <Box textAlign="center" p={4}><CircularProgress /></Box>;
    }

    const currentQuestion = activityData[currentQuestionIndex];
    
    if (!currentQuestion) {
        return <Box textAlign="center" p={4}><CircularProgress /></Box>;
    }

    return (
        <Box p={3} textAlign="center">
            <Typography variant="h4" gutterBottom>{content.title || 'செயல் 04'}</Typography>
            <Typography variant="h6" gutterBottom>{content.description || 'சரியான படத்தைத் தேர்ந்தெடு'}</Typography>
            
            <Box my={2}>
                <IconButton onClick={() => playAudio(currentQuestion.questionAudioUrl)} color="primary">
                    <VolumeUpIcon fontSize="large" />
                </IconButton>
            </Box>

            <Grid container spacing={3} justifyContent="center">
                {currentOptions.map((option) => {
                    const isCorrect = option.id === currentQuestion.correctAnswerId;
                    const isSelected = option.id === selectedOptionId;

                    return (
                       <Grid size={{ xs: 6, sm: 4, md: 3 }} key={option.id}>
                            <Card
                                onClick={() => handleOptionClick(option)}
                                sx={{
                                    cursor: isAnswered ? 'default' : 'pointer',
                                    border: isAnswered && isCorrect ? '3px solid green' : (isSelected && !isCorrect ? '3px solid red' : 'none'),
                                    transform: isAnswered && isCorrect ? 'scale(1.05)' : 'none',
                                    transition: 'transform 0.2s, border 0.2s',
                                    position: 'relative'
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={`${mediaBaseUrl}${option.imageUrl}`}
                                    alt={option.letter}
                                    sx={{ objectFit: 'contain', p: 2, opacity: isAnswered && !isCorrect ? 0.5 : 1 }}
                                />
                                {isAnswered && (
                                    <Box sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white', borderRadius: '50%' }}>
                                        {isCorrect && <CheckCircleIcon color="success" fontSize="large" />}
                                        {isSelected && !isCorrect && <CancelIcon color="error" fontSize="large" />}
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default LetterSoundMcq;