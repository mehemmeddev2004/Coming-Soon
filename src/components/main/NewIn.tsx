"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getProducts } from "@/utils/fetchProducts"
import { useCart } from "@/providers/CartProvider"
import { Product } from "@/types/product"

const NewIn = () => {
  const [products, setProducts] = useState<Product[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts()
        setProducts(data.slice(0, 20)) // top 20 məhsul
      } catch (error) {
        console.error("Məhsullar gətirilə bilmədi:", error)
      }
    }
    fetchData()
  }, [])

  const filters = {
    minPrice: "0",
    maxPrice: "1000",
    categoryId: "1",
    sortBy: "price",
    sortOrder: "asc"
  }
  const queryString = new URLSearchParams(filters).toString()

  const isLatest = (dateString: string) => {
    if (!dateString) return false
    const diff = (new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 7
  }

  return (
    <div className="mx-auto flex flex-col w-full mb-[30px] px-4 py-8">
      <span className="block text-[24px] text-center font-semibold uppercase tracking-wide font-sans mb-[40px] bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Yeni Gələnlər
      </span>

      {/* Overflow container */}
      <div className="max-w-full mx-auto overflow-x-auto scrollbar-hide"
        style={{
    scrollbarWidth: "none", // Firefox
  }}>
        <div className="flex gap-4 min-w-[1280px]">
          {products
          .slice(0,10)
          .map((item) => (
            <Link key={item.id} href={`/product/${item.id}?${queryString}`}>
              <div className="flex-shrink-0 w-[256px] cursor-pointer">
                <img
                  src={item.images || item.img}
                  alt={item.name}
                  className="h-[256px] w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="flex flex-col items-start mt-[10px]">
                  {(item.isNew || isLatest(item.createdAt || item.date || '')) && (
                    <span className="flex items-center mb-[3px] gap-[5px] cursor-default text-[0.714286rem] font-semibold leading-[18px] tracking-[0.0714286rem] uppercase">
                      <div className="w-[5px] h-[5px] bg-black"></div> Latest
                    </span>
                  )}
                  <span className="mb-1 text-[13px] text-gray-800 hover:text-gray-400 font-normal leading-[18px] tracking-[0.02rem]">
                    {item.name}
                  </span>
                  {item.specs && (
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {item.specs
                        .filter(spec => spec.name.toLowerCase().includes("color"))
                        .flatMap(spec => spec.values.map((v, i) => (
                          <span
                            key={i}
                            className="text-[#999999] text-left text-base font-normal leading-[18px] tracking-[0.02rem]"
                          >
                            {v.value}
                          </span>
                        )))
                      }
                    </div>
                  )}
                  <span className="text-left text-[13px] font-normal leading-[18px] tracking-[0.02rem]">
                    AZN {item.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NewIn
