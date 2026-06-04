import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * CART ITEM = bentuk paling sederhana untuk checkout/cart
 * Jangan pakai Product API di sini
 */
type CartItem = {
  id: number;
  product_id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  seller_sku?: string;
  variation_id?: number | null;
  parcel_weight?: number;
};

type CartStore = {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;

  cartCount: () => number;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      // ======================
      // ADD TO CART
      // ======================
      addToCart: (item) => {
        const cart = get().cart;

        const existing = cart.find((i) => i.id === item.id);

        if (existing) {
          set({
            cart: cart.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          });
        } else {
          set({
            cart: [...cart, item],
          });
        }
      },

      // ======================
      // REMOVE ITEM
      // ======================
      removeFromCart: (id) => {
        set({
          cart: get().cart.filter((i) => i.id !== id),
        });
      },

      // ======================
      // UPDATE QTY
      // ======================
      updateQty: (id, qty) => {
        if (qty <= 0) {
          set({
            cart: get().cart.filter((i) => i.id !== id),
          });
          return;
        }

        set({
          cart: get().cart.map((i) =>
            i.id === id ? { ...i, quantity: qty } : i,
          ),
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      // ======================
      // CART COUNT (BADGE)
      // ======================
      cartCount: () =>
        get().cart.reduce((total, item) => total + item.quantity, 0),
    }),

    {
      name: "cart-storage", // localStorage key
    },
  ),
);
