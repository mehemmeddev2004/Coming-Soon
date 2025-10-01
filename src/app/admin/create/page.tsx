"use client"
import React, { useEffect } from "react"
import { useCategory } from "@/hooks/useCategory"
import { useProduct } from "@/hooks/useProduct"
import { useSeason } from "@/hooks/useSeason"
import CategoryForm from "@/components/admin/CategoryForm"
import ProductForm from "@/components/admin/ProductForm"
import SeasonForm from "@/components/admin/SeasonForm"

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

  const {
    showSeasonForm,
    setShowSeasonForm,
    handleAddSeason
  } = useSeason()

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

  // Wrapper function for handleAddProduct to pass categories
  const handleProductSubmit = async (data: any) => {
    return await handleAddProduct(categories, data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Yarat</h2>
            <p className="text-gray-600 mt-2">Kateqoriya və məhsul əlavə edin</p>
          </div>
        </div>

        {/* Categories Section */}
        <section id="categories" className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Kateqoriyalar</h3>
                  <p className="text-gray-600 text-sm mt-1">Məhsul kateqoriyalarını idarə edin</p>
                </div>
                <button
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                  className="inline-flex items-center px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                  </svg>
                  Kateqoriya əlavə et
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
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

        {/* Seasons Section */}
        <section id="seasons" className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Yeni Sezonlar</h3>
                  <p className="text-gray-600 text-sm mt-1">Məhsullar üçün yeni sezon yaradın</p>
                </div>
                <button
                  onClick={() => setShowSeasonForm(!showSeasonForm)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                  </svg>
                  Yeni sezon əlavə et
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                </svg>
                <p className="text-sm">Məhsullar üçün yeni sezonlar yaradın</p>
                <p className="text-xs mt-1">Sezon yaratmaq üçün yuxarıdakı düyməni basın</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Məhsullar</h3>
                  <p className="text-gray-600 text-sm mt-1">Məhsul kataloqu və inventar</p>
                </div>
                <button
                  onClick={() => setShowProductForm(!showProductForm)}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                  </svg>
                  Məhsul əlavə et
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock > 0 ? 'Stokda' : 'Tükənib'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium">Qiymət:</span> {product.price}₼</p>
                      <p><span className="font-medium">Stok:</span> {product.stock}</p>
                      <p><span className="font-medium">Kateqoriya:</span> {product.category?.name || 'N/A'}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
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
        onClose={() => setShowProductForm(false)}
        onSubmit={handleProductSubmit}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        categories={categories}
        productSpecs={productSpecs}
        setProductSpecs={setProductSpecs}
        productVariants={productVariants}
        setProductVariants={setProductVariants}
      />

      {/* Season Modal */}
      <SeasonForm
        show={showSeasonForm}
        onClose={() => setShowSeasonForm(false)}
        onSubmit={handleAddSeason}
        products={products}
      />
    </div>
  )
}

export default Page
