"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ProductFilter from "@/app/(main)/components/sidebar-filter";
import { useCartStore } from "../store/cart";
import { FilterType } from "@/app/(main)/components/sidebar-filter";
import { Product } from "../types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "NEXT_PUBLIC_API_URL";

// Komponen utama dipisah agar bisa dibungkus Suspense (Syarat useSearchParams di Next.js)
function ProductListContent() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isLoggedIn = !!token;

  const [popups, setPopups] = useState<number[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil page dari URL, default ke 1
  const currentPage = Number(searchParams.get("page")) || 1;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastPage, setLastPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [filterType, setFilterType] = useState<FilterType>("ALL");

  const [minPrice, setMinPrice] = useState<number | undefined>();

  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const handleFilterChange = (type: FilterType, min?: number, max?: number) => {
    setFilterType(type);

    setMinPrice(min);

    setMaxPrice(max);
  };

  const category = searchParams.get("category");

  const handleAddToCart = (item: Product) => {
    const variant = item.variants?.[0];

    if (!variant) {
      console.error("No variant found");
      return;
    }

    const cartItem = {
      id: item.id,
      product_id: item.id,

      name: item.name,
      image: item.images?.[0]?.image_url || "",

      price: Number(variant.retail_price || 0),
      quantity: 1,

      variation_id: variant.id,

      seller_sku: variant.seller_sku ?? variant.sku_id,

      parcel_weight: Number(item.parcel_weight ?? 0),
    };



    addToCart(cartItem);
  };

  const loadProducts = async (pageNumber: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      params.append("page", String(pageNumber));

      if (filterType !== "ALL") {
        params.append("type", filterType);
      }

      if (minPrice !== undefined) {
        params.append("min_price", String(minPrice));
      }

      if (maxPrice !== undefined) {
        params.append("max_price", String(maxPrice));
      }

      if (category) {
        params.append("category", category);
      }
      const response = await fetch(
        `${API_URL}/web-products?${params.toString()}`,
      );

      const result = await response.json();

      if (result?.code === "SUCCESS") {
        const fetchedData = result?.data?.data ?? [];
        setProducts(fetchedData);
        setLastPage(result?.data?.last_page || 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger fetch setiap kali currentPage di URL berubah
  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage, filterType, minPrice, maxPrice, category]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency || "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const addToCart = useCartStore((state) => state.addToCart);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#FAFAFA] p-4 md:p-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <button
          className="md:hidden bg-[#FF5F9D] text-white px-4 py-2 rounded-lg"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          Filter
        </button>

        {/* Sidebar */}
        <div className={`${mobileFilterOpen ? "block" : "hidden"} md:block`}>
          <ProductFilter onFilterChange={handleFilterChange} />
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* MINIMALIST SECTION HEADER */}
          <header className="mb-10 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-gray-50 pb-5">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
                Semua Produk
              </h1>
              <p className="text-gray-400 text-xs mt-1 font-medium tracking-wide uppercase">
                Halaman {currentPage} dari {lastPage}
              </p>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center items-center py-28">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5F9D] opacity-80" />
            </div>
          ) : (
            <>
              {/* PRODUCT GRID - MINIMALIST LUXURY STYLE */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                {products.map((item) => {
                  const imageUrl =
                    item.images?.[0]?.image_url ||
                    "https://placehold.co/400x400";

                  const validPrices =
                    item.variants
                      ?.map((v) => parseFloat(v.retail_price || "0"))
                      .filter((p) => p > 0) || [];

                  const minPrice = validPrices.length
                    ? Math.min(...validPrices)
                    : 0;
                  const currency = "IDR";

                  // --- LOGIC RATING UI SEED ---
                  const fakeRating = item.id % 2 === 0 ? 4.8 : 4.9;
                  const fakeReviews = ((item.id * 13) % 900) + 100;
                  const fullStars = Math.floor(fakeRating);

                  return (
                    <div
                      key={item.id}
                      className="group relative flex flex-col bg-white"
                    >
                      {/* IMAGE CONTAINER WITH FLOATING ELEVATED CART BUTTON */}
                      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl mb-3">
                        <Link
                          href={item.slug ? `/shop/product/${item.slug}` : "#"}
                          className="block w-full h-full"
                        >
                          <img
                            src={imageUrl}
                            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
                            alt={item.name}
                          />

                          {minPrice > 0 && (
                            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase">
                              50% OFF
                            </span>
                          )}
                        </Link>

                        {/* Floating Pink Cart Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="absolute bottom-3 right-3 bg-[#FF5F9D] hover:bg-pink-600 text-white p-2.5 rounded-full shadow-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-250 active:scale-95 z-10 cursor-pointer"
                          title="Tambah ke Keranjang"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="8" cy="21" r="1" />
                            <circle cx="19" cy="21" r="1" />
                            <path d="M1.05 1h3.42c.73 0 1.35.5 1.51 1.21L8.84 13.91a2 2 0 0 0 2 1.59h7.62a2 2 0 0 0 1.93-1.48l2.25-8.31a1 1 0 0 0-.97-1.26H5.66" />
                          </svg>
                        </button>
                      </div>

                      {/* PRODUCT INFO CONTAINER */}
                      <div className="flex flex-col flex-1 px-1">
                        {/* RATING & REVIEWS */}
                        <div className="flex items-center gap-1 mb-1.5">
                          <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-2.5 h-2.5 ${
                                  i < fullStars
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-gray-200 text-gray-200"
                                }`}
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

                        {/* PRODUCT TITLE */}
                        <Link
                          href={item.slug ? `/shop/product/${item.slug}` : "#"}
                          className="hover:underline decoration-gray-400 underline-offset-2"
                        >
                          <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed min-h-[36px] md:min-h-[40px]">
                            {item.name}
                          </h3>
                        </Link>

                        {/* PRICE AREA */}
                        {minPrice > 0 && (
                          <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
                            <p className="text-sm md:text-base font-semibold text-gray-950">
                              {formatCurrency(minPrice, currency)}
                            </p>
                            <p className="text-[10px] md:text-xs text-gray-400 line-through">
                              {formatCurrency(minPrice * 2, currency)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION SECTION */}
              <div className="flex justify-center mt-10 items-center gap-2 flex-wrap">
                {/* Prev */}
                <Link
                  href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl border text-[#FF5F9D] transition-all ${
                    currentPage === 1
                      ? "opacity-30 pointer-events-none"
                      : "hover:bg-pink-50 border-pink-100"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Link>

                {/* Number */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const maxVisible = 3;

                    let start = Math.max(1, currentPage - 1);
                    let end = Math.min(lastPage, start + maxVisible - 1);

                    if (end - start < maxVisible - 1) {
                      start = Math.max(1, end - maxVisible + 1);
                    }

                    return Array.from(
                      { length: end - start + 1 },
                      (_, i) => start + i,
                    ).map((p) => (
                      <Link
                        key={p}
                        href={`?page=${p}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                          p === currentPage
                            ? "bg-[#FF5F9D] text-white"
                            : "bg-white border border-pink-100 text-gray-500 hover:bg-pink-50 hover:text-[#FF5F9D]"
                        }`}
                      >
                        {p}
                      </Link>
                    ));
                  })()}
                </div>

                {/* Next */}
                <Link
                  href={
                    currentPage < lastPage ? `?page=${currentPage + 1}` : "#"
                  }
                  className={`flex items-center justify-center w-10 h-10 rounded-xl border text-[#FF5F9D] transition-all ${
                    currentPage === lastPage
                      ? "opacity-30 pointer-events-none"
                      : "hover:bg-pink-50 border-pink-100"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// Export utama menggunakan Suspense untuk useSearchParams
export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF5F9D]" />
        </div>
      }
    >
      <ProductListContent />
    </Suspense>
  );
}
