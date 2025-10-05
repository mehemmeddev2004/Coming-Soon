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
      {/* Başlıq */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-center font-semibold uppercase tracking-wide mb-6 sm:mb-8 lg:mb-10 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Yeni mövsüm / Yeniliklər
      </h2>

      {/* Məhsul grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {newSeason.length > 0 ? (
          newSeason.map((season) => (
            <div
              key={season.id}
              className="flex flex-col cursor-pointer bg-card w-[385px] h-[335px]"
            >
              {/* Şəkil konteyneri */}
              <div className="relative w-full h-[213px] overflow-hidden rounded-t-xl">
                <img
                  src={season.product?.img || "/placeholder-image.jpg"}
                  alt={season.product?.name || season.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Məhsul məlumatları */}
              <div className="p-1 sm:p-1 mt-[20px] flex-1 flex flex-col">
                <h3 className="font-semibold uppercase tracking-wide text-base sm:text-lg leading-snug mb-2 line-clamp-2 text-foreground">
                  {season.product?.name || season.name}
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground font-medium ">
                  {season.product?.price
                    ? `AZN ${season.product.price}`
                    : "Qiymət yoxdur"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8 w-full">
            Mövsüm məhsulları tapılmadı.
          </p>
        )}
      </div>
    </div>
  )
}

export default NewSeason
