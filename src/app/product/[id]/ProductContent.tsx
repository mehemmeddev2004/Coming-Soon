"use client"

import { useState } from "react"
import ProductGallery from "@/components/ui/product/ProductGallery"
import AddToCartButton from "@/components/ui/button/AddToCartButton"
import { Product } from "@/types/product"

const sizes = ["X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large"]
const desc = ["Description", "Sizing", "Shipping", "Returns"]

interface ProductContentProps {
  product: Product
  galleryImages: { id: string; url: string }[]
  mainImage: string
}

export default function ProductContent({ product, galleryImages, mainImage }: ProductContentProps) {
  const [activeTab, setActiveTab] = useState("Description")

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="w-full">
          <ProductGallery images={galleryImages} alt={product.name} />
        </div>

        <div className="flex flex-col space-y-6 text-center">
          {/* Title & Price */}
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-xl font-medium text-gray-900">
              {typeof product.price === 'string' 
                ? product.price.startsWith('AZN') 
                  ? product.price 
                  : `${product.price} AZN`
                : `${product.price} AZN`}
            </p>
          </div>

       {/* Specs */}
      {product.specs && product.specs.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {product.specs.flatMap(spec => 
            spec?.values?.map(value => (
              spec && value ? (
                <span 
                  key={`${spec?.id ?? ''}-${value?.id ?? ''}`} 
                  className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md"
                >
                  {value?.value ?? ''}
                </span>
              ) : null
            ))
          )}
        </div>
      )}

          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">Select a size</h3>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className="h-12 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add To Cart */}
          <AddToCartButton
            id={String(product.id)}
            name={product.name}
            price={typeof product.price === 'string' 
              ? product.price.replace(/[^0-9.,]/g, '') // Remove any non-numeric characters except decimal point
              : product.price}
            className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add To Cart
          </AddToCartButton>

          {/* Tabs */}
          <div className="pt-6">
            <div className="flex justify-between border-b border-gray-200">
              {desc.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`py-2 px-4 text-sm font-medium transition-colors ${
                    activeTab === item ? "text-black border-b-2 border-black" : "text-gray-600 hover:text-black"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4 text-left text-gray-700">
              {activeTab === "Description" && (
                <div>
                  {product.description ? (
                    Array.isArray(product.description) ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {product.description.map((line, idx) => (
                          line !== undefined && line !== null ? (
                            <li key={idx}>{line}</li>
                          ) : null
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
              {activeTab === "Sizing" && (
                <div>
                  <p>Size guide məlumatları burada olacaq.</p>
                </div>
              )}
              {activeTab === "Shipping" && <p>Shipping details burada olacaq.</p>}
              {activeTab === "Returns" && <p>Return policy burada olacaq.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
