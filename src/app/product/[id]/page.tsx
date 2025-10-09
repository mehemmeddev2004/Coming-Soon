import { getProductById } from "@/utils/fetchProducts"
import { redirect } from "next/navigation"
import ProductContent from "./ProductContent"

type Props = {
  params: Promise<{ id: string }>
}

const fallbackImages = [
  {
    id: "1",
    url: "https://media.endclothing.com/media/f_auto,q_auto:eco,w_1600/prodmedia/media/catalog/product/0/9/09-09-2025-ns_jv6464_1.jpg",
  },
  {
    id: "2",
    url: "https://media.endclothing.com/media/f_auto,q_auto:eco,w_1600/prodmedia/media/catalog/product/0/9/09-09-2025-ns_jv6464_7.jpg",
  },
  {
    id: "3",
    url: "https://media.endclothing.com/media/f_auto,q_auto:eco,w_1600/prodmedia/media/catalog/product/0/9/09-09-2025-ns_jv6464_8.jpg",
  },
]

// SEO metadata
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params
  let product = null
  try {
    product = await getProductById(Number(resolvedParams.id))
  } catch (error) {
    console.error("Failed to fetch product for metadata:", error)
  }

  return {
    title: product ? product.name : "Product not found",
    description: product?.description 
      ? Array.isArray(product.description) 
        ? product.description.join(", ") 
        : product.description
      : "Check out our product",
  }
}

const ProductPage = async ({ params }: Props) => {
  const resolvedParams = await params
  const productId = Number(resolvedParams.id)
  console.log("ProductPage params:", resolvedParams)
  console.log("Product ID:", productId)
  console.log(`🔍 Fetching product from: http://localhost:3001/api/products/${productId}`)

  let product

  try {
    product = await getProductById(productId)
    if (!product) {
      console.error(`❌ Product not found or fetch failed for product ${productId}. Possible reasons: network/server error, product does not exist.`)
      redirect("/")
      return null
    }
    console.log("Fetched product:", product)
  } catch (error: any) {
    console.error(`❌ Exception while fetching product ${productId}:`, error)
    console.error("❌ Error type:", typeof error)
    console.error("❌ Error message:", error?.message)
    if (error?.message === "fetch failed") {
      console.error("❌ Network/server error: Unable to reach API endpoint or endpoint returned error.")
    }
    redirect("/")
    return null
  }

  const galleryImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((url: string, idx: number) => ({
          id: String(idx + 1),
          url,
        }))
      : fallbackImages

  const mainImage =
    product.images?.[0] || product.img || fallbackImages[0].url

  return (
    <ProductContent
      product={product}
      galleryImages={galleryImages}
      mainImage={mainImage}
    />
  )
}

export default ProductPage
