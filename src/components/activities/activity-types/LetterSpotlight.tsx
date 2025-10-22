import React from 'react';
import { Box, Typography, Paper, Card, CardContent } from '@mui/material';

// --- NEW: Type for Letter Spotlight Activity ---
export interface SpotlightWord {
    text: string;
    imageUrl?: string; // Optional image for the word
    audioUrl?: string; // Optional audio for pronunciation
}

export interface LetterSpotlightContent {
    spotlightLetter: string; // The letter to highlight, e.g., "அ"
    words: SpotlightWord[];
}

interface LetterSpotlightProps {
    content: LetterSpotlightContent;
}

// The HighlightedWord helper component does not need any changes.
const HighlightedWord: React.FC<{ word: string; letter: string }> = ({ word, letter }) => {
    // ... (This component is already perfect)
    const parts = word.split(new RegExp(`(${letter})`, 'gi'));
    return (
        <Typography variant="h4" component="span">
            {parts.map((part, index) =>
                part.toLowerCase() === letter.toLowerCase() ? (
                    <Typography key={index} component="span" variant="h4" color="error" fontWeight="bold">
                        {part}
                    </Typography>
                ) : (
                    part
                )
            )}
        </Typography>
    );
};

const LetterSpotlight: React.FC<LetterSpotlightProps> = ({ content }) => {
    return (
        // The main container is now a flex column to stack items vertically
        <Box p={2} sx={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            
            {/* Top section: The big spotlight letter */}
            <Paper
                elevation={4}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%', // Take full width of the preview area
                    maxWidth: '300px', // But don't get excessively wide on tablets
                    height: '200px', // Adjusted height for a top-down view
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: '16px',
                    mb: 2 // Margin bottom to separate from the words
                }}
            >
                <Typography variant="h1" sx={{ fontSize: '8rem', fontWeight: 'bold' }}>
                    {content.spotlightLetter}
                </Typography>
            </Paper>

            {/* Bottom section: The list of words */}
            <Box display="flex" flexDirection="column" gap={2} width="100%">
                {content.words.map((word, index) => (
                    <Card key={index} variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                            <HighlightedWord
                                word={word.text}
                                letter={content.spotlightLetter}
                            />
                        </CardContent>
                    </Card>
                ))}
            </Box>
            
        </Box>
    );
};

export default LetterSpotlight;