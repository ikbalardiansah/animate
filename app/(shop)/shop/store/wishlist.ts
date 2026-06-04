import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistItem = {
  product_id: number;
  name: string;
  image: string;
  price: number;
  variation_id?: number | null;
  seller_sku?: string;
  parcel_weight?: number,
  
};

type WishlistStore = {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (id: number) => void;
  isWished: (id: number) => boolean;
  clear: () => void;

  // 🔥 sync helper
  hydrateFromServer: (items: WishlistItem[]) => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((state) => {
          const exists = state.items.find(
            (i) => i.product_id === item.product_id,
          );
          if (exists) return state;

          return { items: [...state.items, item] };
        }),

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== id),
        })),

      isWished: (id) => {
        return get().items.some((i) => i.product_id === id);
      },

      clear: () => set({ items: [] }),

      hydrateFromServer: (items) => set({ items }),
    }),
    {
      name: "wishlist-storage",
    },
  ),
);

export const syncWishlistToServer = async (items: any[]) => {
  const rawToken = localStorage.getItem("access_token");

  const token =
    rawToken &&
    rawToken !== "undefined" &&
    rawToken !== "null" &&
    rawToken.trim() !== ""
      ? rawToken
      : null;

  if (!token) return;

  await fetch("NEXT_PUBLIC_API_URL/api/wishlist/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  });
};
