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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ShowForm from '../components/Show/ShowForm';
import { showService } from '../services/showService';

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const loadShows = async () => {
    try {
      setLoading(true);
      const data = await showService.getShows();
      setShows(data);
      setError('');
    } catch (err) {
      setError('Failed to load shows');
      console.error('Error loading shows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShows();
  }, []);

  const handleAddShow = async (showData) => {
    try {
      await showService.addShow(showData);
      setShowForm(false);
      await loadShows();
    } catch (err) {
      setError('Failed to add show');
      console.error('Error adding show:', err);
    }
  };

  // ✅ EDIT SHOW
  const handleEditShow = async (showData) => {
    try {
      await showService.updateShow(editingShow._id, showData);
      setEditingShow(null);
      await loadShows();
    } catch (err) {
      setError('Failed to update show');
      console.error('Error updating show:', err);
    }
  };

  // ✅ DELETE SHOW
  const handleDeleteShow = async () => {
    try {
      await showService.deleteShow(deleteDialog._id);
      setDeleteDialog(null);
      await loadShows();
    } catch (err) {
      setError('Failed to delete show');
      console.error('Error deleting show:', err);
    }
  };

  const startEdit = (show) => {
    setEditingShow(show);
  };

  const confirmDelete = (show) => {
    setDeleteDialog(show);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Showtimes Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
        >
          Add Showtime
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {showForm && (
        <ShowForm
          onSubmit={handleAddShow}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingShow && (
        <ShowForm
          show={editingShow}
          onSubmit={handleEditShow}
          onCancel={() => setEditingShow(null)}
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
            Are you sure you want to delete this showtime?
            {deleteDialog && (
              <>
                <br />
                <strong>Movie:</strong> {deleteDialog.movie?.title}
                <br />
                <strong>Screen:</strong> {deleteDialog.screen?.name}
                <br />
                <strong>Time:</strong> {new Date(deleteDialog.showTime).toLocaleString()}
              </>
            )}
            <br /><br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button onClick={handleDeleteShow} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="shows table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 200 }}>Movie</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Screen</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Show Time</TableCell>
                <TableCell sx={{ width: 120 }}>Price</TableCell>
                <TableCell sx={{ width: 150 }}>Available Seats</TableCell>
                <TableCell sx={{ width: 120 }}>Total Seats</TableCell>
                <TableCell sx={{ width: 120 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>Loading showtimes...</Typography>
                  </TableCell>
                </TableRow>
              ) : shows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No showtimes found. Add your first showtime!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                shows.map((show) => (
                  <TableRow 
                    key={show._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    hover
                  >
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {show.movie?.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {show.movie?.genre}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={show.screen?.name} 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {show.showTime ? new Date(show.showTime).toLocaleDateString() : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {show.showTime ? new Date(show.showTime).toLocaleTimeString() : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`₹${show.price}`} 
                        color="success" 
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" color="success.main" fontWeight="medium">
                        {show.availableSeats?.length || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {show.screen?.totalSeats || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          color="primary" 
                          onClick={() => startEdit(show)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => confirmDelete(show)}
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

export default Shows;