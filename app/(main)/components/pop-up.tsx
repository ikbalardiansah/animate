"use client";

import React, { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";

export default function ActivityPopup() {
  const [popup, setPopup] = useState<any>(null);
  const [show, setShow] = useState(false);

  const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "";

  const popupImage = popup?.image?.includes("localhost")
    ? popup.image.replace("http://localhost:8000/storage", STORAGE_URL)
    : popup?.image?.startsWith("http")
      ? popup.image
      : `${STORAGE_URL}/${popup?.image}`;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/activities/popup`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const popupData = res.data;
          const today = new Date().toISOString().split("T")[0];

          const storageKey = `popup_seen_${popupData.id}_${today}`;

          const currentCount = Number(localStorage.getItem(storageKey) || 0);

          if (currentCount >= (popupData.popup_max_show || 2)) {
            return;
          }

          setPopup(popupData);

          setTimeout(
            () => {
              setShow(true);
              localStorage.setItem(storageKey, String(currentCount + 1));
            },
            (popupData.popup_delay || 3) * 1000,
          );
        }
      })
      .catch((err) => console.log("Popup Error:", err));
  }, []);

  if (!popup || !show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-gray-950/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300">
      {/* CONTAINER UTAMA - Bottom Sheet di Mobile, Centered Modal di Desktop */}
      <div className="relative w-full sm:max-w-xl md:max-w-2xl bg-white rounded-t-[2rem] sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-none overflow-y-auto no-scrollbar animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        {/* TOMBOL CLOSE ELEGAN */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-800 hover:bg-white transition-all active:scale-95"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="flex flex-col">
          {/* BAGIAN GAMBAR - Aspek rasio cinematic, bersih tanpa badge bertumpuk */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-gray-50">
            <img
              src={popupImage}
              alt={popup.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* BAGIAN KONTEN - Fokus pada tipografi luxury */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col items-center text-center">
            {/* Tagline Kecil */}
            {/* <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
              Kabar Spesial
            </span> */}

            {/* Judul Utama Serif */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#FF5F9D] leading-tight mb-3">
              {popup.title}
            </h2>

            {/* Deskripsi Singkat */}
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-md mb-8">
             {popup.description}
            </p>

            {/* CTA Group Terintegrasi Secara Minimalis */}
            <div className="w-full flex flex-col gap-3">
              <a
                href={popup.cta_link || "#"}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF5F9D] hover:bg-pink-600 text-white py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide transition-all active:scale-[0.98] shadow-sm shadow-pink-100"
              >
                {popup.cta_text || "Lihat Selengkapnya"}
                <ArrowRight size={14} />
              </a>

              {/* <button
                onClick={() => setShow(false)}
                className="w-full py-2.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
              >
                Nanti Saja
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
