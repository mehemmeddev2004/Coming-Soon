"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { getProducts } from "@/utils/fetchProducts"
import type { Product } from "@/types/product"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import ProductCard from "../ui/product/ProductCard"


const Kastyumlar = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isMobile, setIsMobile] = useState(false)

  // ✅ Məhsulları gətiririk
  useEffect(() => {
    const getproduct = async () => {
      try {
        const product = await getProducts()
        setProducts(product)
      } catch (error) {
        console.error("Məhsullar gətirilə bilmədi:", error)
      }
    }

    getproduct()
  }, [])

  // ✅ Ekran ölçüsünə görə layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // ✅ Yalnız 15-ci kateqoriyalı məhsullar
  const filteredProducts = products.filter((item) => item.categoryId === 15)

  return (
    <div className="px-4 sm:px-6 md:px-10">
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-center font-bold uppercase tracking-wide mb-10 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Kostyumlar
      </h2>

      {isMobile ? (
        <div className="overflow-hidden -mx-4 px-4">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1.5}
            breakpoints={{
              480: { slidesPerView: 2.2, spaceBetween: 16 },
              640: { slidesPerView: 2.5, spaceBetween: 20 },
              768: { slidesPerView: 3.2, spaceBetween: 20 },
            }}
            pagination={{ clickable: true }}
            navigation
            grabCursor
            className="!overflow-visible"
          >
            {filteredProducts.map((item) => (
              <SwiperSlide key={item.id}>
                <ProductCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Kastyumlar
