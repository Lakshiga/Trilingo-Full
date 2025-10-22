import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import { FirstLetterMatchContent } from '../../../types/activityContentTypes';

// Helper to shuffle an array
const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

interface FirstLetterMatchProps {
    content: FirstLetterMatchContent;
}

const FirstLetterMatch: React.FC<FirstLetterMatchProps> = ({ content }) => {
    const [wordsToFind, setWordsToFind] = useState<string[]>([]);
    const [currentTarget, setCurrentTarget] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    // Initialize or reset the game
    const setupGame = () => {
        setWordsToFind(shuffleArray(content.words));
        setCurrentTarget(null);
        setFeedback(null);
    };

    // Set the first target word when the component mounts
    useEffect(() => {
        setupGame();
    }, [content.words]); // Rerun if the content changes

    // Set the next target word
    useEffect(() => {
        if (wordsToFind.length > 0 && !currentTarget) {
            setCurrentTarget(wordsToFind[0]);
        }
    }, [wordsToFind, currentTarget]);

    const handleWordClick = (word: string) => {
        if (feedback) return; // Don't allow clicks while feedback is shown

        if (word === currentTarget) {
            setFeedback('correct');
            setTimeout(() => {
                // Remove the found word and move to the next one
                const remainingWords = wordsToFind.slice(1);
                setWordsToFind(remainingWords);
                setCurrentTarget(remainingWords[0] || null);
                setFeedback(null);
            }, 1000); // 1-second delay to show feedback
        } else {
            setFeedback('incorrect');
            setTimeout(() => {
                setFeedback(null); // Reset feedback after delay
            }, 1000);
        }
    };

    const firstLetter = currentTarget ? currentTarget.charAt(0) : '';
    const isComplete = wordsToFind.length === 0 && !currentTarget;

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            {isComplete ? (
                <Box>
                    <Typography variant="h5" color="success.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <CheckCircleIcon fontSize="large" /> Excellent! All words found.
                    </Typography>
                    <Button sx={{mt: 3}} variant="contained" startIcon={<ReplayIcon />} onClick={setupGame}>Play Again</Button>
                </Box>
            ) : (
                <>
                    <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: '#f0f4f8' }}>
                        <Typography variant="h6" color="text.secondary">Find the word starting with:</Typography>
                        <Typography variant="h1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                            {firstLetter}
                        </Typography>
                    </Paper>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        {content.words.map(word => {
                            const isFound = !wordsToFind.includes(word);
                            return (
                                <Chip
                                    key={word}
                                    label={word}
                                    onClick={() => handleWordClick(word)}
                                    disabled={isFound}
                                    sx={{ 
                                        fontSize: '1.2rem', 
                                        padding: '20px 10px',
                                        opacity: isFound ? 0.3 : 1,
                                        transition: 'opacity 0.3s'
                                    }}
                                    color={feedback && currentTarget === word ? (feedback === 'correct' ? 'success' : 'error') : 'primary'}
                                    variant={isFound ? 'filled' : 'outlined'}
                                />
                            );
                        })}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default FirstLetterMatch;