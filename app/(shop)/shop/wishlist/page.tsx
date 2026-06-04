"use client";

import React from "react";
import Link from "next/link";
import { useWishlistStore } from "../store/wishlist";
import { Trash2, ShoppingBag, Heart, ArrowLeft } from "lucide-react";
import { Poppins } from "next/font/google";
import { useCartStore } from "../store/cart";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export default function WishlistPage() {
  const { addToCart } = useCartStore();
  const { items } = useWishlistStore();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const isLoggedIn = !!token && token !== "undefined" && token !== "null";


  const { remove } = useWishlistStore();

  const removeItem = async (productId: number) => {
    const token = localStorage.getItem("access_token");

    // 🔐 LOGIN MODE → hapus di backend
    if (token && token !== "undefined" && token !== "null") {
      await fetch(`NEXT_PUBLIC_API_URL/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // 🔥 SELALU update store (guest & login)
    remove(productId);
  };

  return (
    <main
      className={`${poppins.className} min-h-screen bg-white text-[#111111] antialiased`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-12">
        {/* HEADER - Identik dengan Cart */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-pink-100 p-3 rounded-2xl text-[#FF5F9D] flex-shrink-0">
            <Heart fill="currentColor" size={28} />
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl text-[#FF5F9D] leading-tight">
              Wishlist Saya
            </h1>
            <p className="text-gray-500 font-medium text-xs sm:text-base">
              Ada{" "}
              <span className="text-[#FF5F9D] font-bold">{items.length}</span>{" "}
              produk impian di list kamu
            </p>
          </div>
        </div>

        {/* GUEST MODE BANNER */}
        {!isLoggedIn && items.length > 0 && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-sm flex justify-between items-center">
            <p>
              ⚠️ Kamu dalam <strong>Mode Guest</strong>. Login untuk simpan
              permanen.
            </p>
            <Link href="/login" className="font-bold border-b border-amber-700">
              Login
            </Link>
          </div>
        )}

        {items.length === 0 ? (
          /* EMPTY STATE - Identik dengan Cart */
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2rem]">
            <Heart className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-medium text-lg">
              Wishlist-mu masih kosong nih
            </p>
            <Link
              href="/shop/product"
              className="inline-block mt-6 text-[#FF5F9D] font-bold border-b-2 border-[#FF5F9D]"
            >
              Cari Produk Impian
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LIST WISHLIST (LEFT) - Mengikuti Gaya Card Cart */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="relative bg-white p-3 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-row items-start sm:items-center gap-3 sm:gap-6 transition-all hover:border-[#FF5F9D]/20"
                >
                  {/* IMAGE */}
                  <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* INFO & ACTIONS */}
                  <div className="flex flex-col sm:flex-row flex-1 w-full gap-2 sm:gap-4 sm:items-center min-w-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-xl text-gray-900 leading-snug break-words">
                        {item.name}
                      </h3>
                      <p className="text-[#FF5F9D] font-semibold text-sm sm:text-base mt-1">
                        {item.price
                          ? `Rp ${Number(item.price).toLocaleString("id-ID")}`
                          : "Harga tidak tersedia"}
                      </p>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-row items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
                      <Link href="/shop/cart">
                        <button
                          onClick={() => {
                            addToCart({
                              id: item.product_id,
                              product_id: item.product_id,
                              name: item.name,
                              image: item.image,
                              price: Number(item.price || 0),
                              quantity: 1,

                              variation_id: item.variation_id,

                              seller_sku: item.seller_sku,
                              parcel_weight: Number(item.parcel_weight || 0),
                            });

                            window.location.href = "/shop/cart";
                          }}
                          className="flex-1 sm:flex-none bg-[#FF5F9D] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={16} />
                          <span className="whitespace-nowrap">
                            Ke Keranjang
                          </span>
                        </button>
                      </Link>

                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-pink-200 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/shop/product"
                className="inline-flex items-center gap-2 text-gray-900 hover:text-[#FF5F9D] transition-colors mt-2 text-sm sm:text-base"
              >
                <ArrowLeft size={18} />
                Lanjut Belanja
              </Link>
            </div>

            {/* SIDEBAR INFO (RIGHT) - Opsional untuk Wishlist */}
            <div className="lg:col-span-4 w-full mt-6 lg:mt-0">
              <div className="bg-[#FFF5F8] p-6 sm:p-8 rounded-[2rem] border border-pink-50 lg:sticky lg:top-10">
                <h2 className="text-lg font-bold text-[#FF5F9D] mb-4">
                  Info Wishlist
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Barang di wishlist tidak menjamin ketersediaan stok. Segera
                  pindahkan ke keranjang sebelum kehabisan!
                </p>
                <div className="p-4 bg-white rounded-2xl border border-pink-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-[#FF5F9D]">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">
                      Siap Dibeli
                    </p>
                    <p className="font-bold text-gray-900">
                      {items.length} Produk
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
