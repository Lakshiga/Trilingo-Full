import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { MCQContent, MCQChoice } from '../../../types/activityContentTypes';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface MCQActivityProps {
    content: MCQContent;
}

const MCQActivity: React.FC<MCQActivityProps> = ({ content }) => {
    const [selectedChoiceId, setSelectedChoiceId] = useState<string | number | null>(null);
    const [isAnswered, setIsAnswered] = useState<boolean>(false);

    const handleChoiceClick = (choice: MCQChoice) => {
        if (isAnswered) return; // Prevent changing answer
        setSelectedChoiceId(choice.id);
        setIsAnswered(true);
    };
    
    // Helper to determine the button color after an answer is given
    const getButtonVariant = (choice: MCQChoice): "contained" | "outlined" => {
        if (!isAnswered) return 'outlined';
        if (choice.isCorrect) return 'contained'; // Always highlight the correct answer
        if (selectedChoiceId === choice.id && !choice.isCorrect) return 'contained'; // Highlight the user's wrong choice
        return 'outlined';
    };
    
    const getButtonColor = (choice: MCQChoice): "success" | "error" | "primary" => {
        if (!isAnswered) return 'primary';
        if (choice.isCorrect) return 'success';
        if (selectedChoiceId === choice.id && !choice.isCorrect) return 'error';
        return 'primary';
    };

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif' }}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" component="h2" textAlign="center">
                    {content.question}
                </Typography>
            </Paper>

            <Box display="flex" flexDirection="column" gap={2}>
                {content.choices.map((choice:MCQChoice) => (
                    <Button
                        key={choice.id}
                        variant={getButtonVariant(choice)}
                        color={getButtonColor(choice)}
                        onClick={() => handleChoiceClick(choice)}
                        sx={{ 
                            justifyContent: 'space-between', 
                            textAlign: 'left',
                            padding: '12px 16px',
                            textTransform: 'none' // Keep text normal case
                        }}
                        fullWidth
                    >
                        {choice.text}
                        {isAnswered && choice.isCorrect && <CheckCircleIcon sx={{ ml: 1 }} />}
                        {isAnswered && selectedChoiceId === choice.id && !choice.isCorrect && <CancelIcon sx={{ ml: 1 }} />}
                    </Button>
                ))}
            </Box>
            
            {isAnswered && (
                <Box mt={3} display="flex" justifyContent="center">
                    <Button variant="contained" onClick={() => { setIsAnswered(false); setSelectedChoiceId(null); }}>
                        Try Again
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default MCQActivity;