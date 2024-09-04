'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './ProductDetailsPage.module.css';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();  // Access the route parameter here
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:3000/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    };
    
    fetchProduct();
  }, [id]);  // Use id directly here

  if (!product) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{product.name}</h1>
      <p className={styles.description}>{product.description}</p>
      <p className={styles.price}>Price: ${product.price}</p>
      <button className={styles.button} onClick={() => router.back()}>Back to Products</button>
    </div>
  );
};

export default ProductDetailsPage;
