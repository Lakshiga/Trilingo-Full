import React, { useState, useRef } from 'react';
import { Box, Typography, Grid, Button, Card, CardContent } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ReplayIcon from '@mui/icons-material/Replay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// --- Type definitions for Letters Display Activity ---
export interface TamilVowel {
    id: number;
    letter: string;        // The Tamil vowel character, e.g., "அ"
    romanization: string;  // Roman equivalent, e.g., "a"
    audioUrl: string;      // Audio file for pronunciation
}

export interface LettersDisplayContent {
    title: string;
    description?: string;
    vowels: TamilVowel[];  // Should contain all 12 vowels
    introAudioUrl?: string; // Optional intro audio
}

interface LettersDisplayProps {
    content: LettersDisplayContent;
}

const LettersDisplay: React.FC<LettersDisplayProps> = ({ content }) => {
    const [playingVowelId, setPlayingVowelId] = useState<number | null>(null);
    const [playedVowels, setPlayedVowels] = useState<number[]>([]);
    const [currentSequenceIndex, setCurrentSequenceIndex] = useState<number>(0);
    const [isSequencePlaying, setIsSequencePlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';

    const getFullUrl = (url: string) => {
        if (url.startsWith('http')) return url;
        return `${mediaBaseUrl}/${url}`;
    };

    const playAudio = (audioUrl: string, vowelId: number) => {
        if (audioRef.current) {
            audioRef.current.src = getFullUrl(audioUrl);
            setPlayingVowelId(vowelId);

            audioRef.current.play()
                .then(() => {
                    // Mark as played if not already
                    if (!playedVowels.includes(vowelId)) {
                        setPlayedVowels(prev => [...prev, vowelId]);
                    }
                })
                .catch(e => {
                    console.error('Error playing audio:', e);
                    setPlayingVowelId(null);
                });

            audioRef.current.onended = () => {
                setPlayingVowelId(null);
            };
        }
    };

    const handleVowelClick = (vowel: TamilVowel) => {
        playAudio(vowel.audioUrl, vowel.id);
    };

    const playSequence = async () => {
        if (isSequencePlaying) return;

        setIsSequencePlaying(true);
        setCurrentSequenceIndex(0);

        for (let i = 0; i < content.vowels.length; i++) {
            setCurrentSequenceIndex(i);
            const vowel = content.vowels[i];

            await new Promise((resolve) => {
                if (audioRef.current) {
                    audioRef.current.src = getFullUrl(vowel.audioUrl);
                    setPlayingVowelId(vowel.id);

                    audioRef.current.play().catch(e => console.error('Error playing audio:', e));

                    audioRef.current.onended = () => {
                        setPlayingVowelId(null);
                        // Mark as played
                        if (!playedVowels.includes(vowel.id)) {
                            setPlayedVowels(prev => [...prev, vowel.id]);
                        }
                        setTimeout(resolve, 500); // Small pause between vowels
                    };
                }
            });
        }

        setIsSequencePlaying(false);
        setCurrentSequenceIndex(-1);
    };

    const handleReset = () => {
        setPlayedVowels([]);
        setPlayingVowelId(null);
        setCurrentSequenceIndex(0);
        setIsSequencePlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Arrange vowels in 3 rows (4 vowels per row)
    const arrangeInRows = (vowels: TamilVowel[]) => {
        const rows = [];
        for (let i = 0; i < vowels.length; i += 4) {
            rows.push(vowels.slice(i, i + 4));
        }
        return rows;
    };

    const vowelRows = arrangeInRows(content.vowels);
    const allVowelsPlayed = playedVowels.length === content.vowels.length;

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary.main">
                {content.title}
            </Typography>

            {content.description && (
                <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                    {content.description}
                </Typography>
            )}

            {/* Control buttons */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    onClick={playSequence}
                    disabled={isSequencePlaying}
                    color="primary"
                >
                    {isSequencePlaying ? 'Playing Sequence...' : 'Play All Vowels'}
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<ReplayIcon />}
                    onClick={handleReset}
                    disabled={isSequencePlaying}
                >
                    Reset
                </Button>
            </Box>

            {/* Progress indicator */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    Progress: {playedVowels.length} / {content.vowels.length} vowels learned
                </Typography>
                {allVowelsPlayed && (
                    <Typography variant="h6" color="success.main" sx={{ mt: 1 }}>
                        🎉 Excellent! You've learned all Tamil vowels!
                    </Typography>
                )}
            </Box>

            {/* Tamil Vowels Grid - 3 rows */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {vowelRows.map((row, rowIndex) => (
                    <Grid container spacing={2} key={rowIndex} sx={{ mb: 2, justifyContent: 'center' }}>
                        {row.map((vowel) => {
                            const isPlaying = playingVowelId === vowel.id;
                            const isPlayed = playedVowels.includes(vowel.id);
                            const isCurrentInSequence = isSequencePlaying && currentSequenceIndex === content.vowels.findIndex(v => v.id === vowel.id);

                            return (
                                <Grid size={{ xs: 3 }} key={vowel.id}>
                                    <Card
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            backgroundColor: isCurrentInSequence
                                                ? '#2196F3'
                                                : isPlaying
                                                    ? '#1976D2'
                                                    : isPlayed
                                                        ? '#E8F5E8'
                                                        : '#FAFAFA',
                                            border: isCurrentInSequence || isPlaying
                                                ? '3px solid #1976D2'
                                                : isPlayed
                                                    ? '2px solid #4CAF50'
                                                    : '2px solid #E0E0E0',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                backgroundColor: isCurrentInSequence || isPlaying
                                                    ? '#1976D2'
                                                    : '#F0F0F0',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            },
                                            // Pulsing animation for currently playing
                                            ...(isPlaying && {
                                                animation: 'pulse 1s infinite',
                                                '@keyframes pulse': {
                                                    '0%': { transform: 'scale(1)' },
                                                    '50%': { transform: 'scale(1.05)' },
                                                    '100%': { transform: 'scale(1)' },
                                                },
                                            }),
                                        }}
                                        onClick={() => !isSequencePlaying && handleVowelClick(vowel)}
                                    >
                                        <CardContent sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            p: 1,
                                            '&:last-child': { pb: 1 }
                                        }}>
                                            <Typography
                                                variant="h3"
                                                component="div"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: isCurrentInSequence || isPlaying ? 'white' : 'primary.main',
                                                    mb: 1
                                                }}
                                            >
                                                {vowel.letter}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: isCurrentInSequence || isPlaying ? 'white' : 'text.secondary',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {vowel.romanization}
                                            </Typography>
                                            {isPlaying && (
                                                <VolumeUpIcon
                                                    sx={{
                                                        color: 'white',
                                                        fontSize: '1rem',
                                                        mt: 0.5
                                                    }}
                                                />
                                            )}
                                            {isPlayed && !isPlaying && !isCurrentInSequence && (
                                                <Typography sx={{ color: '#4CAF50', fontSize: '0.8rem', mt: 0.5 }}>
                                                    ✓
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                ))}
            </Box>

            {/* Instructions */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    உயிர் எழுத்துக்களை அழுத்தி உச்சரிப்பைக் கேளுங்கள் (Click on vowels to hear pronunciation)
                </Typography>
            </Box>

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default LettersDisplay;
