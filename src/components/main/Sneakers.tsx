"use client"

import { useCart } from "@/providers/CartProvider"
import { getProducts } from "@/utils/fetchProducts"
import type { Product } from "@/types/product"
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"


import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import ProductCard from "../ui/product/ProductCard"

const Sneakers = () => {
  const [products, setProducts] = useState<Product[]>([])
  const { addItem } = useCart()
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)

  // ✅ Məhsulları gətir
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const fetchedProducts = await getProducts()
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ✅ Ekran ölçüsünə görə layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // ✅ Yalnız 15-ci kateqoriyalı məhsullar
  const filteredProducts = products.filter(
    (item) => Number(item.categoryId ?? item.category?.id) === 15
  )

  return (
    <div className="w-full max-w-[1470px] mx-auto flex flex-col px-4 py-6 sm:p-6 md:p-8">
     <div className=" pb-[32px]">
     <div className="flex justify-between items-center">
      <span className="text-[20px] font-[600] leading-[30px] tracking-[0.157143rem] uppercase font-[Proxima Nova,'Helvetica Neue',Verdana,Arial,sans-serif]">Ayaqqabilar</span>
      <span className="text-[1rem] font-[400]   decoration-black decoration-2 leading-[22px] tracking-[0.02rem] text-[#999999] no-underline block ml-[20px] font-[Proxima Nova,'Helvetica Neue',Verdana,Arial,sans-serif]">Hamisina baxin</span>
     </div>
    </div>
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
            grabCursor
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
              : filteredProducts.map((item) => (
                  <SwiperSlide key={item.id}>
                    <ProductCard item={item} />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      ) : (
        <div className="max-w-[1430px] mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
            {loading
              ? Array(10)
                  .fill(null)
                  .map((_, i) => <ProductCard key={i} isLoading />)
              : filteredProducts.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Sneakers
