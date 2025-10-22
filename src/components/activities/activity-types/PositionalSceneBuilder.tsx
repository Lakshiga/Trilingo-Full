// Create this new file: activity-types/PositionalSceneBuilder.tsx

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Alert, Button } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- Add these types to your activityContentTypes.ts file ---

export interface DraggableSceneObject {
    id: string;
    name: string;
    imageUrl: string;
}

export interface DropZone {
    id: string;
    name: string;
    x: number; // Position from left (in %)
    y: number; // Position from top (in %)
    width: number; // Width (in %)
    height: number; // Height (in %)
}

export interface SceneInstruction {
    id: number;
    text: string;
    audioUrl: string;
    draggableObjectId: string;
    dropZoneId: string;
}

export interface PositionalSceneBuilderContent {
    title: string;
    sceneImageUrl: string;
    draggableObjects: DraggableSceneObject[];
    dropZones: DropZone[];
    instructions: SceneInstruction[];
}

interface PositionalSceneBuilderProps {
    content: PositionalSceneBuilderContent;
}

const PositionalSceneBuilder: React.FC<PositionalSceneBuilderProps> = ({ content }) => {
    const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
    // Stores the position of placed objects: { objectId: dropZoneId }
    const [placedObjects, setPlacedObjects] = useState<Record<string, string>>({});
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentInstruction = content.instructions[currentInstructionIndex];
    const isComplete = currentInstructionIndex >= content.instructions.length;

    // Filter out objects that have already been placed correctly
    const availableObjects = useMemo(() => {
        const placedObjectIds = Object.keys(placedObjects);
        return content.draggableObjects.filter(obj => !placedObjectIds.includes(obj.id));
    }, [placedObjects, content.draggableObjects]);

    const playAudio = useCallback((audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(e => console.error("Audio error:", e));
        }
    }, []);

    // Auto-play the instruction audio when the step changes
    useEffect(() => {
        if (currentInstruction?.audioUrl) {
            const timer = setTimeout(() => playAudio(currentInstruction.audioUrl), 500);
            return () => clearTimeout(timer);
        }
    }, [currentInstruction, playAudio]);

    const handleDragStart = (e: React.DragEvent, objectId: string) => {
        e.dataTransfer.setData('objectId', objectId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, dropZoneId: string) => {
        e.preventDefault();
        if (isComplete) return;

        const draggedObjectId = e.dataTransfer.getData('objectId');

        if (draggedObjectId === currentInstruction.draggableObjectId && dropZoneId === currentInstruction.dropZoneId) {
            // Correct placement
            setFeedback({ type: 'success', message: 'Correct!' });
            setPlacedObjects(prev => ({ ...prev, [draggedObjectId]: dropZoneId }));
            
            // Advance to the next step after a delay
            setTimeout(() => {
                setFeedback(null);
                setCurrentInstructionIndex(prev => prev + 1);
            }, 1500);
        } else {
            // Incorrect placement
            setFeedback({ type: 'error', message: 'That is not the correct place. Listen again.' });
            setTimeout(() => setFeedback(null), 2000);
        }
    };
    
    const handleReset = () => {
        setCurrentInstructionIndex(0);
        setPlacedObjects({});
        setFeedback(null);
    };

    return (
        <Box p={3} sx={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>{content.title}</Typography>

            {/* Instruction Bar */}
            <Paper elevation={2} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                {isComplete ? (
                     <Alert severity="success" icon={<CheckCircleIcon />} sx={{ width: '100%' }}>
                        Excellent! You have completed the scene.
                    </Alert>
                ) : (
                    <>
                        <IconButton onClick={() => playAudio(currentInstruction.audioUrl)} color="primary">
                            <VolumeUpIcon />
                        </IconButton>
                        <Typography variant="h6">{currentInstruction?.text}</Typography>
                    </>
                )}
            </Paper>

            {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

            {/* Main Scene Area */}
            <Box sx={{ position: 'relative', width: '100%', maxWidth: '800px', margin: 'auto', border: '1px solid #ccc' }}>
                <img src={content.sceneImageUrl} alt="Main scene" style={{ width: '100%', display: 'block' }} />

                {/* Render Drop Zones (for interaction) */}
                {content.dropZones.map(zone => (
                    <Box
                        key={zone.id}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, zone.id)}
                        sx={{
                            position: 'absolute',
                            left: `${zone.x}%`,
                            top: `${zone.y}%`,
                            width: `${zone.width}%`,
                            height: `${zone.height}%`,
                            backgroundColor: 'rgba(25, 118, 210, 0.2)', // Optional: shows drop zones
                            border: '2px dashed rgba(25, 118, 210, 0.5)',   // Optional: shows drop zones
                        }}
                    />
                ))}

                {/* Render Placed Objects */}
                {Object.entries(placedObjects).map(([objectId, zoneId]) => {
                    const objectData = content.draggableObjects.find(o => o.id === objectId);
                    const zoneData = content.dropZones.find(z => z.id === zoneId);
                    if (!objectData || !zoneData) return null;
                    return (
                        <img
                            key={objectId}
                            src={objectData.imageUrl}
                            alt={objectData.name}
                            style={{
                                position: 'absolute',
                                left: `${zoneData.x}%`,
                                top: `${zoneData.y}%`,
                                width: `${zoneData.width}%`,
                                height: `${zoneData.height}%`,
                                objectFit: 'contain',
                                pointerEvents: 'none', // Make them non-interactive once placed
                            }}
                        />
                    );
                })}
            </Box>

            {/* Draggable Objects Pool */}
            <Paper elevation={3} sx={{ p: 2, mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                {availableObjects.map(obj => (
                    <Box
                        key={obj.id}
                        component="img"
                        src={obj.imageUrl}
                        alt={obj.name}
                        draggable
                        onDragStart={(e) => handleDragStart(e, obj.id)}
                        sx={{
                            height: 80,
                            cursor: 'grab',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                    />
                ))}
            </Paper>

            {isComplete && (
                 <Button variant="contained" startIcon={<ReplayIcon />} onClick={handleReset} sx={{ mt: 2 }}>
                    Start Over
                </Button>
            )}

            <audio ref={audioRef} style={{ display: 'none' }} />
        </Box>
    );
};

export default PositionalSceneBuilder;