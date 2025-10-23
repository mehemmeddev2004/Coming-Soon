"use client"

import { useEffect, useState } from "react"
import { useProducts } from "@/hooks/useProducts"
import { useCart } from "@/providers/CartProvider"
import type { Product } from "@/types/product"
import { Swiper, SwiperSlide } from "swiper/react"


import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import ProductCard from "../ui/product/ProductCard"

const PRODUCT_LIMIT = 10
const MOBILE_BREAKPOINT = 991

export default function NewIn() {
  const { data: allProducts = [], isLoading: loading } = useProducts()
  const products = allProducts.slice(0, PRODUCT_LIMIT)
  const [isMobile, setIsMobile] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="w-full max-w-[1430px] mx-auto px-4 py-8">
    <div className=" pb-[32px]">
     <div className="flex justify-between items-center">
      <span className="text-[20px] font-[600] leading-[30px] tracking-[0.157143rem] uppercase font-[Proxima Nova,'Helvetica Neue',Verdana,Arial,sans-serif]">Yeni Gələnlər</span>
      <span className="text-[1rem] font-[400]   decoration-black decoration-2 leading-[22px] tracking-[0.02rem] text-[#999999] no-underline block ml-[20px] font-[Proxima Nova,'Helvetica Neue',Verdana,Arial,sans-serif]">Hamisina baxin</span>
     </div>
    </div>

      {isMobile ? (
        <div className="overflow-hidden -mx-4 px-4">
          <Swiper
            spaceBetween={16}
            slidesPerView={1.3}
            breakpoints={{
              480: { slidesPerView: 2.2, spaceBetween: 16 },
              640: { slidesPerView: 2.5, spaceBetween: 20 },
              768: { slidesPerView: 3.2, spaceBetween: 20 },
            }}
            grabCursor={true}
            className="!overflow-visible"
          >
            {loading
              ? Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <SwiperSlide key={i}>
                      <ProductCard isLoading />
                    </SwiperSlide>
                  ))
              : products.map((item) => (
                  <SwiperSlide key={item.id}>
                    <ProductCard item={item} />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading
            ? Array(PRODUCT_LIMIT)
                .fill(null)
                .map((_, i) => <ProductCard key={i} isLoading />)
            : products.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
        </div>
      )}
    </div>
  )
}
