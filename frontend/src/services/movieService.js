import api from './api';

export const movieService = {
  // Get all movies
  getMovies: async () => {
    const response = await api.get('/movies');
    return response.data;
  },

  // Add new movie
  addMovie: async (movieData) => {
    const response = await api.post('/movies', movieData);
    return response.data;
  },

  // ✅ UPDATE MOVIE
  updateMovie: async (movieId, movieData) => {
    const response = await api.put(`/movies/${movieId}`, movieData);
    return response.data;
  },

  // ✅ DELETE MOVIE
  deleteMovie: async (movieId) => {
    const response = await api.delete(`/movies/${movieId}`);
    return response.data;
  },
};