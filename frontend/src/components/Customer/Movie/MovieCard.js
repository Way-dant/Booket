import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { Schedule, Language, Theaters } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // Make sure the handleBookNow function looks like this:
  const handleBookNow = () => {
    navigate(`/movie/${movie._id}`);
  };

  return (
    <Card
      sx={{
        maxWidth: 300,
        height: "100%",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 4,
        },
      }}
    >
      <CardMedia
        component="img"
        height="400"
        image={movie.imageUrl || "/placeholder-movie.jpg"}
        alt={movie.title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {movie.title}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip
            label={movie.genre}
            size="small"
            variant="outlined"
            color="primary"
          />
          <Chip
            label={movie.language}
            size="small"
            variant="outlined"
            icon={<Language fontSize="small" />}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Schedule sx={{ mr: 0.5, fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {movie.duration} min
            </Typography>
          </Box>
          <Chip
            label="Now Showing"
            size="small"
            color="success"
            variant="filled"
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          startIcon={<Theaters />}
          onClick={handleBookNow}
          sx={{
            bgcolor: "#ff6b35",
            "&:hover": { bgcolor: "#e55a2b" },
          }}
        >
          Book Tickets
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
