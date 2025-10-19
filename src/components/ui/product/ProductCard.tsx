"use client"

import Link from "next/link"
import type { Product } from "@/types/product"

// --- Köməkçi dəyişənlər ---
const LATEST_DAYS = 7
const filters = { minPrice: "0", maxPrice: "1000", categoryId: "1", sortBy: "price", sortOrder: "asc" }
const queryString = new URLSearchParams(filters).toString()

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

// Rəng xəritəsi — rəng adlarını hex-koda çeviririk
const colorMap: Record<string, string> = {
  red: "#FF0000",
  blue: "#0000FF",
  green: "#00FF00",
  black: "#000000",
  white: "#FFFFFF",
  yellow: "#FFFF00",
  // İstəsən digər rəngləri də əlavə edə bilərsən
}

const ProductCard = ({ item }: { item: Product }) => {
  const isNewProduct = item.isNew || isLatest(item.createdAt || item.date)
  const imageUrl = item.images || item.img

  return (
    <Link
      href={`/product/${item.id}?${queryString}`}
      className="group block overflow-hidden bg-white relative" // burada relative əlavə edildi
    >
      <div>
        <div className="mb-[.75rem] relative">
          <img src={imageUrl} alt={item.name} className=" h-auto object-cover" />
          {isNewProduct && <NewBadge />}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-[.875rem] font-400 text-[#333]">{item.name}</h2>
            <p>{item.price} AZN</p>
          </div>

          {item.specs && Array.isArray(item.specs) && (
            <div className="">
              <div className="flex gap-1.5 p-[2px] bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                {item.specs.map((spec, specIndex) =>
                  spec?.values && Array.isArray(spec.values)
                    ? spec.values.slice(0, 4).map((v, valIndex) => {
                        const colorKey = v.value?.toLowerCase() ?? ""
                        const bgColor = colorMap[colorKey] ?? v.value?.toLowerCase() ?? "#f3f4f6"

                        return (
                          <span
                            key={v?.id ?? `${specIndex}-${valIndex}`}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200 cursor-pointer"
                            style={{ backgroundColor: bgColor }}
                            title={v?.value || "Color option"}
                          />
                        )
                      })
                    : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
