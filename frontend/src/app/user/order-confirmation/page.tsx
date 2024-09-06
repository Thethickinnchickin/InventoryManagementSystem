import React from 'react';
import styles from './OrderConfirmationPage.module.css';

const OrderConfirmationPage: React.FC = () => (
  <div className={styles.container}>
    <h1 className={styles.heading}>Order Confirmation</h1>
    <p className={styles.text}>Thank you for your order!</p>
    <p className={styles.text}>Your order number is: <strong>#12345</strong></p>
    <p className={styles.text}>We will send you an email confirmation shortly.</p>
  </div>
);

export default OrderConfirmationPage;
