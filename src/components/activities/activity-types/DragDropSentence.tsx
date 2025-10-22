import React, { useState, useEffect } from 'react'; // useEffect-ஐ import செய்யவும்
import { Box, Typography, Paper, Chip, Grid, Button, ThemeProvider, createTheme, CssBaseline, List, ListItem, ListItemText } from "@mui/material";

// --- Interfaces for the new Data Structure ---
export interface Word {
  id: string;
  text: string;
}

export interface Sentence {
  id: string;
  text: string;
  correctWordId: string;
}

export interface FillInTheBlanksContent {
  title: string;
  activityTitle: string;
  instruction: string;
  words: Word[];
  sentences: Sentence[];
}

// --- Main Activity Component ---
const FillInTheBlanksActivityComponent: React.FC<{ content: FillInTheBlanksContent }> = ({ content }) => {
  // --- State Management ---
  const [wordPool, setWordPool] = useState<Word[]>(content?.words || []);
  const [droppedWords, setDroppedWords] = useState<Record<string, Word | null>>(() => {
    const initialState: Record<string, Word | null> = {};
    content?.sentences?.forEach(s => {
      initialState[s.id] = null;
    });
    return initialState;
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  
  // --- SOLUTION: Reset state when content changes ---
  useEffect(() => {
    // இந்த effect, content prop மாறும் ஒவ்வொரு முறையும் இயங்கும்.
    // இது எல்லா state-ஐயும் ஆரம்ப நிலைக்கு மீட்டமைக்கிறது.
    setWordPool(content?.words || []);
    const initialDropped: Record<string, Word | null> = {};
    content?.sentences?.forEach(s => {
      initialDropped[s.id] = null;
    });
    setDroppedWords(initialDropped);
    setIsSubmitted(false);
    setResults({});
  }, [content]); // dependency array-இல் 'content'-ஐ வைப்பதன் மூலம், அது மாறும்போது effect இயங்கும்.


  // --- Guard Clause ---
  if (!content || !content.words || !content.sentences) {
    return <Typography>செயல்பாடு ஏற்றுகிறது...</Typography>;
  }
  
  const allWordsPlaced = wordPool.length === 0;
  const allCorrect = isSubmitted && Object.values(results).length === content.sentences.length && Object.values(results).every(res => res);

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, word: Word) => {
    e.dataTransfer.setData("wordId", word.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
    
  const handleDropOnSentence = (e: React.DragEvent<HTMLDivElement>, sentenceId: string) => {
    e.preventDefault();
    const wordId = e.dataTransfer.getData("wordId");
    const wordToMove = [...wordPool, ...Object.values(droppedWords).filter(Boolean)].find(w => w!.id === wordId);
    
    if (wordToMove) {
      setWordPool(prev => prev.filter(w => w.id !== wordId));
      setDroppedWords(prev => {
          const newDropped = {...prev};
          for(const key in newDropped) {
              if(newDropped[key]?.id === wordId) {
                  newDropped[key] = null;
              }
          }
          const existingWord = prev[sentenceId];
          if (existingWord) {
             setWordPool(p => [...p, existingWord]);
          }
          newDropped[sentenceId] = wordToMove;
          return newDropped;
      });
    }
  };

  const handleDropOnPool = (e: React.DragEvent<HTMLDivElement>) => {
    const wordId = e.dataTransfer.getData("wordId");
    const wordToMove = Object.values(droppedWords).find(w => w?.id === wordId);

    if(wordToMove) {
        setDroppedWords(prev => {
            const newDropped = {...prev};
            for(const key in newDropped) {
                if(newDropped[key]?.id === wordId) {
                    newDropped[key] = null;
                }
            }
            return newDropped;
        });
        setWordPool(prev => [...prev, wordToMove!]);
    }
  }

  // --- Submission and Retry Logic ---
  const handleSubmit = () => {
    const newResults: Record<string, boolean> = {};
    content.sentences.forEach(sentence => {
      const droppedWord = droppedWords[sentence.id];
      newResults[sentence.id] = droppedWord?.id === sentence.correctWordId;
    });
    setResults(newResults);
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setWordPool(content.words);
    const initialDropped: Record<string, Word | null> = {};
    content.sentences.forEach(s => { initialDropped[s.id] = null; });
    setDroppedWords(initialDropped);
    setIsSubmitted(false);
    setResults({});
  };

  const getBoxStyle = (sentenceId: string) => {
      if (!isSubmitted) return {};
      const isCorrect = results[sentenceId];
      if(isCorrect === undefined) return {};
      return isCorrect
        ? { border: '2px solid #2e7d32' } 
        : { border: '2px solid #c62828' };
  };

  // --- Render ---
  return (
    <Box p={3} sx={{ fontFamily: "sans-serif", maxWidth: '900px', margin: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ background: "#0288D1", color: "white", py: 1, borderRadius: "8px", mb: 2, fontWeight: 'bold' }}>
        {content.title}
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: '600', color: '#01579b' }}>
          {content.activityTitle}
        </Typography>
        <Typography variant="body1">{content.instruction}</Typography>
      </Paper>
      
      <Grid container spacing={4}>
        {/* Left Side: Sentences */}
         <Grid size={{ xs: 6 }} >
            <List sx={{ width: '100%' }}>
                {content.sentences.map((sentence, index) => (
                    <ListItem key={sentence.id} disablePadding sx={{ mb: 2 }}>
                       <Typography sx={{ mr: 1, fontWeight: 'bold' }}>{index + 1}.</Typography>
                       <ListItemText primary={sentence.text} />
                       <Box
                         onDragOver={handleDragOver}
                         onDrop={(e) => handleDropOnSentence(e, sentence.id)}
                         sx={{
                            width: '150px',
                            height: '40px',
                            border: '2px dashed #ccc',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '8px',
                            ml: 2,
                            ...getBoxStyle(sentence.id)
                         }}
                       >
                         {droppedWords[sentence.id] && (
                            <Chip 
                                label={droppedWords[sentence.id]!.text}
                                draggable={!allCorrect}
                                onDragStart={(e) => handleDragStart(e, droppedWords[sentence.id]!)}
                                sx={{ cursor: allCorrect ? 'default' : 'grab' }}
                            />
                         )}
                       </Box>
                    </ListItem>
                ))}
            </List>
        </Grid>

        {/* Right Side: Word Pool */}
        <Grid size={{ xs: 6 }} >
             <Typography variant="h6" gutterBottom align="center">சொற்கள்</Typography>
             <Paper
                onDragOver={handleDragOver}
                onDrop={handleDropOnPool}
                sx={{ 
                    p: 2, 
                    minHeight: '200px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    flexWrap: 'wrap', 
                    gap: 1.5, 
                    justifyContent: 'flex-start', 
                    alignItems: 'center',
                    backgroundColor: '#fafafa',
                    border: '2px dashed #ccc'
                }}
             >
                {wordPool.map(word => (
                    <Chip
                        key={word.id}
                        label={word.text}
                        draggable={!allCorrect}
                        onDragStart={(e) => handleDragStart(e, word)}
                        sx={{ cursor: allCorrect ? 'default' : 'grab', fontSize: '1rem', padding: '10px', width: '80%' }}
                    />
                ))}
             </Paper>
        </Grid>
      </Grid>
      
      <Box mt={4} textAlign="center">
          {!isSubmitted && (
             <Button variant="contained" color="primary" onClick={handleSubmit} size="large" disabled={!allWordsPlaced}>
                சமர்ப்பிக்கவும்
            </Button>
          )}
          {isSubmitted && !allCorrect && (
               <Box>
                    <Typography color="error" variant="h6" gutterBottom>சில பதில்கள் தவறானவை. மீண்டும் முயலவும்!</Typography>
                    <Button variant="contained" color="secondary" onClick={handleRetry} size="large">
                        மீண்டும் முயலவும்
                    </Button>
               </Box>
          )}
          {allCorrect && (
              <Typography color="success.main" variant="h5" sx={{ fontWeight: 'bold' }}>
                  🎉 நன்று! எல்லா பதில்களும் சரியானவை! 🎉
              </Typography>
          )}
      </Box>
    </Box>
  );
}

// --- Wrapper Component for Export ---
const FillInTheBlanksActivity: React.FC<{ content: any }> = ({ content }) => {
    const theme = createTheme({
        typography: { fontFamily: ['"Inter"', 'sans-serif'].join(',') },
        palette: {
            primary: { main: '#0288D1' },
            secondary: { main: '#d32f2f' },
            success: { main: '#2e7d32' }
        }
    });

    if (!content) {
        return (
            <ThemeProvider theme={theme}>
                <Typography p={3}>செயல்பாட்டு உள்ளடக்கம் கிடைக்கவில்லை.</Typography>
            </ThemeProvider>
        )
    }

    return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <main>
             <FillInTheBlanksActivityComponent content={content as FillInTheBlanksContent} />
          </main>
      </ThemeProvider>
    );
};

export default FillInTheBlanksActivity;