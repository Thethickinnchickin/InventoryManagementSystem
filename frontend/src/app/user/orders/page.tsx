'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './OrdersPage.module.css';

// Define an interface for the Order
interface Order {
  id: string;
  totalAmount: number;
  createdAt: string; // Assuming the date is in ISO string format
}

const OrdersPage: React.FC = () => {
  // Use the Order interface for the state
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const cookieString = document.cookie;
    const token = cookieString
      .split('; ')
      .find(row => row.startsWith('authToken'))
      ?.split('=')[1];

    axios.get('https://inventorymanagementsystem-kpq9.onrender.com/orders/user/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Orders</h1>
      <div className={styles.ordersList}>
        {orders.map(order => (
          <div key={order.id} className={styles.orderCard}>
            <h2 className={styles.orderCardTitle}>Order #{order.id}</h2>
            <p className={styles.orderCardText}>Total Amount: ${order.totalAmount}</p>
            <p className={styles.orderCardText}>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            {/* Add more order details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
