// Category API utility functions
const BASE_URL = '/api/category';

// Helper function to extract categories from API response
const extractCategories = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data?.categories && Array.isArray(data.categories)) return data.categories;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.id) return [data]; // Single category
  return [];
};

// Get all categories
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/find`);
    if (!response.ok) throw new Error(`Failed to fetch categories`);
    const data = await response.json();
    return extractCategories(data);
  } catch (error) {
    console.error('Fetch categories error:', error);
    return [];
  }
};

// Delete a category
export const deleteCategory = async (id: string | number) => {
  try {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}/${id}/categoryId`, { method: 'DELETE', headers });
    if (!response.ok) throw new Error('Failed to delete category');
    return await response.json();
  } catch (error) {
    console.error('Delete category error:', error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (categoryData: any) => {
  try {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) throw new Error('Failed to create category');
    return await response.json();
  } catch (error) {
    console.error('Create category error:', error);
    throw error;
  }
};

// Search categories
export const searchCategories = async (params: Record<string, string>) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/find?${query}`);
    if (!response.ok) throw new Error('Category search failed');
    return await response.json();
  } catch (error) {
    console.error('Search categories error:', error);
    throw error;
  }
};

// Filter categories
export const filterCategories = async (params: Record<string, string>) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/filter?${query}`);
    if (!response.ok) throw new Error('Category filter failed');
    return await response.json();
  } catch (error) {
    console.error('Filter categories error:', error);
    throw error;
  }
};

// Update category
export const updateCategory = async (categoryId: string, categoryData: any) => {
  try {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}/${categoryId}/categoryId`, {
      method: 'POST',
      headers,
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) throw new Error('Failed to update category');
    return await response.json();
  } catch (error) {
    console.error('Update category error:', error);
    throw error;
  }
};
