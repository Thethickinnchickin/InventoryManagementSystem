'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './DashboardPage.module.css';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/router';

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

  let { isLoggedIn, logout } = useAuth();
  //const router = useRouter();



  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const cookieString = document.cookie;
        const token = cookieString
          .split('; ')
          .find(row => row.startsWith('authToken'))
          ?.split('=')[1];

        if (token) {
          try {
            const response = await axios.get('http://localhost:3000/dashboard/metrics', {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            });
            
            setMetrics(response.data);
          } catch (error) {
            console.error('Failed to fetch protected data', error);
          }
        } else {
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          return null;
        }

      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.dashboardContainer}>
      {isLoggedIn ? (
        <div>
          <h1 className={styles.title} >Dashboard Overview</h1>
          <button onClick={logout}>Logout</button>
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
                {metrics?.topProducts?.map((product) => (
                  <li key={product.product_id}>
                    {product.name}: ${parseFloat(String(product.total_sales)).toLocaleString()}
                  </li>
                )) || <li>No products available</li>}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Low Stock Alerts</h3>
              <ul>
                {metrics?.lowStock?.map((product) => (
                  <li key={product.id}>
                    {product.name}: {product.stock} left
                  </li>
                )) || <li>No low stock alerts</li>}
              </ul>
            </div>
          </div>
        </div>

      ) : (
        <h1>Log In</h1>
      )}

    </div>
  );
};

export default DashboardPage;
