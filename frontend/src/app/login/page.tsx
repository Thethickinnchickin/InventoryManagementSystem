'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './LoginPage.module.css';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

// Define the shape of the decoded JWT token
interface DecodedToken {
  role: string;
  exp: number; // Token expiration time
}

const LoginPage = () => {
  // State hooks for form inputs and error handling
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  // Hook for programmatic navigation
  const router = useRouter();

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Make a POST request to the login endpoint
      const response = await axios.post('https://inventorymanagementsystem-kpq9.onrender.com/auth/login', { username, password });
      const token = response.data.token.access_token;

      // Decode the token to get user role and expiration time
      const decodedToken = jwt.decode(token) as DecodedToken;

      // Check if the token has expired
      if (decodedToken.exp < Date.now() / 1000) {
        throw new Error('Token is expired');
      }

      // Store the token in cookies for authenticated requests
      Cookie.set('authToken', token);

      // Redirect user based on their role
      if (decodedToken.role === 'admin') {
        router.push('/admin'); // Redirect admin to admin dashboard
      } else {
        router.push('/'); // Redirect regular user to home
      }

    } catch (err) {
      // Handle errors and display a message
      console.error('Login error:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Login</h2>
        {/* Display error message if any */}
        {error && <p className={styles.error}>{error}</p>}
        {/* Login form */}
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
