"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  Heart,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/app/(shop)/shop/store/cart";
import { useAuthStore } from "@/app/(shop)/shop/store/authStore";

type Variant = {
  id: number;
  retail_price: string;
};

type Product = {
  id: number;
  name: string;
  slug: string;

  main_image?: string;

  variants?: Variant[];
};

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  role?: string;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showDesktopResult, setShowDesktopResult] = useState(false);
  const [showMobileResult, setShowMobileResult] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const pathname = usePathname();
  const [categories, setCategories] = useState<any[]>([]);
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const menuItems = categories
    .filter((cat) => cat.group === "Menu")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((cat) => ({
      label: cat.name,
      href:
        cat.slug === "shop"
          ? "/shop"
          : cat.slug === "all-product"
            ? "/shop/product"
            : `/shop/category/${cat.slug}`,
    }));

  const fetchProducts = async (keyword = "") => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/web-products?search=${keyword}`,
      );

      const json = await res.json();

      setProducts(json.data.data);
      setShowResult(true);
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = useCartStore((state) =>
    state.cart.reduce((a, b) => a + b.quantity, 0),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim()) {
        fetchProducts(search);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const handleClick = () => setShowResult(false);

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          localStorage.removeItem("access_token");
          setUser(null);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        setUser(null);
      });
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowMobileSearch(false);
    setShowDesktopResult(false);
    setShowMobileResult(false);
    setAccountOpen(false);
  }, [pathname]);

  if (!mounted) return null;
  return (
    <nav className="w-full bg-white sticky top-0 z-50 shadow-sm font-sans">
      {/* 1. Promo Bar */}
      <div className="w-full bg-[#FF5F9D] py-2 text-center">
        <p className="text-white text-[10px] sm:text-xs tracking-widest">
          Halal & BPOM Certified • Hidupkan Cantikmu #Upgrade+
        </p>
      </div>

      {/* 2. Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/shop">
              <Image
                src="/assets/logo-animate.png"
                alt="Animate Logo"
                width={150}
                height={50}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation (Center) */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Dropdown Shop */}
            <div
              className="relative py-8"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm text-slate-800 hover:text-[#FF5F9D] transition-colors tracking-tight">
                Explore{" "}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${shopOpen ? "rotate-180" : ""}`}
                />
              </button>

              {shopOpen && (
                <div className="absolute top-full left-0 w-[280px] bg-white border border-slate-100 shadow-2xl rounded-3xl p-5 z-50">
                  <div className="space-y-1">
                    {menuItems.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-pink-50 hover:text-[#FF5F9D] transition-all group"
                      >
                        <span>{item.label}</span>

                        <span className="opacity-0 group-hover:opacity-100 transition-all">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/shop/product"
              className="flex items-center gap-1 text-sm text-slate-800 hover:text-[#FF5F9D] transition-colors tracking-tight"
            >
              Shop
            </Link>

            <Link
              href="/shop/tracking"
              className="flex items-center gap-1 text-sm text-slate-800 hover:text-[#FF5F9D] transition-colors tracking-tight"
            >
              Lacak Pesanan
            </Link>

            <Link
              href="/offline-store"
              className="flex items-center gap-1 text-sm text-slate-800 hover:text-[#FF5F9D] transition-colors tracking-tight"
            >
              Offline Store
            </Link>

            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-slate-800 hover:text-[#FF5F9D] transition-colors tracking-tight"
            >
              Beranda
            </Link>
          </div>

          {/* Icons & Search (Right) */}
          <div className="flex items-center space-x-2 sm:space-x-5">
            <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowDesktopResult(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchProducts(search);
                  }
                }}
                className="bg-slate-50 border border-slate-100 rounded-full py-2 pl-10 pr-4 text-sm w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-[#FF5F9D] transition-all"
              />
              <Search className="absolute left-3 text-slate-400" size={16} />
            </div>

            {showDesktopResult && search && (
              <div className="absolute top-full mt-2 w-80 bg-white shadow-lg rounded-xl z-50 max-h-96 overflow-y-auto">
                {products.length > 0 ? (
                  products.map((item) => {
                    const price = Number(
                      item?.variants?.[0]?.retail_price ?? 0,
                    );

                    return (
                      <Link
                        key={item.id}
                        href={`/shop/product/${item.slug}`}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50"
                        onClick={() => setShowResult(false)}
                      >
                        <img
                          src={item.main_image}
                          className="w-12 h-12 object-cover rounded-lg"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">
                            {item.name}
                          </p>

                          <p className="text-xs font-bold text-[#FF5F9D]">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(price)}
                          </p>

                          <p className="text-[10px] text-gray-400 line-through">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(price * 2)}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className="p-3 text-sm text-gray-400">
                    Produk tidak ditemukan
                  </p>
                )}

                {products.length > 0 && (
                  <Link
                    href={`/shop/search?q=${search}`}
                    className="block text-center py-3 text-xs font-semibold text-[#FF5F9D] border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    Lihat Semua Produk
                  </Link>
                )}
              </div>
            )}
            <div className="flex items-center gap-4">
              {/* MENU */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-slate-700 hover:text-[#FF5F9D] transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* ACCOUNT */}
              <div className="relative">
                {user ? (
                  <>
                    {/* Avatar */}
                    <button
                      onClick={() => setAccountOpen(!accountOpen)}
                      className="w-9 h-9 rounded-full bg-[#FF5F9D]/10 hover:bg-[#FF5F9D]/20 text-[#FF5F9D] flex items-center justify-center text-sm font-bold border border-[#FF5F9D]/20 transition-all duration-200"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </button>

                    {/* Dropdown Menu */}
                    {accountOpen && (
                      <>
                        {/* Invisible backdrop to close dropdown when clicking outside */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setAccountOpen(false)}
                        />

                        <div className="absolute right-0 top-11 w-56 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                          {/* User Info Section */}
                          <div className="px-4 py-3.5 bg-slate-50/50 border-b border-slate-100 flex flex-col gap-0.5">
                            <p className="text-sm font-semibold text-slate-800 tracking-tight">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-400 truncate font-medium">
                              {user.email}
                            </p>
                          </div>

                          {/* Menu Links Section */}
                          <div className="p-1.5 space-y-0.5">
                            <Link
                              href="/shop/profile"
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#FF5F9D] transition-colors"
                              onClick={() => setAccountOpen(false)}
                            >
                              <User
                                size={16}
                                className="text-slate-400 group-hover:text-[#FF5F9D]"
                              />
                              <span>Profil Saya</span>
                            </Link>

                            <Link
                              href="/shop/orders"
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#FF5F9D] transition-colors"
                              onClick={() => setAccountOpen(false)}
                            >
                              <ShoppingBag
                                size={16}
                                className="text-slate-400"
                              />
                              <span>Pesanan</span>
                            </Link>

                            <hr className="border-slate-100 my-1 mx-1.5" />

                            <button
                              onClick={() => {
                                localStorage.removeItem("access_token");
                                setUser(null);
                                window.location.href = "/";
                              }}
                              className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50/60 transition-colors text-left"
                            >
                              <LogOut size={16} className="text-rose-500" />
                              <span>Keluar</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  /* Login Button Trigger */
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center p-2 text-slate-600 hover:text-[#FF5F9D] hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <User size={22} />
                  </Link>
                )}
              </div>

              {/* CART */}
              <Link
                href="/shop/cart"
                className="relative text-slate-700 hover:text-[#FF5F9D] transition-colors"
              >
                <ShoppingCart size={22} />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF5F9D] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/shop/wishlist"
                className="relative text-slate-700 hover:text-[#FF5F9D] transition-colors"
              >
                <Heart size={22} />
              </Link>

              {/* SEARCH ICON */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="text-slate-700 hover:text-[#FF5F9D] transition-colors"
              >
                <Search size={22} />
              </button>
            </div>

            {/* SEARCH OVERLAY */}
            {showMobileSearch && (
              <div className="absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl z-50 p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setShowMobileResult(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        fetchProducts(search);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F9D]"
                  />

                  <Search
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                  />
                </div>

                {/* SEARCH RESULT */}
                {showMobileResult && search && (
                  <div className="mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <span className="text-[10px] text-gray-400">
                        Hasil Pencarian
                      </span>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto">
                      {products.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                          {products.map((item) => {
                            const price = Number(
                              item?.variants?.[0]?.retail_price ?? 0,
                            );

                            return (
                              <Link
                                key={item.id}
                                href={`/shop/product/${item.slug}`}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-all duration-200 group"
                                onClick={() => {
                                  setShowMobileSearch(false);
                                  setShowMobileResult(false);
                                }}
                              >
                                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
                                  <img
                                    src={item.main_image ?? ""}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-800 line-clamp-2">
                                    {item.name}
                                  </p>

                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-[#FF5F9D]">
                                      {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                      }).format(price)}
                                    </p>

                                    <p className="text-[10px] text-gray-400 line-through">
                                      {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                      }).format(price * 2)}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-sm text-gray-400 italic">
                          Produk tidak ditemukan...
                        </div>
                      )}
                    </div>

                    {products.length > 0 && (
                      <Link
                        href={`/shop/search?q=${search}`}
                        className="block text-center py-3 text-xs font-semibold text-[#FF5F9D] border-t border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        Lihat Semua Produk
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out bg-white ${
          isOpen
            ? "max-h-screen overflow-y-auto border-t border-slate-100"
            : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="px-6 py-8 space-y-6">
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center list-none text-base text-slate-800 cursor-pointer">
                Explore{" "}
                <ChevronDown
                  size={18}
                  className="group-open:rotate-180 transition-transform"
                />
              </summary>
              <div className="mt-4 space-y-2 border-l-2 border-pink-100 pl-4">
                {menuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="block text-sm text-slate-600 hover:text-[#FF5F9D] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
            <summary className="flex justify-between items-center list-none text-base text-slate-800 cursor-pointer">
              <Link href="/shop/product">Shop </Link>
            </summary>
            <summary className="flex justify-between items-center list-none text-base text-slate-800 cursor-pointer">
              <Link href="/shop/tracking">Lacak Pesanan </Link>
            </summary>
            <summary className="flex justify-between items-center list-none text-base text-slate-800 cursor-pointer">
              <Link href="/offline-store">Offline Store </Link>
            </summary>
            <summary className="flex justify-between items-center list-none text-base text-slate-800 cursor-pointer">
              <Link href="/">Beranda </Link>
            </summary>
          </div>
        </div>
      </div>
    </nav>
  );
}
