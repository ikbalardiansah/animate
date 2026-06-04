"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/app/(shop)/shop/store/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  slug?: string;
};

export default function ProductList({ slug }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (item: any) => {
    // 🔥 kalau dari API lama (punya variations)
    if (item.variations?.length) {
      const variation = item.variations[0];

      const cartItem = {
        id: item.id,
        name: item.name,
        image: item.image || "",
        product_id: item.id,
        price: Number(variation.price?.price || 0),
        quantity: 1,
        sku: variation.sku,
        variation_id: variation.id,
        parcel_weight: Number(item.parcel_weight || 0),
      };

      addToCart(cartItem);
      return;
    }

    // 🔥 fallback untuk API category (flat)
    const cartItem = {
      id: item.id,
      name: item.name,
      image: item.image || "",
      product_id: item.id,
      price: Number(item.price || 0),
      quantity: 1,
      sku: item.sku,
      variation_id: null,
    };

    addToCart(cartItem);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const endpoint = slug
        ? `${API_URL}/public/categories/${slug}`
        : `${API_URL}/web-products`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data?.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [slug]);

  // Helper untuk format Rupiah
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <main className="min-h-screen bg-[#FFF5F8] p-4 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-8 border-b border-pink-100 pb-4">
          <h1 className="text-xl md:text-2xl font-medium text-gray-800 capitalize tracking-tight">
            {slug ? slug.replaceAll("-", " ") : "Semua Produk"}
          </h1>
          <div className="text-xs md:text-sm text-pink-400 font-medium bg-white px-4 py-1.5 rounded-full shadow-sm border border-pink-50">
            {products.length} Items
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#FF5F9D] mb-4" />
            <p className="text-pink-300 animate-pulse font-medium text-sm">
              Memuat kecantikan...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-pink-200 p-6">
            <p className="text-pink-400 italic text-sm md:text-base">
              Produk tidak ditemukan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((p) => {
              const imageUrl =
                p.variant_image || p.main_image || "/no-image.png";

              const currentPrice = Number(p.retail_price || 0);

              const productLink = `/shop/product/${p.slug || ""}`;

              // Generator rating palsu berbasis ID produk agar variatif
              const fakeRating = p.id % 2 === 0 ? 4.8 : 4.9;
              const fakeReviews = ((p.id * 13) % 400) + 100;
              const fullStars = Math.floor(fakeRating);

              return (
                <div
                  key={p.id}
                  className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-pink-50/60 p-2 md:p-3 transition-all duration-300 hover:shadow-[0_10px_25px_-10px_rgba(255,95,157,0.15)]"
                >
                  {/* IMAGE CONTAINER */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl mb-3">
                    <Link href={productLink} className="block w-full h-full">
                      <img
                        src={imageUrl}
                        className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
                        alt={p.name}
                      />
                      {currentPrice > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded uppercase">
                          50% OFF
                        </span>
                      )}
                    </Link>

                    {/* Floating Cart Button (Desktop Hover, Mobile Visible) */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      className="absolute bottom-2 right-2 bg-[#FF5F9D] hover:bg-pink-600 text-white p-2 md:p-2.5 rounded-full shadow-sm md:opacity-0 group-hover:opacity-100 transition-all duration-250 active:scale-95 z-10 cursor-pointer"
                      aria-label="Tambah ke keranjang"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="md:w-4 md:h-4"
                      >
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M1.05 1h3.42c.73 0 1.35.5 1.51 1.21L8.84 13.91a2 2 0 0 0 2 1.59h7.62a2 2 0 0 0 1.93-1.48l2.25-8.31a1 1 0 0 0-.97-1.26H5.66" />
                      </svg>
                    </button>
                  </div>

                  {/* INFO CONTAINER */}
                  <div className="flex flex-col flex-1 px-1">
                    {/* RATING */}
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-2.5 h-2.5 ${i < fullStars ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium tracking-tight mt-0.5">
                        {fakeRating.toFixed(1)} ({fakeReviews})
                      </span>
                    </div>

                    {/* JUDUL PRODUK */}
                    <Link
                      href={productLink}
                      className="hover:underline decoration-gray-400 underline-offset-2"
                    >
                      <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed min-h-[36px] md:min-h-[40px] group-hover:text-[#FF5F9D] transition-colors">
                        {p.name}
                      </h3>
                    </Link>

                    {/* HARGA & DISKON */}
                    {currentPrice > 0 && (
                      <div className="mt-2 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[10px] md:text-xs text-gray-400 line-through">
                            {formatIDR(currentPrice * 2)}
                          </p>
                        </div>
                        <p className="text-sm md:text-base font-bold text-gray-950">
                          {formatIDR(currentPrice)}
                        </p>
                      </div>
                    )}

                    {/* STOCK STATUS BADGE */}
                    <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400">
                      <span>Stok Terbatas</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
