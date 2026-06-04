"use client";

import React, { useState, useEffect } from "react";
import { Star, Loader2 } from "lucide-react";
import Link from "next/link";

interface ProductData {
  id: number;
  product: {
    id: number;
    name: string;
    display_image: string;
    display_price: string | null;
    slug: string;
  };
}

const ProductGrid = () => {
  const [activeTab, setActiveTab] = useState("BEST SELLER");
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint =
          activeTab === "NEW ARRIVAL"
            ? "new-arrivals"
            : activeTab === "BEST DEALS"
              ? "best-deals"
              : "best-sellers";

        const res = await fetch(`${API}/${endpoint}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, API]);

  const formatPrice = (price: string | number | null) => {
    const p = typeof price === "string" ? parseFloat(price) : price;
    if (!p) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(p)
      .replace(/\s/g, " ");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-4 md:px-4 md:py-6">
      {/* TABS - Menggunakan padding & font mobile-first */}
      <div className="flex justify-start md:justify-center gap-4 md:gap-6 mb-4 border-b border-gray-100 overflow-x-auto no-scrollbar px-2">
        {["BEST SELLER", "NEW ARRIVAL", "BEST DEALS"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-[12px] md:text-[13px] font-black tracking-wide transition-all relative whitespace-nowrap ${
              activeTab === tab ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#FF5F9D] rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="animate-spin text-[#FF5F9D]" size={24} />
        </div>
      ) : (
        /* GRID - Diperketat gap-nya khusus layar kecil */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
          {products.map((item) => {
            const price = parseFloat(item.product.display_price || "0");

            return (
              <Link
                href={`/product/${item.product.slug}`}
                key={item.id}
                className="w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col transition-all hover:shadow-md active:scale-[0.98]"
              >
                {/* IMAGE CONTAINER - Diubah ke aspect-square agar tidak terlalu memakan ruang layar HP */}
                <div className="relative aspect-square overflow-hidden bg-[#F8FAFC]">
                  {/* BADGE DISCOUNT - Diperkecil */}
                  <div className="absolute top-1.5 left-1.5 z-10 bg-red-500 text-white text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded-lg rounded-bl-sm shadow">
                    -50%
                  </div>

                  <img
                    src={item.product.display_image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTENT CONTAINER - Padding diperkecil (p-2) untuk menghemat space */}
                <div className="p-2 md:p-3 flex flex-col flex-1">
                  {/* TITLE - Ukuran font disesuaikan micro-copy-nya */}
                  <h3 className="text-[11px] md:text-[14px] font-bold text-gray-800 line-clamp-2 leading-tight min-h-[32px] md:min-h-[40px]">
                    {item.product.name}
                  </h3>

                  {/* RATING */}
                  <div className="flex items-center gap-1 my-1 md:my-2">
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          size={9}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <Star size={9} className="fill-gray-200 text-gray-200" />
                    </div>
                    <span className="text-[9px] md:text-[10px] text-gray-400 font-medium">
                      4.9
                    </span>
                  </div>

                  {/* PRICE - Font dikecilkan secara drastis untuk mobile (text-xs & text-base) */}
                  <div className="mb-2">
                    <p className="text-[9px] md:text-[11px] text-gray-400 line-through font-medium">
                      {formatPrice(price * 2)}
                    </p>
                    <p className="text-[13px] md:text-[18px] leading-tight font-black text-[#FF5F9D]">
                      {formatPrice(price)}
                    </p>
                  </div>

                  {/* BUTTON - Padding tombol dikurangi agar compact */}
                  <div className="mt-auto">
                    <button className="w-full bg-[#FF5F9D] hover:bg-pink-600 text-white font-black text-[10px] md:text-[12px] py-1.5 md:py-2 rounded-xl transition-all active:scale-95">
                      + Keranjang
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
