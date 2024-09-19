'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';

// Define the interface for the user profile form data
interface UserProfile {
  username: string;
  password: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    password: '',
    confirmPassword: ''
  });  // Profile state for the form
  const [error, setError] = useState<string | null>(null);  // Error state for handling errors
  const [successMessage, setSuccessMessage] = useState<string | null>(null);  // Success message state

  // Fetch the user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Extract the auth token from cookies
        const cookieString = document.cookie;
        const token = cookieString
          .split('; ')
          .find(row => row.startsWith('authToken'))
          ?.split('=')[1];

        // Make the request to fetch profile data
        const response = await axios.get(`${process.env.API_URL || 'http://localhost:3000'}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({ ...profile, username: response.data.username });  // Set the username in the form
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile information.');
      }
    };

    fetchProfile();
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  // Handle changes in the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle username change form submission
  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Show a confirmation dialog before proceeding
    const confirmed = window.confirm(
      'Are you sure you want to change your username? You will be logged out and need to log back in.'
    );
    if (!confirmed) {
      return;  // If user cancels, abort the process
    }

    try {
      // Extract the auth token from cookies
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find(row => row.startsWith('authToken'))
        ?.split('=')[1];

      // Make the request to update the username
      await axios.put(`${process.env.API_URL || 'http://localhost:3000'}/profile/username`, { username: profile.username }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      alert('Username updated successfully. You will now be redirected to the login page.');
      window.location.href = "/login";  // Redirect to login after updating the username
    } catch (error) {
      console.error('Error updating username:', error);
      setError('Failed to update username.');
    }
  };

  // Handle password change form submission
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate that passwords match
    if (profile.password !== profile.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Extract the auth token from cookies
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find(row => row.startsWith('authToken'))
        ?.split('=')[1];

      // Make the request to update the password
      await axios.put(`${process.env.API_URL || 'http://localhost:3000'}/profile/password`, 
        {
          password: profile.password,
          confirmPassword: profile.confirmPassword
        }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccessMessage('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      {/* Display error message */}
      {error && <Alert severity="error">{error}</Alert>}
      
      {/* Display success message */}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {/* Username change form */}
      <Box component="form" onSubmit={handleUsernameChange} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={profile.username}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Change Username
        </Button>
      </Box>

      {/* Password change form */}
      <Box component="form" onSubmit={handlePasswordChange}>
        <TextField
          fullWidth
          label="New Password"
          type="password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={profile.confirmPassword}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Change Password
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;
