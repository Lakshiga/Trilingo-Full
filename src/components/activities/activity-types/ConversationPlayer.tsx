import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Slider, Stack, Grid } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';

// --- NEW: Type for Conversation Activity ---
export interface ChatMessage {
    speaker: string;      // e.g., "Mani", "Vani"
    avatar?: string;     // Optional URL for a speaker's avatar image
    text: string;         // The dialogue text
    timestamp: number;    // The start time of this line in the audio file (in seconds)
}

export interface ConversationContent {
    title: string;
    audioUrl: string;     // The URL of the full conversation audio file
    messages: ChatMessage[];
}

interface ConversationPlayerProps {
    content: ConversationContent;
}

const ConversationPlayer: React.FC<ConversationPlayerProps> = ({ content }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeMessageIndex, setActiveMessageIndex] = useState<number>(-1);

    // Effect to handle audio time updates
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            // Find the currently spoken message
            const currentMessageIndex = content.messages.findIndex((msg, index) => {
                const nextMsg = content.messages[index + 1];
                return audio.currentTime >= msg.timestamp && (!nextMsg || audio.currentTime < nextMsg.timestamp);
            });
            setActiveMessageIndex(currentMessageIndex);
        };
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [content.messages]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = newValue as number;
            setCurrentTime(newValue as number);
        }
    };

    const handleReplay = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = 0;
            audio.play();
            setIsPlaying(true);
        }
    };

    // Format time from seconds to MM:SS
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Box p={2} sx={{ fontFamily: 'sans-serif', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
                {content.title}
            </Typography>

            {/* Chat Messages Area */}
            <Paper variant="outlined" sx={{ flexGrow: 1, overflowY: 'auto', p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                <Stack spacing={2}>
                    {content.messages.map((message, index) => {
                        const isSender = index % 2 === 0; // Simple logic to alternate sides
                        const isActive = index === activeMessageIndex;
                        return (
                            <Box key={index} display="flex" justifyContent={isSender ? 'flex-start' : 'flex-end'}>
                                <Paper
                                    elevation={isActive ? 6 : 1}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: '20px',
                                        borderTopLeftRadius: isSender ? '5px' : '20px',
                                        borderTopRightRadius: isSender ? '20px' : '5px',
                                        bgcolor: isSender ? 'primary.main' : '#e0e0e0',
                                        color: isSender ? 'white' : 'black',
                                        maxWidth: '75%',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        transform: isActive ? 'scale(1.03)' : 'scale(1)',
                                    }}
                                >
                                    <Typography variant="body1">{message.text}</Typography>
                                </Paper>
                            </Box>
                        );
                    })}
                </Stack>
            </Paper>

            {/* Audio Player Controls */}
            <Paper elevation={4} sx={{ p: 1.5, borderRadius: '16px' }}>
                <audio ref={audioRef} src={content.audioUrl} style={{ display: 'none' }} />
                <Grid container alignItems="center" spacing={2}>
                    <Grid>
                        <IconButton onClick={togglePlayPause}>
                            {isPlaying ? <PauseIcon sx={{ fontSize: 40 }} /> : <PlayArrowIcon sx={{ fontSize: 40 }} />}
                        </IconButton>
                    </Grid>
                    <Grid >
                        <Slider
                            aria-label="time-indicator"
                            size="small"
                            value={currentTime}
                            min={0}
                            step={1}
                            max={duration || 0}
                            onChange={handleSliderChange}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                            <Typography variant="caption">{formatTime(currentTime)}</Typography>
                            <Typography variant="caption">{formatTime(duration)}</Typography>
                        </Box>
                    </Grid>
                    <Grid>
                        <IconButton onClick={handleReplay}>
                            <ReplayIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ConversationPlayer;