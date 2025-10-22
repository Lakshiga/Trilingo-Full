// Create this new file: activity-types/DragDropWordMatch.tsx

import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Grid, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- Add these types to your activityContentTypes.ts file ---

// Represents a draggable word (the "source")
export interface WordSource {
    id: number;
    text: string;
    // The id of the WordTarget that this word correctly matches
    matchId: number; 
}

// Represents a static word (the "target")
export interface WordTarget {
    id: number;
    text: string;
}

export interface DragDropWordMatchContent {
    title: string;
    // The title for the static column (e.g., "Written Words")
    targetTitle: string; 
    // The title for the draggable column (e.g., "Spoken Words")
    sourceTitle: string;
    targets: WordTarget[];
    sources: WordSource[];
}

interface DragDropWordMatchProps {
    content: DragDropWordMatchContent;
}

const DragDropWordMatch: React.FC<DragDropWordMatchProps> = ({ content }) => {
    const [draggedItem, setDraggedItem] = useState<WordSource | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Record<number, number>>({}); // { targetId: sourceId }
    const [error, setError] = useState<boolean>(false);

    const shuffledSources = useMemo(() => {
        return [...content.sources].sort(() => Math.random() - 0.5);
    }, [content.sources]);

    const handleDragStart = (e: React.DragEvent, source: WordSource) => {
        setDraggedItem(source);
        e.dataTransfer.setData('sourceId', source.id.toString());
        setError(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent, targetId: number) => {
        e.preventDefault();
        if (!draggedItem) return;

        // Prevent dropping on an already matched target
        if (Object.keys(matchedPairs).map(Number).includes(targetId)) {
            return;
        }

        // Check if the dragged item's matchId corresponds to the target's id
        if (draggedItem.matchId === targetId) {
            setMatchedPairs(prev => ({ ...prev, [targetId]: draggedItem.id }));
        } else {
            setError(true);
            setTimeout(() => setError(false), 1500);
        }
        setDraggedItem(null);
    };

    const isComplete = Object.keys(matchedPairs).length === content.targets.length;

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>{content.title}</Typography>
            
            {isComplete ? (
                <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>சரியாகப் பொருத்திவிட்டீர்கள்! (Matched Correctly!)</Alert>
            ) : error && (
                <Alert severity="error">தவறான பொருத்தம். (Incorrect Match.)</Alert>
            )}

            <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
                {/* Column for Targets (Drop Zones) */}
                <Grid  size={{xs:12,md:5}}>
                    <Typography variant="h6" mb={2}>{content.targetTitle}</Typography>
                    {content.targets.map(target => (
                        <Paper
                            key={target.id}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, target.id)}
                            sx={{
                                p: 2,
                                mb: 2,
                                minHeight: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                border: '2px dashed #ccc',
                                backgroundColor: matchedPairs[target.id] ? '#e8f5e9' : '#fafafa',
                            }}
                        >
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'left' }}>{target.text}</Typography>
                            {matchedPairs[target.id] && (
                                <Paper elevation={2} sx={{ p: 1, backgroundColor: 'primary.light', color: 'white' }}>
                                    <Typography>{content.sources.find(s => s.id === matchedPairs[target.id])?.text}</Typography>
                                </Paper>
                            )}
                        </Paper>
                    ))}
                </Grid>

                {/* Column for Sources (Draggable Items) */}
                <Grid size={{xs:12,md:5}}>
                    <Typography variant="h6" mb={2}>{content.sourceTitle}</Typography>
                    {shuffledSources.map(source => {
                        const isMatched = Object.values(matchedPairs).includes(source.id);
                        if (isMatched) return null; // Hide if already matched

                        return (
                            <Paper
                                key={source.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, source)}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    cursor: 'grab',
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    opacity: draggedItem?.id === source.id ? 0.5 : 1,
                                }}
                            >
                                <Typography variant="h6">{source.text}</Typography>
                            </Paper>
                        );
                    })}
                </Grid>
            </Grid>
        </Box>
    );
};

export default DragDropWordMatch;