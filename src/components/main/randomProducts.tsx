"use client";
import ProductCard from '@/components/ui/product/ProductCard';
import { Product } from '@/types/product';
import { getProducts } from '@/utils/fetchProducts';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // assuming you use Swiper

const RandomProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch products when the component mounts
  useEffect(() => {
    const getFetchedProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.slice(0, 5)); // Limit to first 5 products
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    getFetchedProducts();
  }, []);

  // Determine if the user is on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Assuming mobile is <= 768px width
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Check initially on mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Render the products with conditional layout
  const renderProducts = () => {
    return (
      <div>
        {isMobile ? (
          <div className="overflow-hidden -mx-4 px-4">
            <Swiper
              spaceBetween={16}
              slidesPerView={1} // Only 1 slide per view on mobile
              breakpoints={{
                480: { slidesPerView: 1, spaceBetween: 16 },
                640: { slidesPerView: 1, spaceBetween: 16 }, // Adjusted for mobile
              }}
              grabCursor={true}
              className="!overflow-visible"
            >
              {products.map((item) => (
                <SwiperSlide key={item.id}>
                  <ProductCard item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return renderProducts();
};

export default RandomProducts;
