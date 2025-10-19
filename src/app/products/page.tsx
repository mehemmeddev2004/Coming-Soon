import ProductsPageClient from "./ProductsPageClient";

interface PageProps {
  searchParams: {
    category?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  return <ProductsPageClient categorySlug={searchParams.category} />;
}
