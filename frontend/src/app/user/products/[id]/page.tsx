'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Alert
} from '@mui/material';

// Define the Product interface to structure the product data
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

// CartItem extends Product to add quantity for each product in the cart
interface CartItem extends Product {
  quantity: number;
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();  // Get the product ID from the route parameters
  const router = useRouter();  // Use router to navigate between pages
  const [product, setProduct] = useState<Product | null>(null);  // State to hold the fetched product data
  const [quantity, setQuantity] = useState(1);  // State to manage the selected product quantity
  const [error, setError] = useState<string | null>(null);  // State to manage error messages

  // Fetch the product details when the component mounts or when the product ID changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {  // Ensure that the product ID exists before making the request
        try {
          const response = await axios.get(`${process.env.API_URL || 'http://localhost:3000'}/products/${id}`);
          setProduct(response.data);  // Set the product data to state
        } catch (error) {
          console.error('Error fetching product:', error);  // Handle any errors during the fetch
          setError('Error fetching product details. Please try again later.');
        }
      }
    };

    fetchProduct();  // Trigger the API call
  }, [id]);  // Re-run the effect when the product ID changes

  // Function to handle adding the product to the cart
  const addToCart = (product: Product) => {
    const storedCart = localStorage.getItem('cart');
    let cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // If the product is already in the cart, increase its quantity
      cart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: (item.quantity || 1) + quantity } : item
      );
    } else {
      // If the product is not in the cart, add it with the selected quantity
      cart.push({ ...product, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));  // Save the updated cart to localStorage
    alert(`${product.name} has been added to your cart!`);  // Show an alert to the user
  };

  // Function to update the quantity state
  const changeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  // If the product data hasn't been loaded yet, show a loading message
  if (!product) return <Container maxWidth="sm"><Typography variant="h6" align="center">Loading...</Typography></Container>;

  return (
    <Container maxWidth="sm" sx={{ paddingY: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ${product.price}
          </Typography>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={changeQuantity}
            InputProps={{ inputProps: { min: 1 } }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => addToCart(product)}
            sx={{ mr: 2 }}
          >
            Add to Cart
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.back()}
          >
            Back to Products
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetailsPage;
