"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  display_image: string;
  price: number | null;
  slug: string;
};

export default function FlashSale() {
  const [products, setProducts] = useState<Product[]>([]);
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  const router = useRouter();

  // Warna tema kustom
  const brandPink = "#FF5F9D";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/best-sellers`,
        );

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let total = 3 * 60 * 60;
    const interval = setInterval(() => {
      total--;
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      setTime({ h, m, s });
      if (total <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number | null) => {
    if (!price) return "Rp -";
    return "Rp " + Number(price).toLocaleString("id-ID");
  };

  return (
    <section className="p-6 bg-[#FFF5F8] rounded-3xl shadow-sm border border-[#FFD1E3]">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg text-white animate-pulse"
            style={{ backgroundColor: brandPink }}
          >
            ⚡
          </div>
          <h2
            className="text-2xl  tracking-tighter"
            style={{ color: brandPink }}
          >
            FLASH SALE
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-[#FFD1E3]">
          <span className="text-sm font-medium text-gray-500">
            Berakhir Dalam
          </span>
          <div className="flex gap-2 font-bold text-white">
            {[time.h, time.m, time.s].map((unit, i) => (
              <span
                key={i}
                className="w-8 h-8 flex items-center justify-center rounded-md text-sm"
                style={{ backgroundColor: brandPink }}
              >
                {String(unit).padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="min-w-[250px] md:min-w-0 group bg-white rounded-2xl p-4 border border-transparent hover:border-[#FF5F9D] transition-all duration-300 hover:shadow-xl hover:shadow-[#FF5F9D20]"
          >
            {/* Badge & Image */}
            <div className="relative overflow-hidden rounded-xl mb-4">
              <div
                className="absolute top-2 left-2 z-10 text-[10px] font-bold text-white px-2 py-1 rounded-full shadow-sm"
                style={{ backgroundColor: brandPink }}
              >
                SAVE 30%
              </div>
              <img
                src={p.display_image}
                alt={p.name}
                className="w-full h-50 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Animate Skin
              </p>
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 h-10 leading-snug">
                {p.name}
              </h3>

              <div className="pt-2">
                <span className="text-lg " style={{ color: brandPink }}>
                  {formatPrice(p.price)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="pt-3">
                <div className="flex justify-between text-[10px] mb-1 font-bold">
                  <span style={{ color: brandPink }}>Tersisa 12 Stok</span>
                  <span className="text-gray-400">60% Terjual</span>
                </div>
                <div className="h-1.5 w-full bg-[#FFE4F0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ backgroundColor: brandPink, width: "60%" }}
                  />
                </div>
              </div>

              <button
                onClick={() => router.push(`/product/${p.slug}`)}
                className="mt-4 w-full text-white py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-[#FF5F9D40] cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${brandPink} 0%, #FF8DB9 100%)`,
                }}
              >
                BELI SEKARANG
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
