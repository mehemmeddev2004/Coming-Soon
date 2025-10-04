"use client"

import { useEffect, useState } from "react"
import { getAllSeasons } from "@/utils/fetchSeasons"
import type { Season } from "@/types/season"

const NewSeason = () => {
  const [newSeason, setNewSeason] = useState<Season[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSeasons()
        if (Array.isArray(data)) {
          setNewSeason(data.slice(0, 3))
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
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-center font-semibold uppercase tracking-wide mb-6 sm:mb-8 lg:mb-10 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Yeni mövsüm / Yeniliklər
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {newSeason.length > 0 ? (
          newSeason.map((season) => (
            <div
              key={season.id}
              className="flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-card"
            >
              <div className="relative w-full aspect-square overflow-hidden">
                <img
                  src={season.product?.img || "/placeholder-image.jpg"}
                  alt={season.product?.name || season.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <h3 className="font-semibold uppercase tracking-wide text-base sm:text-lg leading-snug mb-2 line-clamp-2 text-foreground">
                  {season.product?.name || season.name}
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground font-medium mt-auto">
                  {season.product?.price ? `AZN ${season.product.price}` : "Qiymət yoxdur"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-8">Mövsüm məhsulları tapılmadı.</p>
        )}
      </div>
    </div>
  )
}

export default NewSeason
