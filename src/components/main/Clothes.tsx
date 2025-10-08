"use client"

import type { Product } from "@/types/product"
import { getProducts } from "@/utils/fetchProducts"
import Image from "next/image"
import { useEffect, useState } from "react"

const Clothes = () => {
  const [products, setProducts] = useState<Product[]>([])

  // Məhsulları gətir
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: Product[] = await getProducts()
        setProducts(response)
      } catch (error) {
        console.error("Məhsullar gətirilə bilmədi:", error)
      }
    }
    fetchData()
  }, [])

  // Kategoriya 13 olan məhsulları göstər
  const isCategory13 = (item: Product) => Number(item.categoryId ?? item.category?.id) === 13

  // 7 gündən yeni məhsulları yoxla
  const isLatest = (dateString?: string) => {
    if (!dateString) return false
    const diffDays = (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }

  return (
    <div className="max-w-[1280px] w-full flex flex-col lg:flex-row justify-between gap-6 lg:gap-8 mx-auto">
      {/* Sol tərəfdə şəkil */}
      <div className="w-full lg:w-1/2">
        <Image
          src="/img/clothes.jpg"
          width={600}
          height={650}
          alt="Clothes collection"
          className="w-full h-[400px] sm:h-[500px] lg:h-[650px] object-cover rounded-lg"
        />
      </div>

      {/* Məhsul kartları */}
      <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5 lg:gap-6">
        {products
          .filter(isCategory13)
          .slice(0, 3)
          .map((item, index) => (
            <div
              key={index}
              className="flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition p-3 w-full"
            >
              {/* Şəkil */}
              <div className="w-full aspect-square mb-3">
                <img
                  src={item.img || item.images}
                  alt={item.name || "Product"}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Məzmun */}
              <div className="w-full flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-2">
                  {/* Latest badge */}
                  {(item.isNew || isLatest(item.createdAt || item.date)) && (
                    <span className="flex items-center gap-[5px] cursor-default text-[0.714rem] font-semibold leading-[18px] tracking-[0.0714rem] uppercase">
                      <div className="w-[5px] h-[5px] bg-black rounded-full flex-shrink-0" />
                      Latest
                    </span>
                  )}

                  {/* Rəng spesifikasiyaları */}
                  {item.specs && Array.isArray(item.specs) && (
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {item.specs.map((spec: any, specIndex: number) =>
                        spec?.values && Array.isArray(spec.values)
                          ? spec.values.slice(0, 4).map((v: any, valIndex: number) => (
                              <span
                                key={v?.id ?? `${specIndex}-${valIndex}`}
                                className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    v?.value && typeof v.value === "string" ? v.value : "#f3f4f6",
                                }}
                                title={v?.name || v?.value || "Color option"}
                              />
                            ))
                          : null,
                      )}
                    </div>
                  )}
                </div>

                {/* Məhsul adı */}
                <span className="text-base font-normal leading-[18px] tracking-[0.02rem] font-sans text-left line-clamp-2">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Clothes
