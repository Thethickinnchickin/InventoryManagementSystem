'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert
} from '@mui/material';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios.get(`${process.env.API_URL || 'http://localhost:3000'}/products`)
      .then(response => {
        const productsArray = Array.isArray(response.data.data) ? response.data.data : [];
        setProducts(productsArray);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Error fetching products. Please try again later.');
      });
  }, []);

  const handleNavigate = (productId: number) => {
    router.push(`/user/products/${productId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Our Products
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={4}>
        {products.length > 0 ? (
          products.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${product.price}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ margin: 2 }}
                  onClick={() => handleNavigate(product.id)}
                >
                  Buy
                </Button>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No products available
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default ProductsPage;
