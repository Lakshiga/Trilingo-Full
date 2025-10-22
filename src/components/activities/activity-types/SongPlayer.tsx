import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Slider, Avatar } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';

// --- NEW: Type for Song Player Activity ---
export interface LyricLine {
    text: string;       // The lyric line
    timestamp: number;  // The time in seconds when this line starts
}

export interface SongContent {
    title: string;
    artist?: string;    // Optional artist name
    albumArtUrl?: string; // Optional URL for album art
    audioUrl: string;   // The URL of the full song audio file
    lyrics: LyricLine[];
}

interface SongPlayerProps {
    content: SongContent;
}

const SongPlayer: React.FC<SongPlayerProps> = ({ content }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const activeLyricRef = useRef<HTMLDivElement | null>(null);
    const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeLineIndex, setActiveLineIndex] = useState<number>(-1);

    // Effect to handle audio time updates and lyric highlighting
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            const time = audio.currentTime;
            setCurrentTime(time);

            const currentLineIndex = content.lyrics.findIndex((line, index) => {
                const nextLine = content.lyrics[index + 1];
                return time >= line.timestamp && (!nextLine || time < nextLine.timestamp);
            });
            setActiveLineIndex(currentLineIndex);
        };

        // ... (other event listeners: loadedmetadata, ended) ...
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => { /* ... cleanup listeners ... */ };
    }, [content.lyrics]);

    // Effect to auto-scroll the active lyric into view
    useEffect(() => {
        if (activeLyricRef.current && lyricsContainerRef.current) {
            lyricsContainerRef.current.scrollTo({
                top: activeLyricRef.current.offsetTop - lyricsContainerRef.current.offsetTop - 60, // 60px offset for better centering
                behavior: 'smooth',
            });
        }
    }, [activeLineIndex]);


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
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Paper elevation={4} sx={{ p: 3, m: 'auto', maxWidth: '450px', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '95%' }}>
            {/* Album Art and Song Info */}
            <Box textAlign="center" mb={2}>
                <Avatar
                    variant="rounded"
                    src={content.albumArtUrl || 'default_album_art.png'}
                    sx={{ width: 150, height: 150, m: 'auto', mb: 2, boxShadow: 3 }}
                />
                <Typography variant="h5" component="h1" fontWeight="bold">{content.title}</Typography>
                <Typography variant="subtitle1" color="text.secondary">{content.artist}</Typography>
            </Box>

            {/* Lyrics Area with Auto-Scroll */}
            <Box
                ref={lyricsContainerRef}
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    border: '1px solid #eee',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    textAlign: 'center'
                }}
            >
                {content.lyrics.map((line, index) => {
                    const isActive = index === activeLineIndex;
                    return (
                        <Typography
                            key={index}
                            ref={isActive ? activeLyricRef : null}
                            variant="h6"
                            sx={{
                                p: 1,
                                borderRadius: 1,
                                transition: 'background-color 0.3s, transform 0.3s',
                                backgroundColor: isActive ? 'primary.light' : 'transparent',
                                color: isActive ? 'primary.contrastText' : 'inherit',
                                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                fontWeight: isActive ? 'bold' : 'normal',
                            }}
                        >
                            {line.text}
                        </Typography>
                    );
                })}
            </Box>

            {/* Audio Player Controls */}
            <Box>
                <audio ref={audioRef} src={content.audioUrl} style={{ display: 'none' }} />
                <Slider aria-label="time-indicator" value={currentTime} min={0} step={1} max={duration || 0} onChange={handleSliderChange} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                    <Typography variant="caption">{formatTime(currentTime)}</Typography>
                    <Typography variant="caption">{formatTime(duration)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <IconButton onClick={togglePlayPause}>
                        {isPlaying ? <PauseIcon sx={{ fontSize: 40 }} /> : <PlayArrowIcon sx={{ fontSize: 40 }} />}
                    </IconButton>
                    <IconButton onClick={handleReplay}><ReplayIcon /></IconButton>
                </Box>
            </Box>
        </Paper>
    );
};

export default SongPlayer;