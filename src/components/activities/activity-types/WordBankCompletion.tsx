import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import { WordBankCompletionContent } from '../../../types/activityContentTypes';

interface WordBankProps {
    content: WordBankCompletionContent;
}

// Helper to shuffle the word bank
const shuffleArray = (array: string[]) => [...array].sort(() => Math.random() - 0.5);

const WordBankCompletion: React.FC<WordBankProps> = ({ content }) => {
    // State to hold the user's answers, mapping sentence ID to the chosen word
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [shuffledWordBank, setShuffledWordBank] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);

    // 2. Wrap the handleReset function in useCallback.
    //    It depends on the 'content' prop because it uses 'content.wordBank'.
    const handleReset = useCallback(() => {
        setAnswers({});
        setShuffledWordBank(shuffleArray(content.wordBank));
        setIsComplete(false);
        setSelectedWord(null); // Also reset the selected word
    }, [content]); // Dependency is 'content'

    // 3. Add the now-stable 'handleReset' function to the useEffect dependency array.
    useEffect(() => {
        handleReset();
    }, [content, handleReset]); // The dependency array is now complete.

    const handleCheckAnswers = () => {
        setIsComplete(true);
    };

    const isAllCorrect = content.sentences.every(s => answers[s.id] === s.correctAnswer);
    
    const isWordUsed = (word: string) => Object.values(answers).includes(word);

    const handleWordBankClick = (word: string) => {
        if (isWordUsed(word) || isComplete) return;
        setSelectedWord(word);
    };

    const handleBlankClick = (sentenceId: number) => {
        if (selectedWord && !isComplete) {
            setAnswers(prev => ({...prev, [sentenceId]: selectedWord}));
            setSelectedWord(null);
        }
    };

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif' }}>
            <Typography variant="h6" textAlign="center" mb={2}>{content.title}</Typography>

            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                {content.sentences.map(sentence => (
                     <Box key={sentence.id} display="flex" alignItems="center" my={2} flexWrap="wrap">
                        <Typography variant="body1" component="span">{sentence.prefix}&nbsp;</Typography>
                        <Chip
                            onClick={() => handleBlankClick(sentence.id)}
                            label={answers[sentence.id] || '...........'}
                            sx={{
                                minWidth: '120px', height: '40px', fontSize: '1rem', cursor: 'pointer',
                                border: isComplete ? `2px solid ${answers[sentence.id] === sentence.correctAnswer ? 'green' : 'red'}` : '1px dashed grey',
                                backgroundColor: isComplete ? (answers[sentence.id] === sentence.correctAnswer ? '#e8f5e9' : '#ffebee') : '#eee'
                            }}
                        />
                        <Typography variant="body1" component="span">&nbsp;{sentence.suffix}</Typography>
                    </Box>
                ))}
            </Paper>

            <Typography variant="body1" textAlign="center" mb={1}>Click a word, then click a blank space.</Typography>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {shuffledWordBank.map(word => (
                    <Chip
                        key={word}
                        label={word}
                        onClick={() => handleWordBankClick(word)}
                        disabled={isWordUsed(word) || isComplete}
                        color={selectedWord === word ? 'secondary' : 'primary'}
                        variant={isWordUsed(word) ? 'filled' : 'outlined'}
                        sx={{ fontSize: '1.1rem', cursor: 'pointer' }}
                    />
                ))}
            </Paper>

            <Box textAlign="center" mt={4}>
                {!isComplete ? (
                    <Button variant="contained" onClick={handleCheckAnswers}>Check Answers</Button>
                ) : (
                    <Button variant="outlined" startIcon={<ReplayIcon />} onClick={handleReset}>Try Again</Button>
                )}
            </Box>
            
            {isComplete && (
                 <Typography variant="h6" color={isAllCorrect ? 'success.main' : 'error.main'} textAlign="center" mt={2}>
                    {isAllCorrect ? 'Excellent! All correct.' : 'Some answers are incorrect. Please try again.'}
                </Typography>
            )}
        </Box>
    );
};

export default WordBankCompletion;