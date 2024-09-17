// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './LoginPage.module.css';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://inventorymanagementsystem-kpq9.onrender.com/auth/login', { username, password });
      const token  = response.data.token.access_token;
      const decodedToken = jwt.decode(token) as { role: string };

      Cookie.set('authToken', token); 
      // Redirect or show success message
      if(decodedToken.role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = '/'; // Example redirect
      }
      
    } catch (err) {
      setError('Invalid username or password');
    }
  };
return(
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
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
