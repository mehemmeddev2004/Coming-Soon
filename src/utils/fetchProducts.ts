import { Product } from "@/types/product"

/* =====================================================
 🧩 Type Definitions
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
  page?: number
  limit?: number
}

/* =====================================================
⚙️ Configuration
===================================================== */
const BASE_URL = "/api/products"
const IS_SERVER = typeof window === "undefined"

/* =====================================================
🔐 Auth & Headers Helper
===================================================== */
const getAuthHeaders = (): HeadersInit => {
  const headers: Record<string, string> = { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  
  if (!IS_SERVER) {
    const token = localStorage.getItem("token")
    if (token) headers["Authorization"] = `Bearer ${token}`
  }
  
  return headers
}

const getUrl = (path = ""): string => {
  if (IS_SERVER) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    return `${baseUrl}${BASE_URL}${path}`
  }
  return `${BASE_URL}${path}`
}

/* =====================================================
 🔧 Utility Functions
===================================================== */
const handleFetchError = async (response: Response): Promise<never> => {
  const raw = await response.text()
  let parsed: any = null
  try { parsed = JSON.parse(raw) } catch {}
  
  const msg = parsed?.message || `Request failed: ${response.status}`
  throw new Error(Array.isArray(msg) ? msg.join(", ") : String(msg))
}

const fetchWithConfig = async (url: string, config: RequestInit = {}) => {
  const response = await fetch(url, {
    ...config,
    headers: { ...getAuthHeaders(), ...config.headers },
    ...(IS_SERVER && { cache: "no-store" }),
  })
  
  if (!response.ok) await handleFetchError(response)
  return response.json()
}

const normalizeId = (id: string | number) => ({
  numId: Number(id),
  strId: String(id)
})

const normalizeDescription = (description?: string | string[]): string[] => {
  if (Array.isArray(description)) return description
  return description ? [String(description).trim()] : []
}

/* =====================================================
 🟢 API Functions
===================================================== */

// 1. Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const data = await fetchWithConfig(getUrl(""), { method: "GET" })
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("❌ Failed to fetch products:", err)
    return []
  }
}

// 2. Get product by ID
export const getProductById = async (id: string | number): Promise<Product | null> => {
  try {
    // Try direct API call first
    try {
      return await fetchWithConfig(getUrl(`/${id}`), { method: "GET" })
    } catch {
      // Fallback: search in all products
      const allProducts = await getProducts()
      const { numId, strId } = normalizeId(id)
      
      return allProducts.find(p => {
        const productId = typeof p.id === 'number' ? p.id : Number(p.id)
        return productId === numId || String(p.id) === strId
      }) || null
    }
  } catch (err) {
    console.error(`❌ Failed to fetch product ${id}:`, err)
    return null
  }
}

// 3. Create product
export const createProduct = async (data: CreateProductData): Promise<Product | null> => {
  try {
    if (!data.categoryId) throw new Error("categoryId is required")

    const { categoryId, specs, variants, description, ...rest } = data
    const body = {
      ...rest,
      description: normalizeDescription(description),
    }

    return await fetchWithConfig(`/api/products/category/${categoryId}`, {
      method: "POST",
      body: JSON.stringify(body),
    })
  } catch (err) {
    console.error("❌ Failed to create product:", err)
    return null
  }
}

// 4. Create product specs (batch)
export const createProductSpecs = async (
  productId: number,
  { specs }: ProductSpecData
): Promise<unknown[] | null> => {
  try {
    const url = `/api/products/${productId}/specs`
    const results = await Promise.all(
      specs.map(spec =>
        fetchWithConfig(url, {
          method: "POST",
          body: JSON.stringify(spec),
        })
      )
    )
    return results
  } catch (err) {
    console.error("❌ Failed to create specs:", err)
    return null
  }
}

// 5. Create product variants (batch)
export const createProductVariants = async (
  productId: number,
  { variants }: ProductVariantData
): Promise<unknown[] | null> => {
  try {
    const url = `/api/products/${productId}/variants`
    const results = await Promise.all(
      variants.map(variant =>
        fetchWithConfig(url, {
          method: "POST",
          body: JSON.stringify(variant),
        })
      )
    )
    return results
  } catch (err) {
    console.error("❌ Failed to create variants:", err)
    return null
  }
}

// 6. Update product
export const updateProduct = async (
  id: string | number,
  data: Partial<Product>
): Promise<Product | null> => {
  try {
    return await fetchWithConfig(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch (err) {
    console.error(`❌ Failed to update product ${id}:`, err)
    return null
  }
}

// 7. Delete product
export const deleteProduct = async (id: string | number): Promise<boolean> => {
  try {
    await fetchWithConfig(`${BASE_URL}/${id}`, { method: "DELETE" })
    return true
  } catch (err) {
    console.error(`❌ Failed to delete product ${id}:`, err)
    return false
  }
}

// 8. Filter products (POST method)
export const filterProducts = async (filters: FilterData): Promise<Product[]> => {
  try {
    const data = await fetchWithConfig(`${BASE_URL}/filter`, {
      method: "POST",
      body: JSON.stringify(filters),
    })
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("❌ Filter failed:", err)
    return []
  }
}

// 9. Get filtered products with query params
export const getFilteredProducts = async (filters: FilterData): Promise<Product[]> => {
  try {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null) params.append(key, String(val))
    })

    const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL
    const data = await fetchWithConfig(url, { method: "GET" })
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("❌ Failed to get filtered products:", err)
    return []
  }
}