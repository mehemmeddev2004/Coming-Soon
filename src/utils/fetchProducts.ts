import axios from "axios"
import { Product } from "@/types/product"

const BASE_URL = "/api/products"

// 🧩 Tip Tanımlamaları
type CreateProductData = {
  name: string
  slug?: string
  description?: string | string[]
  img?: string
  images?: string
  price: number | string
  stock: number
  categoryId: number
  brand?: string | { id: string; name: string }
  sizes?: string[] | { id: string; name: string; value: string }[]
  colors?: string[] | { id: string; name: string; value: string }[]
  isActive?: boolean
  specs?: any[]
  variants?: any[]
}

type ProductSpecData = {
  specs: any[]
}

type ProductVariantData = {
  variants: any[]
}

type FilterData = {
  name?: string
  minPrice?: number
  maxPrice?: number
  categoryId?: number
  sortBy?: string
  sortOrder?: string
}

// 🔐 Auth Header Helper
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

/* =====================================================
 🟢 1. Bütün məhsulları gətir
===================================================== */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await axios.get(BASE_URL, { headers: getAuthHeaders() })
    const data = res.data

    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("Məhsullar gətirilə bilmədi:", err)
    return []
  }
}

/* =====================================================
 🟢 2. ID-yə görə məhsul gətir
===================================================== */
export const getProductById = async (id: string | number): Promise<Product | null> => {
  try {
    console.log(`🔍 Fetching product with ID: ${id}`)
    const res = await axios.get(`${BASE_URL}/${id}`, { headers: getAuthHeaders() })
    console.log(`✅ Product fetched successfully:`, res.data)
    return res.data || null
  } catch (err: any) {
    console.error(`❌ Failed to fetch product ${id}:`, err.response?.data || err.message)
    return null
  }
}

/* =====================================================
 🟢 3. Məhsul əlavə et
===================================================== */

export const createProduct = async (data: CreateProductData): Promise<Product | null> => {
  try {
    console.log("🚀 Creating product with data:", data)
    
    if (!data.categoryId) {
      console.error("❌ categoryId is missing:", data.categoryId)
      throw new Error("categoryId tələb olunur")
    }

    const url = `/api/products/category/${data.categoryId}`


    // Remove categoryId, specs, variants from body data
    const { categoryId, specs, variants, ...bodyData } = data

    const res = await axios.post(url, bodyData, { headers: getAuthHeaders() })
    console.log("✅ Yeni məhsul yaradıldı:", res.data)
    return res.data
  } catch (err: any) {
    console.error("❌ Məhsul əlavə olunmadı:", err)
    return null
  }
}


/* =====================================================
 🟢 4. Məhsulun xüsusiyyətlərini (specs) əlavə et
===================================================== */
export const createProductSpecs = async (productId: number, specsData: ProductSpecData): Promise<any[] | null> => {
  try {
    // Use local Next.js API route instead of external API
    const url = `/api/products/${productId}/specs`
    const headers = getAuthHeaders()

    const specs = specsData.specs
    const results: any[] = []

    for (const spec of specs) {
      const res = await axios.post(url, spec, { headers })
      results.push(res.data)
    }

    return results
  } catch (err) {
    console.error("Specs əlavə olunmadı:", err)
    return null
  }
}

/* =====================================================
 🟢 5. Məhsulun variantlarını əlavə et
===================================================== */
export const createProductVariants = async (productId: number, variantsData: ProductVariantData): Promise<any[] | null> => {
  try {
    // Use local Next.js API route instead of external API
    const url = `/api/products/${productId}/variants`
    const headers = getAuthHeaders()

    const variants = variantsData.variants
    const results: any[] = []

    for (const variant of variants) {
      const res = await axios.post(url, variant, { headers })
      results.push(res.data)
    }

    return results
  } catch (err) {
    console.error("Variants əlavə olunmadı:", err)
    return null
  }
}

/* =====================================================
 🟢 6. Məhsulu yenilə
===================================================== */
export const updateProduct = async (id: string | number, data: Partial<Product>): Promise<Product | null> => {
  try {
    console.log(`🔄 Updating product ${id} with data:`, data)
    const res = await axios.put(`${BASE_URL}/${id}`, data, { headers: getAuthHeaders() })
    console.log(`✅ Product ${id} updated successfully:`, res.data)
    return res.data
  } catch (err: any) {
    console.error(`❌ Failed to update product ${id}:`, err.response?.data || err.message)
    return null
  }
}

/* =====================================================
 🟢 7. Məhsulu sil
===================================================== */
export const deleteProduct = async (id: string | number): Promise<{ message: string } | null> => {
  try {
    console.log(`🗑️ Deleting product ${id}`)
    const res = await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeaders() })
    console.log(`✅ Product ${id} deleted successfully:`, res.data)
    return res.data
  } catch (err: any) {
    console.error(`❌ Failed to delete product ${id}:`, err.response?.data || err.message)
    return null
  }
}

/* =====================================================
 🟢 8. Məhsulları filtrlə
===================================================== */
export const filterProducts = async (filters: FilterData): Promise<Product[]> => {
  try {
    console.log(`🔍 Filtering products with:`, filters)
    const res = await axios.post(`${BASE_URL}/filter`, filters, { headers: getAuthHeaders() })
    console.log(`✅ Filtered products:`, res.data)
    return Array.isArray(res.data) ? res.data : []
  } catch (err: any) {
    console.error("❌ Filter failed:", err.response?.data || err.message)
    return []
  }
}

/* =====================================================
 🟢 9. Parametrlərlə məhsulları gətir (search, sort, pagination)
===================================================== */
export const getFilteredProducts = async (filters: {
  name?: string
  minPrice?: number
  maxPrice?: number
  categoryId?: number
  sortBy?: string
  sortOrder?: string
  page?: number
  limit?: number
}): Promise<Product[]> => {
  try {
    const params = new URLSearchParams()

    for (const key in filters) {
      const value = filters[key as keyof typeof filters]
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    }

    console.log(`🔍 Getting filtered products with params:`, params.toString())
    const res = await axios.get(`${BASE_URL}?${params.toString()}`, { headers: getAuthHeaders() })
    console.log(`✅ Filtered products retrieved:`, res.data)
    return Array.isArray(res.data) ? res.data : []
  } catch (err: any) {
    console.error("❌ Failed to get filtered products:", err.response?.data || err.message)
    return []
  }
}
