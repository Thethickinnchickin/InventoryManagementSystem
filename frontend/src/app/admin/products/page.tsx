"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Products.module.css';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [editId, setEditId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10; // Number of products per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products?page=${page}&limit=${limit}&isPaginated=true`);
        setProducts(response.data.data);
        setTotalPages(response.data.lastPage);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:3000/products/${editId}` : 'http://localhost:3000/products';

    try {
      const response = await axios({
        method,
        url,
        data: {
          name,
          description,
          price,
          stock,
          categoryIds: selectedCategories.map((category) => category.id), // Extract category IDs
        },
      });

      if (response.status === 200 || response.status === 201) {
        setProducts((prev) =>
          editId
            ? prev.map((product) => (product.id === response.data.id ? response.data : product))
            : [...prev, response.data]
        );
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setEditId(null);
        setSelectedCategories([]);
      }
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/products/${id}`);

      if (response.status === 200) {
        setProducts((prev) => prev.filter((product) => product.id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const categoryId = Number(value);
    const selectedCategory = categories.find((category) => category.id === categoryId);

    setSelectedCategories((prev) => {
      if (checked) {
        if (!prev.includes(selectedCategory)) {
          return [...prev, selectedCategory];
        }
      } else {
        return prev.filter((category) => category.id !== categoryId);
      }
      return prev;
    });
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/products/${id}`);
      const data = response.data;
      setName(data.name);
      setDescription(data.description);
      setPrice(data.price);
      setStock(data.stock);
      setEditId(id);
      setSelectedCategories(data.categories || []); // Set selected categories as objects
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Product Management</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className={styles.input}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product Description"
          className={styles.input}
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Product Price"
          className={styles.input}
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Product Stock"
          className={styles.input}
        />
        <div className={styles.checkboxGroup}>
          {categories.map((category) => (
            <label key={category.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={category.id}
                checked={selectedCategories.some((selected) => selected.id === category.id)}
                onChange={handleCategoryChange}
                className={styles.checkbox}
              />
              {category.name}
            </label>
          ))}
        </div>
        <button type="submit" className={styles.button}>
          {editId ? 'Update Product' : 'Add Product'}
        </button>
      </form>
      <ul className={styles.productList}>
        {products.map((product) => (
          <li key={product.id} className={styles.productItem}>
            <span>
              {product.name} - ${product.price}
            </span>
            <button
              onClick={() => handleEdit(product.id)}
              className={styles.editButton}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        <span>{page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
