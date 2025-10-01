import { useState } from "react"
import { getProducts, createProduct, createProductSpecs, createProductVariants } from "@/utils/fetchProducts"
import { Product } from "@/types/product"
import { Variant, VariantSpec } from "@/types/variant"
import { category } from "@/types/category"

interface SpecValue {
  key: string
  value: string
}

interface Spec {
  key: string
  name: string
  values: SpecValue[]
}

interface ProductData {
  name: string
  slug: string
  description: string
  img: string
  price: number
  stock: number
  category: string
}

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState<ProductData>({
    name: "",
    slug: "",
    description: "",
    img: "",
    price: 0,
    stock: 0,
    category: ""
  })

  const [productSpecs, setProductSpecs] = useState<Spec[]>([
    { key: "", name: "", values: [{ key: "", value: "" }] }
  ])

  const [productVariants, setProductVariants] = useState<Variant[]>([
    { slug: "", price: 0, stock: 0, discount: 0, images: [], specs: [] }
  ])

  // Load products from API
  const loadProducts = async () => {
    try {
      console.log("🔄 Loading products...")
      const productsData = await getProducts()
      console.log("📦 Loaded products:", productsData)
      console.log("📊 Products count:", productsData.length)
      if (productsData.length > 0) {
        console.log("🆔 Product IDs:", productsData.map(p => p.id))
      }
      setProducts(productsData)
    } catch (error) {
      console.error("❌ Məhsullar yüklənmədi:", error)
    }
  }

  // Validate product data
  const validateProduct = (productData: ProductData): boolean => {
    return !!(productData.name.trim() && productData.price && productData.category)
  }

  // Check authentication
  const checkAuth = (): boolean => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("No authentication token found")
      return false
    }
    return true
  }

  // Find category by name
  const findCategory = (categories: category[], categoryName: string) => {
    return categories.find(cat => cat.name === categoryName)
  }

  // Clean and validate specs
  const prepareSpecs = (specsData: Spec[]) => {
    return specsData
      .filter(spec => spec.key.trim() && spec.name.trim() && 
        spec.values.some(val => val.key.trim() && val.value.trim()))
      .map(spec => ({
        key: spec.key.trim(),
        name: spec.name.trim(),
        values: spec.values
          .filter(val => val.key.trim() && val.value.trim())
          .map(val => ({
            key: val.key.trim(),
            value: val.value.trim()
          }))
      }))
  }

  // Clean and validate variants
  const prepareVariants = (variantsData: Variant[]) => {
    return variantsData
      .filter(variant => variant.slug.trim() && Number(variant.price) > 0 && variant.stock >= 0)
      .map(variant => ({
        slug: variant.slug.trim(),
        price: Number(variant.price),
        stock: Number(variant.stock),
        discount: Number(variant.discount) || 0,
        images: variant.images || [],
        specs: variant.specs
          .filter(spec => spec.key.trim() && spec.value.trim())
          .map(spec => ({
            key: spec.key.trim(),
            value: spec.value.trim()
          }))
      }))
  }

  // Generate unique slug
  const generateSlug = (productData: ProductData): string => {
    const baseSlug = productData.slug.trim() || productData.name.toLowerCase().replace(/\s+/g, "-")
    return `${baseSlug}-${Date.now()}`
  }

  // Reset all forms
  const resetForms = () => {
    setNewProduct({
      name: "",
      slug: "",
      description: "",
      img: "",
      price: 0,
      stock: 0,
      category: ""
    })
    setProductSpecs([{ key: "", name: "", values: [{ key: "", value: "" }] }])
    setProductVariants([{ slug: "", price: 0, stock: 0, discount: 0, images: [], specs: [] }])
    setShowProductForm(false)
  }

  // Main product creation function
  const handleAddProduct = async (
    categories: category[],
    data?: { product: ProductData; specs: Spec[]; variants: Variant[] }
  ): Promise<boolean> => {
    const productData = data?.product || newProduct
    const specsData = data?.specs || productSpecs
    const variantsData = data?.variants || productVariants

    // Validation
    if (!validateProduct(productData)) return false
    if (!checkAuth()) return false

    const selectedCategory = findCategory(categories, productData.category)
    if (!selectedCategory) {
      console.error("Kateqoriya tapılmadı")
      return false
    }

    try {
      // Prepare data
      const validSpecs = prepareSpecs(specsData)
      const validVariants = prepareVariants(variantsData)
      const uniqueSlug = generateSlug(productData)

      // Separate product data (without categoryId, specs, variants)
      const productOnlyData = {
        name: productData.name.trim(),
        slug: uniqueSlug,
        description: productData.description.trim() 
          ? [productData.description.trim()] 
          : ["Məhsul təsviri"],
        img: productData.img || "https://via.placeholder.com/400x400?text=No+Image",
        price: Number(productData.price),
        stock: Number(productData.stock)
      }

      console.log("🔍 Product data being sent:", productOnlyData)
      console.log("🔍 Selected category ID:", selectedCategory.id)
      console.log("🔍 Specs to add:", validSpecs)
      console.log("🔍 Variants to add:", validVariants)

      // Create product with categoryId in URL
      const result = await createProduct({
        ...productOnlyData,
        categoryId: parseInt(selectedCategory.id, 10)
      })
      
      if ((result as any)?.product?.id || result?.id) {
        const createdProduct = (result as any)?.product || result
        const productId = createdProduct.id
        console.log("✅ Məhsul uğurla yaradıldı:", result)
        console.log("🆔 Yaradılan məhsulun ID-si:", productId)
        console.log("🔗 Məhsul URL-i: /products/" + productId)
        
        // Add specs if any exist
        if (validSpecs.length > 0) {
          console.log("📝 Adding specs to product...")
          const specsResult = await createProductSpecs(productId, { specs: validSpecs })
          if (specsResult) {
            console.log("✅ Specs uğurla əlavə edildi:", specsResult)
          } else {
            console.error("❌ Specs əlavə edilmədi")
          }
        }
        
        // Add variants if any exist
        if (validVariants.length > 0) {
          console.log("🎨 Adding variants to product...")
          const variantsResult = await createProductVariants(productId, { variants: validVariants })
          if (variantsResult) {
            console.log("✅ Variants uğurla əlavə edildi:", variantsResult)
          } else {
            console.error("❌ Variants əlavə edilmədi")
          }
        }
        
        await loadProducts()
        resetForms()
        console.log("✅ Məhsul və bütün əlavə məlumatlar uğurla əlavə edildi!")
        return true
      } else {
        console.error("❌ Məhsul əlavə edilmədi - Invalid response:", result)
        return false
      }
    } catch (error) {
      console.error("Məhsul əlavə edilərkən xəta:", error)
      return false
    }
  }

  return {
    products,
    setProducts,
    showProductForm,
    setShowProductForm,
    newProduct,
    setNewProduct,
    productSpecs,
    setProductSpecs,
    productVariants,
    setProductVariants,
    loadProducts,
    handleAddProduct
  }
}
