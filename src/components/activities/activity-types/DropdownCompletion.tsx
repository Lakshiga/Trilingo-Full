import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Button, FormControl, Select, MenuItem, SelectChangeEvent 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import { DropdownCompletionContent, DropdownBlank } from '../../../types/activityContentTypes';

interface DropdownProps {
    content: DropdownCompletionContent;
}

const DropdownCompletion: React.FC<DropdownProps> = ({ content }) => {
    // State to hold user answers, mapping sentence ID to the selected word
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isComplete, setIsComplete] = useState<boolean>(false);

    useEffect(() => {
        handleReset();
    }, [content]);

    const handleReset = () => {
        setAnswers({});
        setIsComplete(false);
    };

    const handleSelectChange = (event: SelectChangeEvent<string>, sentenceId: number) => {
        if (isComplete) return;
        const { value } = event.target;
        setAnswers(prev => ({ ...prev, [sentenceId]: value as string }));
    };

    const handleCheckAnswers = () => {
        setIsComplete(true);
    };

    const isAllCorrect = content.sentences.every(s => answers[s.id] === s.correctAnswer);

    const renderSentence = (sentence: DropdownBlank) => {
        const userAnswer = answers[sentence.id];
        const isCorrect = userAnswer === sentence.correctAnswer;
        
        let selectStyle = {};
        if (isComplete) {
            selectStyle = {
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isCorrect ? 'green' : 'red',
                    borderWidth: '2px'
                },
                backgroundColor: isCorrect ? '#e8f5e9' : '#ffebee'
            };
        }

        return (
            <Box key={sentence.id} display="flex" alignItems="center" my={2.5} flexWrap="wrap">
                <Typography variant="h6" component="span" sx={{ mr: 2 }}>{sentence.prefix}</Typography>
                
                <FormControl variant="outlined" size="small" sx={{ minWidth: 150, ...selectStyle }}>
                    <Select
                        value={userAnswer || ''}
                        onChange={(e) => handleSelectChange(e, sentence.id)}
                        displayEmpty
                        disabled={isComplete}
                    >
                        <MenuItem value="" disabled><em>Select...</em></MenuItem>
                        {sentence.options.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <Typography variant="h6" component="span" sx={{ ml: 2 }}>{sentence.suffix}</Typography>

                {isComplete && (isCorrect ? 
                    <CheckCircleIcon color="success" sx={{ ml: 1 }} /> : 
                    <CancelIcon color="error" sx={{ ml: 1 }} />
                )}
            </Box>
        );
    };
    
    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif' }}>
            <Typography variant="h5" textAlign="center" mb={2}>{content.title}</Typography>

            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                {content.sentences.map(renderSentence)}
            </Paper>
            
            <Box textAlign="center" mt={4}>
                {!isComplete ? (
                    <Button variant="contained" size="large" onClick={handleCheckAnswers}>Check Answers</Button>
                ) : (
                    <Button variant="outlined" size="large" startIcon={<ReplayIcon />} onClick={handleReset}>Try Again</Button>
                )}
            </Box>
            
            {isComplete && (
                 <Typography variant="h5" color={isAllCorrect ? 'success.main' : 'error.main'} textAlign="center" mt={2}>
                    {isAllCorrect ? 'All Correct!' : 'Some answers are incorrect. Please review.'}
                </Typography>
            )}
        </Box>
    );
};

export default DropdownCompletion;