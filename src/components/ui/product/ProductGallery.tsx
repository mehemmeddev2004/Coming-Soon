"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type GalleryImage = {
  id: string;
  url: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  alt: string;
  className?: string;
};

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, alt, className }) => {
  return (
    <div className={className}>
      <Swiper
     
      >
        {images.map((item) => (
          <SwiperSlide key={item.id}>
       
            <img
              src={item.url}
              alt={alt}
              className="w-full h-auto object-cover rounded"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductGallery;
