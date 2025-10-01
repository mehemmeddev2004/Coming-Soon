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
  const product = await getProductById(Number(resolvedParams.id))

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
  console.log("ProductPage params:", resolvedParams)
  console.log("Product ID:", resolvedParams.id)
  
  let product

  try {
    product = await getProductById(Number(resolvedParams.id))
    console.log("Fetched product:", product)
  } catch (error) {
    console.error("Error fetching product:", error)
    redirect("/")
  }

  if (!product) {
    console.log("Product not found, redirecting to home")
    redirect("/")
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
