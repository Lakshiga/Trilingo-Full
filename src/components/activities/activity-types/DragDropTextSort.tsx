// REVISED file: activity-types/DragDropTextSort.tsx

import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Grid, Alert } from '@mui/material';


// --- Type Definitions ---

export interface DraggableText {
    id: string;
    text: string;
    categoryId: string;
}

export interface Category {
    id: string;
    title: string;
}

export interface DragDropTextSortContent {
    title: string;
    items: DraggableText[];
    categories: Category[];
}


interface DragDropTextSortProps {
    content: DragDropTextSortContent;
}

const DragDropTextSort: React.FC<DragDropTextSortProps> = ({ content }) => {
    // State to hold the items that are not yet sorted
    const [unsortedItems, setUnsortedItems] = useState<DraggableText[]>(content.items);
    
    // State to hold the items that have been correctly sorted into their categories
    const [sortedItems, setSortedItems] = useState<Record<string, DraggableText[]>>({});

    const [draggedItem, setDraggedItem] = useState<DraggableText | null>(null);

    // Memoize shuffled items to prevent re-shuffling on every render
    const shuffledUnsortedItems = useMemo(() => {
        return [...unsortedItems].sort(() => Math.random() - 0.5);
    }, [unsortedItems]);

    const handleDragStart = (e: React.DragEvent, item: DraggableText) => {
        setDraggedItem(item);
        e.dataTransfer.setData('itemId', item.id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, categoryId: string) => {
        e.preventDefault();
        if (!draggedItem) return;

        // Check for a correct match
        if (draggedItem.categoryId === categoryId) {
            // Move item from unsorted to the correct sorted category
            setUnsortedItems(prev => prev.filter(item => item.id !== draggedItem.id));
            setSortedItems(prev => ({
                ...prev,
                [categoryId]: [...(prev[categoryId] || []), draggedItem]
            }));
        } else {
            // You can add feedback for an incorrect drop here if needed
            console.log("Incorrect drop!");
        }
        setDraggedItem(null);
    };

    const isComplete = unsortedItems.length === 0;

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">{content.title}</Typography>
            {isComplete && <Alert severity="success" sx={{ justifyContent: 'center' }}>Well done! You have sorted all the items correctly.</Alert>}
            
            {/* Pool of Unsorted Items */}
            <Paper elevation={2} sx={{ p: 2, mb: 4, minHeight: '120px', display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {shuffledUnsortedItems.map(item => (
                    <Paper
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        sx={{ p: '8px 16px', cursor: 'grab', backgroundColor: 'secondary.main', color: 'white', userSelect: 'none' }}
                    >
                        <Typography variant="h6">{item.text}</Typography>
                    </Paper>
                ))}
            </Paper>

            {/* Category Bins */}
            <Grid container spacing={2} justifyContent="center">
                {content.categories.map(category => (
                    // ----- THIS IS THE CORRECTED LINE -----
                    <Grid  key={category.id} >
                        <Paper
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, category.id)}
                            sx={{ p: 2, backgroundColor: '#f5f5f5', minHeight: '300px' }}
                        >
                            <Typography variant="h6" align="center" gutterBottom>{category.title}</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {(sortedItems[category.id] || []).map(item => (
                                    <Paper key={item.id} sx={{ p: '8px 16px', backgroundColor: 'primary.light', color: 'white' }}>
                                        <Typography variant="h6">{item.text}</Typography>
                                    </Paper>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DragDropTextSort;