import { useState } from "react"
import { createSeason, SeasonType } from "@/utils/fetchSeasons"

export const useSeason = () => {
  const [showSeasonForm, setShowSeasonForm] = useState(false)

  const handleAddSeason = async (productId: number, seasonData: { name: string; seasonType: SeasonType }): Promise<boolean> => {
    try {
      const result = await createSeason(productId, seasonData)
      
      if (result) {
        console.log("Yeni sezon uğurla yaradıldı:", result)
        return true
      } else {
        console.error("Sezon yaradılmadı")
        return false
      }
    } catch (error) {
      console.error("Sezon yaradılarkən xəta:", error)
      return false
    }
  }

  return {
    showSeasonForm,
    setShowSeasonForm,
    handleAddSeason
  }
}
