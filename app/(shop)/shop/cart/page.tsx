"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCartStore } from "../store/cart";
import { Poppins } from "next/font/google";

import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export default function CartPage() {
  const items = useCartStore((state) => state.cart);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const router = useRouter();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main
      className={`${poppins.className} min-h-screen bg-white text-[#111111] antialiased`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-12">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-pink-100 p-3 rounded-2xl text-[#FF5F9D] flex-shrink-0">
            <ShoppingCart fill="currentColor" size={28} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl text-[#FF5F9D] leading-tight">
              Keranjang
            </h1>
            <p className="text-gray-500 font-medium text-xs sm:text-base">
              Ada{" "}
              <span className="text-[#FF5F9D] font-bold">{items.length}</span>{" "}
              produk di keranjangmu
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2rem]">
            <ShoppingCart className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-medium text-lg">
              Keranjangmu masih kosong nih
            </p>
            <Link
              href="/shop/product"
              className="inline-block mt-6 text-[#FF5F9D] font-bold border-b-2 border-[#FF5F9D]"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LIST PRODUK (LEFT) */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white p-3 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-row items-start sm:items-center gap-3 sm:gap-6 transition-all hover:border-[#FF5F9D]/20"
                >
                  <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row flex-1 w-full gap-2 sm:gap-4 sm:items-center min-w-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-xl text-gray-900 leading-snug break-words">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-xs mt-0.5 uppercase tracking-wider">
                        SKU: {item.seller_sku}
                      </p>
                      <p className="text-[#FF5F9D] font-semibold text-sm sm:text-base mt-1">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex flex-row items-center justify-between sm:justify-end gap-3 sm:gap-6 mt-1 sm:mt-0">
                      <div className="flex items-center gap-2 sm:gap-4 bg-gray-50 border border-gray-100 rounded-full px-2 py-1 sm:px-4 sm:py-2">
                        <button
                          onClick={() =>
                            updateQty(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="text-gray-400 hover:text-[#FF5F9D] p-1"
                        >
                          <Minus
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                            strokeWidth={3}
                          />
                        </button>
                        <span className="font-bold text-xs sm:text-lg min-w-[14px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-[#FF5F9D] p-1"
                        >
                          <Plus
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                            strokeWidth={3}
                          />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-pink-200 hover:text-[#FF5F9D] transition-colors p-1"
                      >
                        <Trash2 className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.back();
                }}
                className="inline-flex items-center gap-2 text-gray-900 hover:text-[#FF5F9D] transition-colors mt-2 text-sm sm:text-base"
              >
                <ArrowLeft size={18} />
                Lanjut Belanja
              </Link>
            </div>

            {/* RINGKASAN PESANAN (RIGHT) */}
            <div className="lg:col-span-5 w-full mt-6 lg:mt-0">
              <div className="bg-white p-6 sm:p-10 rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] lg:sticky lg:top-10">
                <h2 className="text-lg sm:text-2xl mb-6 sm:mb-8 font-semibold">
                  Ringkasan Pesanan
                </h2>

                {/* DETAIL ITEM DALAM RINGKASAN */}
                <div className="max-h-[300px] overflow-y-auto mb-6 pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-100">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 items-center pb-4 border-b border-gray-50 last:border-0"
                    >
                      <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-400">
                            SKU: {item.seller_sku}
                          </span>

                          <span className="text-sm font-semibold text-gray-900">
                            Rp{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "id-ID",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 sm:space-y-4 font-medium text-gray-500 text-xs sm:text-base">
                  <div className="flex justify-between">
                    <span>Total ({totalItems} Produk)</span>
                    <span className="text-gray-900 font-semibold">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 mb-8">
                  <span className="font-medium text-gray-500 text-xs sm:text-base">
                    Total Bayar
                  </span>
                  <span className="font-bold text-[#FF5F9D]">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <Link href="/shop/checkout">
                  <button className="w-full bg-[#FF5F9D] hover:bg-[#ff4a90] transition-all text-white py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-sm sm:text-lg  shadow-xl shadow-pink-100 active:scale-[0.98]">
                    Lanjut Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
