import React, { useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

export interface VideoPlayerContent {
  title: string;          // Activity title
  description?: string;   // Optional description
  videoUrl: string;       // Video file URL
}

const VideoPlayerActivity: React.FC<{ content: VideoPlayerContent }> = ({ content }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = React.useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
      } else {
        videoRef.current.play().catch(err => console.error("Video play failed:", err));
        setPlaying(true);
      }
    }
  };

  return (
    <Box p={3} sx={{ fontFamily: "sans-serif" }}>
      <Typography variant="h4" align="center" gutterBottom>
        {content.title}
      </Typography>
      {content.description && (
        <Typography variant="body1" align="center" mb={2}>
          {content.description}
        </Typography>
      )}

      <Box display="flex" flexDirection="column" alignItems="center">
        <video
          ref={videoRef}
          width="600"
          controls={false}
          style={{ borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" }}
        >
          <source src={content.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <IconButton
          onClick={togglePlay}
          color="primary"
          sx={{ mt: 2, fontSize: "2rem" }}
        >
          {playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default VideoPlayerActivity;
