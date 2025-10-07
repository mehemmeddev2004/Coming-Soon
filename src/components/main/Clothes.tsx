"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getProducts } from "@/utils/fetchProducts"
import type { Product } from "@/types/product"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const Clothes = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts()

        if (Array.isArray(data)) {
          // Yalnız categoryId 13 olan məhsulları seçirik
          const filtered = data.filter((item) => Number(item.categoryId ?? item.category?.id) === 13).slice(0, 5)

          setProducts(filtered)
        }
      } catch (error) {
        console.error("Məhsullar gətirilə bilmədi:", error)
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

  // URL query string
  const queryString = new URLSearchParams({
    minPrice: "0",
    maxPrice: "1000",
    categoryId: "1",
    sortBy: "price",
    sortOrder: "asc",
  }).toString()

  // Məhsulun kateqoriyasını yoxla
  const isCategory13 = (item: Product) => Number(item.categoryId ?? item.category?.id) === 13

  // Yeni məhsul olub-olmamasını yoxla
  const isLatest = (dateString?: string) => {
    if (!dateString) return false
    const diff = (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 7
  }

  const renderProductCard = (item: Product) => (
    <Link key={item.id} href={`/product/${item.id}?${queryString}`}>
      <div className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
        <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-t-lg bg-gray-50">
          <img src={item.images || item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
        </div>

        {/* Məhsul detalları */}
        <div className="flex flex-col gap-2 px-3 pb-3">
          <div className="flex justify-between items-start gap-2">
            {(item.isNew || isLatest(item.createdAt || item.date)) && (
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex-shrink-0">
                <div className="w-1 h-1 bg-black rounded-full" />
                Latest
              </span>
            )}

            {item.specs && Array.isArray(item.specs) && (
              <div className="flex flex-wrap gap-1.5 justify-end">
                {item.specs
                  .flatMap((spec) => spec?.values || [])
                  .slice(0, 4)
                  .map((v, index) => (
                    <span
                      key={v?.id ?? index}
                      className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                      style={{
                        backgroundColor: typeof v?.value === "string" ? v.value : "#f3f4f6",
                      }}
                      title={v?.value || "Color option"}
                    />
                  ))}
              </div>
            )}
          </div>

          <span className="text-xs sm:text-[13px] text-gray-800 hover:text-gray-600 transition-colors font-normal leading-relaxed line-clamp-2">
            {item.name}
          </span>

          <span className="text-xs sm:text-[13px] font-semibold text-gray-900">AZN {item.price}</span>
        </div>
      </div>
    </Link>
  )

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="w-full lg:w-auto flex-shrink-0">
          <img
            src="/img/clothes.jpg"
            alt="Clothes"
            className="w-full lg:w-[500px] xl:w-[626px] h-[300px] sm:h-[400px] lg:h-[626px] object-cover rounded-xl"
          />
        </div>

        <div className="flex-1 min-w-0">
          {isMobile ? (
            <div className="overflow-hidden -mx-4 px-4">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={12}
                slidesPerView={1.5}
                grabCursor={true}
                breakpoints={{
                  480: { slidesPerView: 2, spaceBetween: 16 },
                  640: { slidesPerView: 2.5, spaceBetween: 16 },
                  768: { slidesPerView: 3, spaceBetween: 20 },
                }}
                className="!overflow-visible"
              >
                {products.filter(isCategory13).map((item) => (
                  <SwiperSlide key={item.id}>{renderProductCard(item)}</SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6">
              {products.filter(isCategory13).map(renderProductCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Clothes
