// Create this new file: activity-types/WordSplitter.tsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';

// --- Add these types to your activityContentTypes.ts file ---

export interface WordPartChoice {
    id: string; // Unique ID for the draggable word part
    text: string;
}

// Represents a single word-splitting challenge
export interface WordSplitterContent {
    id: number;
    title: string;
    compoundWord: string; // The word to be split, e.g., "மலர்த்தொட்டி"
    choices: WordPartChoice[]; // The pool of draggable word parts
    correctAnswers: [string, string]; // The two correct parts in order
}

interface WordSplitterProps {
    content: WordSplitterContent;
}

const WordSplitter: React.FC<WordSplitterProps> = ({ content }) => {
    // State to hold what's dropped in each slot: { part1: WordChoice | null, part2: WordChoice | null }
    const [droppedParts, setDroppedParts] = useState<Record<string, WordPartChoice | null>>({ part1: null, part2: null });
    
    // State to hold validation status for each slot
    const [validation, setValidation] = useState<Record<string, boolean | null>>({ part1: null, part2: null });

    // Reset state when a new exercise is loaded
    useEffect(() => {
        setDroppedParts({ part1: null, part2: null });
        setValidation({ part1: null, part2: null });
    }, [content.id]);

    const handleDragStart = (e: React.DragEvent, choice: WordPartChoice) => {
        e.dataTransfer.setData('choice', JSON.stringify(choice));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, partKey: 'part1' | 'part2') => {
        e.preventDefault();
        const choiceJSON = e.dataTransfer.getData('choice');
        if (!choiceJSON) return;
        
        const choice: WordPartChoice = JSON.parse(choiceJSON);
        const correctPartIndex = partKey === 'part1' ? 0 : 1;
        const isCorrect = choice.text === content.correctAnswers[correctPartIndex];

        if (isCorrect) {
            setDroppedParts(prev => ({ ...prev, [partKey]: choice }));
            setValidation(prev => ({ ...prev, [partKey]: true }));
        } else {
            // Logic for incorrect drop (e.g., show a temporary error)
            setValidation(prev => ({ ...prev, [partKey]: false }));
            setTimeout(() => setValidation(prev => ({ ...prev, [partKey]: null })), 1000);
        }
    };

    const getDropZoneStyle = (partKey: 'part1' | 'part2') => {
        const isValid = validation[partKey];
        let borderColor = 'grey';
        if (isValid === true) borderColor = '#4caf50'; // Green
        if (isValid === false) borderColor = '#f44336'; // Red
        return { border: `2px dashed ${borderColor}` };
    };

    const isComplete = validation.part1 && validation.part2;
    const usedChoiceIds = Object.values(droppedParts).map(p => p?.id).filter(Boolean);

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>{content.title}</Typography>
            
            {/* Draggable Choices Pool */}
            <Paper elevation={2} sx={{ p: 2, mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                {content.choices.map(choice => (
                    !usedChoiceIds.includes(choice.id) && (
                        <Paper key={choice.id} draggable onDragStart={(e) => handleDragStart(e, choice)} sx={{ p: '8px 16px', cursor: 'grab', backgroundColor: 'secondary.main', color: 'white' }}>
                            <Typography variant="h6">{choice.text}</Typography>
                        </Paper>
                    )
                ))}
            </Paper>

            {/* The Equation Area */}
            <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Paper sx={{ p: '12px 24px', backgroundColor: '#1976d2', color: 'white' }}>
                    <Typography variant="h5">{content.compoundWord}</Typography>
                </Paper>
                <Typography variant="h4">=</Typography>
                <Box onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'part1')} sx={{ ...getDropZoneStyle('part1'), minWidth: 150, minHeight: 60, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {droppedParts.part1 && <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{droppedParts.part1.text}</Typography>}
                </Box>
                <Typography variant="h4">+</Typography>
                <Box onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'part2')} sx={{ ...getDropZoneStyle('part2'), minWidth: 150, minHeight: 60, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {droppedParts.part2 && <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{droppedParts.part2.text}</Typography>}
                </Box>
            </Paper>

            {isComplete && <Alert severity="success" sx={{ mt: 3 }}>மிகவும் சரி! (Correct!)</Alert>}
        </Box>
    );
};

export default WordSplitter;