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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ScreenForm from '../components/Screen/ScreenForm';
import { screenService } from '../services/screenService';

const Screens = () => {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const loadScreens = async () => {
    try {
      setLoading(true);
      const data = await screenService.getScreens();
      setScreens(data);
      setError('');
    } catch (err) {
      setError('Failed to load screens');
      console.error('Error loading screens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScreens();
  }, []);

  const handleAddScreen = async (screenData) => {
    try {
      await screenService.addScreen(screenData);
      setShowForm(false);
      await loadScreens();
    } catch (err) {
      setError('Failed to add screen');
      console.error('Error adding screen:', err);
    }
  };

  // ✅ EDIT SCREEN
  const handleEditScreen = async (screenData) => {
    try {
      await screenService.updateScreen(editingScreen._id, screenData);
      setEditingScreen(null);
      await loadScreens();
    } catch (err) {
      setError('Failed to update screen');
      console.error('Error updating screen:', err);
    }
  };

  // ✅ DELETE SCREEN
  const handleDeleteScreen = async () => {
    try {
      await screenService.deleteScreen(deleteDialog._id);
      setDeleteDialog(null);
      await loadScreens();
    } catch (err) {
      setError('Failed to delete screen');
      console.error('Error deleting screen:', err);
    }
  };

  const startEdit = (screen) => {
    setEditingScreen(screen);
  };

  const confirmDelete = (screen) => {
    setDeleteDialog(screen);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Screens Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
        >
          Add Screen
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {showForm && (
        <ScreenForm
          onSubmit={handleAddScreen}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingScreen && (
        <ScreenForm
          screen={editingScreen}
          onSubmit={handleEditScreen}
          onCancel={() => setEditingScreen(null)}
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
            Are you sure you want to delete "{deleteDialog?.name}"? This action cannot be undone.
            {deleteDialog && ` This screen has ${deleteDialog.totalSeats} seats.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button onClick={handleDeleteScreen} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Screen Name</TableCell>
                <TableCell>Total Seats</TableCell>
                <TableCell sx={{ width: 120 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                screens.map((screen) => (
                  <TableRow key={screen._id}>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {screen.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {screen.totalSeats} seats
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          color="primary" 
                          onClick={() => startEdit(screen)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => confirmDelete(screen)}
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

export default Screens;