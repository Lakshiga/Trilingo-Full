import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, IconButton, Slider, Card, CardMedia } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';

// --- NEW: Type for Story Player Activity ---
export interface StoryScene {
    imageUrl: string;     // Image for this part of the story
    text: string;         // The narration text for this scene
    timestamp: number;    // The time in seconds when this scene begins
}

export interface StoryContent {
    title: string;
    audioUrl: string;     // The URL of the full story narration
    scenes: StoryScene[];
}

interface StoryPlayerProps {
    content: StoryContent;
}

const StoryPlayer: React.FC<StoryPlayerProps> = ({ content }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);

     // Effect for audio event listeners and scene synchronization
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            const time = audio.currentTime;
            setCurrentTime(time);
            
            const currentSceneIndex = content.scenes.findIndex((scene, index) => {
                const nextScene = content.scenes[index + 1];
                return time >= scene.timestamp && (!nextScene || time < nextScene.timestamp);
            });
            
            // The comparison uses the freshest 'activeSceneIndex' because it's in the dependency array.
            if (currentSceneIndex !== -1 && currentSceneIndex !== activeSceneIndex) {
                 setActiveSceneIndex(currentSceneIndex);
            }
        };
        
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            setActiveSceneIndex(content.scenes.length - 1);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        // Set initial state when content changes
        setActiveSceneIndex(0);
        setCurrentTime(0);
        setIsPlaying(false);
        if(audio) audio.currentTime = 0;

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [content.scenes, activeSceneIndex]); // *** THE FIX: Add 'activeSceneIndex' ***


    // --- Memoize handler functions with useCallback to stabilize them ---
    const togglePlayPause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(prev => !prev);
    }, [isPlaying]);

    const handleSliderChange = useCallback((event: Event, newValue: number | number[]) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = newValue as number;
            setCurrentTime(newValue as number);
        }
    }, []);
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    const handleReplay = useCallback(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = 0;
            setActiveSceneIndex(0);
            audio.play();
            setIsPlaying(true);
        }
    }, []);

    const currentScene = content.scenes[activeSceneIndex];

    if (!currentScene) {
        return <Typography p={2}>Loading story...</Typography>;
    }

    return (
        <Paper elevation={0} sx={{ p: 2, m: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
                {content.title}
            </Typography>

            {/* --- Top: Image Display Area --- */}
            <Box sx={{ flexGrow: 1, mb: 2, display: 'flex', alignItems: 'center' }}>
                <Card elevation={4} sx={{ width: '100%', borderRadius: 3 }}>
                    <CardMedia
                        component="img"
                        image={currentScene.imageUrl}
                        alt={`Scene for "${currentScene.text.substring(0, 20)}..."`}
                        sx={{
                            width: '100%',
                            aspectRatio: '4 / 3', // Maintain a consistent aspect ratio
                            objectFit: 'cover',
                        }}
                    />
                </Card>
            </Box>

            {/* --- Bottom: Text Display Area --- */}
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    minHeight: '100px', // Ensure a minimum height for the text area
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    borderRadius: 2,
                    mb: 2
                }}
            >
                <Typography variant="h6">
                    {currentScene.text}
                </Typography>
            </Paper>

            {/* --- Audio Player Controls at the very bottom --- */}
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
                    <IconButton onClick={handleReplay}>
                        <ReplayIcon />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    );
};

export default StoryPlayer;