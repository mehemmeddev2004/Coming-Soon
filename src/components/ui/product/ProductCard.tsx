"use client";

import Link from "next/link";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      href={`/product/${product.id ?? product._id}`} 
      className="p-3 w-[320px] rounded-lg flex flex-col gap-y-[5px]  "
    >
      {/* Şəkil */}
      <img
        src="https://media.endclothing.com/media/f_auto,q_auto:eco,w_1600/prodmedia/media/catalog/product/2/8/28-08-2025_JD_MLM100107-08_1_1.jpg"
        width={500}
        height={400}
        alt={product.name || "Product Image"}
        className="rounded-md object-cover "
      />
      <h2 className="">{product.name}</h2>

      {/* Melumat */}
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

      {/* Specs */}
   {product.specs && (
  <div className="flex flex-wrap gap-2">
    {product.specs.map((spec: any) =>
      spec.values.map((v: any) => (
        <span
          key={v.id}
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: v.value }} // v.value hex, rgb və ya color adı olmalıdır
        />
      ))
    )}
  </div>
)}


     <div className="flex justify-between items-center ">
 {/* Qiymət */}
      <span className=" text-[15px] mt-[14px] font-semibold text-gray-700">
        AZN {product.price}
      </span>

       <div className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium px-3 mb-[4px] py-1.5 rounded-full transition-colors duration-200">
          Add to Cart
        </div>
     </div>
    </Link>
  );
}
