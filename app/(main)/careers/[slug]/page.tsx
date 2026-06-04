"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Mail,
  Heart,
  Sparkles,
} from "lucide-react";
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

export default function CareerDetailPage() {
  const { slug } = useParams();
  const [job, setJob] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/careers/${slug}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setJob(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF5F9D] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!job)
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">404 Not Found</p>
        <p className="text-gray-800 font-light text-lg mb-6">Halaman lowongan tidak ditemukan.</p>
        <Link href="/careers" className="text-xs font-bold text-[#FF5F9D] tracking-wider uppercase underline underline-offset-4">
          Kembali ke Karir
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 py-8 md:py-20 px-4 md:px-12 relative">
      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* BACK BUTTON */}
        <Link
          href="/careers"
          className="group inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-colors mb-6 md:mb-10"
        >
          <div className="w-8 h-8 bg-white rounded-lg border border-gray-100 flex items-center justify-center shadow-sm group-hover:border-gray-300 transition-all">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
          </div>
          Kembali
        </Link>

        {/* MAIN CARD CONTAINER */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Subtle Top Border Decor */}
          <div className="h-1 bg-[#FF5F9D]" />

          <div className="p-5 md:p-12">
            
            {/* BADGES HEADER */}
            <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-6">
              <span className="px-2.5 py-1 bg-pink-50/50 text-[#FF5F9D] rounded-md text-[10px] font-bold tracking-wider uppercase">
                Career Opportunity
              </span>
              {job.salary && (
                <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-500 rounded-md text-[10px] font-semibold tracking-wide">
                  IDR {job.salary}
                </span>
              )}
            </div>

            {/* JOB TITLE */}
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-gray-900 leading-tight mb-6 md:mb-8">
              {job.title}
            </h1>

            {/* METADATA INFO */}
            <div className="grid grid-cols-2 gap-3 pb-8 md:pb-10 border-b border-gray-100 text-xs text-gray-600 font-medium">
              <div className="flex items-center gap-2.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{job.type}</span>
              </div>
            </div>

            {/* CONTENT SECTIONS */}
            <div className="space-y-10 md:space-y-12 pt-8 md:pt-10">
              
              {/* DESCRIPTION */}
              <section>
                <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
                  <Sparkles className="text-[#FF5F9D] w-3.5 h-3.5" /> 
                  Deskripsi Pekerjaan
                </h2>
                <div
                  className="
                    prose prose-sm max-w-none text-gray-600 leading-relaxed
                    prose-p:text-gray-600 prose-p:text-sm prose-p:leading-relaxed
                    prose-headings:text-gray-900 prose-headings:font-medium
                    prose-ul:list-disc prose-ul:pl-4 prose-li:my-1 prose-li:text-sm
                    prose-strong:text-gray-950 prose-strong:font-semibold
                    prose-a:text-[#FF5F9D] prose-a:underline
                  "
                  dangerouslySetInnerHTML={{
                    __html: job.description,
                  }}
                />
              </section>

              {/* REQUIREMENTS */}
              {job.requirements && (
                <section>
                  <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
                    <Heart className="text-[#FF5F9D] w-3.5 h-3.5" /> 
                    Kualifikasi
                  </h2>
                  <div
                    className="
                      prose prose-sm max-w-none text-gray-600 leading-relaxed
                      prose-p:text-gray-600 prose-p:text-sm prose-p:leading-relaxed
                      prose-headings:text-gray-900 prose-headings:font-medium
                      prose-ul:list-disc prose-ul:pl-4 prose-li:my-1 prose-li:text-sm
                      prose-strong:text-gray-950 prose-strong:font-semibold
                      prose-a:text-[#FF5F9D] prose-a:underline
                    "
                    dangerouslySetInnerHTML={{
                      __html: job.requirements, // <-- FIXED BUG: Diarahkan ke data requirements
                    }}
                  />
                </section>
              )}
            </div>

            {/* CTA PANEL */}
            <div className="mt-14 md:mt-20 p-6 md:p-10 bg-[#FAFAFA] rounded-xl border border-gray-100 text-center relative">
              <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg shadow-sm mx-auto flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-[#FF5F9D]" />
              </div>

              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Tertarik Bergabung?</h3>
              <p className="text-xs text-gray-500 font-normal mb-6 max-w-xs mx-auto leading-relaxed">
                Kirimkan berkas CV, Lamaran, dan Portfolio terbaikmu langsung ke alamat email resmi kami.
              </p>

              <div className="inline-block w-full sm:w-auto bg-[#FF5F9D] text-white px-6 py-3.5 rounded-xl  text-xs font-medium tracking-wider select-all border border-transparent shadow-sm">
                hrd@animate.co.id
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}