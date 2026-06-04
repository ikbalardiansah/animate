"use client";

import React, { useState, useEffect } from "react";
import { Star, Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "../store/cart";

interface ProductData {
  id: number;
  product: {
    id: number;
    name: string;
    display_image: string;
    display_price: string | null;
    slug: string;
    variants?: {
      id: number;
      sku_id: string;
      retail_price: string;
    }[];
  };
}

const ProductGrid = () => {
  const [activeTab, setActiveTab] = useState("BEST SELLER");
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);


  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = "best-sellers";
        if (activeTab === "NEW ARRIVAL") endpoint = "new-arrivals";
        if (activeTab === "BEST DEALS") endpoint = "best-deals";

        const res = await fetch(`${API}/${endpoint}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, API]);

  const getDynamicRating = (id: number) => {
    const ratings = [4.7, 4.8, 4.9, 5.0];
    const ratingIndex = id % ratings.length;
    const rating = ratings[ratingIndex];
    const totalReviews = ((id * 17) % 861) + 120;

    return { rating, totalReviews };
  };

  const formatPrice = (price: string | number | null) => {
    const p = typeof price === "string" ? parseFloat(price) : price;
    if (!p) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(p)
      .replace(/\s/g, " ");
  };

 

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 md:py-16">
      {/* CENTERED SECTION HEADER */}
      <div className="flex flex-col items-center text-center mb-10 md:mb-12">
        {/* CENTERED TABS */}
        <div className="flex justify-center gap-6 md:gap-8 border-b border-gray-100 w-full max-w-md overflow-x-auto no-scrollbar px-4">
          {["BEST SELLER", "NEW ARRIVAL", "BEST DEALS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-semibold tracking-wider transition-all relative whitespace-nowrap ${
                activeTab === tab
                  ? "text-[#FF5F9D]"
                  : "text-gray-400 hover:text-[#FF5F9D]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF5F9D]"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2
            className="animate-spin text-gray-300"
            size={28}
            strokeWidth={1.5}
          />
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
          {products.map((item) => {
            const price = parseFloat(item.product.display_price || "0");
            const { rating, totalReviews } = getDynamicRating(item.id);
            const fullStars = Math.floor(rating);

            return (
              <div key={item.id} className="group relative flex flex-col">
                {/* IMAGE CONTAINER */}
                <Link
                  href={`/shop/product/${item.product.slug}`}
                  className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl mb-3 block"
                >
                  <img
                    src={item.product.display_image}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

              
                  
                </Link>

                {/* INFO CONTAINER */}
                <div className="flex flex-col flex-1 px-1">
                  {/* RATING & REVIEWS */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={
                            i < fullStars
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium tracking-tight mt-0.5">
                      {rating.toFixed(1)} ({totalReviews})
                    </span>
                  </div>

                  {/* TITLE */}
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="hover:underline decoration-gray-400 underline-offset-2"
                  >
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed min-h-[36px] md:min-h-[40px]">
                      {item.product.name}
                    </h3>
                  </Link>

                  {/* PRICE & DISCOUNT */}
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
                    <p className="text-sm md:text-base font-semibold text-gray-950">
                      {formatPrice(price)}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400 line-through">
                      {formatPrice(price * 2)}
                    </p>
                    <span className="text-[10px] font-bold text-red-500">
                      50% OFF
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
