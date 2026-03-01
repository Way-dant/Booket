import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import MovieForm from '../components/Movie/MovieForm';
import { movieService } from '../services/movieService';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

const loadMovies = async () => {
  try {
    setLoading(true);
    const data = await movieService.getMovies();
    setMovies(data);
    setError('');
    
    // ✅ ADD THIS DEBUG
     console.log("🔍 MOVIE POSTER DEBUG:");
      data.forEach((movie, index) => {
        console.log(`Movie ${index + 1}:`, {
          title: movie.title,   
          hasImageUrl: !!movie.imageUrl,
          imageUrl: movie.imageUrl,
          imageType: typeof movie.imageUrl
        });
      });
      
      setError('');
    
  } catch (err) {
    setError('Failed to load movies');
    console.error('Error loading movies:', err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    loadMovies();
  }, []);

  const handleAddMovie = async (movieData) => {
    try {
      await movieService.addMovie(movieData);
      setShowForm(false);
      await loadMovies();
    } catch (err) {
      setError('Failed to add movie');
      console.error('Error adding movie:', err);
    }
  };

  // ✅ EDIT MOVIE
  const handleEditMovie = async (movieData) => {
    try {
      await movieService.updateMovie(editingMovie._id, movieData);
      setEditingMovie(null);
      await loadMovies();
    } catch (err) {
      setError('Failed to update movie');
      console.error('Error updating movie:', err);
    }
  };

  // ✅ DELETE MOVIE
  const handleDeleteMovie = async () => {
    try {
      await movieService.deleteMovie(deleteDialog._id);
      setDeleteDialog(null);
      await loadMovies();
    } catch (err) {
      setError('Failed to delete movie');
      console.error('Error deleting movie:', err);
    }
  };

  const startEdit = (movie) => {
    setEditingMovie(movie);
  };

  const confirmDelete = (movie) => {
    setDeleteDialog(movie);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Movies Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
        >
          Add Movie
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {showForm && (
        <MovieForm
          onSubmit={handleAddMovie}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingMovie && (
        <MovieForm
          movie={editingMovie}
          onSubmit={handleEditMovie}
          onCancel={() => setEditingMovie(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteDialog)}
        onClose={() => setDeleteDialog(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteDialog?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button onClick={handleDeleteMovie} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="movies table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 100, minWidth: 100 }}>Poster</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Title</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Genre</TableCell>
                <TableCell sx={{ width: 120 }}>Duration</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Language</TableCell>
                <TableCell sx={{ width: 120 }}>Release Date</TableCell>
                <TableCell sx={{ width: 120 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>Loading movies...</Typography>
                  </TableCell>
                </TableRow>
              ) : movies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No movies found. Add your first movie!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                movies.map((movie) => (
                  <TableRow 
                    key={movie._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    hover
                  >
                    <TableCell>
                      <Avatar
                        src={movie.imageUrl}
                        sx={{ 
                          width: 60, 
                          height: 80, 
                          borderRadius: 1,
                          bgcolor: 'grey.200'
                        }}
                        variant="rounded"
                      >
                        {movie.imageUrl ? '' : movie.title.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {movie.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box 
                        sx={{ 
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          bgcolor: 'primary.light',
                          color: 'white',
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}
                      >
                        {movie.genre || 'Not set'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {movie.duration ? `${movie.duration} min` : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {movie.language || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          color="primary" 
                          onClick={() => startEdit(movie)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => confirmDelete(movie)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Movies;