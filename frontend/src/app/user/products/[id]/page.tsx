'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './ProductDetailsPage.module.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();  // Access the route parameter here
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(`https://inventorymanagementsystem-kpq9.onrender.com/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    };
    
    fetchProduct();
  }, [id]);  // Use id directly here

  const addToCart = (product: Product) => {
    const storedCart = localStorage.getItem('cart');
    let cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // If the product is already in the cart, increase its quantity
      cart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      // Add the new product to the cart with an initial quantity of 1
      cart.push({ ...product, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} has been added to your cart!`);
  };

  const changeQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
  }

  if (!product) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{product.name}</h1>
      <p className={styles.description}>{product.description}</p>
      <p className={styles.price}>Price: ${product.price}</p>
      <p className={styles.price}>Quantity</p>
      <input 
        type='number' 
        value={quantity} 
        onChange={(e) => changeQuantity(parseInt(e.target.value, 10))} 
        className={styles.quantity}
        min={1} // Ensure quantity cannot be less than 1
      />
      <button className={styles.button} onClick={() => addToCart(product)}>
        Add to Cart
      </button>
      <button className={styles.button} onClick={() => router.back()}>
        Back to Products
      </button>
    </div>
  );
};

export default ProductDetailsPage;
