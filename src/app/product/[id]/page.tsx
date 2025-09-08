import { getProductById } from "@/utils/fetchProducts";
import React from "react";
import { notFound } from "next/navigation";
import Image from 'next/image'
 
// type
type Props = {
  params: Promise<{
    id: string;
  }>;
  
};

// məhsulu gətirən fake API (sən backend-dən fetch edəcəksən)
async function getProduct(id: string) {
  const product = await getProductById(id);
  console.log(product);
  return product;

}

const ProductPage = async ({ params }: Props) => {
  const { id } = await params;

  // məhsul datasını gətir
  const product = await getProduct(id);
  if (!product) return notFound();

  return (

     <div className="max-w-[1280px] h-[100vh] mx-auto p-6">
      <div className="flex gap-[10px] justify-center">
        <div className="w-[639px]">
          <Image src={product.image} width={639} height={639} alt="" />
        </div>

        <div className="w-[740px]">
          <div className="flex flex-col gap-y-[10px] items-center">
           <div>
                 <h2 className="text-[1.28571rem] font-proxima font-semibold uppercase tracking-[0.128571rem] leading-[26px]">{product.name}</h2>

           </div>
            {product.specs && (
              <div className="flex  gap-2">
                {product.specs.map((spec: any) =>
                  spec.values.map((v: any) => (
                    <span
                      key={v.id}
                      className="px-3 py-[2px] text-sm "
                      >
                      {v.value}
                    </span>
                  ))
                )}
              </div>
            )}
            <div className="flex flex-col items-center">
            <p>{product.price}</p>
            <p className="text-center">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

