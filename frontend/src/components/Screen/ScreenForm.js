import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const ScreenForm = ({ onSubmit, onCancel, screen = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    totalSeats: '',
  });

  // ✅ POPULATE FORM FOR EDIT MODE
  useEffect(() => {
    if (screen) {
      setFormData({
        name: screen.name || '',
        totalSeats: screen.totalSeats?.toString() || '',
      });
    }
  }, [screen]);

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
      totalSeats: parseInt(formData.totalSeats),
    });
  };

  const isEditMode = Boolean(screen);

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Screen' : 'Add New Screen'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            required
            fullWidth
            label="Screen Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            placeholder="e.g., Screen 1, Audi 1"
          />
          <TextField
            required
            fullWidth
            type="number"
            label="Total Seats"
            name="totalSeats"
            value={formData.totalSeats}
            onChange={handleChange}
            margin="normal"
            inputProps={{ min: 1, max: 500 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEditMode ? 'Update Screen' : 'Add Screen'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ScreenForm;