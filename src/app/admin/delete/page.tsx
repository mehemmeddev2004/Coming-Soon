"use client"
import React, { useState, useEffect } from "react"
import { getProducts, deleteProduct } from "@/utils/fetchProducts"
import { fetchCategories, deleteCategory } from "@/utils/fetchCategories"
import { getAllSeasons, deleteSeason } from "@/utils/fetchSeasons"
import { category } from "@/types/category"
import { Product } from "@/types/product"
import { Season } from "@/types/season"

const Page = () => {
  const [categories, setCategories] = useState<category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData, seasonsData] = await Promise.all([
          getProducts(),
          fetchCategories(),
          getAllSeasons()
        ])
        setProducts(productsData)
        setCategories(categoriesData)
        setSeasons(seasonsData)
        console.log("Loaded categories:", categoriesData) // Debug: see what categories exist
        console.log("Loaded seasons:", seasonsData) // Debug: see what seasons exist
        console.log("Season IDs:", seasonsData.map(s => ({ id: s.id, name: s.name }))) // Debug: show season IDs
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Məlumatlar yüklənərkən xəta baş verdi")
      }
    }
    fetchData()
  }, [])

  const handleDeleteCategory = async (id: string | number, name: string) => {
    console.log("handleDeleteCategory called with:", { id, name, idType: typeof id }); // Debug log
    console.log("Current categories in state:", categories.map(c => ({ id: c.id, name: c.name }))); // Check current state
    
    if (!window.confirm(`"${name}" kateqoriyasını silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`)) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await deleteCategory(id)
      if (result !== null) {
        setCategories(categories.filter(c => c.id !== id))
        // Kateqoriya silinəndə həmin kateqoriyaya aid məhsulları da sil
        setProducts(products.filter(p => p.category?.id !== Number(id)))
        setSuccess(`"${name}" kateqoriyası uğurla silindi`)
      } else {
        setError("Kateqoriya silinərkən xəta baş verdi")
      }
    } catch (error) {
      console.error("Delete category error:", error)
      setError("Kateqoriya silinərkən xəta baş verdi")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" məhsulunu silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`)) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await deleteProduct(id)
      if (result !== null) {
        setProducts(products.filter(p => p.id !== id))
        // Məhsul silinəndə həmin məhsula aid sezonları da sil
        setSeasons(seasons.filter(s => s.product?.id !== id.toString()))
        setSuccess(`"${name}" məhsulu uğurla silindi`)
      } else {
        setError("Məhsul silinərkən xəta baş verdi")
      }
    } catch (error) {
      console.error("Delete product error:", error)
      setError("Məhsul silinərkən xəta baş verdi")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSeason = async (id: string | number, name: string) => {
    console.log(`Attempting to delete season ${id} (${name})...`);
    
    if (!window.confirm(`"${name}" sezonunu silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`)) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await deleteSeason(id)
      if (result !== null) {
        setSeasons(seasons.filter(s => s.id !== id))
        setSuccess(`"${name}" sezonu uğurla silindi`)
      } else {
        setError("Sezon silinərkən xəta baş verdi")
      }
    } catch (error: any) {
      console.error("Delete season error:", error)
      
      // Show specific error messages based on the error
      if (error.message?.includes('500')) {
        setError(`Sezon ID ${id} backend serverdə mövcud deyil. Səhifəni yeniləyin.`)
      } else if (error.message?.includes('404')) {
        setError(`Sezon ID ${id} tapılmadı. Artıq silinmiş ola bilər.`)
      } else {
        setError(`Sezon silinərkən xəta: ${error.message || 'Naməlum xəta'}`)
      }
      
      // Refresh the seasons list to show current state
      try {
        const updatedSeasons = await getAllSeasons()
        setSeasons(updatedSeasons)
        console.log('Refreshed seasons after error:', updatedSeasons.map(s => ({ id: s.id, name: s.name })))
      } catch (refreshError) {
        console.error('Failed to refresh seasons:', refreshError)
      }
    } finally {
      setLoading(false)
    }
  }

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Silin</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Məhsul və kateqoriyalarınızı silin</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"/>
            </svg>
            Yenilə
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm sm:text-base">Yüklənir...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm sm:text-base">{success}</p>
          </div>
        )}

        {/* Categories Section */}
        <section id="categories" className="mb-8 sm:mb-12">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Kateqoriyalar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-3 sm:mb-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{category.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Slug: {category.slug}</p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id, category.name)}
                  disabled={loading}
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">Heç bir kateqoriya tapılmadı</p>
          )}
        </section>

        {/* Products Section */}
        <section id="products" className="mb-8 sm:mb-12">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Məhsullar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-3 sm:mb-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{product.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Qiymət: {product.price}₼</p>
                  <p className="text-xs sm:text-sm text-gray-600">Stok: {product.stock}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Kateqoriya: {product.category?.name || "N/A"}</p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  disabled={loading}
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
          {products.length === 0 && (
            <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">Heç bir məhsul tapılmadı</p>
          )}
        </section>

        {/* Seasons Section */}
        <section id="seasons">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Sezonlar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {seasons.map((season) => (
              <div key={season.id} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-3 sm:mb-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{season.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Növ: {season.seasonType === 'spring' ? 'Yaz' : 
                         season.seasonType === 'summer' ? 'Yay' : 
                         season.seasonType === 'autumn' ? 'Pazız' : 
                         season.seasonType === 'winter' ? 'Qış' : season.seasonType}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Məhsul: {season.product?.name || "N/A"}</p>
                  <p className="text-xs sm:text-sm text-gray-600">ID: {season.id}</p>
                </div>
                <button
                  onClick={() => handleDeleteSeason(season.id, season.name)}
                  disabled={loading}
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
          {seasons.length === 0 && (
            <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">Heç bir sezon tapılmadı</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default Page
