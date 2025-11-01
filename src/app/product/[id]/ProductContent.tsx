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
    // Simulate loading or wait for product data
    if (product) {
      setIsLoading(false);
    }
  }, [product]);


  const tabItems = ['Description', 'Sizing', 'Shipping', 'Returns'];

  // Color mapping for product specs
  const colorMap: Record<string, string> = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#EF4444',
    'blue': '#3B82F6',
    'green': '#10B981',
    'yellow': '#F59E0B',
    'purple': '#A855F7',
    'pink': '#EC4899',
    'gray': '#6B7280',
    'grey': '#6B7280',
    'brown': '#92400E',
    'beige': '#D4C5B9',
    'navy': '#1E3A8A',
    'orange': '#F97316',
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size === selectedSize ? null : size);
  };

  // Loading Screen Component
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-[#332d2d] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

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
            <h1 className=" mb-[5px] font-[Georgia,serif] text-[1rem] font-normal tracking-[.05em] leading-[1.333em] md:text-[1.125rem]">
              {product.name}
            </h1>
            <p className="text-[13px] text-gray-600">
              {typeof product.price === 'string' && !product.price.startsWith('AZN')
                ? `${product.price} AZN`
                : product.price}
            </p>
          </div>
          <span className='w-full h-[1px] bg-gray-300'></span>
          {product.specs && product.specs.length > 0 && (
            <div>
              {/* Display only color specs */}
              {product.specs.filter(spec => spec.key === 'color').map((spec) => {
                // Split color values if they contain commas (e.g., "red,blue" -> ["red", "blue"])
                const colors: string[] = [];
                spec.values?.forEach((value) => {
                  const colorValue = value.value || '';
                  // Split by comma and filter out empty strings
                  const splitColors = colorValue.split(',').map(c => c.trim()).filter(c => c.length > 0);
                  colors.push(...splitColors);
                });

                return (
                  <div key={spec.id}>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {colors.map((color, idx) => (
                        <span
                          key={`${spec.id}-${idx}`}
                          className="text-[13px] uppercase text-gray-600"
                        >
                          {spec.name.toUpperCase()}: {color}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1.5 bg-white/90 backdrop-blur-sm p-[2px] rounded-full shadow-inner w-fit">
                      {colors.slice(0, 4).map((color, idx) => {
                        const colorKey = color.toLowerCase()
                        const bgColor = colorMap[colorKey] ?? color.toLowerCase() ?? "#f3f4f6"

                        return (
                          <span
                            key={`${spec.id}-color-${idx}`}
                            className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform duration-200 cursor-pointer"
                            style={{ backgroundColor: bgColor }}
                            title={color}
                          />
                        )
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
  <span className='w-full h-[1px] bg-gray-300'></span>
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">Select a size</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(() => {
                // Get sizes from specs first, fallback to product.sizes
                const sizeSpec = product.specs?.find(spec => spec.key === 'size');
                const sizeValues = sizeSpec?.values || product.sizes || [];
                
                // Split size values if they contain spaces (e.g., "28 30 32" -> ["28", "30", "32"])
                const sizes: string[] = [];
                sizeValues.forEach((size) => {
                  const sizeValue = typeof size === 'string' ? size : size.value;
                  // Split by spaces and filter out empty strings
                  const splitSizes = sizeValue.trim().split(/\s+/).filter(s => s.length > 0);
                  sizes.push(...splitSizes);
                });
                
                if (sizes.length > 0) {
                  return sizes.map((sizeValue, index) => {
                    return (
                      <button
                        key={`${sizeValue}-${index}`}
                        type="button"
                        onClick={() => handleSizeSelect(sizeValue)}
                        className={`h-12 px-4 border rounded-md text-sm font-medium transition-colors ${
                          selectedSize === sizeValue
                            ? 'bg-black text-white border-black'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {sizeValue}
                      </button>
                    );
                  });
                }
                return <p className="col-span-3 text-sm text-gray-500">No sizes available</p>;
              })()}
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
                      <ul className="">
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
