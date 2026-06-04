export interface Variant {
  id: number;
  sku_id: string;
  seller_sku?: string | null;
  variation_option?: string | null;
  retail_price: string;
  quantity: number;
}

export interface ProductImage {
  id: number;
  image_url: string;
}

export interface Product {
  id: number;

  product_id: string;

  name: string;

  slug?: string;

  description?: string | null;

  brand?: string | null;

  main_image?: string | null;

  images?: ProductImage[];

  variants?: Variant[];

  parcel_weight?: number;
}