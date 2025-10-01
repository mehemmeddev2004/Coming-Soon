"use client"
import React from "react"

interface VariantSpec {
  key: string
  value: string
}

interface Variant {
  slug: string
  price: number
  stock: number
  discount?: number
  images?: string[]
  specs: VariantSpec[]
}

interface VariantsFormProps {
  variants: Variant[]
  setVariants: React.Dispatch<React.SetStateAction<Variant[]>>
}

const VariantsForm: React.FC<VariantsFormProps> = ({ variants, setVariants }) => {
  const addVariant = () => {
    setVariants([...variants, { 
      slug: "", 
      price: 0, 
      stock: 0, 
      discount: 0,
      images: [],
      specs: [{ key: "", value: "" }] 
    }])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: string, value: string | number) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const addVariantSpec = (variantIndex: number) => {
    const updated = [...variants]
    updated[variantIndex].specs.push({ key: "", value: "" })
    setVariants(updated)
  }

  const removeVariantSpec = (variantIndex: number, specIndex: number) => {
    const updated = [...variants]
    updated[variantIndex].specs = updated[variantIndex].specs.filter((_, i) => i !== specIndex)
    setVariants(updated)
  }

  const updateVariantSpec = (variantIndex: number, specIndex: number, field: string, value: string) => {
    const updated = [...variants]
    updated[variantIndex].specs[specIndex] = { ...updated[variantIndex].specs[specIndex], [field]: value }
    setVariants(updated)
  }

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium text-gray-900">Məhsul Variantları</h4>
        <button
          type="button"
          onClick={addVariant}
          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          + Variant əlavə et
        </button>
      </div>

      <div className="space-y-4">
        {variants.map((variant, variantIndex) => (
          <div key={variantIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-gray-700">Variant {variantIndex + 1}</h5>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(variantIndex)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Sil
                </button>
              )}
            </div>

            {/* Variant Basic Info */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                <input
                  type="text"
                  placeholder="red-variant, large-size"
                  onChange={(e) => updateVariant(variantIndex, 'slug', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Qiymət (₼)</label>
                <input
                  type="number"
                  placeholder="29.99"
                  onChange={(e) => updateVariant(variantIndex, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stok</label>
                <input
                  type="number"
                  placeholder="10"
                  onChange={(e) => updateVariant(variantIndex, 'stock', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Endirim (%)</label>
                <input
                  type="number"
                  placeholder="0"
                  onChange={(e) => updateVariant(variantIndex, 'discount', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Variant Specs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-gray-600">Xüsusiyyətlər</label>
                <button
                  type="button"
                  onClick={() => addVariantSpec(variantIndex)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  + Xüsusiyyət əlavə et
                </button>
              </div>
              
              {variant.specs.map((spec, specIndex) => (
                <div key={specIndex} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="color, size"
                    value={spec.key}
                    onChange={(e) => updateVariantSpec(variantIndex, specIndex, 'key', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="red, large"
                    value={spec.value}
                    onChange={(e) => updateVariantSpec(variantIndex, specIndex, 'value', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {variant.specs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariantSpec(variantIndex, specIndex)}
                      className="text-red-500 hover:text-red-700 text-xs px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VariantsForm
