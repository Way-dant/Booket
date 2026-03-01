import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, title = "Now Showing" }) => {
  if (!movies || movies.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No movies available at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ 
        fontWeight: 'bold', 
        mb: 4,
        textAlign: 'center',
        background: 'linear-gradient(45deg, #ff6b35, #ff8e53)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent'
      }}>
        {title}
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {movies.map((movie) => (
          <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MovieGrid;
