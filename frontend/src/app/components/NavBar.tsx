"use client";

// components/Navbar.tsx
import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import useAuth from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  let { isLoggedIn, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.navLogo}>
          Inventory Management
        </Link>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          <span className={isOpen ? styles.barActive : styles.bar}></span>
          <span className={isOpen ? styles.barActive : styles.bar}></span>
          <span className={isOpen ? styles.barActive : styles.bar}></span>
        </div>
        {isLoggedIn ? (
          <div className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
            <Link href="/orders" className={styles.navItem}>
              Orders
            </Link>
            <Link href="/products" className={styles.navItem}>
              Products
            </Link>
            <Link href="/categories" className={styles.navItem}>
              Categories
            </Link>
            <Link href="/reports" className={styles.navItem}>
              Reports
            </Link>
            <Link href="/audit-logs" className={styles.navItem}>
              Audit Logs
            </Link>
            <button onClick={logout} className={styles.navItem}>
              Logout
            </button>
          </div>
        ): (
          <div className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
            <Link href="/login" className={styles.navItem}>
              Login 
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
