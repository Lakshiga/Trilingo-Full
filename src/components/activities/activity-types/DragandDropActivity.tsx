import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, Grid, Button, ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// --- Interfaces for Data Structure ---
interface Word {
  id: string;
  text: string;
  category: string; // The ID of the correct category
}

interface Category {
  id: string;
  title: string;
}

export interface DragDropContent {
  title: string;
  activityTitle: string;
  instruction: string;
  words: Word[];
  categories: Category[];
}

// --- Main Activity Component ---
const DragDropActivityComponent: React.FC<{ content: DragDropContent }> = ({ content }) => {
  // Hooks must be called at the top level, before any conditional returns.
  const [wordPool, setWordPool] = useState<Word[]>(content?.words || []);
  const [droppedWords, setDroppedWords] = useState<Record<string, Word[]>>(() => {
    const initialState: Record<string, Word[]> = {};
    content?.categories?.forEach(cat => {
      initialState[cat.id] = [];
    });
    return initialState;
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  // Add a guard clause to prevent crash if content is not fully loaded
  if (!content || !content.words || !content.categories) {
    return <Typography>செயல்பாடு ஏற்றுகிறது...</Typography>;
  }

  const allCorrect = isSubmitted && Object.values(results).length === content.words.length && Object.values(results).every(res => res);

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, word: Word) => {
    e.dataTransfer.setData("wordId", word.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    e.preventDefault();
    const wordId = e.dataTransfer.getData("wordId");
    
    let wordToMove: Word | undefined;
    let sourceCategory: string | null = null;

    wordToMove = wordPool.find(w => w.id === wordId);

    if (!wordToMove) {
        for (const catId in droppedWords) {
            const foundWord = droppedWords[catId].find(w => w.id === wordId);
            if(foundWord) {
                wordToMove = foundWord;
                sourceCategory = catId;
                break;
            }
        }
    }

    if (wordToMove) {
        if(sourceCategory) {
             setDroppedWords(prev => ({
                ...prev,
                [sourceCategory!]: prev[sourceCategory!].filter((w: Word) => w.id !== wordId),
            }));
        } else {
            setWordPool(prev => prev.filter(w => w.id !== wordId));
        }

      setDroppedWords(prev => ({
        ...prev,
        [categoryId]: [...prev[categoryId], wordToMove!],
      }));
    }
  };

  // --- Submission and Retry Logic ---
  const handleSubmit = () => {
    const newResults: Record<string, boolean> = {};
    Object.entries(droppedWords).forEach(([categoryId, words]) => {
      words.forEach(word => {
        newResults[word.id] = word.category === categoryId;
      });
    });
    setResults(newResults);
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setWordPool(content.words);
    setDroppedWords(() => {
      const initialState: Record<string, Word[]> = {};
      content.categories.forEach(cat => {
        initialState[cat.id] = [];
      });
      return initialState;
    });
    setIsSubmitted(false);
    setResults({});
  };
  
  const getChipStyle = (wordId: string) => {
      if (!isSubmitted) return {};
      const isCorrect = results[wordId];
      if(isCorrect === undefined) return {};

      return isCorrect
        ? { backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #2e7d32' } 
        : { backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #c62828' };
  };

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

      <Typography variant="h6" gutterBottom align="center">இழுக்க வேண்டிய சொற்கள்</Typography>
      <Paper 
        elevation={2} 
        onDragOver={handleDragOver}
        onDrop={(e) => {
            const wordId = e.dataTransfer.getData("wordId");
            let sourceCategory: string | null = null;
            let wordToMove: Word | undefined;
             for (const catId in droppedWords) {
                const foundWord = droppedWords[catId].find((w: Word) => w.id === wordId);
                if(foundWord) {
                    wordToMove = foundWord;
                    sourceCategory = catId;
                    break;
                }
            }

            if(wordToMove && sourceCategory) {
                setDroppedWords(prev => ({
                    ...prev,
                    [sourceCategory!]: prev[sourceCategory!].filter((w: Word) => w.id !== wordId)
                }));
                setWordPool(prev => [...prev, wordToMove!]);
            }
        }}
        sx={{ 
            p: 2, 
            mb: 4, 
            minHeight: '80px', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: '#fafafa',
            border: '2px dashed #ccc'
        }}>
        {wordPool.map(word => (
          <Chip
            key={word.id}
            label={word.text}
            draggable={!allCorrect}
            onDragStart={(e) => handleDragStart(e, word)}
            sx={{ cursor: allCorrect ? 'default' : 'grab', fontSize: '1rem', padding: '10px' }}
          />
        ))}
        {wordPool.length === 0 && <Typography color="textSecondary">அனைத்து சொற்களும் நகர்த்தப்பட்டுவிட்டன.</Typography>}
      </Paper>

      <Grid container spacing={4} justifyContent="center">
        {content.categories.map(category => (
          <Grid size={{ xs: 12, sm: 6 }}  key={category.id}>
            <Paper
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, category.id)}
              sx={{
                width: '100%',
                minHeight: 250,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2,
                border: '3px dashed #90caf9',
                backgroundColor: '#f0f7ff'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0d47a1', mb: 2 }}>{category.title}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {droppedWords[category.id]?.map(word => (
                  <Chip 
                    key={word.id} 
                    label={word.text} 
                    draggable={!allCorrect}
                    onDragStart={(e) => handleDragStart(e, word)}
                    sx={{ fontSize: '1rem', cursor: allCorrect ? 'default' : 'grab', ...getChipStyle(word.id) }} 
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Box mt={4} textAlign="center">
          {!isSubmitted && (
             <Button variant="contained" color="primary" onClick={handleSubmit} size="large" disabled={wordPool.length > 0}>
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
};

// --- Wrapper Component for Export ---
const DragAndDropActivity: React.FC<{ content: any }> = ({ content }) => {
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
             <DragDropActivityComponent content={content as DragDropContent} />
          </main>
      </ThemeProvider>
    );
};

export default DragAndDropActivity;

