// Create this new file: activity-types/DragDropFillInBlank.tsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

// --- Add these types to your activityContentTypes.ts file ---

export interface WordChoice {
    id: string; // A unique identifier for the draggable element, e.g., "choice-1a"
    text: string;
}

// This is the main content type for the component, representing a single exercise.
export interface DragDropFillInBlankContent {
    id: number;
    title: string;
    // The text is split into two parts, with the blank space in between.
    promptParts: [string, string];
    choices: WordChoice[];
    correctAnswer: string; // The text of the correct choice
}

interface DragDropFillInBlankProps {
    content: DragDropFillInBlankContent;
}

const DragDropFillInBlank: React.FC<DragDropFillInBlankProps> = ({ content }) => {
    const [droppedItem, setDroppedItem] = useState<WordChoice | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isDropZoneActive, setIsDropZoneActive] = useState<boolean>(false);

    // Reset the state when a new challenge is loaded
    useEffect(() => {
        setDroppedItem(null);
        setIsCorrect(null);
    }, [content.id]);

    const handleDragStart = (e: React.DragEvent, choice: WordChoice) => {
        e.dataTransfer.setData('choice', JSON.stringify(choice));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDropZoneActive(true);
    };

    const handleDragLeave = () => {
        setIsDropZoneActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const choiceJSON = e.dataTransfer.getData('choice');
        if (choiceJSON) {
            const choice: WordChoice = JSON.parse(choiceJSON);
            setDroppedItem(choice);
            setIsCorrect(choice.text === content.correctAnswer);
        }
        setIsDropZoneActive(false);
    };

    const getDropZoneStyle = () => {
        let style: React.CSSProperties = {
            border: `2px dashed grey`,
            transition: 'background-color 0.3s, border-color 0.3s',
        };
        if (isDropZoneActive) {
            style.backgroundColor = '#e3f2fd'; // Light blue when dragging over
        }
        if (isCorrect === true) {
            style.borderColor = '#4caf50'; // Green border for correct
            style.backgroundColor = '#e8f5e9';
        } else if (isCorrect === false) {
            style.borderColor = '#f44336'; // Red border for incorrect
            style.backgroundColor = '#ffebee';
        }
        return style;
    };

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>{content.title}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                சரியான சொல்லை இழுத்து ખાલી இடத்தில் விடவும் (Drag the correct word into the blank space)
            </Typography>

            {/* The Sentence/Prompt Area */}
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                    minHeight: '80px'
                }}
            >
                <Typography variant="h5">{content.promptParts[0]}</Typography>
                <Box
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    sx={{
                        minWidth: '150px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        ...getDropZoneStyle(),
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {droppedItem ? droppedItem.text : '...........'}
                    </Typography>
                </Box>
                <Typography variant="h5">{content.promptParts[1]}</Typography>
            </Paper>

            {/* Draggable Choices */}
            <Typography variant="h6" mb={2}>Choices</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {content.choices.map(choice => (
                    <Paper
                        key={choice.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, choice)}
                        sx={{
                            p: '10px 20px',
                            cursor: 'grab',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:active': { cursor: 'grabbing' },
                        }}
                    >
                        <Typography variant="h6">{choice.text}</Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default DragDropFillInBlank;