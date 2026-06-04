"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useWishlistStore } from "@/app/(shop)/shop/store/wishlist";
import { WishlistItem } from "@/app/(shop)/shop/types/wishlist";
import { useSearchParams, useRouter } from "next/navigation";

type ServerWishlistItem = {
  product: {
    id: number;
    name: string;
    image: string;
    price: number | string;
  };
};

const MySwal = withReactContent(Swal);

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/shop";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Konfigurasi Toast SweetAlert2 yang selaras dengan tema Pink
  const Toast = MySwal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // 🔥 cegah spam klik

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // ❌ HANDLE ERROR RESPONSE
      if (!response.ok) {
        throw new Error(data?.message || "Email atau password salah");
      }

      const token = data.access_token || data.token;

      if (!token) {
        throw new Error("Token tidak ditemukan di response login");
      }

      localStorage.setItem("access_token", token);

      await Toast.fire({
        icon: "success",
        title: "Login Berhasil",
      });

      await syncWishlistAfterLogin(token);

      router.push(redirect);
    } catch (error: unknown) {
      MySwal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error instanceof Error ? error.message : "Terjadi kesalahan.",
        confirmButtonColor: "#FF5F9D",
      });
    } finally {
      setLoading(false); // 🔥 WAJIB ADA
    }
  };

  const syncWishlistAfterLogin = async (token: string) => {
    const { items, hydrateFromServer } = useWishlistStore.getState();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const serverData = await res.json();

    const formatted = (serverData.data || [])
      .filter((w: ServerWishlistItem) => w.product)
      .map((w: ServerWishlistItem) => ({
        product_id: w.product.id,
        name: w.product.name,
        image: w.product.image,
        price: Number(w.product.price ?? 0),
      }));

    const merged: WishlistItem[] = [
      ...formatted,
      ...items.filter(
        (s: WishlistItem) =>
          !formatted.some(
            (srv: WishlistItem) => srv.product_id === s.product_id,
          ),
      ),
    ];

    hydrateFromServer(merged);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: merged }),
    });
  };

  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");

      if (token) {
        router.push(redirect);
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900">
      {/* KIRI: HERO SECTION (Hidden on mobile/tablet portrait) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-pink-50">
        <Image
          src="/images/COVER-12.jpg"
          alt="Animate Hero"
          fill
          sizes="(min-width: 1024px) 50vw, 0vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-16">
          <div className="animate-fade-in-up"></div>
        </div>
      </div>

      {/* KANAN: LOGIN FORM SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20">
        <div className="w-full max-w-[420px]">
          {/* Brand Logo */}
          <div className="mb-12 flex justify-center lg:justify-start">
            <div className="relative h-14 w-44">
              <Image
                src="/assets/logo-animate.png" // Taruh file logo Anda di folder /public
                alt="Animate Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <header className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl text-slate-800 mb-3">Masuk Akun</h1>
            <p className="text-slate-500">
              Belum punya akun?{" "}
              <span
                onClick={() => router.push("/register")}
                className="text-[#FF5F9D] font-bold cursor-pointer hover:underline underline-offset-4"
              >
                Daftar sekarang
              </span>
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500  ml-1">
                Email Anda
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#FF5F9D] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-[#FF5F9D] focus:bg-white focus:ring-4 focus:ring-pink-50"
                  placeholder="hallo@gmail.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 ml-1">
                Kata Sandi
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#FF5F9D] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-[#FF5F9D] focus:bg-white focus:ring-4 focus:ring-pink-50"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-2 border-slate-300 text-[#FF5F9D] focus:ring-[#FF5F9D] cursor-pointer transition-all"
                />
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
                  Ingat Saya
                </span>
              </label>
              {/* <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-sm font-bold text-slate-400 hover:text-[#FF5F9D] transition-colors"
              >
                Lupa Password?
              </button> */}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FF5F9D] hover:bg-[#e04d88] text-white font-bold rounded-2xl shadow-xl shadow-pink-100 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Sedang Masuk...</span>
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </button>

            {/* Social Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center px-1">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs tracking-tighter">
                {/* <span className="bg-white px-4 text-slate-400 font-bold">
                  Atau Gunakan
                </span> */}
              </div>
            </div>

            {/* Google Login */}
            {/* <button
              type="button"
              className="w-full py-4 border-2 border-slate-100 rounded-2xl flex items-center justify-center space-x-3 hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm"
            >
              <Image
                src="/assets/google.png"
                alt="Google"
                width={22}
                height={22}
              />
              <span>Masuk dengan Google</span>
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
