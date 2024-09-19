'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const OrderConfirmationPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ textAlign: 'center', py: 4 }}>
    {/* Heading for the order confirmation page */}
    <Typography variant="h4" gutterBottom>
      Order Confirmation
    </Typography>

    {/* Thank you message */}
    <Typography variant="body1" gutterBottom>
      Thank you for your order!
    </Typography>

    {/* Order number message */}
    <Typography variant="body1" gutterBottom>
      Your order number is: <strong>#12345</strong>
    </Typography>

    {/* Email confirmation message */}
    <Typography variant="body1">
      We will send you an email confirmation shortly.
    </Typography>
  </Container>
);

export default OrderConfirmationPage;
