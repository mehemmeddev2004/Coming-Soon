"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getProducts } from "@/utils/fetchProducts"
import { useCart } from "@/providers/CartProvider"
import type { Product } from "@/types/product"

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const NewIn = () => {
  const [products, setProducts] = useState<Product[]>([])
  const { addItem } = useCart()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts()
        setProducts(data.slice(0, 10)) // ilk 10 məhsul
      } catch (error) {
        console.error("Məhsullar gətirilə bilmədi:", error)
      }
    }
    fetchData()
  }, [])

  // 991px altı üçün Swiper aktivləşdir
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991)
    }

    handleResize() // ilk açılışda yoxla
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

  const isLatest = (dateString?: string) => {
  if (!dateString) return false
  const diffDays =
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 7
}


  const renderProductCard = (item: Product) => (
    <Link key={item.id} href={`/product/${item.id}?${queryString}`}>
      <div className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
        <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-t-lg">
          <img src={item.images || item.img} alt={item.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-2 pl-[13px]">
          <div className="flex justify-between items-start gap-2">
            {(item.isNew || isLatest(item.createdAt || item.date)) && (
            <span className="flex items-center mb-[3px] gap-[5px] cursor-default text-[0.714286rem] font-semibold leading-[18px] tracking-[0.0714286rem] uppercase">
              <div className="w-[5px] h-[5px] bg-black rounded-full" /> Latest
            </span>
          )}

            {item.specs && Array.isArray(item.specs) && (
              <div className="flex flex-wrap gap-1.5 justify-end">
                {item.specs.map((spec: any, specIndex: number) =>
                  spec?.values && Array.isArray(spec.values)
                    ? spec.values.slice(0, 4).map((v: any, valIndex: number) => (
                        <span
                          key={v?.id ?? `${specIndex}-${valIndex}`}
                          className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                          style={{
                            backgroundColor: v?.value && typeof v.value === "string" ? v.value : "#f3f4f6",
                          }}
                          title={v?.name || v?.value || "Color option"}
                        />
                      ))
                    : null,
                )}
              </div>
            )}
          </div>

          <span className="text-xs sm:text-[13px] text-gray-800 hover:text-gray-600 transition-colors font-normal leading-snug tracking-wide line-clamp-2">
            {item.name}
          </span>

          <span className="text-xs sm:text-[13px] font-semibold leading-tight tracking-wide">AZN {item.price}</span>
        </div>
      </div>
    </Link>
  )

  return (
    <div className="w-full max-w-[1280px] mx-auto  px-4 py-6 ">
      <h2 className="text-lg sm:text-xl lg:text-2xl text-center font-semibold uppercase tracking-wide mb-8 sm:mb-10 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Yeni Gələnlər
      </h2>

      {isMobile ? (
        <div className="overflow-hidden -mx-4 px-4">
          <Swiper
            spaceBetween={12}
            slidesPerView={1.5}
            breakpoints={{
              480: {
                slidesPerView: 2.2,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3.2,
                spaceBetween: 16,
              },
            }}
            grabCursor={true}
            className="!overflow-visible"
          >
            {products.map((item) => (
              <SwiperSlide key={item.id}>{renderProductCard(item)}</SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
          {products.map(renderProductCard)}
        </div>
      )}
    </div>
  )
}

export default NewIn
