'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CategoriesPage.module.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [editMode, setEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:3000/categories/${currentCategoryId}`, categoryForm);
      } else {
        await axios.post('http://localhost:3000/categories', categoryForm);
      }
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEditCategory = (category) => {
    setCategoryForm(category);
    setEditMode(true);
    setCurrentCategoryId(category.id);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:3000/categories/${categoryId}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const resetForm = () => {
    setCategoryForm({ name: '' });
    setEditMode(false);
    setCurrentCategoryId(null);
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
