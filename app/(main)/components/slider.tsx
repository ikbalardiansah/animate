"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

export default function HeroSlider() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/sliders`;

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch(API_URL);
        const result = await res.json();
        const data = Array.isArray(result) ? result : result.data || [];

        setSliders(
          data.filter((slider: any) => Number(slider.is_active) === 1),
        );
      } catch (error) {
        console.error("Failed to fetch sliders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-0 md:px-4 mt-0 md:mt-4">
        <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-200 animate-pulse rounded-none md:rounded-2xl" />
      </div>
    );
  }

  if (sliders.length === 0) return null;

  return (
    <div className="relative w-full group">
      <div className="w-full mx-auto overflow-hidden">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade, Navigation]}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          autoplay={{
            delay: 4000, // Slider pindah setiap 4 detik
            disableOnInteraction: false,
          }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={sliders.length > 1}
          autoHeight={true}
          className="w-full"
        >
          {sliders.map((slider) => {
            const imageUrl = `${process.env.NEXT_PUBLIC_STORAGE_URL}/${slider.image}`;

            return (
              <SwiperSlide key={slider.id}>
                <div className="relative w-full flex justify-center bg-white">
                  {/* Gambar menggunakan object-contain agar tidak terpotong pada 1080x1020 */}
                  <img
                    src={imageUrl}
                    alt={slider.title || "Banner"}
                    className="w-full h-auto max-h-[1080px] object-contain block mx-auto"
                  />

                  {slider.link && (
                    <a
                      href={slider.link}
                      className="absolute inset-0 z-10"
                      aria-label="Link Promo"
                    />
                  )}
                </div>
              </SwiperSlide>
            );
          })}

          {/* Navigation Arrows - Hanya muncul di Desktop (md:flex), Hilang di Mobile (hidden) */}
          <button className="custom-prev hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-black/20 hover:bg-[#ff5f9d] backdrop-blur-md text-white rounded-full transition-all opacity-0 group-hover:opacity-100">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="custom-next hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-black/20 hover:bg-[#ff5f9d] backdrop-blur-md text-white rounded-full transition-all opacity-0 group-hover:opacity-100">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </Swiper>
      </div>

      <style jsx global>{`
        /* Menghilangkan panah default swiper jika masih muncul */
        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }

        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.7;
        }

        .swiper-pagination-bullet-active {
          background: #ff5f9d !important;
          width: 24px;
          border-radius: 12px;
          opacity: 1;
        }

        .swiper-slide {
          height: auto !important;
        }
      `}</style>
    </div>
  );
}
