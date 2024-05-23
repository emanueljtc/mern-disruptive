import axios from './axios';
import { categoryT } from '../types/categoryT';

// Get All Categories
export const getCategoriesRq = () => axios.get('api/categories');

// Create Category
export const createCategoryRq = (category: categoryT) =>
  axios.post('api/categories', category);

// Delete Category
export const deleteCategoryRq = (_id: string | number) =>
  axios.delete(`api/categories/${_id}`);

// Update Category
export const updateCategoryRq = (id: string, category: categoryT) =>
  axios.put(`api/categories/${id}`, category);

// Get Category
export const getCategoryRq = (_id: string | number) =>
  axios.get(`api/categories/${_id}`);

