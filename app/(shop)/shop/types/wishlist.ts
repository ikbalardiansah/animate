import { Product } from "./product";

export type WishlistItem = {
  product_id: number;
  name: string;
  image: string;
  price: number;
  variation_id?: number | null;
  sku?: string;
  parcel_weight?: number;
};

export const mapProductToWishlist = (
  product: Product,
): WishlistItem => {
  const firstVariant = product.variants?.[0];

  console.log("PRODUCT:", product.name);
  console.log("VARIANTS:", product.variants);
  console.log("FIRST:", firstVariant);

  return {
    product_id: product.id,

    name: product.name,

    image:
      product.main_image ??
      product.images?.[0]?.image_url ??
      "",

    price: Number(firstVariant?.retail_price ?? 0),

    sku:
      firstVariant?.seller_sku ??
      firstVariant?.sku_id ??
      `ANM-${product.id}`,

    variation_id: firstVariant?.id ?? null,

    parcel_weight: Number(
      product.parcel_weight ?? 0,
    ),
  };
};
