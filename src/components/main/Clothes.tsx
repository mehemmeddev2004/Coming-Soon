"use client"

import type { Product } from "@/types/product"
import { getProducts } from "@/utils/fetchProducts"
import Image from "next/image"
import { useEffect, useState } from "react"
import ProductCard from "../ui/product/ProductCard"


const Clothes = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Məhsulları gətir
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: Product[] = await getProducts()
        setProducts(response)
      } catch (error) {
        console.error("Məhsullar gətirilə bilmədi:", error)
      } finally {
        setLoading(false)
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
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 lg:mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Geyim Kolleksiyası</h2>
          <p className="text-gray-600 text-lg">Ən son moda trendləri və keyfiyyətli geyimlər</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-1/2 relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/img/clothes.jpg"
                width={700}
                height={850}
                alt="Clothes collection"
                className="w-full h-[500px] sm:h-[600px] lg:h-[850px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <p className="text-sm font-semibold text-gray-900">Yeni Kolleksiya 2025</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-[400px] bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                {products.filter(isCategory13).map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {!loading && products.filter(isCategory13).length === 0 && (
              <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">Məhsul tapılmadı</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Clothes
