'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AddToCartButton from '@/components/ui/button/AddToCartButton';
import ProductGallery from '@/components/ui/product/ProductGallery';
import type { Product } from '@/types/product';
import RandomProduct from '@/components/ui/product/RandomProduct';

interface ProductContentProps {
  product: Product;
  galleryImages: Array<{ id: string; url: string }>;
  mainImage: string;
}

export default function ProductContent({ product, galleryImages, mainImage }: ProductContentProps) {
  const currentSlug = usePathname();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Description');

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const tabItems = ['Description', 'Sizing', 'Shipping', 'Returns'];

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size === selectedSize ? null : size);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="w-full h-[30px] mb-[30px]">
        <p className="text-sm text-gray-600">
          You are currently viewing: <strong>{currentSlug}</strong> 
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="w-full">
          <ProductGallery 
            product={product} 
            galleryImages={galleryImages} 
            mainImage={mainImage} 
          />
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-xl font-medium text-gray-900">
              {typeof product.price === 'string' && !product.price.startsWith('AZN')
                ? `${product.price} AZN`
                : product.price}
            </p>
          </div>

          {product.specs && product.specs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.specs.flatMap((spec) =>
                spec.values?.map((value) => (
                  <span
                    key={`${spec.id}-${value.id}`}
                    className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md"
                  >
                    {value.value}
                  </span>
                ))
              )}
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">Select a size</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  className={`h-12 px-4 border rounded-md text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <AddToCartButton
            id={String(product.id)}
            name={product.name}
            price={typeof product.price === 'string' && !product.price.startsWith('AZN')
              ? parseFloat(product.price)
              : typeof product.price === 'string'
                ? parseFloat(product.price.replace(/[^0-9.,]/g, ''))
                : product.price}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
              !selectedSize ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!selectedSize}
          >
            {selectedSize ? 'Add To Cart' : 'Select a size'}
          </AddToCartButton>

          <div className="pt-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabItems.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-4">
              {activeTab === 'Description' && (
                <div className="prose max-w-none">
                  {product.description ? (
                    Array.isArray(product.description) ? (
                      <ul className=" pl-5 space-y-1">
                        {product.description.map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{product.description}</p>
                    )
                  ) : (
                    <p>No description available.</p>
                  )}
                </div>
              )}
              {activeTab === 'Sizing' && <p>Size guide məlumatları burada olacaq.</p>}
              {activeTab === 'Shipping' && <p>Shipping details burada olacaq.</p>}
              {activeTab === 'Returns' && <p>Return policy burada olacaq.</p>}
            </div>
          </div>
        </div>
      </div>
      <div>
        <RandomProduct/>
      </div>
    </div>
  );
}
