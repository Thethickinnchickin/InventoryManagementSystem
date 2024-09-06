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

  // Function to close the menu
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href={userRole === 'admin' ? '/admin' : '/'} className={styles.navLogo} onClick={closeMenu}>
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
                <Link href="/admin" className={styles.navItem} onClick={closeMenu}>
                  Dashboard
                </Link>
                <Link href="/admin/orders" className={styles.navItem} onClick={closeMenu}>
                  Orders
                </Link>
                <Link href="/admin/products" className={styles.navItem} onClick={closeMenu}>
                  Products
                </Link>
                <Link href="/admin/categories" className={styles.navItem} onClick={closeMenu}>
                  Categories
                </Link>
                <Link href="/admin/reports" className={styles.navItem} onClick={closeMenu}>
                  Reports
                </Link>
                <Link href="/admin/audit-logs" className={styles.navItem} onClick={closeMenu}>
                  Audit Logs
                </Link>
              </>
            ) : (
              <>
                <Link href="/user/orders" className={styles.navItem} onClick={closeMenu}>
                  Your Orders
                </Link>
                <Link href="/user/products" className={styles.navItem} onClick={closeMenu}>
                  Products
                </Link>
                <Link href="/user/cart" className={styles.navItem} onClick={closeMenu}>
                  Cart
                </Link>
                <Link href="/user/profile" className={styles.navItem} onClick={closeMenu}>
                  Profile
                </Link>
              </>
            )}
            <button onClick={logout} className={styles.navItem}>
              Logout
            </button>
          </div>
        ) : (
          <div className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
            <Link href="/login" className={styles.navItem} onClick={closeMenu}>
              Login 
            </Link>
            <Link href="/register" className={styles.navItem} onClick={closeMenu}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
