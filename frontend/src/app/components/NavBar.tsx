'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import useAuth from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, userRole, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href={userRole === 'admin' ? '/admin' : '/'} className={styles.navLogo}>
          Inventory Management
        </Link>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          <span className={isOpen ? styles.barActive : styles.bar}></span>
          <span className={isOpen ? styles.barActive : styles.bar}></span>
          <span className={isOpen ? styles.barActive : styles.bar}></span>
        </div>
        {isLoggedIn ? (
          <div className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
            {userRole === 'admin' ? (
              <>
                <Link href="/admin" className={styles.navItem}>
                  Dashboard
                </Link>
                <Link href="/admin/orders" className={styles.navItem}>
                  Orders
                </Link>
                <Link href="/admin/products" className={styles.navItem}>
                  Products
                </Link>
                <Link href="/admin/categories" className={styles.navItem}>
                  Categories
                </Link>
                <Link href="/admin/reports" className={styles.navItem}>
                  Reports
                </Link>
                <Link href="/admin/audit-logs" className={styles.navItem}>
                  Audit Logs
                </Link>
              </>
            ) : (
              <>
                <Link href="/user/orders" className={styles.navItem}>
                  Your Orders
                </Link>
                <Link href="/user/products" className={styles.navItem}>
                  Products
                </Link>
              </>
            )}
            <button onClick={logout} className={styles.navItem}>
              Logout
            </button>
          </div>
        ) : (
          <div className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
            <Link href="/login" className={styles.navItem}>
              Login 
            </Link>
            <Link href="/register" className={styles.navItem}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
