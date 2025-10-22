// Create this new file: activity-types/TrueFalseQuiz.tsx

import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Button, List, ListItem, ListItemText, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';

// --- Add these types to your activityContentTypes.ts file ---

export interface TrueFalseQuestion {
    id: number;
    statement: string;
    isCorrect: boolean; // True if the statement is correct, false if it is incorrect
}

// Represents a single True/False quiz activity
export interface TrueFalseQuizContent {
    id: number;
    title: string;
    questions: TrueFalseQuestion[];
}

interface TrueFalseQuizProps {
    content: TrueFalseQuizContent;
}

const TrueFalseQuiz: React.FC<TrueFalseQuizProps> = ({ content }) => {
    // State to hold the user's answers: { questionId: boolean (true/false) }
    const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const handleAnswerSelect = (questionId: number, answer: boolean) => {
        if (isSubmitted) return; // Don't allow changes after submission
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setUserAnswers({});
        setIsSubmitted(false);
    };
    
    const allQuestionsAnswered = Object.keys(userAnswers).length === content.questions.length;
    let score = 0;
    if (isSubmitted) {
        content.questions.forEach(q => {
            if (userAnswers[q.id] === q.isCorrect) {
                score++;
            }
        });
    }

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>{content.title}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                சரியாயின் ✔ குறியீட்டையும் பிழையாயின் ✘ குறியீட்டையும் அழுத்துக.
            </Typography>

            <List>
                {content.questions.map((question) => {
                    const userAnswer = userAnswers[question.id];
                    let itemStyle = {};
                    if (isSubmitted) {
                        itemStyle = { backgroundColor: userAnswer === question.isCorrect ? '#e8f5e9' : '#ffebee' };
                    }
                    
                    return (
                        <Paper key={question.id} sx={{ mb: 2, ...itemStyle }}>
                            <ListItem>
                                <ListItemText primary={<Typography variant="h6">{question.statement}</Typography>} />
                                <Box>
                                    <IconButton
                                        color={userAnswer === true ? 'primary' : 'default'}
                                        onClick={() => handleAnswerSelect(question.id, true)}
                                        disabled={isSubmitted}
                                    >
                                        <CheckCircleIcon />
                                    </IconButton>
                                    <IconButton
                                        color={userAnswer === false ? 'secondary' : 'default'}
                                        onClick={() => handleAnswerSelect(question.id, false)}
                                        disabled={isSubmitted}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Box>
                            </ListItem>
                        </Paper>
                    );
                })}
            </List>

            <Box mt={3}>
                {isSubmitted ? (
                    <>
                        <Alert severity="info" sx={{ justifyContent: 'center' }}>
                            Your Score: {score} / {content.questions.length}
                        </Alert>
                        <Button variant="contained" startIcon={<ReplayIcon />} onClick={handleReset} sx={{ mt: 2 }}>
                            Try Again
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!allQuestionsAnswered}
                    >
                        Check Answers
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default TrueFalseQuiz;