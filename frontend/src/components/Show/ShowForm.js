import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
} from '@mui/material';
import { movieService } from '../../services/movieService';
import { screenService } from '../../services/screenService';

const ShowForm = ({ onSubmit, onCancel, show = null }) => {
  const [formData, setFormData] = useState({
    movie: '',
    screen: '',
    showTime: '',
    price: '',
  });
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ POPULATE FORM FOR EDIT MODE
  useEffect(() => {
    if (show) {
      setFormData({
        movie: show.movie?._id || '',
        screen: show.screen?._id || '',
        showTime: show.showTime ? new Date(show.showTime).toISOString().slice(0, 16) : '',
        price: show.price?.toString() || '',
      });
    }
  }, [show]);

  // Load movies and screens
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [moviesData, screensData] = await Promise.all([
          movieService.getMovies(),
          screenService.getScreens()
        ]);
        setMovies(moviesData);
        setScreens(screensData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseInt(formData.price),
      showTime: new Date(formData.showTime).toISOString(),
    });
  };

  const isEditMode = Boolean(show);

  if (loading) {
    return (
      <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography>Loading...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Showtime' : 'Add New Showtime'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Movie</InputLabel>
                <Select
                  required
                  name="movie"
                  value={formData.movie}
                  onChange={handleChange}
                  label="Movie"
                >
                  {movies.map((movie) => (
                    <MenuItem key={movie._id} value={movie._id}>
                      {movie.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Screen</InputLabel>
                <Select
                  required
                  name="screen"
                  value={formData.screen}
                  onChange={handleChange}
                  label="Screen"
                >
                  {screens.map((screen) => (
                    <MenuItem key={screen._id} value={screen._id}>
                      {screen.name} ({screen.totalSeats} seats)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="datetime-local"
                label="Show Time"
                name="showTime"
                value={formData.showTime}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Ticket Price (₹)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEditMode ? 'Update Showtime' : 'Add Showtime'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ShowForm;