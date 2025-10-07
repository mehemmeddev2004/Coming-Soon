"use client";

import Link from "next/link";
import Image from "next/image";

interface SpecValue {
  id?: string | number;
  name?: string;
  value?: string;
}

interface ProductSpec {
  id?: string | number;
  name?: string;
  values?: SpecValue[];
}

interface Product {
  id?: string | number;
  _id?: string | number;
  name: string;
  description?: string;
  price: number | string;
  img?: string;
  specs?: ProductSpec[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Helper for image url fallback
  const getImageUrl = (url: string | undefined) =>
    !url ? "/placeholder-image.jpg" : url.startsWith("//") ? `https:${url}` : url;

  return (
    <Link
      href={`/product/${product.id ?? product._id}`}
      className="p-3 w-full max-w-[442px] gap-[20px] rounded-lg flex flex-col  group"
    >
      {/* Image container */}
      <div className=" w-[442px] h-[442px]   sm:h-[442px]   relative bg-white flex items-center justify-center">
        <img
          src={getImageUrl(product.img)}
          alt={product.name}
          width={320}
          height={320}
          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 320px"
        />
      </div>

      {/* Başlıq + rənglər */}
      <div className="flex justify-between items-center mt-2">
        <h2 className="font-medium text-gray-900">{product.name}</h2>
        {product.specs && Array.isArray(product.specs) && (
          <div className="flex flex-wrap gap-2">
            {product.specs.map((spec: ProductSpec, specIndex: number) =>
              spec?.values && Array.isArray(spec.values) ? spec.values.map((v: SpecValue, valIndex: number) => (
                <span
                  key={v?.id ?? `${specIndex}-${valIndex}`}
                  className="w-5 h-5 rounded-full border border-gray-300"
                  style={{ 
                    backgroundColor: v?.value && typeof v.value === 'string' ? v.value : '#f3f4f6' 
                  }}
                  title={v?.name || v?.value || 'Color option'}
                />
              )) : null
            )}
          </div>
        )}
      </div>

      {/* Məlumat */}
      <h2 className="mb-1 text-[14px] font-normal font-sans text-gray-400 tracking-[0.02rem] leading-[18px] line-clamp-2 text-left">
        {product.description}
      </h2>

      {/* Qiymət */}
      <div className="flex justify-between items-center">
        <span className="text-[15px] font-semibold text-gray-700">
          AZN {product.price}
        </span>
      </div>
    </Link>
  );
}
   