import api from './api';

export const screenService = {
  // Get all screens
  getScreens: async () => {
    const response = await api.get('/screens');
    return response.data;
  },

  // Add new screen
  addScreen: async (screenData) => {
    const response = await api.post('/screens', screenData);
    return response.data;
  },

  // ✅ UPDATE SCREEN
  updateScreen: async (screenId, screenData) => {
    const response = await api.put(`/screens/${screenId}`, screenData);
    return response.data;
  },

  // ✅ DELETE SCREEN
  deleteScreen: async (screenId) => {
    const response = await api.delete(`/screens/${screenId}`);
    return response.data;
  },
};