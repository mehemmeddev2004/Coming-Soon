"use client"

import { useCart } from '@/providers/CartProvider'
import { Product } from '@/types/product'
import { getProducts } from '@/utils/fetchProducts'
import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { Swiper, SwiperSlide } from 'swiper/react'



const PRODUCT_LIMIT = 10
const MOBILE_BREAKPOINT = 991


const RandomProduct = () => {
  const [products, setProducts] = useState<Product[]>([])
    const [isMobile, setIsMobile] = useState(false)
    const { addItem } = useCart()

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts()
        console.log('📦 Bütün məhsullar:', data.map(p => ({ id: p.id, name: p.name })))

        // Məhsulları təsadüfi qarışdırırıq
        const shuffled = data.sort(() => Math.random() - 0.5)
        // Qarışdırılmış siyahıdan limit qədərini götürürük
        const randomProducts = shuffled.slice(0, PRODUCT_LIMIT)

        setProducts(randomProducts)
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
    <div className='mt-[40px]'>
   <h2 className="text-xl sm:text-2xl lg:text-2xl text-center font-bold tracking-wide mb-10 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
       Diger mehsullarimiza goz ata bilersiniz
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

export default RandomProduct
