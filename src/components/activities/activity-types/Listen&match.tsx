import React, { useRef } from 'react';
import { Box, Typography,Grid, Card, CardMedia, CardContent, IconButton, List, ListItem, ListItemText } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';



  export interface ListenMatchItem {
    text: string;
    imageUrl: string;
    audioUrl?: string;
}

export interface ListenMatchContent {
    title: string; // e.g., "உயிர் எழுத்து"
    spotlightLetter: string;
    solliyangkal: string[];
    vinaakkal: string[];
    items: ListenMatchItem[];
}

const ListenMatchActivity: React.FC<{ content: ListenMatchContent }> = ({ content }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);


  const playAudio = (audioUrl?: string) => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  };

  return (
    <Box p={2} sx={{ fontFamily: 'sans-serif' }}>
      {/* Title */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {content.title}
      </Typography>

      {/* படங்கள் பகுதி */}
      <Typography variant="h5" gutterBottom>உறைவிடங்களின் படங்கள்</Typography>
      <Grid container spacing={2}>
        {content.items.map((item, index) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="120"
                image={`${process.env.REACT_APP_MEDIA_URL}/${item.imageUrl}`}
                alt={item.text}
                sx={{ objectFit: 'contain', p: 1 }}
              />
              <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h6">{item.text}</Typography>
                {item.audioUrl && (
                  <IconButton onClick={() => playAudio(item.audioUrl)} size="small" color="primary">
                    <VolumeUpIcon />
                  </IconButton>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* சொல்வியங்கல்கள் */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>சொல்வியங்கல்கள்</Typography>
        <List>
          {content.solliyangkal.map((line, i) => (
            <ListItem key={i}>
              <ListItemText primary={line} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* வினாக்கள் */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>வினாக்கள்</Typography>
        <List>
          {content.vinaakkal.map((q, i) => (
            <ListItem key={i}>
              <ListItemText primary={`${i + 1}. ${q}`} />
            </ListItem>
          ))}
        </List>
      </Box>

      <audio ref={audioRef} style={{ display: 'none' }} />
    </Box>
  );
};

export default ListenMatchActivity;