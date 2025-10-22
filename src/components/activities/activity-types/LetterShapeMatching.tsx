import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, Grid,ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// --- Interfaces for Data Structure ---
interface Item {
  id: string;
  content: string; // The text/symbol to display
}

export interface LetterShapeContent {
  title: string;
  activityTitle: string;
  instruction: string;
  leftItems: Item[];
  rightItems: Item[];
  solutions: Record<string, string>; // Maps left item ID to right item ID
}

// --- SVG Line Component ---
const Line: React.FC<{ from: DOMRect; to: DOMRect; color: string }> = ({ from, to, color }) => {
  if (!from || !to) return null;
  
  // Calculate center points relative to the viewport
  const x1 = from.left + from.width / 2;
  const y1 = from.top + from.height / 2;
  const x2 = to.left + to.width / 2;
  const y2 = to.top + to.height / 2;

  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="4" />
  );
};


// --- Main Activity Component ---
const LetterShapeActivityComponent: React.FC<{ content: LetterShapeContent }> = ({ content }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [incorrectPair, setIncorrectPair] = useState<{ left: string, right: string } | null>(null);
  
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Force a re-render to get correct line positions after DOM updates
  const [, forceUpdate] = useState({});
  useEffect(() => {
    // This helps ensure the lines are drawn correctly on initial load and resize
    const observer = new ResizeObserver(() => forceUpdate({}));
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  
  const shuffledRightItems = useMemo(() => 
    [...content.rightItems].sort(() => Math.random() - 0.5), 
    [content.rightItems]
  );
  
  const isComplete = Object.keys(matchedPairs).length === content.leftItems.length;

  const handleItemClick = (id: string, side: 'left' | 'right') => {
    if (isComplete) return;

    if (side === 'left') {
      if (Object.keys(matchedPairs).includes(id)) return;
      setSelectedLeft(id);
      setIncorrectPair(null);
    } 
    
    if (side === 'right' && selectedLeft) {
      if (Object.values(matchedPairs).includes(id)) return;

      if (content.solutions[selectedLeft] === id) {
        // Correct Match
        setMatchedPairs(prev => ({ ...prev, [selectedLeft]: id }));
        setSelectedLeft(null);
        setIncorrectPair(null);
      } else {
        // Incorrect Match
        setIncorrectPair({ left: selectedLeft, right: id });
        setSelectedLeft(null);
        setTimeout(() => setIncorrectPair(null), 600); // Show incorrect line briefly
      }
    }
  };
  
  const getItemStyle = (id: string, side: 'left' | 'right') => {
    const isMatched = side === 'left' ? matchedPairs[id] : Object.values(matchedPairs).includes(id);
    const isSelected = selectedLeft === id;

    if (isMatched) return { border: '3px solid #2e7d32', backgroundColor: '#e8f5e9' };
    if (isSelected) return { border: '3px solid #1976d2', backgroundColor: '#e3f2fd' };
    return { border: '2px solid #bdbdbd' };
  };

  const getLinePositions = () => {
      const positions: { from: DOMRect, to: DOMRect, color: string }[] = [];
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return positions;

      // Draw matched lines
      for (const [leftId, rightId] of Object.entries(matchedPairs)) {
          const from = itemRefs.current[leftId]?.getBoundingClientRect();
          const to = itemRefs.current[rightId]?.getBoundingClientRect();
          if (from && to) positions.push({ from, to, color: '#2e7d32' });
      }

      // Draw incorrect line
      if (incorrectPair) {
          const from = itemRefs.current[incorrectPair.left]?.getBoundingClientRect();
          const to = itemRefs.current[incorrectPair.right]?.getBoundingClientRect();
          if (from && to) positions.push({ from, to, color: '#d32f2f' });
      }
      return positions;
  };

  return (
    <Box p={3} sx={{ fontFamily: "sans-serif", maxWidth: '900px', margin: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ background: "#AD1457", color: "white", py: 1, borderRadius: "8px", mb: 2, fontWeight: 'bold' }}>
        {content.title}
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#FCE4EC' }}>
        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: '600', color: '#880E4F' }}>
          {content.activityTitle}
        </Typography>
        <Typography variant="body1">{content.instruction}</Typography>
      </Paper>
      
      <Box ref={containerRef} sx={{ position: 'relative' }}>
          <Grid container spacing={2} justifyContent="space-between">
            {/* Left Column */}
            <Grid size={{xs:5}} container direction="column" spacing={2}>
              {content.leftItems.map(item => (
                <Grid size={{xs:12, sm:6}} key={item.id}>
                  <Paper
                    ref={el => { itemRefs.current[item.id] = el; }}
                    onClick={() => handleItemClick(item.id, 'left')}
                    sx={{ p: 2, textAlign: 'center', cursor: 'pointer', fontSize: '1.5rem', ...getItemStyle(item.id, 'left') }}
                  >
                    {item.content}
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Right Column */}
            <Grid size={{xs:5}} container direction="column" spacing={2}>
              {shuffledRightItems.map(item => (
                <Grid size={{xs:12, sm:6}} key={item.id}>
                  <Paper
                    ref={el => { itemRefs.current[item.id] = el; }}
                    onClick={() => handleItemClick(item.id, 'right')}
                    sx={{ p: 2, textAlign: 'center', cursor: 'pointer', fontSize: '1.5rem', ...getItemStyle(item.id, 'right') }}
                  >
                    {item.content}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* SVG Overlay for Lines */}
          <svg style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 1 }}>
              {getLinePositions().map((pos, index) => <Line key={index} {...pos} />)}
          </svg>
      </Box>

      {isComplete && (
        <Box mt={4} textAlign="center">
          <Typography color="success.main" variant="h5" sx={{ fontWeight: 'bold' }}>
              🎉 நன்று! நீங்கள் அனைத்தையும் சரியாக இணைத்துவிட்டீர்கள்! 🎉
          </Typography>
        </Box>
      )}
    </Box>
  );
};


// --- Wrapper Component for Export ---
const LetterShapeActivity: React.FC<{ content: any }> = ({ content }) => {
    const theme = createTheme({
        typography: { fontFamily: ['"Inter"', 'sans-serif'].join(',') },
        palette: {
            primary: { main: '#1976d2' },
            success: { main: '#2e7d32' }
        }
    });
  
    if (!content) {
        return <Typography p={3}>செயல்பாட்டு உள்ளடக்கம் ஏற்றுகிறது...</Typography>
    }

    return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <main>
             <LetterShapeActivityComponent content={content as LetterShapeContent} />
          </main>
      </ThemeProvider>
    );
};

export default LetterShapeActivity;

