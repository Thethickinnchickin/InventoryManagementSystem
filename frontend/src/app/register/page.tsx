'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Hook to navigate programmatically
import styles from './RegisterPage.module.css';

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
      await axios.post('https://inventorymanagementsystem-kpq9.onrender.com/users/register', { username, password });
      
      // Redirect user to login page on successful registration
      router.push('/login');
    } catch (err) {
      // Handle errors (e.g., username already exists) and display a message
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Page header */}
      <h1 className={styles.header}>Register</h1>
      
      {/* Registration form */}
      <form className={styles.form} onSubmit={handleRegister}>
        
        {/* Username input */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        {/* Password input */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {/* Confirm password input */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Display error message if any */}
        {error && <p className={styles.error}>{error}</p>}
        
        {/* Submit button */}
        <button type="submit" className={styles.button}>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
