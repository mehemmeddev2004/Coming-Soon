import axios from "axios";

const BASE_URL = "http://localhost:3001/api/products";

// Bütün məhsulları gətir
export const getProducts = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (err) {
    console.error("Məhsullar gətirilə bilmədi:", err);
    return [];
  }
};

// ID-yə görə məhsul
export const getProductById = async (id: string | number) => {
  try {
    const res = await axios.get(`${BASE_URL}?id=${id}`);
    if (Array.isArray(res.data)) {
      return res.data[0] || null;
    }
    return res.data;
  } catch (err) {
    console.error("Məhsul tapılmadı:", err);
    return null;
  }
};


// Məhsul əlavə et
export const createProduct = async (data: any) => {
  try {
    const res = await axios.post(BASE_URL, data);
    return res.data;
  } catch (err) {
    console.error("Məhsul əlavə olunmadı:", err);
    return null;
  }
};

// Məhsulu yenilə
export const updateProduct = async (id: string | number, data: any) => {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Məhsul yenilənmədi:", err);
    return null;
  }
};

// Məhsulu sil
export const deleteProduct = async (id: string | number) => {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Məhsul silinmədi:", err);
    return null;
  }
};

// Filtrləmə
export const filterProducts = async (filters: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/filter`, filters);
    return res.data;
  } catch (err) {
    console.error("Filtr işləmir:", err);
    return [];
  }
};
