"use client";

import React from "react";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";

export default function Marketplace() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Title Section */}
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-gray-400 text-sm tracking-[0.3em] uppercase mb-2">
          Temukan Kami Di
        </h2>
        <div className="w-12 h-1 bg-[#FF5F9D] rounded-full"></div>
      </div>

      {/* Grid Marketplace: 2 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* TikTok Shop */}
        <MarketplaceCard
          href="https://vt.tiktok.com/ZS9Feej8bC2dK-t9nBA/"
          // URL CDN Logo TikTok
          logo="/images/tiktok.png"
          name="Animate TikTok Shop"
          desc="Cek Live Shopping Kami"
        />

        {/* Shopee Official */}
        <MarketplaceCard
          href="https://shopee.co.id/animateofficial.id"
          // URL CDN Logo Shopee
          logo="/images/shopee.png"
          name="Animate Shopee Official"
          desc="Gratis Ongkir & Voucher"
          isFeatured={true}
        />
      </div>
    </section>
  );
}

function MarketplaceCard({ href, logo, name, desc, isFeatured = false }: any) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center p-6 bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg ${
        isFeatured
          ? "border-[#FF5F9D] shadow-[0_10px_30px_rgba(255,95,157,0.1)]"
          : "border-gray-100 hover:border-pink-200"
      }`}
    >
      <div className="relative w-12 h-12 flex-shrink-0 mr-6">
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      <div className="flex-grow">
        <h4 className="text-gray-800 text-base md:text-lg tracking-tight">
          {name}
        </h4>
        <p className="text-gray-400 text-xs md:text-sm font-medium">{desc}</p>
      </div>

      <div className="text-pink-100 group-hover:text-[#FF5F9D] transition-colors ml-4">
        <FaChevronRight size={18} />
      </div>
    </a>
  );
}
