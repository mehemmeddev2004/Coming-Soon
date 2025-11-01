import { useState } from "react"
import { getProducts, createProduct, createProductSpecs, createProductVariants } from "@/utils/fetchProducts"
// Bütün tipləri `any` olaraq dəyişirik.
import { Product } from "@/types/product"
import { Variant, VariantSpec } from "@/types/variant"
import { category } from "@/types/category"

// Məhsul ilə əlaqəli verilənlər tipi
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
  const [products, setProducts] = useState<any[]>([]) // `Product[]` əvəzinə `any[]`
  const [showProductForm, setShowProductForm] = useState<boolean>(false)
  const [newProduct, setNewProduct] = useState<ProductData>({
    name: "",
    slug: "",
    description: "",
    img: "",
    price: 0,
    stock: 0,
    category: ""
  })

  const [productSpecs, setProductSpecs] = useState<any[]>([ { key: "", name: "", values: [{ key: "", value: "" }] } ]) // `Spec[]` əvəzinə `any[]`
  const [productVariants, setProductVariants] = useState<any[]>([ { slug: "", price: 0, stock: 0, discount: 0, images: [], specs: [] } ]) // `Variant[]` əvəzinə `any[]`

  // Məhsulları yüklə
  const loadProducts = async () => {
    try {
      console.log("🔄 Yüklənir...")
      const productsData = await getProducts() as any[] // `getProducts()` funksiyasının nəticəsini `any[]` olaraq qeyd edirik.
      console.log("📦 Məhsullar:", productsData)
      setProducts(productsData)
    } catch (error) {
      console.error("❌ Yükləmə xətası:", error)
    }
  }

  // Məhsul məlumatlarını yoxla
const validateProduct = (productData: any): boolean => {
  return productData.name.trim() && productData.price > 0 && productData.category.trim()
}


  // Kateqoriyanı tap
  const findCategory = (categories: any[], categoryName: string) => { // `category[]` əvəzinə `any[]`
    return categories.find((cat: any) => cat.name === categoryName) // `category` tipini `any` olaraq dəyişirik.
  }

  // Əlavə edilməsi üçün uyğun spec-ləri hazırlamaq
  const prepareSpecs = (specsData: any[]) => { // `Spec[]` əvəzinə `any[]`
    console.log("🔍 prepareSpecs input:", specsData)
    const filtered = specsData.filter((spec: any) => spec.key.trim() && spec.name.trim() && spec.values.length > 0)
      .map((spec: any) => ({
        key: spec.key.trim(),
        name: spec.name.trim(),
        values: spec.values.filter((val: any) => val.key.trim() && val.value.trim())
      }))
    console.log("✅ prepareSpecs output:", filtered)
    return filtered
  }

  // Variantları hazırlamaq
  const prepareVariants = (variantsData: any[]) => { // `Variant[]` əvəzinə `any[]`
    return variantsData.filter((variant: any) => variant.slug.trim() && variant.price > 0 && variant.stock >= 0)
      .map((variant: any) => ({
        slug: variant.slug.trim(),
        price: variant.price,
        stock: variant.stock,
        discount: variant.discount,
        images: variant.images || [],
        specs: variant.specs.filter((spec: any) => spec.key.trim() && spec.value.trim())
      }))
  }

  // Unikal slug yarat
  const generateSlug = (productData: ProductData): string => {
    const base = productData.slug.trim() || productData.name
    // strip query/hash
    const stripped = base.split('?')[0].split('#')[0]
    // lowercase and replace non-alphanumeric with hyphens
    const normalized = stripped
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    return `${normalized}-${Date.now()}`
  }

  // Formları sıfırlamaq
  const resetForms = () => {
    setNewProduct({ name: "", slug: "", description: "", img: "", price: 0, stock: 0, category: "" })
    setProductSpecs([ { key: "", name: "", values: [{ key: "", value: "" }] } ])
    setProductVariants([ { slug: "", price: 0, stock: 0, discount: 0, images: [], specs: [] } ])
    setShowProductForm(false)
  }

  // Məhsul əlavə etmə funksiyası
  const handleAddProduct = async (categories: any[], data?: { product: ProductData, specs: any[], variants: any[] }) => { // `category[]`, `Spec[]`, `Variant[]` hamısı `any[]` oldu.
    const productData = data?.product || newProduct
    const specsData = data?.specs || productSpecs
    const variantsData = data?.variants || productVariants

    // Məhsul məlumatlarını yoxla
    if (!validateProduct(productData)) {
      console.error("❌ Məhsul məlumatları səhvdir")
      return false
    }

    const selectedCategory = findCategory(categories, productData.category)
    if (!selectedCategory) {
      console.error("❌ Kateqoriya tapılmadı")
      return false
    }

    try {
      // Verilənləri hazırlamaq
      const validSpecs = prepareSpecs(specsData)
      const validVariants = prepareVariants(variantsData)
      const uniqueSlug = generateSlug(productData)

      const productOnlyData = {
        name: productData.name.trim(),
        slug: uniqueSlug,
        description: productData.description.trim() || "Məhsul təsviri",
        img: productData.img || "https://via.placeholder.com/400x400?text=No+Image",
        price: productData.price,
        stock: productData.stock
      }

      // Məhsulu yarat
      console.log("📤 Creating product with data:", { ...productOnlyData, categoryId: parseInt(selectedCategory.id, 10) })
      const result = await createProduct({ ...productOnlyData, categoryId: parseInt(selectedCategory.id, 10) }) as any // `createProduct()` funksiyasının nəticəsini `any` olaraq qeyd edirik.
      console.log("📥 Create product result:", result)
      
      if (!result) {
        console.error("❌ Məhsul yaradılmadı - API null qaytardı")
        console.error("🔍 Yoxlayın: 1) Token mövcuddur? 2) Backend API işləyir? 3) Kateqoriya ID düzgündür?")
        return false
      }
      
      // Backend returns {product: {...}, message: '...'} structure
      const createdProduct = result.product || result
      
      if (!createdProduct.id) {
        console.error("❌ Məhsul yaradılmadı - cavabda 'id' yoxdur")
        console.error("📦 Alınan cavab:", result)
        return false
      }
      
      const productId = createdProduct.id
      console.log("✅ Məhsul yaradıldı:", createdProduct)

      // Specs əlavə et
      if (validSpecs.length) {
        console.log("📤 Sending specs to API:", validSpecs)
        const specsResult = await createProductSpecs(productId, { specs: validSpecs })
        console.log("📥 Specs API result:", specsResult)
      } else {
        console.log("⚠️ No valid specs to create")
      }

      // Variants əlavə et
      if (validVariants.length) {
        await createProductVariants(productId, { variants: validVariants })
      }

      // Məhsulları yenilə
      await loadProducts()

      // Formları sıfırla
      resetForms()

      console.log("✅ Məhsul uğurla yaradıldı")
      return true
    } catch (error) {
      console.error("❌ Xəta:", error)
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
