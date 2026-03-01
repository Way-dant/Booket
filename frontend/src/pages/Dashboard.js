import React from 'react';
import { Typography, Paper, Grid, Box, Button } from '@mui/material';
import { Movie as MovieIcon, Theaters as ScreenIcon, Schedule as ShowtimesIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Welcome to Movie Booking System Admin Panel
      </Typography>
      
      {/* Main Management Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <MovieIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Movies Management</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Add, view and manage movies in your catalog
            </Typography>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => navigate('/admin/movies')}
            >
              Manage Movies
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <ScreenIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Screens Management</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Manage theater screens and seating capacity
            </Typography>
            <Button 
              variant="contained" 
              color="secondary"
              fullWidth
              onClick={() => navigate('/admin/screens')}
            >
              Manage Screens
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <ShowtimesIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Showtimes Management</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Create and manage movie showtimes and schedules
            </Typography>
            <Button 
              variant="contained" 
              color="success"
              fullWidth
              onClick={() => navigate('/admin/shows')}
            >
              Manage Showtimes
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Single Quick Action Button */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Paper sx={{ p: 3, maxWidth: 400, margin: '0 auto' }}>
          <Typography variant="h6" gutterBottom>Quick Access</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            View how customers see your cinema
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            fullWidth
            onClick={() => window.open('/', '_blank')}
          >
            View Customer Website
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;