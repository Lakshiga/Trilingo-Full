import React, { useState, useRef } from 'react';
import { Box, Typography, Card, CardMedia, Button, Paper, Grid } from '@mui/material';

// Types (JSON வடிவமைப்புக்கான வகைகள்)
export interface Item {
    id: number;
    name: string;
    imageUrl: string;
    audioUrl: string;
    categoryId: string;
}
export interface Category {
    id: string;
    name: string;
}
export interface CategorizationContent {
    title: string;
    instruction: string;
    items: Item[];
    categories: Category[];
}

export interface DragDropCategorizationProps {
    content: CategorizationContent;
}

const DragDropCategorization: React.FC<DragDropCategorizationProps> = ({ content }) => {
    const [unplacedItems, setUnplacedItems] = useState<Item[]>(content.items);
    const [placedItems, setPlacedItems] = useState<Record<string, Item[]>>({});
    const [draggedItem, setDraggedItem] = useState<Item | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // --- திருத்தப்பட்ட பகுதி இங்கே தொடங்குகிறது ---
    // const playAudio = (audioUrl: string) => {
    //     if (!audioUrl) {
    //         console.warn("Audio URL is missing for this item.");
    //         return;
    //     }

    //     if (audioRef.current) {
    //         audioRef.current.src = audioUrl;
    //         const playPromise = audioRef.current.play();

    //         if (playPromise !== undefined) {
    //             playPromise.catch(error => {
    //                 // பிழையை இங்கே கையாள்வதன் மூலம் செயலி செயலிழக்காது
    //                 console.error("Audio playback error:", error);
    //                 alert(`Could not play audio from: ${audioUrl}. Please check if the file exists in the public folder.`);
    //             });
    //         }
    //     }
    // };
    // --- திருத்தப்பட்ட பகுதி இங்கே முடிகிறது ---

    const handleDragStart = (item: Item) => {
        setDraggedItem(item);
        //playAudio(item.audioUrl);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (category: Category) => {
        if (!draggedItem) return;

        if (draggedItem.categoryId === category.id) {
            setUnplacedItems(prev => prev.filter(item => item.id !== draggedItem.id));
            setPlacedItems(prev => ({
                ...prev,
                [category.id]: [...(prev[category.id] || []), draggedItem]
            }));
        } else {
            console.log("Wrong category!");
        }
        setDraggedItem(null);
    };

    const resetActivity = () => {
        setUnplacedItems(content.items);
        setPlacedItems({});
    };

    return (
        <Box p={3} textAlign="center">
            <Typography variant="h5">{content.title}</Typography>
            <Typography mb={3}>{content.instruction}</Typography>

            <Grid container spacing={4}>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="h6">பொருட்கள்</Typography>
                    <Paper elevation={2} sx={{ p: 2, minHeight: '300px' }}>
                        {unplacedItems.map(item => (
                            <Card 
                                key={item.id}
                                draggable
                                onDragStart={() => handleDragStart(item)}
                                onDragEnd={handleDragEnd}
                                sx={{ m: 1, cursor: 'grab', opacity: draggedItem?.id === item.id ? 0.5 : 1 }}
                            >
                                <CardMedia component="img" height="100" image={item.imageUrl} alt={item.name} />
                            </Card>
                        ))}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 6 }}>
                     <Grid container spacing={2}>
                        {content.categories.map(category => (
                            <Grid size={{ xs: 6 }} key={category.id}>
                                <Typography variant="h6">{category.name}</Typography>
                                <Paper
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(category)}
                                    elevation={2}
                                    sx={{ p: 2, minHeight: '300px', border: '2px dashed grey' }}
                                >
                                    {(placedItems[category.id] || []).map(item => (
                                        <Card key={item.id} sx={{ m: 1 }}>
                                            <CardMedia component="img" height="80" image={item.imageUrl} alt={item.name} />
                                        </Card>
                                    ))}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
            
            <Button variant="contained" onClick={resetActivity} sx={{ mt: 3 }}>மீண்டும் தொடங்கு</Button>
            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default DragDropCategorization;