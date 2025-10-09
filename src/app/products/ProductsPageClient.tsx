"use client";
import { useState, useEffect } from "react";
import ProductFilter from "@/components/ui/product/ProductFilter";
import { getProducts } from "@/utils/fetchProducts";
import ProductCard from "@/components/ui/product/ProductCard";
import { applyCategoryFilter, applyColorFilter, applyPriceFilter, applySort } from "@/utils/productFilters";
import type { Product } from "@/types/product";


const ProductsPageClient = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [selectedCategories, setSelectedCategories] = useState<Array<string | number>>([]);
  const [checked, setChecked] = useState<boolean[]>([]);


  useEffect(() => {
    (async () => {
      const prods = await getProducts();
      setProducts(prods || []);
      setFilteredProducts(prods || []);
    })();
  }, []);


  useEffect(() => {
    const noFilters =
      !selectedCategories.length &&
      !selectedColor &&
      !selectedSort &&
      minPrice === "" &&
      maxPrice === "";
    if (noFilters) {
      setFilteredProducts(products);
      return;
    }
    let local = [...products];
    local = applyCategoryFilter(local, selectedCategories);
    local = applyColorFilter(local, selectedColor);
    local = applyPriceFilter(local, minPrice, maxPrice);
    local = applySort(local, selectedSort);
    setFilteredProducts(local);
  }, [selectedCategories, selectedColor, selectedSort, minPrice, maxPrice, products]);


  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleFilters = () => setFiltersOpen((prev) => !prev);


  const resetFilters = async () => {
    setSelectedCategories([]);
    setSelectedColor(null);
    setSelectedSort("");
    setMinPrice("");
    setMaxPrice("");
    setChecked([]);
    const all = await getProducts();
    setFilteredProducts(all || []);
  };


  return (
    <div className="max-w-[1430px] mx-auto px-4 py-4 min-h-screen flex flex-col relative">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-[15px] text-gray-600">
          Products ({filteredProducts.length})
        </span>
        <button onClick={toggleFilters} className="p-2">
          <img src="/img/filter.svg" alt="Toggle filters" />
        </button>
      </div>


      {filteredProducts.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3  w-full">
          {filteredProducts.map((product, idx) => (
            product && typeof product === "object" ? (
              (product.id || product._id) ? (
                <ProductCard key={product.id ?? product._id} item={product} />
              ) : (
                <ProductCard key={idx} item={product} />
              )
            ) : null
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-600">
          <p className="mb-4">Nəticə tapılmadı.</p>
          <button
            className="px-4 py-2 border rounded"
            onClick={resetFilters}
          >
            Filtrləri sıfırla
          </button>
        </div>
      )}


      <ProductFilter
        handleFilterChange={filtersOpen}
        handleFilterToggle={toggleFilters}
        openSections={openSections}
        toggleSection={toggleSection}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onChangeMin={setMinPrice}
        onChangeMax={setMaxPrice}
        onApplyPrice={() => {}}
        onChangeSelectedCategories={setSelectedCategories}
        checked={checked}
        setChecked={setChecked}
      />
    </div>
  );
};


export default ProductsPageClient;
