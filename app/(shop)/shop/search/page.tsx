"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// 1. DEFINISI INTERFACE (Sesuai dengan Struktur WebProduct Laravel Kamu)
interface ProductVariant {
  id: number;
  sku_id: string;
  retail_price: string;
}

interface ProductImage {
  id: number;
  image_url: string;
}

interface ProductItem {
  id: number;
  name: string;
  slug: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

// Komponen utama pembungkus dengan Suspense (Wajib di Next.js saat pakai useSearchParams)
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-28">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5F9D] opacity-80" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

// Komponen konten internal yang menjalankan logika pencarian
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // State Manajemen
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  // Helper Formatter Rupiah (IDR)
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Logika Tambah Ke Keranjang (Ambil varian default pertama)
  const handleAddToCart = (item: ProductItem) => {
    const variant = item.variants?.[0];
    if (!variant) {
      alert(`Produk "${item.name}" tidak memiliki variasi aktif.`);
      return;
    }

    // Sambungkan ke fungsi global addToCart/Store Context kamu di sini
    const cartItem = {
      id: variant.id,
      name: item.name,
      product_id: item.id,
      image: item.images?.[0]?.image_url || "https://placehold.co/400x400",
      price: parseFloat(variant.retail_price || "0"),
      quantity: 1,
      sku: variant.sku_id,
      variation_id: variant.id, // Aman, mengirimkan variation_id asli (bukan null)
    };
    // addToCart(cartItem);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);

      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const res = await fetch(
          `${API_BASE_URL}/web-products?search=${encodeURIComponent(query)}&page=${currentPage}`,
        );

        const result = await res.json();

        if (res.ok && result.code === "SUCCESS") {
          setProducts(result.data?.data || []);
          setLastPage(result.data?.last_page || 1);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data pencarian:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query, currentPage]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 md:py-16">
      {/* HEADER SECTION */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-gray-50 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
            Hasil Pencarian: <span className="text-[#FF5F9D]">"{query}"</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-medium tracking-wide uppercase">
            Menampilkan {products.length} produk pilihan
          </p>
        </div>
      </header>

      {/* LOADING STATE */}
      {loading ? (
        <div className="flex justify-center items-center py-28">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5F9D] opacity-80" />
        </div>
      ) : products.length === 0 ? (
        /* DATA TIDAK DITEMUKAN STATE */
        <div className="text-center py-28 space-y-3">
          <p className="text-gray-400 text-sm">
            Produk yang Anda cari tidak dapat ditemukan.
          </p>
          <Link
            href="/shop"
            className="inline-block text-xs font-bold text-[#FF5F9D] hover:underline"
          >
            Kembali Jelajahi Produk Animate →
          </Link>
        </div>
      ) : (
        <>
          {/* PRODUCT GRID - MINIMALIST LUXURY STYLE */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
            {products.map((item) => {
              // 1. SOLUSI GAMBAR: Mengutamakan main_image langsung dari tabel web_products
              const imageUrl =
                (item as any).main_image ||
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

              const fakeRating = item.id % 2 === 0 ? 4.8 : 4.9;
              const fakeReviews = ((item.id * 13) % 900) + 100;
              const fullStars = Math.floor(fakeRating);

              

              const productLink = `/shop/product/${item.slug}`;

              // JIKA folder detail Anda berada di app/(shop)/product/[slug]/page.tsx (tanpa double shop), ganti menjadi:
              // const productLink = `/product/${item.slug}`;

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col bg-white"
                >
                  {/* IMAGE CONTAINER */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl mb-3">
                    <Link href={productLink} className="block w-full h-full">
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

                    {/* Floating Cart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="absolute bottom-3 right-3 bg-[#FF5F9D] hover:bg-pink-600 text-white p-2.5 rounded-full shadow-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-250 active:scale-95 z-10 cursor-pointer"
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

                  {/* INFO CONTAINER */}
                  <div className="flex flex-col flex-1 px-1">
                    <div className="flex items-center gap-1 mb-1.5">
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
                      <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed min-h-[36px] md:min-h-[40px]">
                        {item.name}
                      </h3>
                    </Link>

                    {/* HARGA */}
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
          {lastPage > 1 && (
            <div className="flex justify-center mt-12 md:mt-16 gap-2 md:gap-3 items-center">
              {/* TOMBOL SEBELUMNYA */}
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" }); // Opsional: scroll ke atas saat ganti halaman
                }}
                className="p-2.5 md:px-5 md:py-2.5 border border-pink-100 rounded-xl text-sm font-bold text-[#FF5F9D] bg-white disabled:opacity-30 enabled:hover:bg-[#FFF0F5] transition duration-200 cursor-pointer shadow-sm disabled:cursor-not-allowed flex items-center justify-center gap-1"
                aria-label="Halaman Sebelumnya"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 stroke-[2.5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden md:inline">Sebelumnya</span>
              </button>

              {/* INDIKATOR HALAMAN */}
              <div className="text-xs md:text-sm font-bold text-gray-400 bg-white px-3.5 py-2.5 md:px-4 md:py-2 rounded-xl border border-pink-50 shadow-sm tracking-wide">
                <span className="text-[#FF5F9D]">{currentPage}</span>
                <span className="mx-1 text-gray-300">/</span>
                <span>{lastPage}</span>
              </div>

              {/* TOMBOL SELANJUTNYA */}
              <button
                disabled={currentPage === lastPage}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(lastPage, prev + 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="p-2.5 md:px-5 md:py-2.5 border border-pink-100 rounded-xl text-sm font-bold text-[#FF5F9D] bg-white disabled:opacity-30 enabled:hover:bg-[#FFF0F5] transition duration-200 cursor-pointer shadow-sm disabled:cursor-not-allowed flex items-center justify-center gap-1"
                aria-label="Halaman Selanjutnya"
              >
                <span className="hidden md:inline">Selanjutnya</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 stroke-[2.5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
