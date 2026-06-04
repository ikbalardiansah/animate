"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const TikTokEmbed = dynamic(
  () => import("react-social-media-embed").then((mod) => mod.TikTokEmbed),
  { ssr: false },
);

type TikTok = {
  id: number;
  url: string;
};

export default function TikTokSection() {
  const [videos, setVideos] = useState<TikTok[]>([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API}/tiktoks`);
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("TikTok fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [API]);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 md:py-20 overflow-hidden">
      <div className="text-center mb-10 md:mb-14">
        <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#FF5F9D] uppercase mb-2 block">
          Gaya Hidup Animate
        </span>
        <h2 className="text-3xl md:text-4xl  tracking-tight text-gray-950 mb-4">
          Trending di{" "}
          <span className="text-[#FF5F9D]  font-normal">TikTok</span>
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Produk skincare & makeup yang lagi viral di TikTok dan diburu banyak
          orang. Dari serum FYP, sunscreen no whitecast.
        </p>
        <div className="w-20 h-1.5 bg-[#FF5F9D] mx-auto mt-6 rounded-full"></div>
      </div>

      {loading ? (
        /* SKELETON LOADING - Mobile optimized */
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory px-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[75vw] sm:min-w-[300px] md:min-w-[340px] aspect-[9/16] bg-gray-50 rounded-2xl animate-pulse snap-center"
            />
          ))}
        </div>
      ) : videos.length === 0 ? (
        /* EMPTY STATE - Minimalis */
        <div className="max-w-md mx-auto bg-gray-50/50 rounded-2xl p-10 text-center border border-gray-100">
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            Belum ada video rekomendasi saat ini.
          </p>
        </div>
      ) : (
        /* CONTAINER - Horisontal presisi di Mobile, Grid sejajar di Desktop */
        <div
          className="
          flex overflow-x-auto snap-x snap-mandatory pb-6 gap-4 no-scrollbar px-2
          md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 md:px-0
        "
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className="
                min-w-[75vw] sm:min-w-[300px] md:min-w-0 
                snap-center transition-all duration-300
              "
            >
              {/* CARD EMBED - Efek border halus tanpa shadow berlebih */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50/30 group hover:border-gray-200 transition-all">
                <TikTokEmbed url={video.url} width="100%" height="auto" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
