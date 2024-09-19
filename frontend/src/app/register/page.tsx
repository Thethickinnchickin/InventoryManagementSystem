'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Hook to navigate programmatically
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';

const RegisterPage: React.FC = () => {
  // State variables to handle form inputs and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Next.js router for page navigation

  // Function to handle form submission and registration logic
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate if the password and confirm password fields match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send POST request to register a new user
      await axios.post(`${process.env.API_URL || 'http://localhost:3000'}/users/register`, { username, password });
      
      // Redirect user to login page on successful registration
      router.push('/login');
    } catch (err) {
      // Handle errors (e.g., username already exists) and display a message
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs">
      {/* Page header */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Register
      </Typography>
      
      {/* Registration form */}
      <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        {/* Username input */}
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        {/* Password input */}
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* Confirm password input */}
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Display error message if any */}
        {error && <Alert severity="error">{error}</Alert>}
        
        {/* Submit button */}
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
