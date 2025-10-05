"use client"
import React, { useState } from "react"
import { category } from "@/types/category"
import SpecsForm from "./SpecsForm"
import VariantsForm from "./VariantsForm"

interface SpecValue {
  key: string
  value: string
}

interface Spec {
  key: string
  name: string
  values: SpecValue[]
}

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

interface ProductFormProps {
  show: boolean
  onClose: () => void
  onSubmit: (data: {
    product: {
      name: string
      slug: string
      description: string
      img: string
      images?: string
      price: number
      stock: number
      category: string
    }
    specs: Spec[]
    variants: Variant[]
  }) => Promise<boolean>
  newProduct: {
    name: string
    slug: string
    description: string
    img: string
    price: number
    stock: number
    category: string
  }
  setNewProduct: React.Dispatch<React.SetStateAction<{
    name: string
    slug: string
    description: string
    img: string
    price: number
    stock: number
    category: string
  }>>
  categories: category[]
  productSpecs: Spec[]
  setProductSpecs: React.Dispatch<React.SetStateAction<Spec[]>>
  productVariants: Variant[]
  setProductVariants: React.Dispatch<React.SetStateAction<Variant[]>>
}

const ProductForm: React.FC<ProductFormProps> = ({ show, onClose, onSubmit, newProduct, setNewProduct, categories, productSpecs, setProductSpecs, productVariants, setProductVariants }) => {
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [additionalImages, setAdditionalImages] = useState<string[]>([])
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Upload image using the correct API endpoint
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsImageUploading(true)
      setMessage({ type: 'success', text: 'Şəkil yüklənir...' })

      const formData = new FormData()
      formData.append('image', file)

      console.log('Uploading to /api/upload/image with field: image')
      
      const response = await fetch('https://etor.onrender.com/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed:', errorText)
        
        // If upload fails, show manual URL input option
        setMessage({ 
          type: 'error', 
          text: 'Şəkil yükləmə uğursuz oldu. Şəkil URL-ini manual daxil edə bilərsiniz.' 
        })
        return null
      }

      const responseText = await response.text()
      console.log('Upload successful:', responseText)
      
      // Try to parse as JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        // If not JSON, assume the response is the URL itself
        data = { url: responseText }
      }

      setMessage({ type: 'success', text: 'Şəkil uğurla yükləndi!' })
      return data.url || data.imageUrl || data.filePath || data.downloadUrl || responseText
    } catch (error: any) {
      console.error('Image upload error:', error)
      setMessage({ 
        type: 'error', 
        text: 'Şəkil yükləmə uğursuz oldu. Şəkil URL-ini manual daxil edə bilərsiniz.' 
      })
      return null
    } finally {
      setIsImageUploading(false)
    }
  }


  // Image compression function (kept for fallback)
  const compressImage = (file: File, callback: (dataUrl: string) => void) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions (max 800px width/height)
      let { width, height } = img
      const maxSize = 800
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7) // 70% quality
      callback(compressedDataUrl)
    }
    
    img.src = URL.createObjectURL(file)
  }
  
 const handleSubmit = async () => {
  if (isUploading) return // Prevent double submission

  // Validate required fields
  if (!newProduct.name.trim()) {
    setMessage({ type: 'error', text: 'Məhsul adı məcburidir!' })
    return
  }
  if (!newProduct.price || newProduct.price <= 0) {
    setMessage({ type: 'error', text: 'Düzgün qiymət daxil edin!' })
    return
  }
  if (!newProduct.category) {
    setMessage({ type: 'error', text: 'Kateqoriya seçin!' })
    return
  }

  setIsUploading(true)
  setMessage(null)

  try {
    console.log("Göndərilən məhsul:", {
      ...newProduct,
      specs: productSpecs,
      variants: productVariants
    })

    // 👇 Artıq məlumatları `onSubmit`-ə göndəririk
    const success = await onSubmit({
      product: {
        ...newProduct,
        images: additionalImages.length > 0 ? JSON.stringify(additionalImages) : undefined
      },
      specs: productSpecs,
      variants: productVariants
    })

    if (success) {
      setMessage({ type: 'success', text: 'Məhsul uğurla əlavə edildi!' })
      // Reset additional images
      setAdditionalImages([])
      setTimeout(() => {
        onClose()
        setMessage(null)
      }, 2000)
    } else {
      setMessage({ type: 'error', text: 'Məhsul əlavə edilərkən xəta baş verdi!' })
    }
  } catch (error) {
    console.error(error)
    setMessage({ type: 'error', text: 'Məhsul əlavə edilərkən xəta baş verdi!' })
  } finally {
    setIsUploading(false)
  }
}


  if (!show) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-lg rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Yeni Məhsul</h3>
          <p className="text-sm text-gray-600 mt-1">Məhsul məlumatlarını daxil edin</p>
          
          {/* Message Display */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                  </svg>
                )}
                {message.text}
              </div>
            </div>
          )}
        </div>
        
        {/* Form Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Məhsul adı *</label>
              <input 
                type="text" 
                placeholder="Ağ köynək" 
                value={newProduct.name} 
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-sm sm:text-base" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input 
                type="text" 
                placeholder="ag-koynek" 
                value={newProduct.slug} 
                onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-sm sm:text-base" 
              />
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Təsvir</label>
            <textarea 
              placeholder="Məhsul haqqında ətraflı məlumat..." 
              value={newProduct.description} 
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors h-20 resize-none" 
            />
          </div>
          
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Şəkil</label>
            <div className="space-y-3">
              {/* Mobile-friendly file upload button */}
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*,image/heic,image/heif"
                  capture="environment"
                  disabled={isImageUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // Check file size (max 10MB now that we're using Cloudinary)
                      if (file.size > 10 * 1024 * 1024) {
                        setMessage({type: 'error', text: 'Şəkil faylı çox böyükdür! Maksimum 10MB ola bilər.'})
                        e.target.value = '' // Clear the input
                        return
                      }
                      
                      // Upload image
                      const imageUrl = await uploadImage(file)
                      if (imageUrl) {
                        setNewProduct({ ...newProduct, img: imageUrl })
                      }
                      
                      // Clear the input so the same file can be selected again if needed
                      e.target.value = ''
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload"
                  className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-400 transition-colors cursor-pointer ${
                    isImageUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    {isImageUploading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mr-2"></div>
                        <span className="text-sm text-gray-600">Yüklənir...</span>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-emerald-600">Şəkil seçin</span>
                          <span className="hidden sm:inline"> və ya buraya sürükləyin</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="sm:hidden">Kameradan çəkin və ya qalereydən seçin</span>
                          <span className="hidden sm:inline">PNG, JPG, HEIC (max 10MB)</span>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                <span className="hidden sm:inline">Maksimum fayl ölçüsü: 10MB. Şəkillər Cloudinary-ə yüklənir və avtomatik optimallaşdırılır.</span>
                <span className="sm:hidden">Max 10MB. Auto-optimized upload.</span>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">və ya URL daxil edin</span>
                </div>
              </div>
              
              <input 
                type="url" 
                placeholder="https://example.com/product.jpg" 
                value={typeof newProduct.img === 'string' && newProduct.img.startsWith('http') ? newProduct.img : ''} 
                onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-sm" 
              />
            </div>
            {newProduct.img && (
              <img 
                src={newProduct.img} 
                alt="Preview" 
                className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  console.error("Şəkil yüklənmədi:", newProduct.img)
                }}
              />
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Əlavə Şəkillər</label>
            <div className="space-y-3">
              <input 
                type="file" 
                accept="image/*"
                multiple
                disabled={isImageUploading}
                onChange={async (e) => {
                  const files = Array.from(e.target.files || [])
                  if (files.length > 0) {
                    setMessage({ type: 'success', text: `${files.length} şəkil yüklənir...` })
                    
                    const uploadPromises = files.map(async (file) => {
                      if (file.size > 10 * 1024 * 1024) {
                        console.error('File too large:', file.name)
                        return null
                      }
                      return await uploadImage(file)
                    })
                    
                    const uploadedUrls = await Promise.all(uploadPromises)
                    const validUrls = uploadedUrls.filter(url => url !== null) as string[]
                    
                    if (validUrls.length > 0) {
                      setAdditionalImages(prev => [...prev, ...validUrls])
                      setMessage({ type: 'success', text: `${validUrls.length} şəkil uğurla yükləndi!` })
                    }
                    
                    e.target.value = ''
                  }
                }}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                  isImageUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`} 
              />
              <div className="text-sm text-gray-500">
                Birdən çox şəkil seçə bilərsiniz. Maksimum fayl ölçüsü: 10MB.
              </div>
              
              {/* Additional Images Preview */}
              {additionalImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {additionalImages.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={imageUrl} 
                        alt={`Additional ${index + 1}`} 
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAdditionalImages(prev => prev.filter((_, i) => i !== index))
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qiymət (₼) *</label>
              <input 
                type="number" 
                placeholder="25.99" 
                value={newProduct.price || ''} 
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" 
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stok miqdarı</label>
              <input 
                type="number" 
                placeholder="100" 
                value={newProduct.stock || ''} 
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" 
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya *</label>
            <select 
              value={newProduct.category} 
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            >
              <option value="">Seçin</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Specs Section */}
          <SpecsForm specs={productSpecs} setSpecs={setProductSpecs} />

          {/* Variants Section */}
          <VariantsForm variants={productVariants} setVariants={setProductVariants} />
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Ləğv et
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isUploading || isImageUploading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              isUploading || isImageUploading
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isImageUploading ? 'Şəkil yüklənir...' : isUploading ? 'Yaradılır...' : 'Yarat'}
          </button>
        </div>
      </div>
    </>
  )
}

export default ProductForm
