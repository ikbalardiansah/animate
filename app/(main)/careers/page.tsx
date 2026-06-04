"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, MapPin, ArrowRight, Sparkles, Stars } from "lucide-react";
import Link from "next/link";

interface Career {
  id: number;
  title: string;
  slug: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary: string;
  status: "OPEN" | "CLOSED" | "DRAFT";
  created_at: string;
}

export default function CareerListPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/careers`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setCareers(res.data);
        setLoading(false); // <-- Sudah diperbaiki dari loading(false)
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 py-12 md:py-24 px-4 md:px-12 relative overflow-hidden">
      {/* Background Glow Minimalis */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#FF5F9D]/5 blur-[80px] md:blur-[150px] rounded-full -z-10" />

      <div className="max-w-3xl mx-auto">
        {/* HEADER SECTION */}
        <header className="text-left md:text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-md shadow-sm border border-gray-100 mb-4 md:mb-6">
            <Sparkles size={14} className="text-[#FF5F9D]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
              Hiring Now
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-gray-900 leading-tight mb-4 md:mb-6">
            Build Your Future <br className="hidden sm:inline" />
            <span className="font-medium text-[#FF5F9D]">With Animate.</span>
          </h1>

          <p className="text-gray-500 text-xs md:text-sm font-normal max-w-md md:mx-auto leading-relaxed">
            Bergabunglah dengan tim kami untuk merevolusi dunia kecantikan
            Indonesia melalui inovasi digital dan kreativitas tanpa batas.
          </p>
        </header>

        {/* CAREERS CONTAINER */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <div className="w-8 h-8 border-2 border-[#FF5F9D] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 font-medium text-[10px] uppercase tracking-widest">
                Mencari posisi...
              </p>
            </div>
          ) : careers.length > 0 ? (
            careers.map((job) => (
              <Link
                key={job.id}
                href={`/careers/${job.slug}`}
                className="block group"
              >
                <div className="bg-white p-5 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
                  {/* Left Column: Info */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-medium text-gray-800 tracking-tight group-hover:text-[#FF5F9D] transition-colors line-clamp-2">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 text-[11px] font-medium tracking-wide">
                      <span className="flex items-center gap-1.5 bg-pink-50/50 px-2.5 py-1 rounded-md text-[#FF5F9D] font-semibold">
                        <Briefcase size={12} strokeWidth={2.5} /> {job.type}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md text-gray-500 border border-gray-100/50">
                        <MapPin size={12} /> {job.location}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: CTA Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t border-gray-50 sm:border-0">
                    <span className="text-[#FF5F9D] text-xs font-semibold tracking-wider uppercase inline-block sm:hidden group-hover:underline">
                      Lihat Detail
                    </span>
                    <span className="text-gray-400 text-xs font-medium tracking-wide uppercase hidden sm:inline-block group-hover:text-gray-900 transition-colors">
                      Detail
                    </span>

                    <div className="bg-gray-50 group-hover:bg-[#FF5F9D] text-gray-400 group-hover:text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border border-gray-100 group-hover:border-transparent transition-all duration-300 group-hover:translate-x-1 flex-shrink-0">
                      <ArrowRight
                        className="w-4 h-4 md:w-5 md:h-5"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 px-4">
              <Stars className="mx-auto text-gray-300 mb-3" size={32} />
              <p className="text-gray-400 text-xs font-medium tracking-wide uppercase">
                Belum ada posisi yang tersedia saat ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
