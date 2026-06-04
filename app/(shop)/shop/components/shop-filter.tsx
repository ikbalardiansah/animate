"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  Zap,
  Waves,
  Search,
  Filter,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";

const categories = [
  { id: "skincare", label: "Skincare", icon: <Sparkles size={16} />, promo: null },
  { id: "lippies", label: "Lippies", icon: <ShoppingBag size={16} />, promo: "-40%" },
  { id: "bodycare", label: "Bodycare", icon: <Waves size={16} />, promo: null },
  { id: "bundling", label: "Bundling", icon: <Zap size={16} />, promo: "50%" },
];

export default function ShopFilter() {
  const [activeTab, setActiveTab] = useState("skincare");
  const [priceRange, setPriceRange] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: activeTab,
        search,
        price: priceRange,
        sort,
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params}`);
      const data = await res.json();
      setProducts(data.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, priceRange, sort]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF9FB] pb-20 font-sans text-[#5F4B53]">
      {/* Search & Navbar Area */}
      <div className="bg-white/80 backdrop-blur-md px-4 py-4 sticky top-0 z-40 border-b border-pink-50 lg:py-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF5F9D] transition-transform group-focus-within:scale-110"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari produk kecantikanmu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#FFF5F8] border-2 border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:bg-white focus:border-[#FF5F9D]/20 transition-all outline-none placeholder:text-pink-300"
              />
            </div>
            <button className="bg-[#FF5F9D] text-white p-3.5 rounded-2xl shadow-lg shadow-pink-200 lg:hidden">
              <Filter size={20} />
            </button>
          </div>

          {/* Luxury Tab Navigation */}
          <div className="flex overflow-x-auto no-scrollbar gap-3 lg:gap-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`group relative flex items-center gap-2 px-6 py-2.5 rounded-xl whitespace-nowrap transition-all duration-500 text-sm font-bold ${
                  activeTab === cat.id
                    ? "bg-[#FF5F9D] text-white shadow-xl shadow-pink-200"
                    : "bg-white text-[#FF5F9D] hover:bg-pink-50"
                }`}
              >
                {cat.icon}
                {cat.label}
                {cat.promo && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                    activeTab === cat.id ? "bg-white/20 text-white" : "bg-rose-100 text-[#FF5F9D]"
                  }`}>
                    {cat.promo}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-10">
        {/* Modern Toolbar */}
        <div className="flex items-center justify-between mb-10 bg-[#FF5F9D]/5 p-2 rounded-[2rem]">
          <div className="flex gap-2">
            <button 
              onClick={() => setSort("latest")}
              className={`px-6 py-3 rounded-[1.5rem] text-sm font-black transition-all ${sort === 'latest' ? 'bg-white text-[#FF5F9D] shadow-sm' : 'text-[#FF5F9D]/60'}`}
            >
              Terbaru
            </button>
            <button 
              onClick={() => setSort("best")}
              className={`px-6 py-3 rounded-[1.5rem] text-sm font-black transition-all ${sort === 'best' ? 'bg-white text-[#FF5F9D] shadow-sm' : 'text-[#FF5F9D]/60'}`}
            >
              Terlaris
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-4 px-6 text-[#FF5F9D]">
            <span className="text-xs font-bold  opacity-60">Urutkan Harga</span>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="bg-transparent border-none text-sm  outline-none cursor-pointer"
            >
              <option value="">Semua</option>
              <option value="under50k">Di bawah 50rb</option>
              <option value="50-150k">50rb - 150rb</option>
            </select>
          </div>
        </div>

        {/* Improved Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
          {products.map((product: any) => {
            const originalPrice = product.variations?.[0]?.price?.price || 0;
            const discountedPrice = Math.floor(originalPrice / 2);

            return (
              <Link
                key={product.id}
                href={`/shop/product/${product.slug}`}
                className="group flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-white border border-pink-50 shadow-sm transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-pink-100">
                  <img
                    src={product.variations?.[0]?.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  
                  {/* Glass Tag */}
                  <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50">
                    <p className="text-[10px] font-black text-[#FF5F9D]">-50% OFF</p>
                  </div>
                  
                  {/* Floating Action (Desktop Only) */}
                  <div className="absolute inset-x-0 bottom-6 px-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden lg:block">
                    <button className="w-full bg-[#FF5F9D] text-white py-3 rounded-2xl font-bold text-xs shadow-xl shadow-pink-200 flex items-center justify-center gap-2">
                      <ShoppingBag size={14} /> Lihat Detail
                    </button>
                  </div>
                </div>

                <div className="mt-6 px-2 text-center lg:text-left">
                  <p className="text-[10px] font-bold text-pink-300  tracking-[0.2em] mb-1">
                    {activeTab}
                  </p>
                  <h3 className="font-bold text-base line-clamp-1 mb-2 group-hover:text-[#FF5F9D] transition-colors leading-tight">
                    {product.name}
                  </h3>

                  <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-3 justify-center lg:justify-start">
                    <span className="text-sm font-bold text-[#FF5F9D]">
                      Rp {formatRupiah(discountedPrice)}
                    </span>
                    <span className="text-[11px] text-pink-200 line-through decoration-[#FF5F9D]/30 decoration-2">
                      Rp {formatRupiah(originalPrice)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-40">
            <LayoutGrid className="mx-auto text-pink-100 mb-4" size={60} />
            <p className="text-[#FF5F9D] font-black text-xl">Oops! Produk belum tersedia.</p>
            <p className="text-pink-300 text-sm mt-2">Coba gunakan filter atau kata kunci lainnya.</p>
          </div>
        )}
      </div>
    </div>
  );
}