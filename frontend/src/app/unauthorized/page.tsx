'use client';

import Link from 'next/link'; // Next.js Link component for navigation
import styles from './UnauthorizedPage.module.css'; // Importing CSS module for styling

// Component that renders the Unauthorized (Access Denied) page
const UnauthorizedPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Displaying the page title */}
        <h1 className={styles.title}>Access Denied</h1>
        
        {/* Message indicating the user lacks permission */}
        <p className={styles.message}>You do not have the necessary permissions to view this page.</p>
        
        {/* Link to redirect the user to the login page */}
        <Link href="/login" className={styles.loginLink}>
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
