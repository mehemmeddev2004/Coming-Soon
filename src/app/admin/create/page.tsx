"use client"
import React, { useEffect, useState } from "react"
import { useCategory } from "@/hooks/useCategory"
import { useProduct } from "@/hooks/useProduct"
import CategoryForm from "@/components/admin/CategoryForm"
import ProductForm from "@/components/admin/ProductForm"
import { updateProduct } from "@/utils/fetchProducts"
import { Product } from "@/types/product"

const Page = () => {
  // Custom hooks
  const {
    categories,
    showCategoryForm,
    setShowCategoryForm,
    newCategory,
    setNewCategory,
    loadCategories,
    handleAddCategory
  } = useCategory()

  const {
    products,
    showProductForm,
    setShowProductForm,
    newProduct,
    setNewProduct,
    productSpecs,
    setProductSpecs,
    productVariants,
    setProductVariants,
    loadProducts,
    handleAddProduct
  } = useProduct()

  // Edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🚀 Starting data fetch...")
        await Promise.all([
          loadProducts(),
          loadCategories()
        ])
        console.log("✅ Data fetch completed")
      } catch (error) {
        console.error("❌ Məlumatlar yüklənmədi:", error)
      }
    }
    
    fetchData()
  }, [])

  // Debug categories state changes
  useEffect(() => {
    console.log("🔍 Categories state changed:", categories)
    console.log("📊 Categories count in component:", categories.length)
  }, [categories])

  // Handle edit click
  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setIsEditMode(true)
    
    // Set form data
    setNewProduct({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      img: product.img || '',
      price: typeof product.price === 'number' ? product.price : parseFloat(product.price as string) || 0,
      stock: product.stock || 0,
      category: product.category?.name || ''
    })
    
    // Load specs if available
    if (product.specs && product.specs.length > 0) {
      setProductSpecs(product.specs.map(spec => ({
        key: spec.key || '',
        name: spec.name || '',
        values: spec.values?.map(v => ({ key: v.key || '', value: v.value || '' })) || [{ key: '', value: '' }]
      })))
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
    }
    
    setShowProductForm(true)
  }

  // Wrapper function for handleAddProduct to pass categories
  const handleProductSubmit = async (data: any) => {
    if (isEditMode && editingProduct) {
      // Update existing product
      try {
        console.log('📤 Update data being sent:', data)
        console.log('🔍 Editing product:', editingProduct)
        
        // Backend doesn't want categoryId on update, and requires slug
        // Description must be array with at least 3 characters per item
        let descriptionArray: string[] = []
        
        if (Array.isArray(data.product.description)) {
          // If already array, use it
          descriptionArray = data.product.description.filter((item: any) => 
            typeof item === 'string' && item.trim().length >= 3
          )
        } else if (typeof data.product.description === 'string') {
          // If string, convert to array
          const descriptionText = data.product.description.trim()
          if (descriptionText.length >= 3) {
            descriptionArray = [descriptionText]
          }
        }
        
        // Ensure at least one valid description
        if (descriptionArray.length === 0) {
          descriptionArray = ['Məhsul təsviri']
        }
        
        console.log('🔍 Description array before sending:', descriptionArray)
        console.log('🔍 Description array length:', descriptionArray.length)
        console.log('🔍 First item:', descriptionArray[0])
        console.log('🔍 First item length:', descriptionArray[0]?.length)
        
        const updateData = {
          name: data.product.name,
          slug: data.product.slug || editingProduct.slug, // Keep existing slug or use new one
          price: Number(data.product.price),
          stock: Number(data.product.stock),
          description: descriptionArray, // Must be array with items >= 3 chars
          img: data.product.img
          // Don't send categoryId on update
        }
        
        console.log('📦 Final update payload:', updateData)
        console.log('📦 Update payload description:', updateData.description)
        
        const result = await updateProduct(editingProduct.id, updateData as any)
        if (result) {
          await loadProducts()
          setShowProductForm(false)
          setIsEditMode(false)
          setEditingProduct(null)
          return true
        }
        return false
      } catch (error) {
        console.error('Error updating product:', error)
        return false
      }
    } else {
      // Create new product
      return await handleAddProduct(categories, data)
    }
  }

  // Handle form close
  const handleFormClose = () => {
    setShowProductForm(false)
    setIsEditMode(false)
    setEditingProduct(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Yarat</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Kateqoriya və məhsul əlavə edin</p>
            </div>
          </div>

          {/* Categories Section */}
          <section id="categories" className="mb-8 sm:mb-12">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Kateqoriyalar</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">Məhsul kateqoriyalarını idarə edin</p>
                  </div>
                  <button
                    onClick={() => setShowCategoryForm(!showCategoryForm)}
                    className="inline-flex items-center px-3 sm:px-4 py-2 bg-violet-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                    </svg>
                    <span className="hidden sm:inline">Kateqoriya əlavə et</span>
                    <span className="sm:hidden">Əlavə et</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      <span className="px-2 py-1 text-xs font-medium bg-violet-100 text-violet-800 rounded-full">
                        ID: {category.id}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium">Slug:</span> {category.slug}</p>
                      <p><span className="font-medium">Parent ID:</span> {category.parentId || 'Yoxdur'}</p>
                    </div>
                    
                    
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


          {/* Products Section */}
          <section id="products">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Məhsullar</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">Məhsul kataloqu və inventar</p>
                  </div>
                  <button
                    onClick={() => setShowProductForm(!showProductForm)}
                    className="inline-flex items-center px-3 sm:px-4 py-2 bg-emerald-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                    </svg>
                    <span className="hidden sm:inline">Məhsul əlavə et</span>
                    <span className="sm:hidden">Əlavə et</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base pr-2">{product.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock > 0 ? 'Stokda' : 'Tükənib'}
                      </span>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      <p><span className="font-medium">Qiymət:</span> {product.price}₼</p>
                      <p><span className="font-medium">Stok:</span> {product.stock}</p>
                      <p><span className="font-medium">Kateqoriya:</span> {product.category?.name || 'N/A'}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Redaktə
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryForm
        show={showCategoryForm}
        onClose={() => setShowCategoryForm(false)}
        onSubmit={handleAddCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        categories={categories}
      />

      {/* Product Modal */}
      <ProductForm
        show={showProductForm}
        onClose={handleFormClose}
        onSubmit={handleProductSubmit}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        categories={categories}
        productSpecs={productSpecs}
        setProductSpecs={setProductSpecs}
        productVariants={productVariants}
        setProductVariants={setProductVariants}
      />

     
    </div>
  )
}

export default Page
