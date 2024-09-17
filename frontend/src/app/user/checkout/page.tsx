'use client';

import React, { useState } from 'react';
import styles from './CheckoutPage.module.css';
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
  // State to manage shipping information
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // State to manage billing information
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  // State to handle error messages and success messages
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle change in shipping information inputs
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // Handle change in billing information inputs
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  // Handle order submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null); // Reset error message
    setSuccessMessage(null); // Reset success message

    // Retrieve cart items from localStorage
    const cartItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cartItems.length === 0) {
      setError("Your cart is empty."); // Display error if the cart is empty
      return;
    }

    // Retrieve authentication token from cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken'))
      ?.split('=')[1];

    // Create order form object containing shipping and cart details
    const orderForm = {
      customerName: shippingInfo.fullName,
      shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), // Calculate total amount
    };

    try {
      // Send POST request to create the order
      const response = await axios.post("https://inventorymanagementsystem-kpq9.onrender.com/orders", orderForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // On successful order placement
      localStorage.removeItem('cart'); // Clear cart
      setSuccessMessage('Order placed successfully!'); // Display success message

      // Redirect to order confirmation page
      window.location.href = '/user/order-confirmation';
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place the order.'); // Display error message on failure
    }
  };

  return (
    <div className={styles.container}>
      <h1>Checkout</h1>

      {/* Display error message */}
      {error && <p className={styles.error}>{error}</p>}
      
      {/* Display success message */}
      {successMessage && <p className={styles.success}>{successMessage}</p>}

      <form onSubmit={handleSubmitOrder}>
        <h2>Shipping Information</h2>
        
        {/* Shipping info inputs */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={shippingInfo.fullName}
          onChange={handleShippingChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={handleShippingChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingInfo.city}
          onChange={handleShippingChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingInfo.postalCode}
          onChange={handleShippingChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shippingInfo.country}
          onChange={handleShippingChange}
          required
        />

        <h2>Billing Information</h2>

        {/* Billing info inputs */}
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={billingInfo.cardNumber}
          onChange={handleBillingChange}
          required
        />
        <input
          type="text"
          name="expirationDate"
          placeholder="Expiration Date (MM/YY)"
          value={billingInfo.expirationDate}
          onChange={handleBillingChange}
          required
        />
        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={billingInfo.cvv}
          onChange={handleBillingChange}
          required
        />

        {/* Submit order button */}
        <button type="submit" className={styles.button}>
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
