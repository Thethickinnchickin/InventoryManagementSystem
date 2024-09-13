'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProfilePage.module.css';
import { headers } from 'next/headers';

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
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cookieString = document.cookie;
        const token = cookieString
          .split('; ')
          .find(row => row.startsWith('authToken'))
          ?.split('=')[1];

        const response = await axios.get('https://inventorymanagementsystem-kpq9.onrender.com/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({ ...profile, username: response.data.username });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile information.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to change your username? You will be logged out and need to log back in.'
    );
    if (!confirmed) {
      return; // Abort the process if the user cancels
    }

    try {
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find(row => row.startsWith('authToken'))
        ?.split('=')[1];
      
      await axios.put('https://inventorymanagementsystem-kpq9.onrender.com/profile/username', { username: profile.username }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      alert('Username updated successfully. You will now be redirected to the login page.');
      window.location.href = "/login"; // Redirect to login after updating username
    } catch (error) {
      console.error('Error updating username:', error);
      setError('Failed to update username.');
    }
  };
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (profile.password !== profile.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const cookieString = document.cookie;
      const token = cookieString
      .split('; ')
      .find(row => row.startsWith('authToken'))
      ?.split('=')[1];
      await axios.put('https://inventorymanagementsystem-kpq9.onrender.com/profile/password', 
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
    <div className={styles.container}>
      <h1 className={styles.title}>Profile</h1>
      {error && <p className={styles.error}>{error}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      
      {/* Username change form */}
      <form className={styles.profileForm} onSubmit={handleUsernameChange}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>
          Change Username
        </button>
      </form>

      {/* Password change form */}
      <form className={styles.profileForm} onSubmit={handlePasswordChange}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={profile.confirmPassword}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
