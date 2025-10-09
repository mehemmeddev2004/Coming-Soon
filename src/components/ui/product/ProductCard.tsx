"use client"

import Link from "next/link"
import type { Product } from "@/types/product"
import { Badge } from "lucide-react"


const LATEST_DAYS = 7

const filters = {
  minPrice: "0",
  maxPrice: "1000",
  categoryId: "1",
  sortBy: "price",
  sortOrder: "asc",
}
const queryString = new URLSearchParams(filters).toString()

function isLatest(dateString?: string) {
  if (!dateString) return false
  const diffDays = (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= LATEST_DAYS
}

export const ProductCard = ({ item }: { item: Product }) => {
  return (
    <Link key={item.id} href={`/product/${item.id}?${queryString}`} className="group block">
      <article className="relative bg-white flex flex-col h-full rounded-2xl overflow-hidden border border-gray-200/60 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={item.images || item.img}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />

          {/* Latest Badge - Positioned on Image */}
          {(item.isNew || isLatest(item.createdAt || item.date)) && (
            <div className="absolute top-3 left-3">
              <span
                className="bg-black/90 hover:bg-black text-white backdrop-blur-sm px-3 py-1.5 text-xs font-semibold tracking-wide shadow-lg rounded-full inline-flex items-center"
              >
                <span className="relative flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  Yeni
                </span>
              </span>
            </div>
          )}

          {/* Color Specs - Positioned on Image */}
          {item.specs && Array.isArray(item.specs) && (
            <div className="absolute bottom-3 right-3">
              <div className="flex gap-1.5 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                {item.specs.map((spec, specIndex) =>
                  spec?.values && Array.isArray(spec.values)
                    ? spec.values.slice(0, 4).map((v, valIndex) => (
                        <span
                          key={v?.id ?? `${specIndex}-${valIndex}`}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200 cursor-pointer"
                          style={{
                            backgroundColor: v?.value && typeof v.value === "string" ? v.value : "#f3f4f6",
                          }}
                          title={v?.value || "Color option"}
                        />
                      ))
                    : null,
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-1 p-5">
          {/* Product Name */}
          <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors min-h-[2.5rem]">
            {item.name}
          </h3>

          {/* Price */}
          <div className=" border-t border-gray-100">
            <p className="text-2xl font-bold text-gray-900 tracking-tight">
              <span className="text-sm font-medium text-gray-500 mr-1">AZN</span>
              {item.price}
            </p>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-gray-900/5 transition-all duration-300 pointer-events-none" />
      </article>
    </Link>
  )
}

export default ProductCard
