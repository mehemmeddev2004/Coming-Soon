export enum SeasonType {
  SPRING = "spring",
  SUMMER = "summer",
  AUTUMN = "autumn",
  WINTER = "winter",
}

export interface Season {
  id: number
  name: string
  seasonType: SeasonType
  product: {
    brand: any;
  sizes: any;
  colors: any;
  id: string;
  slug: string;
  name: string;
  description?: string;
  img?: string; // əsas şəkil
  images?: string
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
  } | null
  createdAt?: string
}

export interface CreateSeasonData {
  name: string
  seasonType: SeasonType
}
