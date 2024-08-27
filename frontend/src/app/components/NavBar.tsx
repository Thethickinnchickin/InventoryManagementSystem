"use client";

// components/Navbar.tsx
import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
