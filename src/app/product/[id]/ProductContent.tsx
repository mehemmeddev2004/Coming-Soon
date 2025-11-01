'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (product) {
      setIsLoading(false);
    }
  }, [product]);

  const tabItems = ['Description', 'Sizing', 'Shipping', 'Returns'];

  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    purple: '#A855F7',
    pink: '#EC4899',
    gray: '#6B7280',
    grey: '#6B7280',
    brown: '#92400E',
    beige: '#D4C5B9',
    navy: '#1E3A8A',
    orange: '#F97316',
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size === selectedSize ? null : size);
  };

  // 🔹 Loading Screen
  if (isLoading) {
    return (
      <div role="status" className="flex items-center justify-center h-screen bg-black">
        <svg
          aria-hidden="true"
          className="inline w-10 h-10 text-gray-700 animate-spin fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 
            50 100.591C22.3858 100.591 0 78.2051 
            0 50.5908C0 22.9766 22.3858 0.59082 
            50 0.59082C77.6142 0.59082 100 22.9766 
            100 50.5908ZM9.08144 50.5908C9.08144 
            73.1895 27.4013 91.5094 50 91.5094C72.5987 
            91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 
            27.9921 72.5987 9.67226 50 9.67226C27.4013 
            9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 
            38.4038 97.8624 35.9116 97.0079 
            33.5539C95.2932 28.8227 92.871 
            24.3692 89.8167 20.348C85.8452 
            15.1192 80.8826 10.7238 75.2124 
            7.41289C69.5422 4.10194 63.2754 
            1.94025 56.7698 1.05124C51.7666 
            0.367541 46.6976 0.446843 41.7345 
            1.27873C39.2613 1.69328 37.813 
            4.19778 38.4501 6.62326C39.0873 
            9.04874 41.5694 10.4717 44.0505 
            10.1071C47.8511 9.54855 51.7191 
            9.52689 55.5402 10.0491C60.8642 
            10.7766 65.9928 12.5457 70.6331 
            15.2552C75.2735 17.9648 79.3347 
            21.5619 82.5849 25.841C84.9175 
            28.9121 86.7997 32.2913 88.1811 
            35.8758C89.083 38.2158 91.5421 
            39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // 🔹 Main Product Content
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="w-full h-[30px] mb-[30px]">
        <p className="text-sm text-gray-600">
          You are currently viewing: <strong>{currentSlug}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <div className="w-full">
          <ProductGallery product={product} galleryImages={galleryImages} mainImage={mainImage} />
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="mb-[5px] font-[Georgia,serif] text-[1rem] md:text-[1.125rem] font-normal tracking-[.05em] leading-[1.333em]">
              {product.name}
            </h1>
            <p className="text-[13px] text-gray-600">
              {typeof product.price === 'string' && !product.price.startsWith('AZN')
                ? `${product.price} AZN`
                : product.price}
            </p>
          </div>

          <span className="w-full h-[1px] bg-gray-300"></span>

          {/* Colors */}
          {product.specs && product.specs.length > 0 && (
            <div>
              {product.specs
                .filter((spec) => spec.key === 'color')
                .map((spec) => {
                  const colors: string[] = [];
                  spec.values?.forEach((value) => {
                    const splitColors = (value.value || '')
                      .split(',')
                      .map((c) => c.trim())
                      .filter(Boolean);
                    colors.push(...splitColors);
                  });

                  return (
                    <div key={spec.id}>
                      <div className="flex gap-1.5 bg-white/90 backdrop-blur-sm p-[2px] rounded-full shadow-inner w-fit">
                        <span className="text-[13px] text-gray-600">COLOR:</span>
                        {colors.slice(0, 4).map((color, idx) => {
                          const colorKey = color.toLowerCase();
                          const bgColor = colorMap[colorKey] ?? colorKey ?? '#f3f4f6';
                          return (
                            <span
                              key={`${spec.id}-color-${idx}`}
                              className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform duration-200 cursor-pointer"
                              style={{ backgroundColor: bgColor }}
                              title={color}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          <span className="w-full h-[1px] bg-gray-300"></span>

          {/* Sizes */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Select a size</h3>
            <div className="grid grid-cols-3 gap-2">
              {(() => {
                const sizeSpec = product.specs?.find((spec) => spec.key === 'size');
                const sizeValues = sizeSpec?.values || product.sizes || [];
                const sizes: string[] = [];
                sizeValues.forEach((size) => {
                  const value = typeof size === 'string' ? size : size.value;
                  sizes.push(...value.trim().split(/\s+/));
                });

                if (sizes.length > 0) {
                  return sizes.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSizeSelect(s)}
                      className={`h-12 px-4 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === s
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ));
                }
                return <p className="col-span-3 text-sm text-gray-500">No sizes available</p>;
              })()}
            </div>
          </div>

          {/* Add to Cart */}
          <AddToCartButton
            id={String(product.id)}
            name={product.name}
            price={
              typeof product.price === 'string'
                ? parseFloat(product.price.replace(/[^0-9.,]/g, ''))
                : product.price
            }
            size={selectedSize || undefined}
            color={product.specs?.[0]?.values?.[0]?.value}
            specs={product.specs}
            image={mainImage || product.img || product.imageUrl}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
              !selectedSize ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!selectedSize}
          >
            {selectedSize ? 'Add To Cart' : 'Select a size'}
          </AddToCartButton>

          {/* Tabs */}
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
                      <ul>
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

      {/* Random Product Section */}
      <div className="mt-10">
        <RandomProduct />
      </div>
    </div>
  );
}
