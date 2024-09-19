'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './DashboardPage.module.css';
import useAuth from '../hooks/useAuth';
import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText } from '@mui/material';

// Define styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  backgroundColor: theme.palette.background.paper,
}));

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  textAlign: 'center',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const MetricsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  textAlign: 'center',
}));

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
        const cookieString = document.cookie;
        const token = cookieString
          .split('; ')
          .find(row => row.startsWith('authToken'))
          ?.split('=')[1];

        if (!token) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/dashboard/metrics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <DashboardContainer>
      {isLoggedIn ? (
        <div>
          <Title>Dashboard Overview</Title>
          <Button variant="contained" color="primary" onClick={logout} sx={{ mb: 2 }}>
            Logout
          </Button>
          <MetricsGrid>
            <Card>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4" color="primary">
                ${parseFloat(String(metrics?.revenue || 0)).toLocaleString()}
              </Typography>
            </Card>
            <Card>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{metrics?.orders}</Typography>
            </Card>
            <Card>
              <Typography variant="h6">Top-Selling Products</Typography>
              <List>
                {metrics?.topProducts?.length ? (
                  metrics.topProducts.map(product => (
                    <ListItem key={product.product_id}>
                      <ListItemText
                        primary={product.name}
                        secondary={`$${parseFloat(String(product.total_sales)).toLocaleString()}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>No products available</ListItem>
                )}
              </List>
            </Card>
            <Card>
              <Typography variant="h6">Low Stock Alerts</Typography>
              <List>
                {metrics?.lowStock?.length ? (
                  metrics.lowStock.map(product => (
                    <ListItem key={product.id}>
                      <ListItemText
                        primary={product.name}
                        secondary={`${product.stock} left`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>No low stock alerts</ListItem>
                )}
              </List>
            </Card>
          </MetricsGrid>
        </div>
      ) : (
        <Title>Please log in to view this page</Title>
      )}
    </DashboardContainer>
  );
};

export default DashboardPage;
