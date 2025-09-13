"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getProducts } from "@/utils/fetchProducts"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/providers/CartProvider"

const NewIn = () => {
  const [products, setProducts] = useState<any[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="mx-auto w-full flex flex-col max-w-7xl px-4 py-8 ">
      <span className="block text-[24px] pl-[5px]  text-center font-semibold uppercase tracking-wide font-sans mb-[40px] bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Yeni Gələnlər
      </span>

      <div className="flex flex-wrap gap-6">
        {products.slice(0, 10).map((item: any) => (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
            className="relative group flex flex-col cursor-pointer w-[300px]"
          >
            {/* Image container */}
            <div className="w-full h-[300px] bg-gray-100 overflow-hidden relative">
              <img
                src={item.imageUrl || "https://media.endclothing.com/media/f_auto,q_auto:eco,w_1600/prodmedia/media/catalog/product/0/9/09-09-2025-ns_jv6464_1.jpg"}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute bottom-0 w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="flex items-center w-full gap-2 bg-white text-black px-4 py-2 text-center justify-center font-medium hover:bg-black hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addItem({ id: String(item.id), name: item.name, price: item.price });
                  }}
                  type="button"
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              </div>
            </div>

            {/* Product info */}
            <div className="flex flex-col items-start gap-y-1 mt-2">
              <span className="mb-1 text-base font-proxima tracking-[0.02rem] font-normal normal-case leading-[18px] text-left line-clamp-2">
                {item.description}
              </span>

              {item.specs && (
                <div className="flex flex-wrap gap-2">
                  {item.specs.map((spec: any, specIndex: number) =>
                    spec.values.map((v: any, valIndex: number) => (
                      <span
                        className="mb-1 text-[#999999] text-left cursor-auto text-base font-proxima tracking-[0.02rem] font-normal normal-case leading-[18px]"
                        key={`${specIndex}-${valIndex}`}
                      >
                        {v.color ? v.color : v.value}
                      </span>
                    ))
                  )}
                </div>
              )}

              {item.date &&
                new Date(item.date) >
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                  <span className="text-sm text-blue-600 font-semibold">
                    Latest
                  </span>
                )}

              <span className="font-semibold">{item.price} AZN</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NewIn
