import { Product } from "@/types/product"

/* =====================================================
 🧩 Tip Tanımlamaları
===================================================== */
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
  specs?: unknown[]
  variants?: unknown[]
}

type ProductSpecData = { specs: unknown[] }
type ProductVariantData = { variants: unknown[] }

type FilterData = {
  name?: string
  minPrice?: number
  maxPrice?: number
  categoryId?: number
  sortBy?: string
  sortOrder?: string
}

/* =====================================================
⚙️ Konfiqurasiya
===================================================== */
const BASE_URL = "/api/products"
const SERVER_URL = "https://etor.onrender.com/api/products"

/* =====================================================
🔐 Auth Header Helper
===================================================== */
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

/* =====================================================
 🔄 URL Helper (SSR / CSR üçün)
===================================================== */
const getUrl = (path = ""): string => {
  // For server-side requests, use full URL with localhost
  const isServer = typeof window === "undefined"
  if (isServer) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    return `${baseUrl}${BASE_URL}${path}`
  }
  // For client-side requests, use relative URL
  return `${BASE_URL}${path}`
}

/* =====================================================
 🟢 1. Bütün məhsulları gətir
===================================================== */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const url = getUrl("")
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "NextJS-App/1.0",
      },
      ...(typeof window === "undefined" && { cache: "no-store" }),
    })

    if (!response.ok) {
      console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("❌ Məhsullar yüklənərkən xəta:", err)
    return []
  }
}

/* =====================================================
 🟢 2. ID-yə görə məhsul gətir
===================================================== */
export const getProductById = async (id: string | number): Promise<Product | null> => {
  try {
    // First, try to get the product from the local API
    const url = getUrl(`/${id}`)
    console.log(`🔍 Fetching product from: ${url}`)
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      ...(typeof window === "undefined" && { cache: "no-store" }),
    })

    console.log(`📥 Response status: ${response.status}`)

    if (response.ok) {
      const data = await response.json()
      console.log(`✅ Product found:`, data)
      return data
    }

    // If 404, try to get all products and find by ID
    console.log(`⚠️ Product ${id} not found via direct API, trying to fetch from all products...`)
    const allProducts = await getProducts()
    console.log(`📦 Checking ${allProducts.length} products for ID ${id}`)
    
    const numId = Number(id)
    const strId = String(id)
    const product = allProducts.find(p => {
      const productId = typeof p.id === 'number' ? p.id : Number(p.id)
      return productId === numId || String(p.id) === strId
    })
    
    if (product) {
      console.log(`✅ Found product in list:`, product)
      return product
    }

    console.error(`❌ Product ${id} not found anywhere`)
    return null
  } catch (err) {
    console.error(`❌ Failed to fetch product ${id}:`, err)
    return null
  }
}

/* =====================================================
 🟢 3. Məhsul əlavə et
===================================================== */
export const createProduct = async (data: CreateProductData): Promise<Product | null> => {
  try {
    if (!data.categoryId) throw new Error("categoryId tələb olunur")

    const url = `/api/products/category/${data.categoryId}`
    const { categoryId: _, specs: __, variants: ___, ...body } = data

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error("❌ Məhsul əlavə olunmadı:", err)
    return null
  }
}

/* =====================================================
 🟢 4. Məhsulun xüsusiyyətlərini (specs) əlavə et
===================================================== */
export const createProductSpecs = async (
  productId: number,
  { specs }: ProductSpecData
): Promise<unknown[] | null> => {
  try {
    const url = `/api/products/${productId}/specs`
    const headers = getAuthHeaders()
    const results = []

    for (const spec of specs) {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(spec),
      })

      if (!response.ok) {
        throw new Error(`Failed to create spec: ${response.status}`)
      }

      const data = await response.json()
      results.push(data)
    }

    return results
  } catch (err) {
    console.error("❌ Specs əlavə olunmadı:", err)
    return null
  }
}

/* =====================================================
 🟢 5. Məhsulun variantlarını əlavə et
===================================================== */
export const createProductVariants = async (
  productId: number,
  { variants }: ProductVariantData
): Promise<unknown[] | null> => {
  try {
    const url = `/api/products/${productId}/variants`
    const headers = getAuthHeaders()
    const results = []

    for (const variant of variants) {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(variant),
      })

      if (!response.ok) {
        throw new Error(`Failed to create variant: ${response.status}`)
      }

      const data = await response.json()
      results.push(data)
    }

    return results
  } catch (err) {
    console.error("❌ Variants əlavə olunmadı:", err)
    return null
  }
}

/* =====================================================
 🟢 6. Məhsulu yenilə
===================================================== */
export const updateProduct = async (id: string | number, data: Partial<Product>) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error(`❌ Failed to update product ${id}:`, err)
    return null
  }
}

/* =====================================================
 🟢 7. Məhsulu sil
===================================================== */
export const deleteProduct = async (id: string | number) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error(`❌ Failed to delete product ${id}:`, err)
    return null
  }
}

/* =====================================================
 🟢 8. Məhsulları filtrlə
===================================================== */
export const filterProducts = async (filters: FilterData): Promise<Product[]> => {
  try {
    const response = await fetch(`${BASE_URL}/filter`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(filters),
    })

    if (!response.ok) {
      throw new Error(`Filter failed: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("❌ Filter failed:", err)
    return []
  }
}

/* =====================================================
 🟢 9. Parametrlərlə məhsulları gətir (search, sort, pagination)
===================================================== */
export const getFilteredProducts = async (filters: FilterData & { page?: number; limit?: number }) => {
  try {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null) params.append(key, String(val))
    })

    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get filtered products: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("❌ Failed to get filtered products:", err)
    return []
  }
}
