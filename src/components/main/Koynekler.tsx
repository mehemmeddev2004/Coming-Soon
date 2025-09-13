"use client"
import { useCart } from '@/providers/CartProvider';
import { getProducts } from '@/utils/fetchProducts';
import React, { useEffect, useState } from 'react';

const Koynekler = () => {
      const [products, setProducts] = useState<any[]>([]);
      const { addItem } = useCart();
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
        fetchData();
      }, []);
  return (
    <div className=' '>
     
    </div>
  );
}

export default Koynekler;
