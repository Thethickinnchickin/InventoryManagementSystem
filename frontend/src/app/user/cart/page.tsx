'use client';

import React, { useEffect, useState } from 'react';
import styles from './CartPage.module.css';
import { useRouter } from 'next/navigation';

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
    <div className={styles.container}>
      <h1 className={styles.heading}>Your Cart</h1>

      {/* Display a message if the cart is empty */}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {/* Render each item in the cart */}
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} // Handle quantity change
                      className={styles.quantityInput}
                    />
                  </td>
                  <td>${Number(item.price).toFixed(2)}</td> {/* Display item price */}
                  <td>${(item.price * item.quantity).toFixed(2)}</td> {/* Display total price for this item */}
                  <td>
                    <button onClick={() => removeItem(item.id)} className={styles.removeButton}>
                      Remove
                    </button> {/* Button to remove item from cart */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Display the total price and a checkout button */}
          <div className={styles.cartSummary}>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <button onClick={handleCheckout} className={styles.checkoutButton}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
