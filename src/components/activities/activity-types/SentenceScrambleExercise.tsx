import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Chip, Button, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// --- Interfaces for Data Structure ---
interface Sentence {
  id: string;
  scrambled: string[];
  solution: string;
}

export interface SentenceScrambleContent {
  title: string;
  activityTitle: string;
  instruction: string;
  sentences: Sentence[];
}

// --- Main Activity Component ---
const SentenceScrambleComponent: React.FC<{ content: SentenceScrambleContent }> = ({ content }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [answerWords, setAnswerWords] = useState<string[]>([]);
  const [wordBank, setWordBank] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'none'>('none');
  const [submitted, setSubmitted] = useState(false);

  const currentSentence = content.sentences[currentSentenceIndex];
  const isLastSentence = currentSentenceIndex === content.sentences.length - 1;

  const setupCurrentSentence = useCallback(() => {
    setAnswerWords([]);
    setWordBank([...content.sentences[currentSentenceIndex].scrambled].sort(() => Math.random() - 0.5));
    setFeedback('none');
    setSubmitted(false);
  }, [currentSentenceIndex, content.sentences]);

  useEffect(() => {
    setupCurrentSentence();
  }, [setupCurrentSentence]);

  const handleWordBankClick = (word: string, index: number) => {
    if (submitted) return;
    setAnswerWords(prev => [...prev, word]);
    setWordBank(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnswerClick = (word: string, index: number) => {
    if (submitted) return;
    setWordBank(prev => [...prev, word]);
    setAnswerWords(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCheck = () => {
    const userAnswer = answerWords.join(' ') + '.';
    if (userAnswer === currentSentence.solution) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
    setSubmitted(true);
  };

  const handleNext = () => {
    if (!isLastSentence) {
        setCurrentSentenceIndex(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    setupCurrentSentence();
  };
  
  const allDone = submitted && feedback === 'correct' && isLastSentence;


  return (
    <Box p={3} sx={{ fontFamily: "sans-serif", maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ background: "#AD1457", color: "white", py: 1, borderRadius: "8px", mb: 2, fontWeight: 'bold' }}>
        {content.title}
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#FCE4EC' }}>
        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: '600', color: '#880E4F' }}>
          {content.activityTitle}
        </Typography>
        <Typography variant="body1">{content.instruction}</Typography>
      </Paper>
      
      {!allDone && (
         <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>வாக்கியம் {currentSentenceIndex + 1}</Typography>
            
            {/* Answer Area */}
            <Paper elevation={3} sx={{ p: 2, minHeight: '100px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '10px', mb: 2, border: submitted && feedback === 'incorrect' ? '2px solid #d32f2f' : '2px solid transparent', backgroundColor: submitted && feedback === 'correct' ? '#EDF7ED' : 'white' }}>
               {answerWords.map((word, i) => (
                   <Chip key={`ans-${i}`} label={word} onClick={() => handleAnswerClick(word, i)} sx={{ fontSize: '1.2rem', p: 2, cursor: submitted ? 'default' : 'pointer' }} />
               ))}
            </Paper>
            
            {/* Word Bank */}
             <Paper elevation={2} sx={{ p: 2, minHeight: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '10px', mb: 2 }}>
               {wordBank.map((word, i) => (
                   <Chip key={`bank-${i}`} label={word} onClick={() => handleWordBankClick(word, i)} clickable={!submitted} sx={{ fontSize: '1.2rem', p: 2, backgroundColor: '#EC407A', color: 'white' }} />
               ))}
             </Paper>

            {/* Feedback per word */}
            {submitted && (
                <Box sx={{ mt: 2, p: 2, borderRadius: '4px', backgroundColor: feedback === 'correct' ? '#f1f8e9' : '#ffebee' }}>
                    {feedback === 'correct' ? 
                        <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CheckCircleIcon/> மிகச் சரி!</Typography> 
                        : 
                        <Box>
                            <Typography color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CancelIcon/> தவறான வாக்கியம்</Typography>
                            <Typography sx={{mt: 1}}>சரியான வாக்கியம்: <span style={{fontWeight: 'bold', color: '#2e7d32'}}>{currentSentence.solution}</span></Typography>
                        </Box>
                    }
                </Box>
            )}
        </Paper>
      )}
      
       {/* Global Controls */}
       <Box textAlign="center" sx={{ mt: 4, minHeight: '50px' }}>
            {!submitted && (
                <Button variant="contained" color="primary" onClick={handleCheck} size="large" disabled={answerWords.length === 0}>சரிபார்க்கவும்</Button>
            )}
            {submitted && feedback === 'incorrect' && (
                <Button variant="contained" color="secondary" onClick={handleRetry} size="large">மீண்டும் முயலவும்</Button>
            )}
            {submitted && feedback === 'correct' && !isLastSentence && (
                 <Button variant="contained" color="success" onClick={handleNext} size="large" endIcon={<ArrowForwardIcon />}>அடுத்த வாக்கியம்</Button>
            )}
            {allDone && (
                <Paper elevation={4} sx={{p:4, backgroundColor: 'success.main', color: 'white'}}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        🎉 வாழ்த்துக்கள்! நீங்கள் எல்லா வாக்கியங்களையும் சரியாக முடித்துவிட்டீர்கள்! 🎉
                    </Typography>
                </Paper>
            )}
       </Box>
    </Box>
  );
};


// --- Wrapper Component for Export ---
const SentenceScrambleActivity: React.FC<{ content: any }> = ({ content }) => {
    const theme = createTheme({
        typography: { fontFamily: ['"Inter"', 'sans-serif'].join(',') },
        palette: {
            primary: { main: '#1976d2' },
            secondary: { main: '#f50057' },
            success: { main: '#2e7d32' }
        }
    });
  
    if (!content || !content.sentences || content.sentences.length === 0) {
        return <Typography p={3}>செயல்பாட்டு உள்ளடக்கம் ஏற்றுகிறது...</Typography>
    }

    return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <main>
             <SentenceScrambleComponent content={content as SentenceScrambleContent} />
          </main>
      </ThemeProvider>
    );
};

export default SentenceScrambleActivity;
