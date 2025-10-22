import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Chip, Button, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// --- Interfaces for Data Structure ---
interface Word {
  id: string;
  scrambled: string[]; // An array of characters
  solution: string;
}

export interface WordScrambleContent {
  title: string;
  activityTitle: string;
  instruction: string;
  words: Word[];
}

// --- Main Activity Component ---
const WordScrambleComponent: React.FC<{ content: WordScrambleContent }> = ({ content }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});
  const [remainingLetters, setRemainingLetters] = useState<{ [key: string]: string[] }>({});
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: 'correct' | 'incorrect' | 'none' }>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const wordsPerPage = 5;
  const totalPages = Math.ceil(content.words.length / wordsPerPage);
  const isLastPage = currentPage === totalPages - 1;

  const currentWords = content.words.slice(
    currentPage * wordsPerPage,
    (currentPage + 1) * wordsPerPage
  );

  // Initialize or reset the state for all words
  const initializeState = useCallback(() => {
    const initialAnswers: { [key: string]: string[] } = {};
    const initialRemainingLetters: { [key: string]: string[] } = {};
    const initialFeedbacks: { [key: string]: 'correct' | 'incorrect' | 'none' } = {};

    content.words.forEach(word => {
        initialAnswers[word.id] = [];
        initialRemainingLetters[word.id] = [...word.scrambled].sort(() => Math.random() - 0.5);
        initialFeedbacks[word.id] = 'none';
    });

    setAnswers(initialAnswers);
    setRemainingLetters(initialRemainingLetters);
    setFeedbacks(initialFeedbacks);
    setSubmitted(false);
    setCurrentPage(0);
  }, [content.words]);

  useEffect(() => {
    initializeState();
  }, [initializeState]);

  const handleLetterClick = (wordId: string, letter: string, index: number) => {
    setAnswers(prev => ({
        ...prev,
        [wordId]: [...prev[wordId], letter]
    }));
    setRemainingLetters(prev => ({
        ...prev,
        [wordId]: prev[wordId].filter((_, i) => i !== index)
    }));
  };
  
  const handleAnswerLetterClick = (wordId: string, letter: string, index: number) => {
    if (submitted) return;
    setRemainingLetters(prev => ({
        ...prev,
        [wordId]: [...prev[wordId], letter]
    }));
    setAnswers(prev => ({
        ...prev,
        [wordId]: prev[wordId].filter((_, i) => i !== index)
    }));
  };

  const checkCurrentPageAnswers = () => {
    const newFeedbacks: { [key: string]: 'correct' | 'incorrect' } = {};
    currentWords.forEach(word => {
        const userAnswer = answers[word.id]?.join('') || '';
        newFeedbacks[word.id] = userAnswer === word.solution ? 'correct' : 'incorrect';
    });
    setFeedbacks(prev => ({...prev, ...newFeedbacks}));
    setSubmitted(true);
  };

  const handleNextPage = () => {
    if (!isLastPage) {
        setCurrentPage(prev => prev + 1);
        setSubmitted(false);
    }
  };

  if (Object.keys(answers).length === 0) {
      return <Typography p={3}>ஏற்றுகிறது...</Typography>;
  }
  
  const allCorrectOnPage = submitted && currentWords.every(word => feedbacks[word.id] === 'correct');

  return (
    <Box p={3} sx={{ fontFamily: "sans-serif", maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ background: "#00695C", color: "white", py: 1, borderRadius: "8px", mb: 2, fontWeight: 'bold' }}>
        {content.title}
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#E0F2F1' }}>
        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: '600', color: '#004D40' }}>
          {content.activityTitle}
        </Typography>
        <Typography variant="body1">{content.instruction}</Typography>
      </Paper>
      
      {currentWords.map((word, index) => (
        <Paper key={word.id} elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>கேள்வி {currentPage * wordsPerPage + index + 1}</Typography>
            
            {/* Answer Area */}
            <Paper elevation={3} sx={{ p: 2, minHeight: '80px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '10px', mb: 2, border: submitted && feedbacks[word.id] === 'incorrect' ? '2px solid #d32f2f' : '2px solid transparent', backgroundColor: submitted && feedbacks[word.id] === 'correct' ? '#EDF7ED' : 'white' }}>
               {answers[word.id].map((letter, i) => (
                   <Chip key={`${word.id}-ans-${i}`} label={letter} onClick={() => handleAnswerLetterClick(word.id, letter, i)} sx={{ height: 56, width: 56, fontSize: '1.5rem', fontWeight: 'bold', cursor: submitted ? 'default' : 'pointer' }} />
               ))}
            </Paper>
            
            {/* Letter Bank */}
             <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: remainingLetters[word.id]?.length <= 4 ? 'center' : 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '10px', mb: 2 }}>
               {remainingLetters[word.id].map((letter, i) => (
                   <Chip key={`${word.id}-rem-${i}`} label={letter} onClick={() => handleLetterClick(word.id, letter, i)} clickable={!submitted} sx={{ height: 56, width: 56, fontSize: '1.5rem', fontWeight: 'bold', backgroundColor: '#4DB6AC', color: 'white' }} />
               ))}
             </Paper>

            {/* Feedback per word */}
            {submitted && (
                <Box sx={{ mt: 2, p: 2, borderRadius: '4px', backgroundColor: feedbacks[word.id] === 'correct' ? '#f1f8e9' : '#ffebee' }}>
                    {feedbacks[word.id] === 'correct' ? 
                        <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CheckCircleIcon/> சரியாகச் செய்தீர்கள்!</Typography> 
                        : 
                        <Box>
                            <Typography color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CancelIcon/> தவறான பதில்</Typography>
                            <Typography sx={{mt: 1}}>சரியான பதில்: <span style={{fontWeight: 'bold', color: '#2e7d32'}}>{word.solution}</span></Typography>
                        </Box>
                    }
                </Box>
            )}
        </Paper>
      ))}
      
       {/* Global Controls */}
       <Box textAlign="center" sx={{ mt: 4, minHeight: '50px' }}>
            {!submitted && (
                <Button variant="contained" color="primary" onClick={checkCurrentPageAnswers} size="large">சரிபார்க்கவும்</Button>
            )}

            {submitted && !allCorrectOnPage && (
                <Button variant="contained" color="secondary" onClick={() => {
                    const wordIdsOnPage = currentWords.map(w => w.id);
                    setAnswers(prev => {
                        const newAnswers = {...prev};
                        wordIdsOnPage.forEach(id => { newAnswers[id] = [] });
                        return newAnswers;
                    });
                     setRemainingLetters(prev => {
                        const newLetters = {...prev};
                        currentWords.forEach(w => { newLetters[w.id] = [...w.scrambled].sort(() => Math.random() - 0.5) });
                        return newLetters;
                    });
                    setSubmitted(false);
                }} size="large">மீண்டும் முயலவும்</Button>
            )}
            
            {allCorrectOnPage && !isLastPage && (
                 <Button variant="contained" color="success" onClick={handleNextPage} size="large" endIcon={<ArrowForwardIcon />}>அடுத்து</Button>
            )}

            {allCorrectOnPage && isLastPage && (
                <Typography color="success.main" variant="h5" sx={{ fontWeight: 'bold' }}>
                    🎉 வாழ்த்துக்கள்! நீங்கள் எல்லாவற்றையும் சரியாக முடித்துவிட்டீர்கள்! 🎉
                </Typography>
            )}
       </Box>
    </Box>
  );
};


// --- Wrapper Component for Export ---
const WordScrambleActivity: React.FC<{ content: any }> = ({ content }) => {
    const theme = createTheme({
        typography: { fontFamily: ['"Inter"', 'sans-serif'].join(',') },
        palette: {
            primary: { main: '#1976d2' },
            secondary: { main: '#f50057' },
            success: { main: '#2e7d32' }
        }
    });
  
    if (!content || !content.words || content.words.length === 0) {
        return <Typography p={3}>செயல்பாட்டு உள்ளடக்கம் ஏற்றுகிறது...</Typography>
    }

    return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <main>
             <WordScrambleComponent content={content as WordScrambleContent} />
          </main>
      </ThemeProvider>
    );
};

export default WordScrambleActivity;

