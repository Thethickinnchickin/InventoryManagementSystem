'use client';

import React from 'react';
import Link from 'next/link';
import styles from './UnauthorizedPage.module.css';

const UnauthorizedPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>You do not have the necessary permissions to view this page.</p>
        <Link href="/login" className={styles.loginLink}>
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
