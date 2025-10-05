// Category API utility functions
const BASE_URL = '/api/category';
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

// Retry helper function
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = 1000
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error: any) {
    if (retries > 0) {
      // Don't retry on 4xx errors (client errors)
      if (error?.response?.status && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      console.log(`Retrying request... ${MAX_RETRIES - retries + 1}/${MAX_RETRIES}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(requestFn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Helper function to extract categories from API response
const extractCategories = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data?.categories && Array.isArray(data.categories)) return data.categories;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.id) return [data]; // Single category
  return [];
};

// Get all categories with retry and timeout
export const fetchCategories = async () => {
  return retryRequest(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      
      const response = await fetch(`${BASE_URL}/find`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
      const data = await response.json();
      return extractCategories(data);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server took too long to respond');
      }
      console.error('Fetch categories error:', error);
      return [];
    }
  });
};

// Delete a category
export const deleteCategory = async (id: string | number) => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token for category deletion:', token ? 'Present' : 'Missing');
    
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}/${id}/categoryId`, { method: 'DELETE', headers });
    
    console.log('Category delete response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Category delete error details:', errorData);
      
      if (response.status === 401) {
        throw new Error('Authentication required. Please login again.');
      } else if (response.status === 404) {
        throw new Error('Category not found. It may have already been deleted.');
      } else {
        throw new Error(errorData.message || 'Failed to delete category');
      }
    }
    
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
