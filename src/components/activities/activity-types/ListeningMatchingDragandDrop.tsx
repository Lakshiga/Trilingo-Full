import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Paper, Chip, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- Interfaces for the new Data Structure ---
export interface WordChoice {
  id: string;
  text: string;
}

export interface SentenceItem {
  id: string;
  preBlankText: string;
  postBlankText?: string;
  audioUrl: string;
  correctWordId: string;
}

export interface ListeningMatchingContent {
  title: string;
  introduction: string;
  sentences: SentenceItem[];
  words: WordChoice[];
}

// --- Main Activity Component ---
const ListeningMatchingDragandDrop: React.FC<{ content: ListeningMatchingContent }> = ({ content }) => {
  // --- State Management ---
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [wordChoices, setWordChoices] = useState<WordChoice[]>(content.words);
  const [droppedWords, setDroppedWords] = useState<Record<string, WordChoice | null>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActivityFinished, setIsActivityFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // --- Effect to Reset State When Content Prop Changes ---
  useEffect(() => {
    setCurrentSentenceIndex(0);
    setWordChoices(content.words);
    setDroppedWords({});
    setIsPlaying(false);
    setIsActivityFinished(false);
    setFeedback(null);
  }, [content]);

  // --- Audio Playback Logic ---
  const playAudio = useCallback((audioUrl: string, onEnded?: () => void) => {
    if (audioUrl && audioRef.current) {
      setIsPlaying(true);
      audioRef.current.src = audioUrl; // Assuming full URL is provided in JSON
      
      const handleEnded = () => {
        setIsPlaying(false);
        if (onEnded) onEnded();
        audioRef.current?.removeEventListener('ended', handleEnded);
      };
      
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    }
  }, []);

  // --- Core Sequential Activity Logic ---
  useEffect(() => {
    if (currentSentenceIndex >= content.sentences.length) {
      setIsActivityFinished(true);
      return;
    }
    // Automatically play audio for the current sentence
    const currentSentence = content.sentences[currentSentenceIndex];
    // A small delay to give a sense of transition
    const timer = setTimeout(() => {
        playAudio(currentSentence.audioUrl);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentSentenceIndex, content.sentences, playAudio]);

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, word: WordChoice) => {
    e.dataTransfer.setData("wordId", word.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, sentenceId: string) => {
    e.preventDefault();
    const currentSentence = content.sentences[currentSentenceIndex];

    // Only allow dropping on the CURRENT active sentence
    if (sentenceId !== currentSentence.id || isPlaying) {
      return;
    }

    const wordId = e.dataTransfer.getData("wordId");
    const droppedWord = wordChoices.find(w => w.id === wordId);

    if (droppedWord) {
      if (droppedWord.id === currentSentence.correctWordId) {
        // --- Correct Answer ---
        setFeedback('correct');
        setDroppedWords(prev => ({ ...prev, [sentenceId]: droppedWord }));
        setWordChoices(prev => prev.filter(w => w.id !== wordId));

        // After showing feedback, move to the next sentence
        setTimeout(() => {
          setFeedback(null);
          setCurrentSentenceIndex(prev => prev + 1);
        }, 1200); // 1.2 second delay for feedback

      } else {
        // --- Incorrect Answer ---
        setFeedback('incorrect');
        setTimeout(() => setFeedback(null), 1000); // Show incorrect feedback for 1 second
      }
    }
  };
  
  // --- Render Logic ---
  if (isActivityFinished) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h4" color="success.main">🎉 வாழ்த்துக்கள்! சிறப்பாகச் செய்தீர்கள்! 🎉</Typography>
        <Typography variant="h6" sx={{mt: 2}}>இந்தச் செயல்பாட்டை வெற்றிகரமாக முடித்துவிட்டீர்கள்.</Typography>
      </Box>
    );
  }

  return (
    <Box p={2} sx={{ fontFamily: "sans-serif", maxWidth: '900px', margin: 'auto' }}>
      <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>{content.title}</Typography>
      <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#f0f7ff' }}>
        <Typography variant="body1">{content.introduction}</Typography>
      </Paper>

      {/* Word Choices Pool */}
      <Typography align="center" sx={{ mb: 1, fontWeight: 'bold' }}>பொருத்தமான சொல்லை இழுத்துவிடவும்:</Typography>
      <Paper sx={{ p: 2, mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', alignItems: 'center', minHeight: '60px', border: '2px dashed #ccc' }}>
        {wordChoices.map(word => (
          <Chip key={word.id} label={word.text} draggable onDragStart={(e) => handleDragStart(e, word)} sx={{ cursor: 'grab', fontSize: '1.1rem' }} />
        ))}
      </Paper>

      {/* Sentences Area */}
      <Box>
        {content.sentences.map((sentence, index) => {
          const isCurrent = index === currentSentenceIndex;
          const isCompleted = !!droppedWords[sentence.id];
          return (
            <Paper key={sentence.id} elevation={isCurrent ? 4 : 1} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 1, transition: 'all 0.3s', backgroundColor: isCurrent ? '#e3f2fd' : (isCompleted ? '#f5f5f5' : 'white'), borderLeft: isCurrent ? '5px solid #0288D1' : '5px solid transparent' }}>
              <Box>
                {isCurrent && isPlaying ? <VolumeUpIcon color="primary" /> : null}
                {isCompleted ? <CheckCircleIcon color="success" /> : null}
              </Box>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                {sentence.preBlankText}
                <Box
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, sentence.id)}
                  sx={{
                    minWidth: '150px',
                    height: '40px',
                    border: isCompleted ? 'none' : (isCurrent ? '2px dashed #0288D1' : '2px dashed #ccc'),
                    borderRadius: '16px',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isCurrent && feedback === 'incorrect' ? '#ffebee' : 'transparent',
                    transition: 'background-color 0.3s'
                  }}
                >
                  {droppedWords[sentence.id] ? (
                    <Chip label={droppedWords[sentence.id]?.text} color="success" sx={{ fontSize: '1rem' }} />
                  ) : (isCurrent && <Typography variant="body2" color="textSecondary">இங்கே இழுத்துவிடவும்</Typography>)}
                </Box>
                {sentence.postBlankText}
              </Typography>
            </Paper>
          );
        })}
      </Box>
      <audio ref={audioRef} style={{ display: 'none' }} />
    </Box>
  );
};

// --- Wrapper Component ---
const ListeningMatchingActivity: React.FC<{ content: any }> = ({ content }) => {
    const theme = createTheme({
        typography: { fontFamily: ['"Inter"', 'sans-serif'].join(',') },
        palette: {
            primary: { main: '#0288D1' },
            secondary: { main: '#d32f2f' },
            success: { main: '#2e7d32' }
        }
    });

    if (!content) {
        return <ThemeProvider theme={theme}><Typography p={3}>செயல்பாட்டு உள்ளடக்கம் கிடைக்கவில்லை.</Typography></ThemeProvider>;
    }

    return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <main><ListeningMatchingDragandDrop content={content as ListeningMatchingContent} /></main>
      </ThemeProvider>
    );
};

export default ListeningMatchingActivity;