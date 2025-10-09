"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/utils/fetchProducts"
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
  const [products, setProducts] = useState<Product[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts()
        setProducts(data.slice(0, PRODUCT_LIMIT))
      } catch (error) {
        console.error("Məhsullar gətirilə bilmədi:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-center font-bold uppercase tracking-wide mb-10 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Yeni Gələnlər
      </h2>

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
  )
}
