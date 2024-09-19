'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Define the Category type
interface Category {
  id: string;
  name: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [editMode, setEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL || 'http://localhost:3000'}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cookieString = document.cookie;
    const token = cookieString
      .split('; ')
      .find(row => row.startsWith('authToken'))
      ?.split('=')[1];

    try {
      if (editMode) {
        await axios.put(`${process.env.API_URL || 'http://localhost:3000'}/categories/${currentCategoryId}`, categoryForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${process.env.API_URL || 'http://localhost:3000'}/categories`, categoryForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setCategoryForm(category);
    setEditMode(true);
    setCurrentCategoryId(category.id);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find(row => row.startsWith('authToken'))
        ?.split('=')[1];
      await axios.delete(`${process.env.API_URL || 'http://localhost:3000'}/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const resetForm = () => {
    setCategoryForm({ name: '' });
    setEditMode(false);
    setCurrentCategoryId('');
  };

  return (
    <Container>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: 'black' }} // Ensure the title text is black
      >
        Category Management
      </Typography>
      <form onSubmit={handleCategorySubmit}>
        <TextField
          label="Category Name"
          variant="outlined"
          name="name"
          value={categoryForm.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          sx={{ color: 'black' }} // Ensure input text is black
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button type="submit" variant="contained" color="primary">
            {editMode ? 'Update Category' : 'Create Category'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={resetForm}>
            Cancel
          </Button>
        </Box>
      </form>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        mt={4}
        sx={{ color: 'black' }} // Ensure subtitle text is black
      >
        Existing Categories
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <ListItemText primary={category.name} sx={{ color: 'black' }} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditCategory(category)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(category.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CategoriesPage;
