'use client';

import React from 'react';
import Link from 'next/link';
import { Typography, Button, Box, Container, useTheme, useMediaQuery } from '@mui/material';
import useAuth from './hooks/useAuth'; // Custom hook to check authentication status

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth(); // Using the custom hook to get the authentication status
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        padding: 2,
        [theme.breakpoints.down('sm')]: {
          padding: 1,
        },
      }}
    >
      <Typography 
        variant="h2" 
        component="h1" 
        sx={{ 
          color: '#333', 
          mb: 2, 
          fontSize: isMobile ? '2rem' : '2.5rem',
        }}
      >
        Welcome to the Inventory Management System
      </Typography>
      {isLoggedIn ? (
        <>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#28a745', 
              mb: 4,
              fontSize: isMobile ? '1rem' : '1.2rem',
            }}
          >
            You are logged in! Explore the available features:
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: 2, 
              alignItems: 'center',
              justifyContent: 'center', // Center buttons horizontally
              width: '100%',
              maxWidth: '600px'
            }}
          >
            <Button 
              component={Link} 
              href="/user/products" 
              variant="contained" 
              color="primary"
              sx={{ width: isMobile ? '100%' : 'auto' }}
            >
              View Products
            </Button>
            <Button 
              component={Link} 
              href="/user/orders" 
              variant="contained" 
              color="primary"
              sx={{ width: isMobile ? '100%' : 'auto' }}
            >
              View Orders
            </Button>
            <Button 
              component={Link} 
              href="/user/profile" 
              variant="contained" 
              color="primary"
              sx={{ width: isMobile ? '100%' : 'auto' }}
            >
              View Profile
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#555', 
              mb: 4,
              fontSize: isMobile ? '1rem' : '1.2rem',
            }}
          >
            Please log in to access more features.
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: 2, 
              alignItems: 'center',
              justifyContent: 'center', // Center buttons horizontally
              width: '100%',
              maxWidth: '400px'
            }}
          >
            <Button 
              component={Link} 
              href="/login" 
              variant="contained" 
              color="primary"
              sx={{ width: isMobile ? '100%' : 'auto' }}
            >
              Login
            </Button>
            <Button 
              component={Link} 
              href="/register" 
              variant="contained" 
              color="primary"
              sx={{ width: isMobile ? '100%' : 'auto' }}
            >
              Register
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default HomePage;
