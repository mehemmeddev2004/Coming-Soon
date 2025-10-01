"use client"
import React, { useState, useEffect } from 'react'
import { getAllSeasons, getSeasonsByProduct } from '@/utils/fetchSeasons'
import { getProducts } from '@/utils/fetchProducts'
import { Season, SeasonType } from '@/types/season'
import { Product } from '@/types/product'

const SeasonsPage = () => {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<number | "all">("all")
  const [error, setError] = useState<string | null>(null)

  // Season type labels in Azerbaijani
  const getSeasonTypeLabel = (seasonType: SeasonType): string => {
    const labels = {
      [SeasonType.SPRING]: "Yaz",
      [SeasonType.SUMMER]: "Yay", 
      [SeasonType.AUTUMN]: "Payız",
      [SeasonType.WINTER]: "Qış"
    }
    return labels[seasonType] || seasonType
  }

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [seasonsData, productsData] = await Promise.all([
        getAllSeasons(),
        getProducts()
      ])
      
      setSeasons(Array.isArray(seasonsData) ? seasonsData : [])
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (error: any) {
      console.error('Error fetching data:', error)
      setError(error.message || 'Məlumatlar yüklənmədi')
      setSeasons([]) // Ensure seasons is always an array
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Filter seasons by product
  const filterSeasonsByProduct = async (productId: number | "all") => {
    try {
      setLoading(true)
      setError(null)
      
      if (productId === "all") {
        const allSeasons = await getAllSeasons()
        setSeasons(Array.isArray(allSeasons) ? allSeasons : [])
      } else {
        const productSeasons = await getSeasonsByProduct(productId)
        setSeasons(Array.isArray(productSeasons) ? productSeasons : [])
      }
    } catch (error: any) {
      console.error('Error filtering seasons:', error)
      setError(error.message || 'Sezonlar yüklənmədi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleProductFilter = (productId: number | "all") => {
    setSelectedProduct(productId)
    filterSeasonsByProduct(productId)
  }

  // Get product name from season
  const getProductName = (season: Season): string => {
    if (season.product) {
      return season.product.name
    }
    return "Məhsul tapılmadı"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Sezonlar yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Sezonlar</h2>
            <p className="text-gray-600 mt-2">Məhsul sezonlarını idarə edin</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"/>
            </svg>
            Yenilə
          </button>
        </div>


        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Seasons Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">
              Sezonlar ({seasons.length})
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {selectedProduct === "all" ? "Bütün məhsulların sezonları" : `Seçilmiş məhsulun sezonları`}
            </p>
          </div>
          
          <div className="p-8">
            {seasons.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                </svg>
                <p className="text-lg font-medium mb-2">Heç bir sezon tapılmadı</p>
                <p className="text-sm">Yeni sezon yaratmaq üçün "Yarat" səhifəsinə keçin</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seasons.map((season) => (
                  <div key={season.id} className="border border-1px p-4 rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 text-lg">{season.name}</h4>
                      <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {getSeasonTypeLabel(season.seasonType)}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z"/>
                        </svg>
                        <span className="font-medium">Məhsul:</span>
                        <span className="ml-1">{getProductName(season)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                        </svg>
                        <span className="font-medium">ID:</span>
                        <span className="ml-1">{season.id}</span>
                      </div>
                      
                      {season.createdAt && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                          </svg>
                          <span className="font-medium">Yaradılıb:</span>
                          <span className="ml-1">{new Date(season.createdAt).toLocaleDateString('az-AZ')}</span>
                        </div>
                      )}
                    </div>
                    
        
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeasonsPage
