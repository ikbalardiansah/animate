"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/app/(shop)/shop/store/wishlist";

export default function WishlistButton({ product, className }: any) {
  // Tambahkan className di sini
  const { add, remove, isWished } = useWishlistStore();
  const wished = isWished(product.id);

  const toggleWishlist = async () => {
    if (wished) {
      remove(product.id);
    } else {
      const firstVariant = product.variants?.[0];

      const price = Number(firstVariant?.retail_price || 0);

      add({
        product_id: product.id,

        name: product.name,

        image: firstVariant?.variant_image || product.main_image || "",

        price,

        variation_id: firstVariant?.id,

        seller_sku: firstVariant?.seller_sku ?? firstVariant?.sku_id,

        parcel_weight: Number(product.parcel_weight ?? 0),
      });

      console.log(firstVariant);
    }

    const rawToken = localStorage.getItem("access_token");

    const token =
      rawToken &&
      rawToken !== "undefined" &&
      rawToken !== "null" &&
      rawToken.trim() !== ""
        ? rawToken
        : null;

    if (!token) {
      return;
    }

    try {
      if (wished) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${product.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            product_id: product.id,
          }),
        });
      }
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Biar gak trigger link kalau tombol ini ada di dalam Card
        toggleWishlist();
      }}
      // Gunakan className dari props, jika kosong baru pakai default absolute
      className={
        className ||
        "absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm hover:scale-105 transition"
      }
    >
      <Heart
        className={`w-5 h-5 transition ${
          wished ? "fill-[#FF5F9D] text-[#FF5F9D]" : "text-gray-400"
        }`}
      />
    </button>
  );
}
