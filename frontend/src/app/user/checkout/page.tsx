'use client';

import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface BillingInfo {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

const CheckoutPage = () => {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccessMessage(null);

    const cartItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken'))
      ?.split('=')[1];

    const orderForm = {
      customerName: shippingInfo.fullName,
      shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    };

    try {
      const response = await axios.post(`${process.env.API_URL || 'http://localhost:3000'}/orders`, orderForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem('cart');
      setSuccessMessage('Order placed successfully!');
      window.location.href = '/user/order-confirmation';
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place the order.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {error && <Typography color="error" gutterBottom>{error}</Typography>}
      {successMessage && <Typography color="success" gutterBottom>{successMessage}</Typography>}

      <form onSubmit={handleSubmitOrder}>
        <Typography variant="h6" gutterBottom>
          Shipping Information
        </Typography>

        <TextField
          fullWidth
          name="fullName"
          label="Full Name"
          value={shippingInfo.fullName}
          onChange={handleShippingChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          name="address"
          label="Address"
          value={shippingInfo.address}
          onChange={handleShippingChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          name="city"
          label="City"
          value={shippingInfo.city}
          onChange={handleShippingChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          name="postalCode"
          label="Postal Code"
          value={shippingInfo.postalCode}
          onChange={handleShippingChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          name="country"
          label="Country"
          value={shippingInfo.country}
          onChange={handleShippingChange}
          required
          margin="normal"
        />

        <Typography variant="h6" gutterBottom>
          Billing Information
        </Typography>

        <TextField
          fullWidth
          name="cardNumber"
          label="Card Number"
          value={billingInfo.cardNumber}
          onChange={handleBillingChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          name="expirationDate"
          label="Expiration Date (MM/YY)"
          value={billingInfo.expirationDate}
          onChange={handleBillingChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          name="cvv"
          label="CVV"
          value={billingInfo.cvv}
          onChange={handleBillingChange}
          required
          margin="normal"
        />

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
          Place Order
        </Button>
      </form>
    </Container>
  );
};

export default CheckoutPage;
