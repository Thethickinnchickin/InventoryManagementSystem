"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './Products.module.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10; // Number of products per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL || 'http://localhost:3000'}/products?page=${page}&limit=${limit}&isPaginated=true`);
        setProducts(response.data.data);
        setTotalPages(response.data.lastPage);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL || 'http://localhost:3000'}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const cookieString = document.cookie;
    const token = cookieString
      .split('; ')
      .find(row => row.startsWith('authToken'))
      ?.split('=')[1];
    const url = editId ? `${process.env.API_URL || 'http://localhost:3000'}/products/${editId}` : `${process.env.API_URL || 'http://localhost:3000'}/products`;

    try {
      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`
        },
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

  const handleDelete = async (id: number) => {
    try {
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find(row => row.startsWith('authToken'))
        ?.split('=')[1];
      const response = await axios.delete(`${process.env.API_URL || 'http://localhost:3000'}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setProducts((prev) => prev.filter((product) => product.id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleEdit = async (id: number) => {
    try {
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find(row => row.startsWith('authToken'))
        ?.split('=')[1];
      const response = await axios.get(`${process.env.API_URL || 'http://localhost:3000'}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      <Typography variant="h4">Product Management</Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          fullWidth
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className={styles.input}
        />
        <TextField
          fullWidth
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product Description"
          className={styles.input}
        />
        <TextField
          fullWidth
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Product Price"
          className={styles.input}
        />
        <TextField
          fullWidth
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Product Stock"
          className={styles.input}
        />
        <div className={styles.checkboxGroup}>
          {categories.map((category) => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  value={category.id}
                  checked={selectedCategories.some((selected) => selected.id === category.id)}
                  onChange={handleCategoryChange}
                />
              }
              label={category.name}
            />
          ))}
        </div>
        <Button type="submit" variant="contained" color="primary" className={styles.button}>
          {editId ? 'Update Product' : 'Add Product'}
        </Button>
      </form>
      <ul className={styles.productList}>
        {products.map((product) => (
          <li key={product.id} className={styles.productItem}>
            <span>
              {product.name} - ${product.price}
            </span>
            <IconButton
              onClick={() => handleEdit(product.id)}
              className={styles.editButton}
            >
              Edit
            </IconButton>
            <IconButton
              onClick={() => handleDelete(product.id)}
              color="error"
              className={styles.deleteButton}
            >
              <DeleteIcon />
            </IconButton>
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        <Button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </Button>
        <Typography variant="body1">
          {page} of {totalPages}
        </Typography>
        <Button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
