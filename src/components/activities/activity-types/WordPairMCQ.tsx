import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// --- COLOCATED TYPES ---
export interface WordPairQuestion {
    id: number;
    promptAudioUrl: string; 
    choices: [string, string];
    correctAnswer: string;
}

// This is the top-level structure.
// The ActivityPlayerModal will loop through the 'questions' array.
export interface WordPairMCQContent {
    title: string;
    questions: WordPairQuestion[];
}

// --- PROPS INTERFACE ---
// The component receives the full WordPairMCQContent structure.
interface WordPairProps {
    content: WordPairMCQContent;
}

const WordPairMCQ: React.FC<WordPairProps> = ({ content }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentQuestion = content.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === content.questions.length - 1;

    // Reset state when question changes
    useEffect(() => {
        setUserAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
    }, [currentQuestionIndex]);

    const playAudio = () => {
        if (audioRef.current && currentQuestion) {
            audioRef.current.play().catch(e => console.error(e));
        }
    };

    const handleAnswer = (choice: string) => {
        if (userAnswer || showResult) return; // Already answered or showing result
        setUserAnswer(choice);
        const correct = choice === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setShowResult(true);
    };

    const handleReset = () => {
        setUserAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            // Activity completed
            return;
        }
        setCurrentQuestionIndex(prev => prev + 1);
    };

    return (
        <Box p={2} textAlign="center">
            <audio ref={audioRef} src={currentQuestion.promptAudioUrl} />
            <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6">Listen and choose the correct word:</Typography>
                <IconButton onClick={playAudio}><VolumeUpIcon fontSize="large" color="primary" /></IconButton>
            </Paper>

            <Box display="flex" justifyContent="space-around" alignItems="center">
                {currentQuestion.choices.map((choice: string) => {
                    const isSelected = userAnswer === choice;
                    const isCorrectChoice = choice === currentQuestion.correctAnswer;
                    let color: "success" | "error" | "primary" = "primary";
                    if (showResult) {
                        color = isCorrectChoice ? "success" : (isSelected ? "error" : "primary");
                    } else if (isSelected) {
                        color = "primary";
                    }

                    return (
                        <Button
                            key={choice}
                            variant={showResult ? 'contained' : (isSelected ? 'contained' : 'outlined')}
                            color={color}
                            onClick={() => handleAnswer(choice)}
                            disabled={showResult && !isCorrect}
                            sx={{ fontSize: '2rem', padding: '20px 40px', textTransform: 'none', minWidth: '180px' }}
                        >
                            {choice}
                            {showResult && isSelected && isCorrectChoice && <CheckCircleIcon sx={{ ml: 2 }} />}
                            {showResult && isSelected && !isCorrectChoice && <CancelIcon sx={{ ml: 2 }} />}
                        </Button>
                    );
                })}
            </Box>

            {showResult && (
                <Box mt={3}>
                    {isCorrect ? (
                        <Typography variant="h6" color="success.main">
                            ✓ சரியான பதில்! {isLastQuestion ? 'செயல்பாடு முடிந்தது!' : 'அடுத்த கேள்விக்குச் செல்லவும்.'}
                        </Typography>
                    ) : (
                        <Box>
                            <Typography variant="h6" color="error.main">
                                ✗ தவறான பதில். சரியான பதில்: {currentQuestion.correctAnswer}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleReset}
                                sx={{ mt: 2, mr: 2 }}
                            >
                                மீண்டும் முயலவும்
                            </Button>
                        </Box>
                    )}

                    {isCorrect && !isLastQuestion && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            sx={{ mt: 2 }}
                        >
                            அடுத்த கேள்வி
                        </Button>
                    )}
                </Box>
            )}

            {!showResult && userAnswer && (
                <Typography variant="h6" color="primary.main" mt={3}>
                    பதிலைத் தேர்ந்தெடுக்கவும்
                </Typography>
            )}
        </Box>
    );
};

export default WordPairMCQ;