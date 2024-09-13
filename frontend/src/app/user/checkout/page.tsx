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
      const response = await axios.post("http://localhost:3000/orders", orderForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // If order creation is successful
      localStorage.removeItem('cart');
      setSuccessMessage('Order placed successfully!');
  
      // Redirect to the order confirmation page
      window.location.href = '/user/order-confirmation';
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place the order.');
    }
  };
  

  return (
    <div className={styles.container}>
      <h1>Checkout</h1>

      {error && <p className={styles.error}>{error}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}

      <form onSubmit={handleSubmitOrder}>
        <h2>Shipping Information</h2>
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

        <button type="submit" className={styles.button}>
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
