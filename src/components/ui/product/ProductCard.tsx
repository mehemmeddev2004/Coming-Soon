"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id ?? product._id}`}
      className="p-3 w-[320px] rounded-lg flex flex-col gap-y-[5px] group"
    >
      {/* Image container */}
      <div className="w-full h-[300px] rounded-t-2xl  overflow-hidden relative">
        <img
          src={product.img}
          alt={product.name}
          className="h-full w-full object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
        />

       
      </div>

      {/* Başlıq + rənglər */}
      <div className="flex justify-between items-center mt-2">
        <h2 className="font-medium text-gray-900">{product.name}</h2>
        {product.specs && (
          <div className="flex flex-wrap gap-2">
            {product.specs.map((spec: any, specIndex: number) =>
              spec.values.map((v: any, valIndex: number) => (
                <span
                  key={v.id ?? `${specIndex}-${valIndex}`}
                  className="w-5 h-5 rounded-full border"
                  style={{ backgroundColor: v.value }} // hex, rgb və ya rəng adı olmalıdır
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Məlumat */}
      <h2
        className="
          mb-1 
          text-[14px]
          font-normal 
          font-sans 
          text-gray-400
          tracking-[0.02rem] 
          leading-[18px] 
          line-clamp-2
          text-left
        "
      >
        {product.description}
      </h2>

      {/* Qiymət */}
      <div className="flex justify-between items-center">
        <span className="text-[15px]  font-semibold text-gray-700">
          AZN {product.price}
        </span>
      </div>
    </Link>
  );
}
