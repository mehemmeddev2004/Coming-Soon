"use client"
import React, { useState, useEffect } from 'react'
import { getProducts, updateProduct, createProductSpecs, createProductVariants } from '@/utils/fetchProducts'
import { fetchCategories } from '@/utils/fetchCategories'
import { Product } from '@/types/product'
import { category } from '@/types/category'
import SpecsForm from '@/components/admin/SpecsForm'
import VariantsForm from '@/components/admin/VariantsForm'

const EditPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    categoryId: '',
    description: '',
    img: '',
    isActive: true
  })

  const [productSpecs, setProductSpecs] = useState<any[]>([{ key: "", name: "", values: [{ key: "", value: "" }] }])
  const [productVariants, setProductVariants] = useState<any[]>([{ slug: "", price: 0, stock: 0, discount: 0, images: [], specs: [] }])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        fetchCategories()
      ])
      setProducts(Array.isArray(productsData) ? productsData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      categoryId: product.category?.id?.toString() || '',
      description: product.description || '',
      img: product.img || '',
      isActive: product.isActive ?? true
    })
    
    // Load specs if available
    if (product.specs && product.specs.length > 0) {
      setProductSpecs(product.specs.map(spec => ({
        key: spec.key || '',
        name: spec.name || '',
        values: spec.values?.map(v => ({ key: v.key || '', value: v.value || '' })) || [{ key: '', value: '' }]
      })))
    } else {
      setProductSpecs([{ key: "", name: "", values: [{ key: "", value: "" }] }])
    }
    
    // Load variants if available
    if (product.variants && product.variants.length > 0) {
      setProductVariants(product.variants.map(variant => ({
        slug: variant.slug || '',
        price: variant.price || 0,
        stock: variant.stock || 0,
        discount: variant.discount || 0,
        images: variant.images || [],
        specs: variant.specs || []
      })))
    } else {
      setProductVariants([{ slug: "", price: 0, stock: 0, discount: 0, images: [], specs: [] }])
    }
    
    setShowEditForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      setLoading(true)
      
      // Backend doesn't want categoryId on update, and requires slug
      // Description must be array with at least 3 characters per item
      let descriptionArray: string[] = []
      
      if (Array.isArray(formData.description)) {
        // If already array, use it
        descriptionArray = formData.description.filter((item: any) => 
          typeof item === 'string' && item.trim().length >= 3
        )
      } else if (typeof formData.description === 'string') {
        // If string, convert to array
        const descriptionText = formData.description.trim()
        if (descriptionText.length >= 3) {
          descriptionArray = [descriptionText]
        }
      }
      
      // Ensure at least one valid description
      if (descriptionArray.length === 0) {
        descriptionArray = ['Məhsul təsviri']
      }
      
      const updateData = {
        name: formData.name,
        slug: editingProduct.slug, // Keep existing slug
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: descriptionArray, // Must be array with items >= 3 chars
        img: formData.img,
        isActive: formData.isActive
        // Don't send categoryId on update
      }

      // Update basic product info
      const result = await updateProduct(editingProduct.id, updateData as any)
      
      if (result) {
        // Update specs if they exist
        const validSpecs = productSpecs.filter(spec => 
          spec.key.trim() && spec.name.trim() && spec.values.length > 0
        ).map(spec => ({
          key: spec.key.trim(),
          name: spec.name.trim(),
          values: spec.values.filter((val: any) => val.key.trim() && val.value.trim())
        }))
        
        if (validSpecs.length > 0) {
          await createProductSpecs(Number(editingProduct.id), { specs: validSpecs })
        }
        
        // Update variants if they exist
        const validVariants = productVariants.filter(variant => 
          variant.slug.trim() && variant.price > 0 && variant.stock >= 0
        ).map(variant => ({
          slug: variant.slug.trim(),
          price: variant.price,
          stock: variant.stock,
          discount: variant.discount,
          images: variant.images || [],
          specs: variant.specs.filter((spec: any) => spec.key.trim() && spec.value.trim())
        }))
        
        if (validVariants.length > 0) {
          await createProductVariants(Number(editingProduct.id), { variants: validVariants })
        }
        
        await fetchData() // Refresh data
        setShowEditForm(false)
        setEditingProduct(null)
        alert('Məhsul uğurla yeniləndi!')
      } else {
        alert('Məhsul yenilənərkən xəta baş verdi!')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Məhsul yenilənərkən xəta baş verdi!')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowEditForm(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      price: '',
      stock: '',
      categoryId: '',
      description: '',
      img: '',
      isActive: true
    })
    setProductSpecs([{ key: "", name: "", values: [{ key: "", value: "" }] }])
    setProductVariants([{ slug: "", price: 0, stock: 0, discount: 0, images: [], specs: [] }])
  }

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Məhsullar yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Məhsul Redaktəsi
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Məhsul məlumatlarını yeniləyin və idarə edin.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full">
                {/* Product Image */}
                {product.img && (
                  <div className="mb-4 aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={product.img} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-1 text-xs sm:text-sm text-gray-600 mb-4">
                    <p><span className="font-medium">Qiymət:</span> {product.price}₼</p>
                    <p><span className="font-medium">Stok:</span> {product.stock}</p>
                    <p><span className="font-medium">Kateqoriya:</span> {product.category?.name || 'N/A'}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Aktiv' : 'Deaktiv'}
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Edit Button */}
                <button
                  onClick={() => handleEditClick(product)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Redaktə et
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm sm:text-base">Heç bir məhsul tapılmadı</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Məhsul Redaktə et</h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Məhsul adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qiymət (₼)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stok miqdarı
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kateqoriya
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Kateqoriya seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şəkil URL
                  </label>
                  <input
                    type="url"
                    value={formData.img}
                    onChange={(e) => setFormData(prev => ({ ...prev, img: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Təsvir
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Məhsul haqqında məlumat..."
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Məhsul aktiv
                  </label>
                </div>

                {/* Specs Section */}
                <SpecsForm specs={productSpecs} setSpecs={setProductSpecs} />

                {/* Variants Section */}
                <VariantsForm variants={productVariants} setVariants={setProductVariants} />

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Yenilənir...' : 'Yenilə'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditPage
