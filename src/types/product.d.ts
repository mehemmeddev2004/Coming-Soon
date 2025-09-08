export type Product = {
  brand: any;
  sizes: any;
  colors: any;
  id: string;
  slug: string;
  name: string;
  description?: string;
  img?: string; // əsas şəkil
  price: number | string; // API-də string gəlir, lazım gələrsə number-a çevir
  stock: number;
  isActive?: boolean;

  category?: {
    id: number;
    name: string;
    slug: string;
    parentId?: number | null;
    imageUrl?: string | null;
  };

  specs?: {
    id: number;
    key: string;
    name: string;
    productId: number;
    values: {
      id: number;
      key: string;
      value: string;
      productSpecId: number;
    }[];
  }[];

  variants?: {
    id: number;
    slug: string;
    price: number | string;
    stock: number;
    discount?: number;
    images?: string[];
    productId: number;
    specs?: {
      key: string;
      value: string;
    }[];
  }[];

  createdAt?: string;
  updatedAt?: string;
};


// Filterlərin tipi
export type SelectedFilters = {
  brand: any[];
  color: any[];
  size: any[];
};
