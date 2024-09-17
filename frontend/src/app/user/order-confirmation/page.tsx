import React from 'react';
import styles from './OrderConfirmationPage.module.css';

const OrderConfirmationPage: React.FC = () => (
  <div className={styles.container}>
    {/* Page heading */}
    <h1 className={styles.heading}>Order Confirmation</h1>

    {/* Thank you message */}
    <p className={styles.text}>Thank you for your order!</p>

    {/* Display order number (static for now) */}
    <p className={styles.text}>
      Your order number is: <strong>#12345</strong>
    </p>

    {/* Email confirmation message */}
    <p className={styles.text}>We will send you an email confirmation shortly.</p>
  </div>
);

export default OrderConfirmationPage;
