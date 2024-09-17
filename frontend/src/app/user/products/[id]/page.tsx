'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './ProductDetailsPage.module.css';

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

  // Fetch the product details when the component mounts or when the product ID changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {  // Ensure that the product ID exists before making the request
        try {
          const response = await axios.get(`https://inventorymanagementsystem-kpq9.onrender.com/products/${id}`);
          setProduct(response.data);  // Set the product data to state
        } catch (error) {
          console.error('Error fetching product:', error);  // Handle any errors during the fetch
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
  const changeQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
  }

  // If the product data hasn't been loaded yet, show a loading message
  if (!product) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{product.name}</h1>  {/* Product name */}
      <p className={styles.description}>{product.description}</p>  {/* Product description */}
      <p className={styles.price}>Price: ${product.price}</p>  {/* Product price */}
      
      <p className={styles.price}>Quantity</p>
      <input 
        type='number' 
        value={quantity} 
        onChange={(e) => changeQuantity(parseInt(e.target.value, 10))} 
        className={styles.quantity}
        min={1}  // Ensure that the quantity is at least 1
      />
      
      {/* Button to add the product to the cart */}
      <button className={styles.button} onClick={() => addToCart(product)}>
        Add to Cart
      </button>

      {/* Button to go back to the previous page */}
      <button className={styles.button} onClick={() => router.back()}>
        Back to Products
      </button>
    </div>
  );
};

export default ProductDetailsPage;
