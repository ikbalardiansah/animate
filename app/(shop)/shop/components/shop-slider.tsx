"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function ResponsiveModernSlider() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sliders`);
        const result = await res.json();
        setSliders(Array.isArray(result) ? result : result.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  if (loading) return (
    <div className="w-full h-[60vh] md:h-[85vh] bg-neutral-100 animate-pulse rounded-2xl md:rounded-[2.5rem] m-4" />
  );
  
  if (sliders.length === 0) return null;

  return (
    <section className="relative w-full h-[70vh] sm:h-[60vh] md:h-[85vh] px-0 md:px-6 py-0 md:py-4">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade, Navigation]}
        effect="fade"
        loop={true}
        speed={800}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        navigation={{ nextEl: ".btn-next", prevEl: ".btn-prev" }}
        className="w-full h-full md:rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        {sliders.map((slider, index) => (
          <SwiperSlide key={slider.id}>
            <div className="relative w-full h-full flex items-end md:items-center">
              {/* Background dengan Zoom Effect */}
              <motion.div 
                className="absolute inset-0 z-0"
                initial={{ scale: 1.1 }}
                animate={{ scale: activeIndex === index ? 1 : 1.1 }}
                transition={{ duration: 6 }}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${slider.image}`}
                  className="w-full h-full object-cover"
                  alt={slider.title}
                />
                {/* Overlay: Gelap di bawah untuk mobile, gelap di kiri untuk desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 md:bg-gradient-to-r md:from-black/70 md:via-transparent to-transparent" />
              </motion.div>

              {/* Content Container */}
              <div className="relative z-10 w-full px-6 pb-20 md:pb-0 md:px-20">
                <AnimatePresence mode="wait">
                  {activeIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="max-w-xl"
                    >
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[#ff5f9d] font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-2 block"
                      >
                        Featured Discovery
                      </motion.span>
                      <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
                        {slider.title}
                      </h2>
                      
                      {slider.link && (
                        <a
                          href={slider.link}
                          className="inline-flex items-center gap-3 bg-white hover:bg-[#ff5f9d] hover:text-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-bold transition-all transform hover:scale-105"
                        >
                          Shop Now <ArrowRight size={18} />
                        </a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation Controls - Desktop: Bottom Right, Mobile: Top Right */}
        <div className="absolute top-6 right-6 md:top-auto md:bottom-12 md:right-12 z-30 flex gap-2 md:gap-4">
          <button className="btn-prev w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <ChevronLeft size={20} />
          </button>
          <button className="btn-next w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#ff5f9d] hover:border-[#ff5f9d] transition-all">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Progress Bar (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] md:h-1 bg-white/10 z-30">
          <motion.div 
            key={activeIndex}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-full bg-[#ff5f9d]"
          />
        </div>
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet { background: white !important; }
        .swiper-pagination-bullet-active { background: #ff5f9d !important; }
      `}</style>
    </section>
  );
}