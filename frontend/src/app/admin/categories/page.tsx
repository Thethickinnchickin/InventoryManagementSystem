'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CategoriesPage.module.css';

// Define the Category type
interface Category {
  id: string;
  name: string;
}

const CategoriesPage = () => {
  // State to hold the list of categories
  const [categories, setCategories] = useState<Category[]>([]);
  // State to manage the category form inputs
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  // State to toggle between create and edit modes
  const [editMode, setEditMode] = useState(false);
  // State to track the ID of the currently edited category
  const [currentCategoryId, setCurrentCategoryId] = useState('');

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetch the list of categories from the server.
   */
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  /**
   * Handle changes to the category form inputs.
   * @param e - The change event from the input field.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission for creating or updating a category.
   * @param e - The submit event from the form.
   */
  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Retrieve authentication token from cookies
    const cookieString = document.cookie;
    const token = cookieString
      .split('; ')
      .find(row => row.startsWith('authToken'))
      ?.split('=')[1];

    try {
      if (editMode) {
        // Update existing category
        await axios.put(`https://inventorymanagementsystem-kpq9.onrender.com/categories/${currentCategoryId}`, categoryForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new category
        await axios.post('https://inventorymanagementsystem-kpq9.onrender.com/categories', categoryForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // Refresh the list of categories and reset the form
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  /**
   * Set the form for editing a category.
   * @param category - The category to edit.
   */
  const handleEditCategory = (category: Category) => {
    setCategoryForm(category);
    setEditMode(true);
    setCurrentCategoryId(category.id);
  };

  /**
   * Delete a category by its ID.
   * @param categoryId - The ID of the category to delete.
   */
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find(row => row.startsWith('authToken'))
        ?.split('=')[1];
      await axios.delete(`https://inventorymanagementsystem-kpq9.onrender.com/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories(); // Refresh the list of categories
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  /**
   * Reset the category form and exit edit mode.
   */
  const resetForm = () => {
    setCategoryForm({ name: '' });
    setEditMode(false);
    setCurrentCategoryId('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Category Management</h1>
      <form className={styles.form} onSubmit={handleCategorySubmit}>
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={categoryForm.name}
          onChange={handleInputChange}
          className={styles.input}
        />
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            {editMode ? 'Update Category' : 'Create Category'}
          </button>
          <button type="button" className={styles.cancelButton} onClick={resetForm}>
            Cancel
          </button>
        </div>
      </form>

      <h2 className={styles.subTitle}>Existing Categories</h2>
      <ul className={styles.categoryList}>
        {categories.map((category) => (
          <li key={category.id} className={styles.categoryItem}>
            <span>{category.name}</span>
            <div className={styles.actionButtons}>
              <button onClick={() => handleEditCategory(category)} className={styles.editButton}>
                Edit
              </button>
              <button onClick={() => handleDeleteCategory(category.id)} className={styles.deleteButton}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
