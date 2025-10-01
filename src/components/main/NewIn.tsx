"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getProducts } from "@/utils/fetchProducts"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/providers/CartProvider"
import { Product } from "@/types/product"

const NewIn = () => {
  const [products, setProducts] = useState<Product[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts()
        // Maksimum 10 məhsul göstər
        setProducts(data.slice(0, 10))
        console.log("Gətirilən məhsullar:", data)
        console.log("🆔 Məhsul ID-ləri:", data.map(p => ({ id: p.id, name: p.name })))
      } catch (error) {
        console.error("Məhsullar gətirilə bilmədi:", error)
      }
    }
    fetchData()
  }, [])
  // Filter parametrləri (misal üçün sabit olaraq)
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
    <div className="mx-auto flex flex-col w-full h-[850px] mb-[30px] px-4 py-8">
    
      <span className="block text-[24px] text-center font-semibold uppercase tracking-wide font-sans mb-[40px] bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Yeni Gələnlər
      </span>
     <div className="w-[1280px] mx-auto max-w-full  flex flex-wrap gap-4">
  {products.map((item, index) => (
    <Link 
      key={index} 
      href={`/product/${item.id}?${queryString}`}
      onClick={() => console.log("🔗 Clicking product:", { id: item.id, name: item.name, url: `/product/${item.id}` })}
    >
      <div className="flex flex-col w-[256px] h-[256px] cursor-pointer">
        {/* IMAGE */}
        <div>
          <img
            src={item.images || item.img}
            alt={item.name}
            className="h-[256px] w-[256px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {/* CONTENT */}
        <div className="flex flex-col items-start">
          {(item.isNew || isLatest(item.createdAt || item.date || '')) && (
            <span className="flex items-center mb-[3px] gap-[5px] cursor-default  mt-[10px] text-[0.714286rem] font-semibold leading-[18px] tracking-[0.0714286rem] font-sans uppercase">
              <div className="w-[5px] h-[5px] bg-black"></div> Latest
            </span>
          )}
          <span className="m-0 mb-1 text-[13px] text-gray-800 hover:text-gray-400 font-normal leading-[18px] tracking-[0.02rem] font-sans normal-case">
            {item.name}
          </span>
          {item.specs && (
            <div className="flex items-center gap-2">
              {item.specs.map((spec, specIndex: number) =>
                spec.values.map((v, valIndex: number) => (
                  <span
                    className="block mb-[4px] text-[#999999] text-left cursor-auto text-base font-proxima tracking-[0.02rem] font-normal normal-case leading-[18px]"
                    key={`${specIndex}-${valIndex}`}
                  >
                    {v.value}
                  </span>
                ))
              )}
            </div>
          )}
          <span className="block text-left text-[13px] font-proxima tracking-[0.02rem] font-normal normal-case leading-[18px]">
            AZN {item.price}
          </span>
        </div>
      </div>
    </Link>
  ))}
</div>


     
    </div>
  )
}

export default NewIn
