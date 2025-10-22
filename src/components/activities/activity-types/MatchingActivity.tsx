import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import { MatchingContent, MatchItem } from '../../../types/activityContentTypes';

interface MatchingActivityProps {
    content: MatchingContent;
}

const MatchingActivity: React.FC<MatchingActivityProps> = ({ content }) => {
    const [selectedA, setSelectedA] = useState<MatchItem | null>(null);
    const [selectedB, setSelectedB] = useState<MatchItem | null>(null);
    const [correctPairs, setCorrectPairs] = useState<string[]>([]); // Stores IDs of correctly matched items

    // This effect checks for a match whenever the user selects one item from each column
    useEffect(() => {
        if (selectedA && selectedB) {
            if (selectedA.matchId === selectedB.id) {
                // Correct match!
                setCorrectPairs(prev => [...prev, selectedA.id, selectedB.id]);
            }
            // Reset selections after a short delay to give user feedback
            setTimeout(() => {
                setSelectedA(null);
                setSelectedB(null);
            }, 300);
        }
    }, [selectedA, selectedB]);

    const handleItemClick = (item: MatchItem, column: 'A' | 'B') => {
        // Don't allow clicking an already matched item
        if (correctPairs.includes(item.id)) return;

        if (column === 'A') {
            setSelectedA(item);
        } else {
            setSelectedB(item);
        }
    };
    
    const isComplete = correctPairs.length === content.columnA.length + content.columnB.length;

    const handleReset = () => {
        setSelectedA(null);
        setSelectedB(null);
        setCorrectPairs([]);
    };

    // Helper function to render a single item button
    const renderItem = (item: MatchItem, column: 'A' | 'B', isSelected: boolean) => {
        const isCorrect = correctPairs.includes(item.id);
        
        let variant: "contained" | "outlined" = "outlined";
        if (isCorrect) variant = "contained";
        else if (isSelected) variant = "contained";
        
        let color: "success" | "primary" = "primary";
        if(isCorrect) color = "success";

        return (
            <Button
                key={item.id}
                variant={variant}
                color={color}
                onClick={() => handleItemClick(item, column)}
                disabled={isCorrect}
                fullWidth
                sx={{ 
                    my: 1, 
                    height: '60px', 
                    textTransform: 'none',
                    justifyContent: 'center',
                    fontSize: '1rem',
                }}
            >
                {item.content}
            </Button>
        );
    }

    return (
        <Box p={2} sx={{ fontFamily: 'sans-serif' }}>
            {content.title && (
                <Typography variant="h6" textAlign="center" mb={3}>{content.title}</Typography>
            )}

            <Grid container spacing={4} justifyContent="center" alignItems="center">
                {/* Column A */}
                <Grid size={{xs:5}} >
                    {content.columnA.map(item => renderItem(item, 'A', selectedA?.id === item.id))}
                </Grid>
                {/* Column B */}
                <Grid size={{xs:5}}>
                    {content.columnB.map(item => renderItem(item, 'B', selectedB?.id === item.id))}
                </Grid>
            </Grid>

            {isComplete && (
                <Box textAlign="center" mt={4}>
                    <Typography variant="h5" color="success.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <CheckCircleIcon /> All Matched!
                    </Typography>
                </Box>
            )}
            
             <Box textAlign="center" mt={4}>
                <Button variant="outlined" startIcon={<ReplayIcon />} onClick={handleReset}>
                    Reset
                </Button>
            </Box>
        </Box>
    );
};

export default MatchingActivity;