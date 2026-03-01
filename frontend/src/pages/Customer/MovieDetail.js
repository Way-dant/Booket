import React, { useState, useEffect } from "react"; // ✅ Only import what we need
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Schedule,
  Language,
  Theaters,
  CalendarToday,
} from "@mui/icons-material";
import Navbar from "../../components/Customer/Header/Navbar";
import { movieService } from "../../services/movieService";
import { showService } from "../../services/showService";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Move the function inside useEffect to fix the warning
  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true);
        
        // ✅ Load actual movie data
        const moviesData = await movieService.getMovies();
        const foundMovie = moviesData.find((m) => m._id === id);
        setMovie(foundMovie);

        if (foundMovie) {
          // ✅ LOAD ACTUAL SHOWS FROM API - NOT MOCK DATA!
          try {
            const showsData = await showService.getShowsByMovie(id);
            setShows(showsData);
          } catch (showError) {
            console.error("Error loading shows:", showError);
            setShows([]); // Set empty array if no shows found
          }
        } else {
          setError("Movie not found");
        }
      } catch (err) {
        setError("Failed to load movie details");
        console.error("Error loading movie:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [id]);

  const handleBookShow = (showId) => {
    navigate(`/booking/${showId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box>
        <Navbar />
        <Container sx={{ py: 4, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || "Movie not found"}
          </Alert>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate("/")}
          sx={{ mb: 3 }}
        >
          Back to Movies
        </Button>

        <Grid container spacing={4}>
          {/* Movie Poster */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
              <img
                src={movie.imageUrl || "/placeholder-movie.jpg"}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                }}
              />
            </Paper>
          </Grid>

          {/* Movie Details */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                {movie.title}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                <Chip label={movie.genre} color="primary" />
                <Chip
                  label={movie.language}
                  icon={<Language />}
                  variant="outlined"
                />
                <Chip
                  label={`${movie.duration} min`}
                  icon={<Schedule />}
                  variant="outlined"
                />
              </Box>

              <Typography variant="body1" color="text.secondary" paragraph>
                {movie.description ||
                  `Experience the epic ${movie.genre.toLowerCase()} adventure "${
                    movie.title
                  }". Don't miss this incredible cinematic journey.`}
              </Typography>
            </Box>

            {/* Showtimes Section */}
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <CalendarToday sx={{ mr: 1 }} />
                Available Showtimes
              </Typography>

              {shows.length === 0 ? (
                <Typography
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 3 }}
                >
                  No showtimes available for this movie.
                  <br />
                  <Button
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/admin/shows")}
                  >
                    Add Showtimes in Admin
                  </Button>
                </Typography>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {shows.map((show) => (
                    <Paper
                      key={show._id}
                      sx={{
                        p: 2,
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="h6">
                          {new Date(show.showTime).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(show.showTime).toLocaleTimeString()} •{" "}
                          {show.screen?.name} • ₹{show.price}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          {show.availableSeats?.length} seats available
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<Theaters />}
                        onClick={() => handleBookShow(show._id)}
                        sx={{
                          bgcolor: "#ff6b35",
                          "&:hover": { bgcolor: "#e55a2b" },
                        }}
                      >
                        Select Seats
                      </Button>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetail;
