"use client"
import React, { useState } from "react"
import { Product } from "@/types/product"
import { SeasonType } from "@/types/season"

interface SeasonFormProps {
  show: boolean
  onClose: () => void
  onSubmit: (productId: number, seasonData: { name: string; seasonType: SeasonType }) => Promise<boolean>
  products: Product[]
}

const SeasonForm: React.FC<SeasonFormProps> = ({
  show,
  onClose,
  onSubmit,
  products
}) => {
  const [selectedProductId, setSelectedProductId] = useState<number | "">("")
  const [seasonName, setSeasonName] = useState("")
  const [seasonType, setSeasonType] = useState<SeasonType | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const seasonTypes = [
    { value: SeasonType.SPRING, label: "Yaz" },
    { value: SeasonType.SUMMER, label: "Yay" },
    { value: SeasonType.AUTUMN, label: "Payız" },
    { value: SeasonType.WINTER, label: "Qış" }
  ]

  const handleSubmit = async () => {
    if (!selectedProductId || !seasonName.trim() || !seasonType) {
      setMessage({ type: 'error', text: 'Bütün sahələri doldurun!' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const success = await onSubmit(Number(selectedProductId), {
        name: seasonName.trim(),
        seasonType: seasonType as SeasonType
      })

      if (success) {
        setMessage({ type: 'success', text: 'Yeni sezon uğurla yaradıldı!' })
        // Reset form
        setSelectedProductId("")
        setSeasonName("")
        setSeasonType("")
        
        setTimeout(() => {
          onClose()
          setMessage(null)
        }, 2000)
      } else {
        setMessage({ type: 'error', text: 'Sezon yaradılarkən xəta baş verdi!' })
      }
    } catch (error: any) {
      console.error(error)
      setMessage({ type: 'error', text: error.message || 'Sezon yaradılarkən xəta baş verdi!' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!show) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md rounded-2xl shadow-2xl z-50">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Yeni Sezon Yarat</h3>
          <p className="text-sm text-gray-600 mt-1">Məhsul üçün yeni sezon əlavə edin</p>
          
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
        <div className="p-6 space-y-4">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Məhsul seçin *</label>
            <select 
              value={selectedProductId} 
              onChange={(e) => setSelectedProductId(e.target.value ? Number(e.target.value) : "")} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">Məhsul seçin</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (ID: {product.id})
                </option>
              ))}
            </select>
          </div>

          {/* Season Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sezon adı *</label>
            <input 
              type="text" 
              placeholder="Yaz kolleksiyası 2024" 
              value={seasonName} 
              onChange={(e) => setSeasonName(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
            />
          </div>

          {/* Season Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sezon növü *</label>
            <select 
              value={seasonType} 
              onChange={(e) => setSeasonType(e.target.value as SeasonType)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">Sezon növü seçin</option>
              {seasonTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
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
            disabled={isSubmitting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Yaradılır...' : 'Yarat'}
          </button>
        </div>
      </div>
    </>
  )
}

export default SeasonForm
