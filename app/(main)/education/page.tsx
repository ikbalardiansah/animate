"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Search, Tag, Loader2 } from "lucide-react";

export default function ArtikelPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL;
  const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL;

  useEffect(() => {
    fetch(`${API}/posts`)
      .then((res) => res.json())
      .then((res) => {
        // Asumsi BE Laravel menggunakan pagination atau langsung data
        setPosts(res.data || res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter artikel berdasarkan pencarian judul
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#FF5F9D] mb-4" size={40} />
        <p className="text-gray-400  tracking-widest text-xs animate-pulse">
          Memuat Jurnal Kecantikan...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FFFDFE] pb-20">
      {/* HERO SECTION */}
      <div className="bg-white border-b border-pink-50 pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-5xl md:text-7xl text-[#FF5F9D] tracking-tighter">
            Beauty Journal
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
            Temukan tips rahasia, edukasi bahan skincare, dan update terbaru
            seputar dunia kecantikan bersama ANIMATE.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-6 relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#FF5F9D] transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari artikel kecantikan..."
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-none bg-gray-50 focus:ring-4 focus:ring-pink-50 transition-all font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* GRID ARTIKEL */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/education/${post.slug}`}
                className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-transparent hover:border-pink-100 hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <img
                    src={
                      post.featured_image
                        ? `${STORAGE}/${post.featured_image}`
                        : "/placeholder.jpg"
                    }
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-5 left-5 z-20">
                    <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-[10px tracking-widest text-gray-900 shadow-sm">
                      Edukasi
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-[10px]  text-gray-400 tracking-widest">
                    <Calendar size={14} className="text-pink-300" />
                    {new Date(post.created_at).toLocaleDateString("id-ID", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  <h3 className="text-xl text-gray-900 leading-tight group-hover:text-[#FF5F9D] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed">
                    {post.excerpt ||
                      "Baca selengkapnya mengenai rahasia kulit cantik di artikel ini..."}
                  </p>

                  <div className="pt-4 mt-auto flex items-center text-[#FF5F9D] font-black text-xs tracking-widest gap-2 group-hover:gap-4 transition-all">
                    Baca Artikel <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
              Tidak ada artikel yang ditemukan.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER CTA */}
      <div className="max-w-4xl mx-auto px-6 mt-32 text-center">
        <div className="bg-gradient-to-br from-[#FF5F9D] to-[#FF87B2] p-10 md:p-16 rounded-[3.5rem] shadow-2xl shadow-pink-200 relative overflow-hidden">
          {/* Dekorasi Cahaya */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 blur-2xl" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Ingin tahu lebih banyak?
            </h2>
            <p className="text-pink-50 font-medium mb-10 max-w-sm mx-auto leading-relaxed opacity-90">
              Dapatkan update produk terbaru dan tips kecantikan harian langsung
              di emailmu.
            </p>

            <div className="max-w-md mx-auto">
              <div className="p-2 bg-white rounded-[2rem] shadow-xl flex flex-col md:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-6 py-4 rounded-[1.5rem] border-none focus:ring-0 text-gray-800 placeholder:text-gray-300 font-bold text-sm"
                />
                <button className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg shadow-gray-200">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
