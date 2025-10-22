'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from "@/utils/fetchProducts";
import ProductContent from "./ProductContent";
import { Product } from "@/types/product";

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        console.log('Fetching product with ID:', productId);
        const productData = await getProductById(Number(productId));
        
        if (!productData) {
          throw new Error('Product not found');
        }

        console.log('Product data received:', productData);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || 'Product not found'}</p>
      </div>
    );
  }

  const galleryImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map((url: string, idx: number) => ({
        id: String(idx + 1),
        url,
      }))
    : [];

  const mainImage = product.img || galleryImages[0]?.url || '';

  return (
    <ProductContent
      product={product}
      galleryImages={galleryImages}
      mainImage={mainImage}
    />
  );
}
