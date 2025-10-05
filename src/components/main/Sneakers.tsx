"use client"

import { useCart } from "@/providers/CartProvider"
import { getProducts } from "@/utils/fetchProducts"
import type { Product } from "@/types/product"
import Link from "next/link"
import { useEffect, useState } from "react"

const Sneakers = () => {
  const [products, setProducts] = useState<Product[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProducts()
        console.log("Fetched products:", fetchedProducts)
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : [])
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchData()
  }, [])

  const isCategory15 = (item: Product) => {
    if (item.categoryId) return Number(item.categoryId) === 15
    if (item.category?.id) return Number(item.category.id) === 15
    return false
  }

  const isLatest = (date?: string) => {
    if (!date) return false
    const created = new Date(date)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return created > weekAgo
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl lg:text-4xl text-center font-semibold uppercase tracking-wide font-sans mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
        Ayaqqabılar
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2">
          <img src="/img/sneaker.jpeg" alt="Sneaker Banner" className="w-full aspect-[3/2] h-[520px] rounded-lg" />
        </div>

        <div className="w-full lg:w-1/2 rounded-lg flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 lg:max-h-[676px] lg:overflow-y-auto">
            {products.filter(isCategory15).length === 0 ? (
              <div className="col-span-full flex justify-center items-center text-muted-foreground py-10">
                Heç bir məhsul tapılmadı.
              </div>
            ) : (
              products
                .filter(isCategory15)
                .slice(0, 10)
                .map((item, index) => (
                  <div key={index} className="flex flex-col items-start gap-2">
                    <Link
                      key={item.id}
                      href={{
                        pathname: `/product/${item.id}`,
                        query: {
                          category: item.categoryId || item.category?.id || "15",
                          name: encodeURIComponent(item.name || ""),
                        },
                      }}
                    >
                      <div className="w-full cursor-pointer">
                        <img
                          src={item.images || item.img}
                          alt={item.name}
                          className="w-full aspect-square object-cover rounded-md transition-transform duration-300 hover:scale-105"
                        />
                        <div className="flex flex-col items-start mt-2">
                          {(item.isNew || isLatest(item.createdAt || item.date || "")) && (
                            <span className="flex items-center mb-1 gap-1 text-xs font-semibold uppercase tracking-wider">
                              <div className="w-1 h-1 bg-black rounded-full"></div> Latest
                            </span>
                          )}
                          <span className="mb-1 text-sm text-gray-800 hover:text-gray-400 font-normal tracking-wide">
                            {item.name}
                          </span>
                          {item.specs && (
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {item.specs
                                .filter((spec) => spec.name.toLowerCase().includes("color"))
                                .flatMap((spec) =>
                                  spec.values.map((v, i) => (
                                    <span key={i} className="text-gray-500 text-sm font-normal tracking-wide">
                                      {v.value}
                                    </span>
                                  )),
                                )}
                            </div>
                          )}
                          <span className="text-sm font-normal tracking-wide">AZN {item.price}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sneakers
