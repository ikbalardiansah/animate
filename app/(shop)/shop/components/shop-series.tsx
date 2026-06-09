"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// 1. Definisikan Interface yang presisi sesuai skema asli API public-series Anda
interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  seller_sku: string;
  image: string;
}

interface SeriesData {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  products: Product[];
}

const ExploreSeriesSlider = () => {
  const [seriesList, setSeriesList] = useState<SeriesData[]>([]);
  const [activeSeriesId, setActiveSeriesId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);
  const API_URL = "https://animateofficial.com/be-animate/api/public-series";

  // 2. Fetch data dari API public-series asli saat komponen di-load
  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        const data: SeriesData[] = json.data || [];

        setSeriesList(data);

        // Otomatis aktifkan ID dari series urutan pertama sebagai default
        if (data.length > 0) {
          setActiveSeriesId(data[0].id);
        }
      } catch (error) {
        console.error("Gagal memuat data dari public-series API:", error);
        setSeriesList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  // Ambil data produk dari objek series yang tab-nya sedang diklik aktif
  const currentActiveSeries = seriesList.find(
    (item) => item.id === activeSeriesId,
  );

  const formatPrice = (priceString: string | number) => {
    const p =
      typeof priceString === "string" ? parseFloat(priceString) : priceString;
    if (!p) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(p)
      .replace(/\s/g, " ");
  };

  // Navigasi Geser/Slide Manual (Desktop)
  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      sliderRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-4 md:px-4 md:py-6 relative group bg-white">
      {/* SECTION TITLE */}
      <div className="mb-6 px-4 text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Explore Series
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Pilih rangkaian skincare sesuai kebutuhan kulitmu.
        </p>
      </div>

      {/* TABS MENU SERIES (Slideable secara horizontal di mobile jika menu panjang) */}
      {/* TABS MENU SERIES - Simple, Clean & Pill Style */}
      <div
        className="flex justify-start gap-2 mb-6 overflow-x-auto px-2 pb-2"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {seriesList.map((series) => {
          const isActive = activeSeriesId === series.id;
          return (
            <button
              key={series.id}
              onClick={() => setActiveSeriesId(series.id)}
              className={`px-4 py-2 text-xs md:text-sm  tracking-wide rounded-full transition-all duration-200 whitespace-nowrap border ${
                isActive
                  ? "bg-[#FF5F9D] border-[#FF5F9D] text-white shadow-sm shadow-pink-100 scale-[1.02]"
                  : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {series.name}
            </button>
          );
        })}
      </div>

      {/* LOADING CONTROLLER */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="animate-spin text-[#FF5F9D]" size={24} />
        </div>
      ) : !currentActiveSeries || currentActiveSeries.products.length === 0 ? (
        <div className="text-center py-12 text-xs text-gray-400 italic">
          Belum ada produk di dalam series ini.
        </div>
      ) : (
        /* SLIDER COMPONENT WORKSPACE */
        <div className="relative w-full">
          {/* Tombol Panah Kiri */}
          <button
            onClick={() => scrollSlider("left")}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-100 shadow-md p-2 rounded-full text-gray-600 hover:text-[#FF5F9D] active:scale-90 transition-all hidden md:flex opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Tombol Panah Kanan */}
          <button
            onClick={() => scrollSlider("right")}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-100 shadow-md p-2 rounded-full text-gray-600 hover:text-[#FF5F9D] active:scale-90 transition-all hidden md:flex opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>

          {/* Track Horizontal Slider */}
          <div
            ref={sliderRef}
            className="flex gap-2 md:gap-4 overflow-x-auto pb-4 pt-1 px-2 scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Inject Global CSS Sembunyikan Baris Scrollbar bawaan Webkit Browser */}
            <style jsx global>{`
              div::-webkit-scrollbar {
                display: none !important;
              }
            `}</style>

            {currentActiveSeries.products.map((prod) => {
              // Ambil harga asli dari data JSON Anda (misal: "53986.00")
              const currentPrice = parseFloat(prod.price || "0");

              // 1. FAKE RATING DINAMIS BERDASARKAN ID PRODUK
              const ratingPool = [4.8, 4.9, 5.0, 4.7];
              const currentRating = ratingPool[prod.id % ratingPool.length];

              // Hitung jumlah bintang solid
              const goldStarsCount = currentRating === 5.0 ? 5 : 4;

              // 2. FAKE HARGA CORET (Dihitung naik dari harga asli berdasarkan pool diskon)
              const discountPool = [30, 40, 50, 60];
              const currentDiscount =
                discountPool[prod.id % discountPool.length];

              // Rumus agar harga asli API tetap menjadi harga jual setelah didiskon dari harga coret
              const originalPrice = currentPrice / (1 - currentDiscount / 100);

              return (
                <div
                  key={prod.id}
                  className="w-[155px] sm:w-[190px] md:w-[220px] shrink-0 snap-start"
                >
                  <div className="group relative flex flex-col h-full">
                    {/* IMAGE CONTAINER - rounded-xl & mb-3 */}
                    <Link
                      href={`/shop/product/${prod.slug}`}
                      className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl mb-3 block"
                    >
                      {/* BADGE DISCOUNT */}
                      <div className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                        {currentDiscount}% OFF
                      </div>

                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    {/* INFO CONTAINER */}
                    <div className="flex flex-col flex-1 px-1">
                      {/* RATING & REVIEWS */}
                      <div className="flex items-center gap-1 mb-1.5">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => {
                            const isGold = i < goldStarsCount;
                            return (
                              <Star
                                key={i}
                                size={10}
                                className={
                                  isGold
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-gray-200 text-gray-200"
                                }
                              />
                            );
                          })}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium tracking-tight mt-0.5">
                          {currentRating.toFixed(1)}
                        </span>
                      </div>

                      {/* TITLE */}
                      <Link
                        href={`/shop/product/${prod.slug}`}
                        className="hover:underline decoration-gray-400 underline-offset-2 block"
                      >
                        <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed min-h-[36px] md:min-h-[40px]">
                          {prod.name}
                        </h3>
                      </Link>

                      {/* PRICE & DISCOUNT - Sesuai konsep mendatar */}
                      <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
                        {/* Harga Asli API (Harga setelah diskon) */}
                        <p className="text-sm md:text-base font-semibold text-gray-950">
                          {formatPrice(currentPrice)}
                        </p>
                        {/* Harga Coret (Hasil kalkulasi naik) */}
                        <p className="text-[10px] md:text-xs text-gray-400 line-through">
                          {formatPrice(originalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreSeriesSlider;
