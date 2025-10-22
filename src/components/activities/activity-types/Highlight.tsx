import React, { useState, useEffect } from 'react'; // useEffect-ஐ import செய்யவும்
import { Box, Typography, Paper, Button, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// --- Interfaces for the new Data Structure ---
export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface SentencePart {
  text: string;
  type: string; // The ID of the correct category
}

export interface Sentence {
  id:string;
  text: string;
  parts: SentencePart[];
}

export interface HighlightContent {
  title: string;
  activityTitle: string;
  instruction: string;
  categories: Category[];
  sentences: Sentence[];
}

// --- Main Activity Component ---
const HighlightActivityComponent: React.FC<{ content: HighlightContent }> = ({ content }) => {
  // --- State Management ---
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selections, setSelections] = useState<Record<string, Record<string, string>>>({}); // { sentenceId: { "word": "categoryId" } }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, Record<string, boolean>>>({}); // { sentenceId: { "word": true/false } }

  // --- SOLUTION: Reset state when content changes ---
  useEffect(() => {
    // இந்த effect, content prop மாறும் ஒவ்வொரு முறையும் இயங்கும்.
    // இது எல்லா state-ஐயும் ஆரம்ப நிலைக்கு மீட்டமைக்கிறது.
    setActiveCategory(null);
    setSelections({});
    setIsSubmitted(false);
    setResults({});
  }, [content]); // dependency array-இல் 'content'-ஐ வைப்பதன் மூலம், அது மாறும்போது effect இயங்கும்.


  if (!content || !content.sentences || !content.categories) {
    return <Typography>செயல்பாடு ஏற்றுகிறது...</Typography>;
  }

  // --- Event Handlers ---
  const handlePartClick = (sentenceId: string, partText: string) => {
    if (!activeCategory || isSubmitted) return;

    setSelections(prev => {
      const newSelections = { ...prev };
      newSelections[sentenceId] = { ...(prev[sentenceId] || {}) };
      
      if (newSelections[sentenceId][partText] === activeCategory.id) {
        delete newSelections[sentenceId][partText];
      } else {
        newSelections[sentenceId][partText] = activeCategory.id;
      }
      
      return newSelections;
    });
  };

  const getPartStyle = (sentenceId: string, partText: string): React.CSSProperties => {
    const selectedCategoryId = selections[sentenceId]?.[partText];
    if (selectedCategoryId) {
      const category = content.categories.find(c => c.id === selectedCategoryId);
      return {
        backgroundColor: category?.color || '#e0e0e0',
        color: '#fff',
        padding: '2px 6px',
        borderRadius: '4px',
        cursor: isSubmitted ? 'default' : 'pointer',
        display: 'inline-block',
        position: 'relative'
      };
    }
    return { 
      cursor: isSubmitted || !activeCategory ? 'default' : 'pointer', 
      display: 'inline-block', 
      position: 'relative' 
    };
  };
  
  const renderResultIcon = (sentenceId: string, partText: string) => {
      if(!isSubmitted) return null;
      const isCorrect = results[sentenceId]?.[partText];
      if(isCorrect === undefined) return null;

      return isCorrect ? 
        <CheckCircleIcon sx={{ color: 'green', fontSize: 16, position: 'absolute', top: -8, right: -8, backgroundColor: 'white', borderRadius: '50%' }} /> :
        <CancelIcon sx={{ color: 'red', fontSize: 16, position: 'absolute', top: -8, right: -8, backgroundColor: 'white', borderRadius: '50%' }} />;
  }

  // --- Submission Logic ---
  const handleSubmit = () => {
    const newResults: Record<string, Record<string, boolean>> = {};
    content.sentences.forEach(sentence => {
      newResults[sentence.id] = {};
      const userSelectionsForSentence = selections[sentence.id] || {};
      
      sentence.parts.forEach(part => {
          const correctType = part.type;
          const userSelectionType = userSelectionsForSentence[part.text];
          if(userSelectionType !== undefined){
             newResults[sentence.id][part.text] = userSelectionType === correctType;
          }
      });
    });
    setResults(newResults);
    setIsSubmitted(true);
  };
  
  const handleRetry = () => {
      setActiveCategory(null);
      setSelections({});
      setIsSubmitted(false);
      setResults({});
  };
  
  const totalParts = content.sentences.reduce((acc, s) => acc + s.parts.length, 0);
  const totalCorrect = Object.values(results).reduce((acc, sentenceResults) => acc + Object.values(sentenceResults).filter(Boolean).length, 0);
  const allCorrect = isSubmitted && totalCorrect === totalParts;

  // --- Sentence Rendering Logic ---
  const renderSentence = (sentence: Sentence) => {
    const partTexts = sentence.parts.map(p => p.text);
    const regex = new RegExp(`(${partTexts.join('|')})`, 'g');
    const segments = sentence.text.split(regex).filter(Boolean);

    return segments.map((segment, index) => {
      if (partTexts.includes(segment)) {
        return (
          <span
            key={index}
            onClick={() => handlePartClick(sentence.id, segment)}
            style={getPartStyle(sentence.id, segment)}
          >
            {segment}
            {renderResultIcon(sentence.id, segment)}
          </span>
        );
      }
      return <span key={index}>{segment}</span>;
    });
  };

  return (
    <Box p={3} sx={{ fontFamily: "sans-serif", maxWidth: '900px', margin: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
        {content.title}
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: '600', color: '#01579b' }}>
          {content.activityTitle}
        </Typography>
      </Paper>

      {/* Category Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {content.categories.map(category => (
          <Button
            key={category.id}
            onClick={() => setActiveCategory(category)}
            variant={activeCategory?.id === category.id ? "contained" : "outlined"}
            sx={{
              backgroundColor: activeCategory?.id === category.id ? category.color : 'transparent',
              borderColor: category.color,
              color: activeCategory?.id === category.id ? '#fff' : category.color,
              '&:hover': {
                  backgroundColor: activeCategory?.id === category.id ? category.color : 'transparent',
              }
            }}
          >
            {category.label}
          </Button>
        ))}
      </Box>

      {/* Sentences */}
      <Box>
        {content.sentences.map((sentence, index) => (
          <Typography key={sentence.id} variant="h6" sx={{ mb: 3, lineHeight: 2 }}>
           {index + 1}. {renderSentence(sentence)}
          </Typography>
        ))}
      </Box>
      
      {/* Action Buttons */}
       <Box mt={4} textAlign="center">
          {!isSubmitted && (
             <Button variant="contained" color="primary" onClick={handleSubmit} size="large">
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
const HighlightActivity: React.FC<{ content: any }> = ({ content }) => {
    const theme = createTheme({
        typography: { fontFamily: ['"Inter"', 'sans-serif'].join(',') },
        palette: {
            primary: { main: '#0288D1' },
            secondary: { main: '#d32f2f' },
            success: { main: '#388e3c' }
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
             <HighlightActivityComponent content={content as HighlightContent} />
          </main>
      </ThemeProvider>
    );
};

export default HighlightActivity;