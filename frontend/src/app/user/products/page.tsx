'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProductsPage.module.css';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('https://inventorymanagementsystem-kpq9.onrender.com/products')
      .then(response => {
        console.log(response);
        const productsArray = Array.isArray(response.data.data) ? response.data.data : [];
        setProducts(productsArray);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleNavigate = (productId: number) => {
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
              <button className="button-24" onClick={() => handleNavigate(product.id)}>Buy</button>
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
