export type CartItem = {
  id: number;

  name: string;

  image: string;

  price: number;

  quantity: number;

  sku?: string;

  variant_id?: number;

  seller_sku?: string;

  parcel_weight: number 
  
};