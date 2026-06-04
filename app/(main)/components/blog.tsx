"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
};

export default function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/posts`);
        const json = await res.json();

        // Laravel paginate → data di dalam "data"
        setPosts(json.data || []);
      } catch (err) {
        console.error("Gagal fetch posts:", err);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      })
      .toUpperCase();
  };

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="relative">
            {/* Label Kecil di Atas Judul (Opsional untuk mempermanis) */}
            <span className="text-[#FF5F9D] text-xs font-bold uppercase tracking-widest mb-2 block">
              Artikel
            </span>

            <h2 className="text-3xl md:text-4xl  text-gray-900 tracking-tight mb-2">
              BEAUTY <span className="text-[#FF5F9D]">JOURNAL</span>
            </h2>

            <p className="text-gray-500 text-sm md:text-base max-w-md">
              Tips & trik kecantikan eksklusif untuk pancarkan pesona alamimu
              setiap hari.
            </p>

            {/* Garis Aksen Khas yang sama dengan Category Section */}
            <div className="w-12 h-1 bg-[#FF5F9D] mt-4 rounded-full"></div>
          </div>

          <button
            onClick={() => router.push("/education")}
            className="text-pink-500 font-semibold text-sm cursor-pointer"
          >
            Lihat Semua Artikel →
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={
                    post.featured_image
                      ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.featured_image}`
                      : "/placeholder.png"
                  }
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />

                <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                  {formatDate(post.published_at)}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <span className="text-xs text-pink-500 font-bold uppercase">
                  BEAUTY
                </span>

                <h3 className="text-sm font-semibold mt-2 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                  {post.excerpt}
                </p>

                <button
                  onClick={() => router.push(`/education/${post.slug}`)}
                  className="mt-3 text-pink-500 text-xs font-semibold cursor-pointer"
                >
                  Baca Selengkapnya →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
