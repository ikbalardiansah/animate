"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";

const MySwal = withReactContent(Swal);

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

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

    if (loading) return; // 🔥 prevent spam klik

    if (formData.password !== formData.password_confirmation) {
      return MySwal.fire({
        icon: "warning",
        title: "Password Tidak Cocok",
        text: "Pastikan konfirmasi password sama dengan password Anda.",
        confirmButtonColor: "#FF5F9D",
      });
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        await Toast.fire({
          icon: "success",
          title: "Registrasi Berhasil",
          text: "Silakan login kembali.",
        });

        router.push("/login");
      } else {
        MySwal.fire({
          icon: "error",
          title: "Registrasi Gagal",
          text: data?.errors
            ? Object.values(data.errors).flat().join(", ")
            : data?.message || "Terjadi kesalahan.",
          confirmButtonColor: "#FF5F9D",
        });
      }
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Masalah Koneksi",
        text: "Gagal terhubung ke server.",
        confirmButtonColor: "#FF5F9D",
      });
    } finally {
      setLoading(false); // 🔥 selalu reset
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900">
      {/* KIRI: HERO SECTION */}
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

      {/* KANAN: REGISTER FORM SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-[460px]">
          <div className="mb-10 flex justify-center lg:justify-start">
            <div className="relative h-14 w-44">
              <Image
                src="/assets/logo-animate.png"
                alt="Animate Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <header className="mb-8 text-center lg:text-left">
            <h1 className="text-4xl  tracking-tight text-slate-800 mb-2">
              Buat Akun
            </h1>
            <p className="text-slate-500">
              Sudah punya akun?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-[#FF5F9D] font-bold cursor-pointer hover:underline"
              >
                Masuk di sini
              </span>
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 tracking-widest ml-1">
                Nama Lengkap
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#FF5F9D]">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-[#FF5F9D] focus:bg-white"
                  placeholder="Nama Lengkap"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 tracking-widest ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#FF5F9D]">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-[#FF5F9D] focus:bg-white"
                  placeholder="email@anda.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 tracking-widest ml-1">
                Kata Sandi
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#FF5F9D]">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-[#FF5F9D] focus:bg-white"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 tracking-widest ml-1">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#FF5F9D]">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password_confirmation"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-[#FF5F9D] focus:bg-white"
                  placeholder="********"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-[#FF5F9D] hover:bg-[#e04d88] text-white font-bold rounded-2xl shadow-xl shadow-pink-100 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-80"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Memproses...</span>
                </>
              ) : (
                "Daftar Sekarang"
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
              <span>Daftar dengan Google</span>
            </button> */}
          </form>

          {/* <footer className="mt-12 text-center lg:text-left">
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em]">
              &copy; 2026 Animate by Yunna Mercier.
            </p>
          </footer> */}
        </div>
      </div>
    </div>
  );
}
