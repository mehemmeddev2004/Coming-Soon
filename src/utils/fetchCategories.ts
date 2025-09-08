import axios from "axios";

const BASE_URL = "http://localhost:3001/api/category";

// bütün məhsulları gətirir
export const getCategories = async () => {
  try {
   const res = await axios.get(`${BASE_URL}/find`);

    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
