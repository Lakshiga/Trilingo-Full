import React, { useState } from "react";
import { Box, Typography, Paper, Chip, Grid, Button, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Define the structure for the activity's content, including solutions
export interface LetterFillContent {
    title: string;
    activityTitle: string;
    instruction: string;
    sentences: string[]; // Sentences with "____" as a placeholder
    options: string[];   // Word bank options
    solutions: string[]; // The correct answers in order
}

const LetterFillActivity: React.FC<{ content: LetterFillContent }> = ({ content }) => {
    // State to hold the user's answers
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    // State to track the currently selected blank, starting with the first one
    const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(0);
    // State to track if the answers have been submitted
    const [isSubmitted, setIsSubmitted] = useState(false);
    // State to store the results of the submission
    const [results, setResults] = useState<{ [key: number]: boolean }>({});

    const allCorrect = isSubmitted && Object.values(results).every(res => res);

    // Handles clicking a word from the options bank
    const handleOptionSelect = (option: string) => {
        if (activeSentenceIndex !== null && !allCorrect) {
            setAnswers((prev) => ({ ...prev, [activeSentenceIndex]: option }));
            // Find the next unanswered blank and make it active
            const nextUnanswered = content.sentences.findIndex((_, i) => !answers[i]);
            setActiveSentenceIndex(nextUnanswered !== -1 ? nextUnanswered : null);
        }
    };

    // Handles submitting the answers for checking
    const handleSubmit = () => {
        const newResults: { [key: number]: boolean } = {};
        content.sentences.forEach((_, i) => {
            const isCorrect = answers[i] === content.solutions[i];
            newResults[i] = isCorrect;
        });
        setResults(newResults);
        setIsSubmitted(true);
    };

    // Handles retrying the activity after a wrong submission
    const handleRetry = () => {
        setAnswers({});
        setIsSubmitted(false);
        setResults({});
        setActiveSentenceIndex(0); // Reset focus to the first blank
    };

    return (
        <Box p={3} sx={{ fontFamily: "sans-serif", maxWidth: '800px', margin: 'auto' }}>
            {/* Main Title */}
            <Typography variant="h4" align="center" sx={{
                background: "#2E7D32",
                color: "white",
                py: 1,
                borderRadius: "8px",
                mb: 2,
                fontWeight: 'bold',
            }}>
                {content.title}
            </Typography>

            {/* Instructions */}
            <Paper elevation={2} sx={{ p: 2, mb: 3, background: '#f1f8e9' }}>
                <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: '600', color: '#33691e' }}>
                    {content.activityTitle}
                </Typography>
                <Typography variant="body1">
                    {content.instruction}
                </Typography>
            </Paper>

            {/* Sentences with blanks */}
            <Box mt={2}>
                {content.sentences.map((s, i) => (
                    <Paper key={i} sx={{ p: 2, mb: 2, fontSize: "1.1rem", background: "#ffffff", border: "1px solid #e0e0e0", display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        {s.split("____").map((part, idx) => (
                            <React.Fragment key={idx}>
                                <Typography component="span" sx={{ fontSize: '1.2rem', lineHeight: 1.8 }}>{part}</Typography>
                                {idx < s.split("____").length - 1 && (
                                    <Chip
                                        label={answers[i] || "          "}
                                        onClick={() => !allCorrect && setActiveSentenceIndex(i)}
                                        sx={{
                                            mx: 1,
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            minWidth: '60px',
                                            border: activeSentenceIndex === i ? '2px solid #1976d2' : '1px solid #ccc',
                                            backgroundColor: isSubmitted ? (results[i] ? '#e8f5e9' : '#ffebee') : (answers[i] ? '#e3f2fd' : '#f5f5f5'),
                                            color: isSubmitted ? (results[i] ? '#2e7d32' : '#c62828') : '#1769aa',
                                            '& .MuiChip-icon': {
                                                color: isSubmitted ? (results[i] ? '#2e7d32' : '#c62828') : 'inherit',
                                            }
                                        }}
                                        icon={isSubmitted ? (results[i] ? <CheckCircleIcon /> : <CancelIcon />) : undefined}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </Paper>
                ))}
            </Box>

            {/* Word bank */}
            <Box mt={4}>
                <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    விருப்பங்கள்:
                </Typography>
                <Grid container spacing={2}>
                    {content.options.map((opt, idx) => (
                        <Grid size={{ xs: 4, sm: 3 }} key={idx}>
                            <Chip
                                label={opt}
                                onClick={() => handleOptionSelect(opt)}
                                clickable={!allCorrect && activeSentenceIndex !== null}
                                disabled={allCorrect}
                                sx={{
                                    width: '100%',
                                    fontSize: '1.2rem',
                                    padding: '20px 10px',
                                    cursor: !allCorrect && activeSentenceIndex !== null ? 'pointer' : 'not-allowed',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                    }
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Action Buttons and Status Message */}
            <Box mt={4} textAlign="center">
                {!isSubmitted && (
                    <Button variant="contained" color="success" onClick={handleSubmit} size="large" disabled={Object.keys(answers).length !== content.sentences.length}>
                        சமர்ப்பிக்கவும்
                    </Button>
                )}

                {isSubmitted && !allCorrect && (
                    <Box>
                        <Typography color="error" variant="h6" gutterBottom>சில பதில்கள் தவறானவை. மீண்டும் முயலவும்!</Typography>
                        <Button variant="contained" color="primary" onClick={handleRetry} size="large">
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


const LetterFill: React.FC<{ content: any }> = ({ content }) => {
    const theme = createTheme({
        typography: {
            fontFamily: ['"Inter"', 'sans-serif'].join(','),
        },
        palette: {
            success: {
                main: '#2e7d32',
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <LetterFillActivity content={content as LetterFillContent} />
            </main>
        </ThemeProvider>
    );
};

export default LetterFill;
