import api from './api';

export const showService = {
  // Get all shows
  getShows: async () => {
    const response = await api.get('/shows');
    return response.data;
  },

  // Add new show
  addShow: async (showData) => {
    const response = await api.post('/shows', showData);
    return response.data;
  },

  // Get shows by movie ID
  getShowsByMovie: async (movieId) => {
    const response = await api.get(`/shows/movie/${movieId}`);
    return response.data;
  },

  // ✅ UPDATE SHOW
  updateShow: async (showId, showData) => {
    const response = await api.put(`/shows/${showId}`, showData);
    return response.data;
  },

  // ✅ DELETE SHOW
  deleteShow: async (showId) => {
    const response = await api.delete(`/shows/${showId}`);
    return response.data;
  },
};