import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert, Button } from '@mui/material';

// --- Add these types to your activityContentTypes.ts file ---
// (Keeping them here for standalone use; move to your shared types file if preferred)

export interface WordChoice {
    id: string; // A unique ID for the draggable word
    text: string;
}

// Defines a segment of the prompt, which can be either text or a blank
export interface PromptSegment {
    type: 'text' | 'blank';
    content: string; // The text itself, or the unique ID for the blank
}

// The main content type for the multi-blank component
export interface MultiDragDropFillInBlankContent {
    id: number;
    title: string;
    promptSegments: PromptSegment[];
    choices: WordChoice[];
    // A map where the key is the blank's ID and the value is the correct answer text
    correctAnswers: Record<string, string>;
}

interface MultiDragDropFillInBlankProps {
    content: MultiDragDropFillInBlankContent;
}

const MultiDragDropFillInBlank: React.FC<MultiDragDropFillInBlankProps> = ({ content }) => {
    // Stores which word is in which blank: { blankId: WordChoice }
    const [droppedItems, setDroppedItems] = useState<Record<string, WordChoice>>({});
    // Stores the IDs of choices that have been used
    const [usedChoiceIds, setUsedChoiceIds] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    // Reset state when a new exercise is loaded
    useEffect(() => {
        setDroppedItems({});
        setUsedChoiceIds([]);
        setIsComplete(false);
    }, [content.id]);

    // Check for completion whenever the dropped items change
    useEffect(() => {
        const blankIds = content.promptSegments
            .filter(s => s.type === 'blank')
            .map(s => s.content);
        if (Object.keys(droppedItems).length !== blankIds.length) {
            setIsComplete(false);
            return;
        }

        let allCorrect = true;
        for (const blankId of blankIds) {
            if (droppedItems[blankId]?.text !== content.correctAnswers[blankId]) {
                allCorrect = false;
                break;
            }
        }
        setIsComplete(allCorrect);
    }, [droppedItems, content]);

    const handleDragStart = (e: React.DragEvent, choice: WordChoice) => {
        e.dataTransfer.setData('choice', JSON.stringify(choice));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, blankId: string) => {
        e.preventDefault();
        const choiceJSON = e.dataTransfer.getData('choice');
        if (!choiceJSON) return;
        
        const choice: WordChoice = JSON.parse(choiceJSON);

        // If this choice is already used in another blank, do nothing (prevent duplicates).
        // (We intentionally don't allow dragging from an already-filled blank — only pool items are draggable.)
        if (usedChoiceIds.includes(choice.id) && !droppedItems[blankId]) return;

        // If a word is already in this blank, return that word to the pool (remove from used)
        const oldItemInBlank = droppedItems[blankId];
        const newUsedChoiceIds = [...usedChoiceIds];
        if (oldItemInBlank) {
            const index = newUsedChoiceIds.indexOf(oldItemInBlank.id);
            if (index > -1) newUsedChoiceIds.splice(index, 1);
        }

        setDroppedItems(prev => ({ ...prev, [blankId]: choice }));
        setUsedChoiceIds(prev => {
            // ensure we don't duplicate
            if (!prev.includes(choice.id)) return [...newUsedChoiceIds, choice.id];
            return newUsedChoiceIds;
        });
    };

    // Called when answers were wrong and learner presses "Try Again".
    // This returns only the incorrect words back to the pool so they can reattempt.
    const handleTryAgain = () => {
        const blankIds = content.promptSegments
            .filter(s => s.type === 'blank')
            .map(s => s.content);

        const newDropped = { ...droppedItems };
        const newUsed = [...usedChoiceIds];

        for (const blankId of blankIds) {
            const placed = newDropped[blankId];
            if (placed && placed.text !== content.correctAnswers[blankId]) {
                // remove from dropped (return to pool)
                delete newDropped[blankId];
                const idx = newUsed.indexOf(placed.id);
                if (idx > -1) newUsed.splice(idx, 1);
            }
        }

        setDroppedItems(newDropped);
        setUsedChoiceIds(newUsed);
        setIsComplete(false);
    };

    // Full reset (optional)
    const handleReset = () => {
        setDroppedItems({});
        setUsedChoiceIds([]);
        setIsComplete(false);
    };

    const blankIds = content.promptSegments.filter(s => s.type === 'blank').map(s => s.content);
    const allFilled = Object.keys(droppedItems).length === blankIds.length;
    const showWrong = allFilled && !isComplete;

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h4" component="h1">{content.title}</Typography>
                {/* Small reset button available if you want to clear everything */}
                <Button size="small" onClick={handleReset}>Reset</Button>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                சரியான சொற்களை இழுத்து இடைவெளிகளை நிரப்படுக (Drag the correct words to fill the blanks)
            </Typography>

            {/* The Sentence/Prompt Area */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1, minHeight: '80px' }}>
                {content.promptSegments.map((segment, index) =>
                    segment.type === 'text' ? (
                        <Typography key={index} variant="h5">{segment.content}</Typography>
                    ) : (
                        (() => {
                            const placed = droppedItems[segment.content];
                            const isBlankCorrect = placed && placed.text === content.correctAnswers[segment.content];
                            const isBlankIncorrect = placed && placed.text !== content.correctAnswers[segment.content];

                            const borderColor = isComplete && isBlankCorrect
                                ? '#4caf50'
                                : (showWrong && isBlankIncorrect ? '#f44336' : 'grey');

                            const bgColor = isComplete && isBlankCorrect
                                ? '#e8f5e9'
                                : (showWrong && isBlankIncorrect ? '#ffebee' : (placed ? '#e3f2fd' : 'transparent'));

                            return (
                                <Box
                                    key={index}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, segment.content)}
                                    sx={{
                                        minWidth: '150px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: `2px dashed ${borderColor}`,
                                        backgroundColor: bgColor,
                                        transition: 'background-color 0.2s, border-color 0.2s',
                                    }}
                                >
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {placed?.text || '...........'}
                                    </Typography>
                                </Box>
                            );
                        })()
                    )
                )}
            </Paper>

            {/* Draggable Choices Pool */}
            <Typography variant="h6" mb={2}>Choices</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', minHeight: '60px', mb: 2 }}>
                {content.choices.filter(choice => !usedChoiceIds.includes(choice.id)).map(choice => (
                    <Paper
                        key={choice.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, choice)}
                        sx={{ p: '10px 20px', cursor: 'grab', backgroundColor: 'secondary.main', color: 'white' }}
                    >
                        <Typography variant="h6">{choice.text}</Typography>
                    </Paper>
                ))}
            </Box>

            {/* Wrong / Correct Feedback */}
            {showWrong && (
                <Box mt={2}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        சில பதில்கள் தவறாக உள்ளன — தயவுசெய்து தவறான சொற்களை சரி செய்யவும்.
                    </Alert>
                    <Button variant="contained" onClick={handleTryAgain}>
                        மீண்டும் முயற்சி செய்
                    </Button>
                </Box>
            )}

            {isComplete && (
                <Box mt={3}>
                    <Alert severity="success">
                        மிகச் சரி! நீங்கள் இறுதி செய்தீர்கள் — வாழ்த்துகள்!
                    </Alert>
                    {/* Per your request: do not prompt to do it again here — we only wish them. */}
                </Box>
            )}
        </Box>
    );
};

export default MultiDragDropFillInBlank;
