import axios from "axios"
import { CreateSeasonData, Season, SeasonType } from "@/types/season"

const BASE_URL = "https://etor.onrender.com/api/new-season"

// Helper function to get authentication headers
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

// Export SeasonType enum
export { SeasonType }

/* =====================================================
 🟢 1. Get all seasons
===================================================== */
export const getAllSeasons = async (): Promise<Season[]> => {
  try {
    const res = await axios.get(BASE_URL, { headers: getAuthHeaders() })
    return Array.isArray(res.data) ? res.data : []
  } catch (err: unknown) {
    console.error("Error fetching all seasons:", err)
    return []
  }
}

/* =====================================================
 🟢 2. Get seasons by product
===================================================== */
export const getSeasonsByProduct = async (productId: number): Promise<Season[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/${productId}`, { headers: getAuthHeaders() })
    return Array.isArray(res.data) ? res.data : []
  } catch (err: unknown) {
    console.error(`Error fetching seasons for product ${productId}:`, err)
    return []
  }
}

/* =====================================================
 🟢 3. Create new season for a product
===================================================== */
export const createSeason = async (productId: number, seasonData: CreateSeasonData): Promise<Season | null> => {
  try {
    const res = await axios.post(`${BASE_URL}/${productId}`, seasonData, { headers: getAuthHeaders() })
    return res.data?.data || res.data || null
  } catch (err: unknown) {
    console.error(`Error creating season for product ${productId}:`, err)
    return null
  }
}

/* =====================================================
 🟢 4. Delete season
===================================================== */
export const deleteSeason = async (seasonId: string | number): Promise<{ message: string } | null> => {
  try {
    const res = await axios.delete(`${BASE_URL}/${seasonId}`, { headers: getAuthHeaders() })
    return res.data || null
  } catch (err: unknown) {
    console.error(`Error deleting season ${seasonId}:`, err)
    return null
  }
}
