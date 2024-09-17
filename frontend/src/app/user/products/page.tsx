'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProductsPage.module.css';
import { useRouter } from 'next/navigation';

// Define the Product interface to structure product data
interface Product {
  id: number; // Product ID
  name: string; // Name of the product
  description: string; // Product description
  price: number; // Product price
}

const ProductsPage: React.FC = () => {
  // State to store the fetched list of products
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter(); // Use router to navigate between pages

  // Fetch the products from the API on component mount
  useEffect(() => {
    axios.get(`${process.env.API_URL}/products`)
      .then(response => {
        console.log(response); // Debugging purpose to log the API response
        const productsArray = Array.isArray(response.data.data) ? response.data.data : [];
        setProducts(productsArray); // Update the state with the products array
      })
      .catch(error => console.error('Error fetching products:', error)); // Log any errors during the fetch
  }, []); // Empty dependency array ensures this runs only once on component mount

  // Function to navigate to the product detail page when clicking "Buy"
  const handleNavigate = (productId: number) => {
    router.push(`/user/products/${productId}`);  // Navigate to the specific product's detail page
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Products</h1>

      {/* Display a grid of product cards if products exist, otherwise show a no-products message */}
      <div className={styles.productsGrid}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className={styles.productCard}>
              <h2 className={styles.productName}>{product.name}</h2>
              <p className={styles.productDescription}>{product.description}</p>
              <p className={styles.productPrice}>${product.price}</p>

              {/* Button to navigate to the product detail page */}
              <button className="button-24" onClick={() => handleNavigate(product.id)}>Buy</button>
            </div>
          ))
        ) : (
          <p className={styles.noProductsMessage}>No products available</p> // Message if no products are available
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
