'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './DashboardPage.module.css';
import useAuth from '../hooks/useAuth';

interface DashboardMetrics {
  revenue: number | string;
  orders: number | string;
  topProducts: { product_id: number; name: string; total_sales: number | string }[];
  lowStock: { id: number; name: string; stock: number }[];
  newCustomers: number | string;
  avgOrderValue: number | string;
  mostActiveUsers: { username: string; ordersCount: number }[];
}

const DashboardPage = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Retrieve the token from cookies
        const cookieString = document.cookie;
        const token = cookieString
          .split('; ')
          .find(row => row.startsWith('authToken'))
          ?.split('=')[1];

        // Redirect to login if no token is present
        if (!token) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return;
        }

        // Fetch dashboard metrics
        const response = await axios.get('https://inventorymanagementsystem-kpq9.onrender.com/dashboard/metrics', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []); // Empty dependency array ensures this runs once on component mount

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.dashboardContainer}>
      {isLoggedIn ? (
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <button onClick={logout} className={styles.logoutButton}>Logout</button>
          <div className={styles.metricsGrid}>
            <div className={styles.card}>
              <h3>Total Revenue</h3>
              <p>${parseFloat(String(metrics?.revenue || 0)).toLocaleString()}</p>
            </div>
            <div className={styles.card}>
              <h3>Total Orders</h3>
              <p>{metrics?.orders}</p>
            </div>
            <div className={styles.card}>
              <h3>Top-Selling Products</h3>
              <ul>
                {metrics?.topProducts?.length ? (
                  metrics.topProducts.map(product => (
                    <li key={product.product_id}>
                      {product.name}: ${parseFloat(String(product.total_sales)).toLocaleString()}
                    </li>
                  ))
                ) : (
                  <li>No products available</li>
                )}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Low Stock Alerts</h3>
              <ul>
                {metrics?.lowStock?.length ? (
                  metrics.lowStock.map(product => (
                    <li key={product.id}>
                      {product.name}: {product.stock} left
                    </li>
                  ))
                ) : (
                  <li>No low stock alerts</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <h1>Please log in to view this page</h1>
      )}
    </div>
  );
};

export default DashboardPage;
