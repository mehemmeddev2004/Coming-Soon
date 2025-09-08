// Sort mapping
export const mapSort = (val: string) => {
  switch (val) {
    case "Low to High": return "price_asc";
    case "High to Low": return "price_desc";
    case "A-Z": return "name_asc";
    case "Z-A": return "name_desc";
    case "Featured": return "featured";
    default: return val;
  }
};

// Category filter
export const applyCategoryFilter = (list: any[], selectedCategories: Array<string|number>) => {
  if (!selectedCategories?.length) return list;
  const sel = selectedCategories.map(String);
  return list.filter((p: any) => {
    const cid = p?.category?.id ?? p?.categoryId ?? p?.category_id;
    return cid != null && sel.includes(String(cid));
  });
};

// Color filter
export const applyColorFilter = (list: any[], selectedColor: string | null) => {
  if (!selectedColor) return list;
  const target = selectedColor.toLowerCase();
  return list.filter((p: any) => {
    const specs = p?.specs || [];
    const specMatch = specs.some((s: any) =>
      (s?.key || s?.name || "").toLowerCase().includes("color") &&
      (s?.values || []).some((v: any) => (v?.value || v?.key)?.toLowerCase() === target)
    );
    if (specMatch) return true;

    return (p?.variants || []).some((vr: any) =>
      (vr?.specs || []).some((vs: any) =>
        String(vs?.key).toLowerCase() === "color" &&
        String(vs?.value).toLowerCase() === target
      )
    );
  });
};

// Price filter
export const applyPriceFilter = (list: any[], minPrice: number | "", maxPrice: number | "") => {
  const minP = minPrice !== "" ? Number(minPrice) : null;
  const maxP = maxPrice !== "" ? Number(maxPrice) : null;
  return list.filter((p: any) => {
    const price = Number(p?.price);
    if (minP != null && price < minP) return false;
    if (maxP != null && price > maxP) return false;
    return true;
  });
};

// Sort filter
export const applySort = (list: any[], selectedSort: string) => {
  const s = mapSort(selectedSort);
  const result = [...list];
  if (s === "price_asc") result.sort((a, b) => a.price - b.price);
  if (s === "price_desc") result.sort((a, b) => b.price - a.price);
  if (s === "name_asc") result.sort((a, b) => String(a.name).localeCompare(b.name));
  if (s === "name_desc") result.sort((a, b) => String(b.name).localeCompare(a.name));
  return result;
};

// Master filter (hamısını birləşdirir)
export const applyAllFilters = (
  products: any[],
  categories: Array<string|number>,
  color: string | null,
  minPrice: number | "",
  maxPrice: number | "",
  sort: string
) => {
  let result = [...products];
  result = applyCategoryFilter(result, categories);
  result = applyColorFilter(result, color);
  result = applyPriceFilter(result, minPrice, maxPrice);
  result = applySort(result, sort);
  return result;
};
