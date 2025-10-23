"use client"

import Link from "next/link"
import type { Product } from "@/types/product"
import ProductCardSkeleton from "./ProductCardSkeleton"

// --- Köməkçi dəyişənlər ---
const LATEST_DAYS = 7

// --- Köməkçi funksiyalar ---
function isLatest(dateString?: string) {
  if (!dateString) return false
  const diffDays = (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= LATEST_DAYS
}

// --- Alt komponentlər ---
const NewBadge = () => (
  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
    Yeni
  </div>
)

// Rəng xəritəsi
const colorMap: Record<string, string> = {
  red: "#FF0000",
  blue: "#0000FF",
  green: "#00FF00",
  black: "#000000",
  white: "#FFFFFF",
  yellow: "#FFFF00",
}

// --- Əsas komponent ---
const ProductCard = ({
  item,
  isLoading = false,
}: {
  item?: Product
  isLoading?: boolean
}) => {
  // Loading vəziyyəti (məs: API çağırışı gələnə qədər)
  if (isLoading || !item) {
    return <ProductCardSkeleton />
  }

  const isNewProduct = item.isNew || isLatest(item.createdAt || item.date)
  const imageUrl = item.images || item.img

  return (
    <Link
      href={`/product/${item.id}`}
      className="group block overflow-hidden bg-white relative rounded-xl shadow-sm hover:shadow-md transition"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover rounded-t-xl"
        />
        {isNewProduct && <NewBadge />}
      </div>

      <div className="p-3 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-[#333] group-hover:text-black transition-colors">
            {item.name}
          </h2>
          <p className="text-gray-700 font-semibold">{item.price} AZN</p>
        </div>

        {item.specs && Array.isArray(item.specs) && (
          <div className="flex gap-1.5 bg-white/90 backdrop-blur-sm p-[2px] rounded-full shadow-inner">
            {item.specs.map((spec, specIndex) =>
              spec?.values && Array.isArray(spec.values)
                ? spec.values.slice(0, 4).map((v, valIndex) => {
                    const colorKey = v.value?.toLowerCase() ?? ""
                    const bgColor =
                      colorMap[colorKey] ?? v.value?.toLowerCase() ?? "#f3f4f6"

                    return (
                      <span
                        key={v?.id ?? `${specIndex}-${valIndex}`}
                        className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform duration-200 cursor-pointer"
                        style={{ backgroundColor: bgColor }}
                        title={v?.value || "Color option"}
                      />
                    )
                  })
                : null
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard
