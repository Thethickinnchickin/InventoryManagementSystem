'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper } from '@mui/material';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const router = useRouter();

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cart = JSON.parse(storedCart); // Parse stored cart data
      setCartItems(cart); // Set cart items state
      calculateTotal(cart); // Calculate the total price based on the loaded cart items
    }
  }, []);

  // Calculate the total price of all items in the cart
  const calculateTotal = (cart: CartItem[]) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0); // Sum up item prices based on quantity
    setTotalPrice(total); // Update the total price state
  };

  // Update the quantity of a specific cart item
  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item // Update quantity if item ID matches
    );
    setCartItems(updatedCart); // Update cart items state with new quantity
    calculateTotal(updatedCart); // Recalculate total price after quantity change
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart to localStorage
  };

  // Remove an item from the cart
  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id); // Filter out the removed item
    setCartItems(updatedCart); // Update cart items state
    calculateTotal(updatedCart); // Recalculate total price after item removal
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart to localStorage
  };

  // Handle checkout logic
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!'); // Prevent checkout if cart is empty
      return;
    }
    router.push('/user/checkout'); // Navigate to the checkout page
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            Your cart is empty.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => router.push('/')}>
            Go to Shop
          </Button>
        </Box>
      ) : (
        <Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        inputProps={{ min: 1 }}
                      />
                    </TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>${item.price * item.quantity}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={2} textAlign="right">
            <Typography variant="h6">
              Total Price: ${totalPrice}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckout}
              sx={{ mt: 2 }}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
