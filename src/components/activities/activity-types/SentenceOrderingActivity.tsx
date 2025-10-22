import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Button, ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// --- TypeScript Interfaces ---
export interface Sentence {
  id: string;
  text: string;
  correctOrder: number; // The correct position (e.g., 1, 2, 3...)
}

export interface SentenceOrderingContent {
 
  activityTitle: string;
  instruction: string;
  imageUrl: string;
  sentences: Sentence[];
}

// --- Main Activity Component ---
const SentenceOrderingComponent: React.FC<{ content: SentenceOrderingContent }> = ({ content }) => {
  // --- State Management ---
  const [sentences, setSentences] = useState<Sentence[]>(() => [...content.sentences].sort(() => Math.random() - 0.5));
  const [unplacedNumbers, setUnplacedNumbers] = useState<number[]>(() => Array.from({ length: content.sentences.length }, (_, i) => i + 1));
  const [placements, setPlacements] = useState<Record<string, number | null>>(() => {
      const initialState: Record<string, number | null> = {};
      content.sentences.forEach(s => { initialState[s.id] = null; });
      return initialState;
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  // --- Effect to Reset State When Content Changes ---
  useEffect(() => {
    setSentences([...content.sentences].sort(() => Math.random() - 0.5));
    setUnplacedNumbers(Array.from({ length: content.sentences.length }, (_, i) => i + 1));
    const initialPlacements: Record<string, number | null> = {};
    content.sentences.forEach(s => { initialPlacements[s.id] = null; });
    setPlacements(initialPlacements);
    setIsSubmitted(false);
    setResults({});
  }, [content]);

  const allPlaced = unplacedNumbers.length === 0;
  const allCorrect = isSubmitted && Object.values(results).length === content.sentences.length && Object.values(results).every(res => res);

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, number: number) => {
    e.dataTransfer.setData("number", number.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSentenceId: string | 'pool') => {
    e.preventDefault();
    const draggedNumber = parseInt(e.dataTransfer.getData("number"));
    if (isNaN(draggedNumber)) return;

    let sourceSentenceId: string | null = null;
    for (const id in placements) {
        if (placements[id] === draggedNumber) {
            sourceSentenceId = id;
            break;
        }
    }

    const newPlacements = { ...placements };
    const newUnplacedNumbers = [...unplacedNumbers];
    const numberInTargetSlot = targetSentenceId !== 'pool' ? newPlacements[targetSentenceId] : null;

    if (sourceSentenceId) {
        newPlacements[sourceSentenceId] = null;
    } else {
        const index = newUnplacedNumbers.indexOf(draggedNumber);
        if (index > -1) newUnplacedNumbers.splice(index, 1);
    }
    
    if (numberInTargetSlot) {
        if(sourceSentenceId) {
            newPlacements[sourceSentenceId] = numberInTargetSlot;
        } else {
            newUnplacedNumbers.push(numberInTargetSlot);
        }
    }
    
    if (targetSentenceId !== 'pool') {
        newPlacements[targetSentenceId] = draggedNumber;
    } else {
        newUnplacedNumbers.push(draggedNumber);
    }

    setPlacements(newPlacements);
    setUnplacedNumbers(newUnplacedNumbers.sort((a, b) => a - b));
  };
  
  // --- Submission and Retry Logic ---
  const handleSubmit = () => {
    const newResults: Record<string, boolean> = {};
    content.sentences.forEach(sentence => {
        const placedNumber = placements[sentence.id];
        newResults[sentence.id] = placedNumber === sentence.correctOrder;
    });
    setResults(newResults);
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setSentences([...content.sentences].sort(() => Math.random() - 0.5));
    setUnplacedNumbers(Array.from({ length: content.sentences.length }, (_, i) => i + 1));
    const initialPlacements: Record<string, number | null> = {};
    content.sentences.forEach(s => { initialPlacements[s.id] = null; });
    setPlacements(initialPlacements);
    setIsSubmitted(false);
    setResults({});
  };

  // --- Dynamic Styling for Slots ---
  const getSlotStyle = (sentenceId: string) => {
    if (!isSubmitted) return {};
    return results[sentenceId]
      ? { borderColor: '#2e7d32', backgroundColor: '#e8f5e9' }
      : { borderColor: '#c62828', backgroundColor: '#ffebee' };
  };

  // --- Render ---
  return (
    <Box p={2} sx={{ fontFamily: "sans-serif", maxWidth: '900px', margin: 'auto' }}>
      {/*<Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>{content.title}</Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#e3f2fd' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: '600', color: '#01579b' }}>{content.activityTitle}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>{content.instruction}</Typography>
      </Paper>
      
      {/* --- UI CHANGE: Image Display is now at the top --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
          <img src={content.imageUrl} alt="Activity visual" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid #ddd' }} />
      </Box>

      {/* Number Pool (where unplaced numbers are held) */}
      <Typography align="center" sx={{ mb: 1, fontWeight: 'bold' }}>சரியான எண்ணை இழுத்துவிடவும்:</Typography>
      <Paper
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'pool')}
        sx={{ p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', alignItems: 'center', minHeight: '60px', border: '2px dashed #ccc' }}
      >
        {unplacedNumbers.map(num => (
          <Chip key={`pool-${num}`} label={num} draggable onDragStart={(e) => handleDragStart(e, num)} sx={{ cursor: 'grab', fontSize: '1.2rem', fontWeight: 'bold' }} />
        ))}
        {unplacedNumbers.length === 0 && <Typography color="textSecondary">அனைத்து எண்களும் பயன்படுத்தப்பட்டுவிட்டன.</Typography>}
      </Paper>

      {/* List of Sentences with Drop Slots */}
      <Box>
        {sentences.map(sentence => (
            <Box key={sentence.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <Box
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, sentence.id)}
                    sx={{
                        width: '50px',
                        height: '50px',
                        border: '2px dashed #90caf9',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '8px',
                        transition: 'all 0.3s',
                        ...getSlotStyle(sentence.id)
                    }}
                >
                    {placements[sentence.id] ? (
                        <Chip
                            label={placements[sentence.id]}
                            draggable
                            onDragStart={(e) => handleDragStart(e, placements[sentence.id]!)}
                            sx={{ cursor: 'grab', fontSize: '1.2rem', fontWeight: 'bold' }}
                        />
                    ) : null}
                </Box>
                <Typography variant="body1" sx={{ flex: 1 }}>{sentence.text}</Typography>
            </Box>
        ))}
      </Box>

      {/* Action Buttons */}
      <Box mt={4} textAlign="center">
        {!isSubmitted && <Button variant="contained" color="primary" onClick={handleSubmit} size="large" disabled={!allPlaced}>சமர்ப்பிக்கவும்</Button>}
        {isSubmitted && !allCorrect && (
          <Box>
            <Typography color="error" variant="h6" gutterBottom>வரிசை தவறானது. மீண்டும் முயலவும்!</Typography>
            <Button variant="contained" color="secondary" onClick={handleRetry} size="large">மீண்டும் முயலவும்</Button>
          </Box>
        )}
        {allCorrect && <Typography color="success.main" variant="h5" sx={{ fontWeight: 'bold' }}>🎉 நன்று! சரியான வரிசை! 🎉</Typography>}
      </Box>
    </Box>
  );
};

// --- Wrapper Component for Export ---
const SentenceOrderingActivity: React.FC<{ content: any }> = ({ content }) => {
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
            <ThemeProvider theme={theme}><Typography p={3}>செயல்பாட்டு உள்ளடக்கம் கிடைக்கவில்லை.</Typography></ThemeProvider>
        );
    }

    return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <main><SentenceOrderingComponent content={content as SentenceOrderingContent} /></main>
      </ThemeProvider>
    );
};

export default SentenceOrderingActivity;