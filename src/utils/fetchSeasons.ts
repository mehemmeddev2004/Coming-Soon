import axios from "axios"
import { CreateSeasonData, Season, SeasonType } from "@/types/season"

const BASE_URL = "/api/new-season"

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
    console.log(`Attempting to delete season ${seasonId}...`);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await axios.delete(`/api/new-season/${seasonId}`, { 
      headers,
      validateStatus: (status) => status < 500 // Don't throw for 4xx errors
    });
    
    console.log(`Delete season ${seasonId} response:`, {
      status: res.status,
      statusText: res.statusText,
      data: res.data
    });

    if (res.status >= 400) {
      const errorMessage = res.data?.message || res.data?.error || 'Failed to delete season';
      console.error('Delete season error:', {
        status: res.status,
        message: errorMessage,
        details: res.data?.details
      });
      
      // Show user-friendly error message based on status
      if (typeof window !== 'undefined') {
        if (res.status === 401) {
          alert('Authentication required. Please login again.');
        } else if (res.status === 404) {
          alert('Season not found. It may have already been deleted.');
        } else if (res.status === 500) {
          alert('Server error. The season may not exist on the backend server.');
        } else {
          alert(`Error deleting season: ${errorMessage}`);
        }
      }
      
      return null;
    }
    
    return res.data || { message: 'Season deleted successfully' };
  } catch (err: any) {
    console.error(`Error deleting season ${seasonId}:`, {
      name: err.name,
      message: err.message,
      code: err.code,
      ...(err.response && {
        response: {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        }
      }),
      ...(err.request && { request: 'Request was made but no response received' })
    });
    
    // Show user-friendly error message
    if (typeof window !== 'undefined') {
      alert(`Failed to delete season: ${err.message || 'Unknown error occurred'}`);
    }
    
    return null;
  }
}
