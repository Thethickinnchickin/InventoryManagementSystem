'use client';

import React from 'react';
import Link from 'next/link';
import styles from './HomePage.module.css';
import useAuth from './hooks/useAuth';

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome to the Inventory Management System</h1>
      {isLoggedIn ? (
        <>
          <p className={styles.loggedInMessage}>You are logged in! Explore the available features:</p>
          <div className={styles.buttonContainer}>
            <Link href="/user/products">
              <button className={styles.button}>View Products</button>
            </Link>
            <Link href="/user/orders">
              <button className={styles.button}>View Orders</button>
            </Link>
            <Link href="/user/profile">
              <button className={styles.button}>View Profile</button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className={styles.subHeader}>Please log in to access more features.</p>
          <div className={styles.buttonContainer}>
            <Link href="/login">
              <button className={styles.button}>Login</button>
            </Link>
            <Link href="/register">
              <button className={styles.button}>Register</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
