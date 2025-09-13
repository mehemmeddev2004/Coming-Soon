"use client";
import { useCart } from "@/providers/CartProvider";
import { getCategories } from "@/utils/fetchCategories";
import { getProducts } from "@/utils/fetchProducts";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Sneakers = () => {
  const [products, setProducts] = useState<any[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-[1280px] max-[1297px]:flex-col flex justify-between mx-auto gap-4">
      {/* Left Image */}
      <div className="w-full">
        <img
          src="/img/sneaker.jpeg"
          className="w-[676px] h-[676px] object-cover"
          alt="Sneaker Banner"
        />
      </div>

      {/* Product List */}
      <div className="w-full h-[676px] bg-gray-300 flex flex-col gap-4 overflow-y-auto p-2">
        {products
          .filter((item) => item.categoryId === 1)
          .slice(0, 10)
          .map((item, index) => (
            <div key={index} className="flex flex-col items-start gap-2">
              {/* Product Link */}
              <Link
                href={`/product/${item.id}`}
                className="relative group flex flex-col cursor-pointer w-[300px]"
              >
                {/* Image container */}
                <div className="w-full h-[300px] bg-gray-100 overflow-hidden relative">
                  <img
                    src={
                      item.imageUrl ||
                      item.img ||
                      "https://media.endclothing.com/media/f_auto,q_auto:eco,w_1600/prodmedia/media/catalog/product/0/9/09-09-2025-ns_jv6464_1.jpg"
                    }
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay button */}
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

                {/* Product Info */}
                <div className="flex flex-col items-start gap-y-1 mt-2">
                  <span className="text-base font-proxima tracking-[0.02rem] leading-[18px] line-clamp-2">
                    {item.description}
                  </span>

                  {/* Specs */}
                  {item.specs?.map((spec: any, specIndex: number) =>
                    spec.values.map((v: any, valIndex: number) => (
                      <span
                        className="text-[#999999] text-left text-base font-proxima tracking-[0.02rem] leading-[18px]"
                        key={`${specIndex}-${valIndex}`}
                      >
                        {v.color ? v.color : v.value}
                      </span>
                    ))
                  )}

                  {/* Latest badge */}
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
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sneakers;
