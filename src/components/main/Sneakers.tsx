"use client";

import { useCart } from "@/providers/CartProvider";
import { getProducts } from "@/utils/fetchProducts";
import { Product } from "@/types/product";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Sneakers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProducts();
        console.log("Fetched products:", fetchedProducts);
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  // 🔍 Sneaker kateqoriyasını yoxla (id:15)
  const isCategory15 = (item: Product) => {
    if (item.categoryId) return Number(item.categoryId) === 15;
    if (item.category?.id) return Number(item.category.id) === 15;
    return false;
  };

  // 🕒 Son 7 gündə əlavə olunanlar üçün "Latest" etiketi
  const isLatest = (date?: string) => {
    if (!date) return false;
    const created = new Date(date);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return created > weekAgo;
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-6 p-4">
      {/* 🔹 Başlıq */}
      <span className="block text-[24px] text-center font-semibold uppercase tracking-wide font-sans mb-[20px] bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Ayaqqabılar
      </span>

      {/* 🔹 Kontent hissə */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 🖼 Sol Banner şəkli */}
        <div className="w-full lg:w-1/2">
          <img
            src="/img/sneaker.jpeg"
            className="w-full h-auto max-h-[600px] object-cover rounded-lg"
            alt="Sneaker Banner"
          />
        </div>

        {/* 🛍 Məhsul siyahısı */}
        <div className="w-full lg:w-1/2 h-auto lg:max-h-[676px] rounded-lg flex flex-col gap-4 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.filter(isCategory15).length === 0 ? (
              <div className="col-span-full flex justify-center items-center text-gray-500 py-10">
                Heç bir məhsul tapılmadı.
              </div>
            ) : (
              products
                .filter(isCategory15)
                .slice(0, 10)
                .map((item, index) => (
                  <div key={index} className="flex flex-col items-start gap-2">
                    <Link
                      href={`/product/${item.id}`}
                      className="relative group flex flex-col cursor-pointer w-full"
                    >
                      {/* 🖼 Şəkil konteyneri */}
                      <div className="w-full h-[250px] bg-gray-100 overflow-hidden relative rounded-md">
                        <img
                          src={
                            item.imageUrl ||
                            item.img ||
                            "https://media.endclothing.com/media/f_auto,q_auto:eco,w_1600/prodmedia/media/catalog/product/0/9/09-09-2025-ns_jv6464_1.jpg"
                          }
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* 🛒 Hover Add to Cart düyməsi */}
                        <div className="absolute bottom-0 w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            className="flex items-center w-full gap-2 bg-white text-black px-4 py-2 text-center justify-center font-medium hover:bg-black hover:text-white transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addItem({
                                id: String(item.id),
                                name: item.name,
                                price: Number(item.price),
                              });
                            }}
                            type="button"
                          >
                            <ShoppingBag size={18} /> Add to Cart
                          </button>
                        </div>
                      </div>

                      {/* 🆕 Latest etiketi */}
                      {isLatest(item.date || item.createdAt) && (
                        <span className="flex items-center mb-[3px] gap-[5px] cursor-default mt-[10px] text-[0.714286rem] font-semibold leading-[18px] tracking-[0.0714286rem] font-sans uppercase">
                          <div className="w-[5px] h-[5px] bg-black"></div> Latest
                        </span>
                      )}

                      {/* 📜 Məhsul məlumatı */}
                      <div className="flex flex-col items-start gap-y-1 mt-2">
                        <span className="text-base font-proxima tracking-[0.02rem] leading-[18px] line-clamp-2">
                          {item.description || item.name}
                        </span>

                        {/* 🔹 Specs */}
                        {item.specs?.map((spec, specIndex: number) =>
                          spec.values.map((v, valIndex: number) => (
                            <span
                              className="text-[#999999] text-left text-sm font-proxima tracking-[0.02rem] leading-[18px]"
                              key={`${specIndex}-${valIndex}`}
                            >
                              {v.value}
                            </span>
                          ))
                        )}

                        {/* 💰 Qiymət */}
                        <span className="font-semibold">{item.price} AZN</span>
                      </div>
                    </Link>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sneakers;
