import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ bgcolor: '#1a1a1a' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer' 
            }}
            onClick={() => navigate('/')}
          >
            <MovieIcon sx={{ mr: 1, fontSize: 32 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              CineHub
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
              sx={{ fontWeight: 'bold' }}
            >
              Home
            </Button>
            <Button color="inherit">Now Showing</Button>
            <Button color="inherit">Coming Soon</Button>
            <Button color="inherit">Theaters</Button>
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              variant="outlined"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              sx={{ bgcolor: '#ff6b35', '&:hover': { bgcolor: '#e55a2b' } }}
              onClick={() => navigate('/login')}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;