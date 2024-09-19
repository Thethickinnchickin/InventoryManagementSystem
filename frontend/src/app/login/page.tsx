'use client';

import { useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Box 
} from '@mui/material';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/login`, { username, password });
      const token = response.data.token.access_token;
      const decodedToken = jwt.decode(token) as { role: string };

      Cookie.set('authToken', token); 
      if(decodedToken.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = '/'; // Example redirect
      }
      
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="xs"
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        padding: 2 
      }}
    >
      <Card sx={{ width: '100%', padding: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Login
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
