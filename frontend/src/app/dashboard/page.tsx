'use client'; // Add this line to mark the component as a Client Component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:3000/dashboard/metrics');
        setMetrics(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <p>Loading...</p>;

  const revenue = typeof metrics?.revenue === 'number' ? metrics.revenue : parseFloat(metrics?.revenue) || 0;
  const orders = typeof metrics?.orders === 'number' ? metrics.orders : parseInt(metrics?.orders, 10) || 0;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.metricsCards}>
        <div className={styles.card}>
          <h3>Total Revenue</h3>
          <p>${revenue.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <h3>Total Orders</h3>
          <p>{orders}</p>
        </div>
        <div className={styles.card}>
          <h3>Top-Selling Products</h3>
          <ul>
            {metrics?.topProducts?.map((product: any) => {
              const totalSales = parseFloat(product.total_sales);
              return (
                <li key={product.product_id}>
                  {product.name}: ${!isNaN(totalSales) ? totalSales.toFixed(2) : 'N/A'}
                </li>
              );
            }) || <li>No products available</li>}
          </ul>
        </div>
        <div className={styles.card}>
          <h3>Low Stock Alerts</h3>
          <ul>
            {metrics?.lowStock?.map((product: any) => (
              <li key={product.id}>{product.name}: {product.stock} left</li>
            )) || <li>No low stock alerts</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
