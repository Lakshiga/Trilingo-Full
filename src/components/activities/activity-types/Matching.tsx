import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardActionArea, CardMedia, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReplayIcon from "@mui/icons-material/Replay";

interface ImageChoice {
  id: string;
  imageUrl: string;
  isCorrect: boolean;
}

interface ImageChoiceActivityProps {
  title: string;
  options: ImageChoice[];
}

const ImageChoiceActivity: React.FC<ImageChoiceActivityProps> = ({ title, options }) => {
  const [selected, setSelected] = useState<ImageChoice | null>(null);

  const handleSelect = (choice: ImageChoice) => {
    setSelected(choice);
  };

  const handleReset = () => {
    setSelected(null);
  };

  return (
    <Box p={2} textAlign="center">
      {/* Title */}
      <Typography variant="h6" mb={3}>{title}</Typography>

      {/* Options */}
      <Grid container spacing={3} justifyContent="center">
        {options.map((choice) => (
          <Grid size={{ xs: 6 }} key={choice.id}>
            <Card
              sx={{
                border: selected?.id === choice.id ? "3px solid blue" : "1px solid #ccc",
                borderRadius: 2
              }}
            >
              <CardActionArea onClick={() => handleSelect(choice)} disabled={!!selected}>
                <CardMedia
                  component="img"
                  height="180"
                  image={choice.imageUrl}
                  alt="option"
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Feedback */}
      {selected && (
        <Box mt={3}>
          {selected.isCorrect ? (
            <Typography variant="h5" color="success.main" display="flex" alignItems="center" justifyContent="center" gap={1}>
              <CheckCircleIcon /> Correct!
            </Typography>
          ) : (
            <Typography variant="h5" color="error.main" display="flex" alignItems="center" justifyContent="center" gap={1}>
              <CancelIcon /> Wrong, Try Again
            </Typography>
          )}
          <Box mt={2}>
            <Button variant="outlined" startIcon={<ReplayIcon />} onClick={handleReset}>
              Retry
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageChoiceActivity;
