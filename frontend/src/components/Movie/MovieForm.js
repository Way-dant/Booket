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
  Box,
  Typography,
} from '@mui/material';

const MovieForm = ({ onSubmit, onCancel, movie = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    duration: '',
    language: '',
    releaseDate: '',
    imageUrl: '',
  });

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Adventure'];
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'];

  // ✅ POPULATE FORM FOR EDIT MODE
  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        genre: movie.genre || '',
        duration: movie.duration?.toString() || '',
        language: movie.language || '',
        releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
        imageUrl: movie.imageUrl || '',
      });
    }
  }, [movie]);

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
      duration: parseInt(formData.duration),
      releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : null,
    });
  };

  const isEditMode = Boolean(movie);

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Movie Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                margin="normal"
              >
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Duration (minutes)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                margin="normal"
              >
                {languages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Release Date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Movie Poster URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                margin="normal"
                placeholder="https://example.com/movie-poster.jpg"
              />
            </Grid>
            {formData.imageUrl && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Poster Preview:
                  </Typography>
                  <img 
                    src={formData.imageUrl} 
                    alt="Poster preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '300px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEditMode ? 'Update Movie' : 'Add Movie'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MovieForm;