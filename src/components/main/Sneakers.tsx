"use client"

import { useCart } from "@/providers/CartProvider"
import { getProducts } from "@/utils/fetchProducts"
import type { Product } from "@/types/product"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const Sneakers = () => {
  const [products, setProducts] = useState<Product[]>([])
  const { addItem } = useCart()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProducts()
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : [])
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const filters = {
    minPrice: "0",
    maxPrice: "1000",
    categoryId: "1",
    sortBy: "price",
    sortOrder: "asc",
  }
  const queryString = new URLSearchParams(filters).toString()

  const isCategory15 = (item: Product) => Number(item.categoryId ?? item.category?.id) === 15

  const isLatest = (date?: string) => {
    if (!date) return false
    const created = new Date(date)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return created > weekAgo
  }

  const renderProductCard = (item: Product) => (
    <Link key={item.id} href={`/product/${item.id}?${queryString}`}>
      <div className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
        <div className="relative w-full aspect-square overflow-hidden rounded-t-lg mb-3">
          <img
            src={item.images || item.img}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Məhsul məlumatları */}
        <div className="flex flex-col gap-2 px-2 pb-2">
          <div className="flex justify-between items-start gap-2">
            {/* Latest etiketi */}
            {(item.isNew || isLatest(item.createdAt || item.date || "")) && (
              <span className="flex items-center gap-[5px] cursor-default text-[10px] sm:text-[11px] font-semibold leading-tight tracking-wider uppercase">
                <div className="w-[5px] h-[5px] bg-black rounded-full flex-shrink-0" /> Latest
              </span>
            )}

            {item.specs && Array.isArray(item.specs) && (
              <div className="flex flex-wrap gap-1.5 justify-end">
                {item.specs
                  .flatMap((spec: any) => (spec?.values && Array.isArray(spec.values) ? spec.values : []))
                  .slice(0, 4)
                  .map((v: any, index: number) => (
                    <span
                      key={v?.id ?? index}
                      className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                      style={{
                        backgroundColor: v?.value && typeof v.value === "string" ? v.value : "#f3f4f6",
                      }}
                      title={v?.name || v?.value || "Color option"}
                    />
                  ))}
              </div>
            )}
          </div>

          <span className="text-xs sm:text-[13px] text-gray-800 hover:text-gray-600 font-normal leading-relaxed tracking-wide line-clamp-2">
            {item.name}
          </span>

          <span className="text-sm sm:text-[13px] font-semibold leading-relaxed tracking-wide text-gray-900">
            AZN {item.price}
          </span>
        </div>
      </div>
    </Link>
  )

  const filteredProducts = products.filter(isCategory15)

  return (
    <div className="w-full max-w-[1430px] mx-auto flex flex-col px-4 py-6 sm:p-6 md:p-8">
      <span className="block text-lg sm:text-xl md:text-2xl text-center font-semibold uppercase tracking-wide font-sans mb-8 sm:mb-10 md:mb-12 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Ayaqqabilar
      </span>

      {isMobile ? (
        <div className="overflow-hidden -mx-4 px-4">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1.5}
            breakpoints={{
              480: {
                slidesPerView: 2.2,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3.2,
                spaceBetween: 20,
              },
            }}
            grabCursor={true}
            className="!overflow-visible"
          >
            {filteredProducts.map((item) => (
              <SwiperSlide key={item.id}>{renderProductCard(item)}</SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
            {filteredProducts.map(renderProductCard)}
          </div>
        </div>
      )}
    </div>
  )
}

export default Sneakers
