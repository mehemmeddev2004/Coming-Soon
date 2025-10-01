"use client"

import { useEffect, useState } from "react"
import { getAllSeasons } from "@/utils/fetchSeasons"
import { Season } from "@/types/season"


const NewSeason = () => {
  const [newSeason, setNewSeason] = useState<Season[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSeasons()
        if (Array.isArray(data)) {
          setNewSeason(data.slice(0, 3)) // maksimum 3 sezon
        } else {
          console.warn("Gələn data array deyil:", data)
          setNewSeason([])
        }
      } catch (error) {
        console.error("Sezon məhsulları gətirilə bilmədi:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="px-5 max-w-[1280px] mx-auto">
      {/* Başlıq */}
      <span className="block text-[24px] text-center font-semibold uppercase tracking-wide font-sans mb-8 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Yeni mövsüm / Yeniliklər
      </span>

      {/* Məhsullar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {newSeason.length > 0 ? (
          newSeason.map((season) => (
            <div
              key={season.id}
              className="flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={
                  season.product?.img ||
                  "/placeholder-image.jpg"
                }
                alt={season.product?.name || season.name}
                className="h-[256px] w-full object-cover transition-transform duration-300 hover:scale-105"
              />

              <div className="p-4">
                <span className="block font-sans font-semibold uppercase tracking-[0.1rem] text-[1.1rem] leading-6 mb-2 line-clamp-2">
                  {season.product?.name || season.name}
                </span>

                <p className="text-sm text-gray-500 font-medium">
                  {season.product?.price
                    ? `AZN ${season.product.price}`
                    : "Qiymət yoxdur"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">
            Mövsüm məhsulları tapılmadı.
          </p>
        )}
      </div>
    </div>
  )
}

export default NewSeason
