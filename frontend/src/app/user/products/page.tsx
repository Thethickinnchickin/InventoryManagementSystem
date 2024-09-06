'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProductsPage.module.css';
import { useRouter } from 'next/navigation';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(response => {
        const productsArray = Array.isArray(response.data.data) ? response.data.data : [];
        setProducts(productsArray);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleNavigate = (productId: any) => {
    router.push(`/user/products/${productId}`);  // Navigate to another page
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Products</h1>
      <div className={styles.productsGrid}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className={styles.productCard}>
              <h2 className={styles.productName}>{product.name}</h2>
              <p className={styles.productDescription}>{product.description}</p>
              <p className={styles.productPrice}>${product.price}</p>
              <button className='button-24' onClick={() => handleNavigate(product.id)}>Buy</button>
            </div>
          ))
        ) : (
          <p className={styles.noProductsMessage}>No products available</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
