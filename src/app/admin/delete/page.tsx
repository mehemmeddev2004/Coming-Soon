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
    } catch (error) {
      console.error("Delete season error:", error)
      setError("Sezon silinərkən xəta baş verdi")
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
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Silin</h2>
          <p className="text-gray-600 mt-1">Məhsul və kateqoriyalarınızı silin</p>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">Yüklənir...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Categories Section */}
      <section id="categories" className="mb-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Kateqoriyalar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">{category.name}</h4>
                <p className="text-sm text-gray-600">Slug: {category.slug}</p>
              </div>
              <button
                onClick={() => handleDeleteCategory(category.id, category.name)}
                disabled={loading}
                className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-gray-500 text-center py-8">Heç bir kateqoriya tapılmadı</p>
        )}
      </section>

      {/* Products Section */}
      <section id="products">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Məhsullar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600">Qiymət: {product.price}₼</p>
                <p className="text-sm text-gray-600">Stok: {product.stock}</p>
                <p className="text-sm text-gray-600">Kateqoriya: {product.category?.name || "N/A"}</p>
              </div>
              <button
                onClick={() => handleDeleteProduct(product.id, product.name)}
                disabled={loading}
                className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-gray-500 text-center py-8">Heç bir məhsul tapılmadı</p>
        )}
      </section>

      {/* Seasons Section */}
      <section id="seasons" className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Sezonlar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasons.map((season) => (
            <div key={season.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">{season.name}</h4>
                <p className="text-sm text-gray-600">
                  Növ: {season.seasonType === 'spring' ? 'Yaz' : 
                       season.seasonType === 'summer' ? 'Yay' : 
                       season.seasonType === 'autumn' ? 'Payız' : 
                       season.seasonType === 'winter' ? 'Qış' : season.seasonType}
                </p>
                <p className="text-sm text-gray-600">Məhsul: {season.product?.name || "N/A"}</p>
                <p className="text-sm text-gray-600">ID: {season.id}</p>
              </div>
              <button
                onClick={() => handleDeleteSeason(season.id, season.name)}
                disabled={loading}
                className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
        {seasons.length === 0 && (
          <p className="text-gray-500 text-center py-8">Heç bir sezon tapılmadı</p>
        )}
      </section>
    </div>
  )
}

export default Page
