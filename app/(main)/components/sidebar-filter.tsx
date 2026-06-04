"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export type FilterType = "ALL" | "BUNDLE" | "NORMAL";

interface ProductFilterProps {
  onFilterChange: (
    type: FilterType,
    minPrice?: number,
    maxPrice?: number,
  ) => void;
}

const ProductFilter = ({ onFilterChange }: ProductFilterProps) => {
  const [selectedType, setSelectedType] = useState<FilterType>("ALL");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const [debouncedMin] = useDebounce(minPrice, 500);

  const [debouncedMax] = useDebounce(maxPrice, 500);

  const categories = [
    { label: "Semua Produk", value: "ALL" },
    { label: "Bundle Package", value: "BUNDLE" },
    { label: "Single Product", value: "NORMAL" },
  ] as const;

  const handleApplyFilter = () => {
    const min = minPrice !== "" ? Number(minPrice) : undefined;
    const max = maxPrice !== "" ? Number(maxPrice) : undefined;

    if (min !== undefined && max !== undefined && min > max) {
      alert("Harga minimum tidak boleh lebih besar dari maksimum");
      return;
    }

    onFilterChange(selectedType, min, max);
  };

  const handleReset = () => {
    setSelectedType("ALL");
    setMinPrice("");
    setMaxPrice("");

    onFilterChange("ALL", undefined, undefined);
  };

  useEffect(() => {
    const min = minPrice !== "" ? Number(minPrice) : undefined;

    const max = maxPrice !== "" ? Number(maxPrice) : undefined;

    onFilterChange(selectedType, min, max);
  }, [selectedType, minPrice, maxPrice, debouncedMin, debouncedMax]);

  return (
    <aside className="w-full md:w-72 bg-white rounded-3xl shadow-md border border-gray-100 p-6 md:p-8 h-fit transition-all">
      {/* 🔥 Title */}{" "}
      <div className="mb-8">
        {" "}
        <h2 className="text-lg font-bold text-gray-900">Filter Produk</h2>{" "}
        <p className="text-sm text-gray-400 mt-1">
          Sesuaikan pencarian produk{" "}
        </p>{" "}
      </div>
      {/* 🔥 Category */}
      <div className="mb-10">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
          Kategori
        </h3>

        <div className="space-y-3">
          {categories.map((cat) => (
            <label
              key={cat.value}
              className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer border transition-all
          ${
            selectedType === cat.value
              ? "border-[#FF5F9D] bg-pink-50"
              : "border-gray-200 hover:border-gray-400"
          }`}
            >
              <span
                className={`text-sm font-medium ${
                  selectedType === cat.value
                    ? "text-[#FF5F9D]"
                    : "text-gray-700"
                }`}
              >
                {cat.label}
              </span>

              <input
                type="radio"
                name="category"
                checked={selectedType === cat.value}
                onChange={() => setSelectedType(cat.value)}
                className="accent-[#FF5F9D]"
              />
            </label>
          ))}
        </div>
      </div>
      {/* 🔥 Price Range */}
      <div className="mb-10">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
          Rentang Harga
        </h3>

        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-[#FF5F9D] focus:outline-none transition"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-[#FF5F9D] focus:outline-none transition"
          />
        </div>
      </div>
      {/* 🔥 Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleApplyFilter}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white 
      bg-gradient-to-r from-[#FF5F9D] to-pink-500
      hover:opacity-90 active:scale-95 transition-all shadow-lg"
        >
          Terapkan Filter
        </button>

        <button
          onClick={handleReset}
          className="w-full py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
        >
          Reset Filter
        </button>
      </div>
    </aside>
  );
};

export default ProductFilter;
