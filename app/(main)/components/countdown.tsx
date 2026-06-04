"use client";

import React, { useEffect, useState } from "react";
import { Clock3, ArrowRight } from "lucide-react";

export function PromoCountdown() {
  const [promo, setPromo] = useState<any>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "";

  const promoImage = promo?.image
    ? promo.image.includes("localhost")
      ? promo.image.replace("http://localhost:8000/storage", STORAGE_URL)
      : promo.image.startsWith("http")
        ? promo.image
        : `${STORAGE_URL}/${promo.image}`
    : "/assets/promo-placeholder.jpg";

  /* FETCH PROMO */
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/activities/countdown`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setPromo(res.data);
        }
      })
      .catch((err) => {
        console.log("Countdown Error:", err);
      });
  }, []);

  /* TIMER */
  useEffect(() => {
    if (!promo?.end_date) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(promo.end_date).getTime();
      const distance = end - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [promo]);

  if (!promo) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 md:py-14">
      {/* CARD BANNER - Borderless design & clean aspect ratio */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 flex flex-col md:flex-row group min-h-[480px] md:min-h-[380px]">
        {/* BACKGROUND IMAGE - Pengatur ruang gambar di mobile (atas) & desktop (kanan) */}
        <div className="relative w-full h-[200px] md:h-auto md:w-[45%] md:absolute md:right-0 md:top-0 md:bottom-0 overflow-hidden order-1 md:order-2">
          <img
            src={promoImage}
            alt={promo.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
          />
          {/* Overlay gradien halus penyeimbang teks */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent md:bg-gradient-to-r md:from-gray-50 md:via-transparent" />
        </div>

        {/* CONTENT CONTAINER */}
        <div className="relative z-10 flex-1 p-5 sm:p-8 md:p-12 flex flex-col justify-between gap-6 order-2 md:order-1 md:max-w-[60%]">
          {/* TOP ELEMENT: TAG & TIMER */}
          <div className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between w-full">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              {promo.badge || "Penawaran Terbatas"}
            </span>

            {/* COUNTDOWN TILES - Lebih kontras dan mudah dibaca di mobile */}
            <div className="flex items-center gap-2 text-gray-900 bg-white shadow-sm px-4 py-2 rounded-xl border border-gray-100/80">
              <Clock3 size={14} className="text-[#FF5F9D]" />
              <div className="flex items-baseline gap-1 font-mono text-sm sm:text-base font-bold">
                <span className="text-gray-950 tabular-nums">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] font-sans font-medium text-gray-400 mr-0.5">
                  d
                </span>
                <span className="text-gray-950 tabular-nums">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] font-sans font-medium text-gray-400 mr-0.5">
                  h
                </span>
                <span className="text-gray-950 tabular-nums">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] font-sans font-medium text-gray-400 mr-0.5">
                  m
                </span>
                <span className="text-[#FF5F9D] tabular-nums animate-pulse">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] font-sans font-medium text-[#FF5F9D]">
                  s
                </span>
              </div>
            </div>
          </div>

          {/* MAIN PROMO INFO */}
          <div className="my-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#FF5F9D] leading-tight">
              {promo.title}
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm text-gray-500 leading-relaxed max-w-lg">
              {promo.description ||
                "Jangan lewatkan momen spesial ini. Nikmati formula terbaik dari Animate dengan penawaran eksklusif sebelum waktu berakhir."}
            </p>
          </div>

          {/* BOTTOM BAR: CTA & HIGHLIGHT */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200/60 w-full">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF5F9D]">
                {promo.highlight_title || "Kejutan Spesial"}
              </p>
              <p className="text-xs font-medium text-gray-800 mt-0.5">
                {promo.highlight_text || "Promo Eksklusif Buy 1 Get 2"}
              </p>
            </div>

            {/* CTA BUTTON */}
            {promo.cta_link && (
              <a
                href={promo.cta_link}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#FF5F9D] hover:bg-pink-600 text-white px-6 py-3 rounded-xl transition-all font-semibold text-xs tracking-wide active:scale-[0.98] shadow-sm shadow-pink-100"
              >
                <span>{promo.cta_text || "Lihat Detail"}</span>
                <ArrowRight size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
