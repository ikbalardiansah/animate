"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaYoutube, FaFacebookF } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16">
      {/* 1. Bagian Atas: Konten Utama (Background Putih) */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
        {/* Kolom 1: Logo & Deskripsi */}
        <div className="space-y-6">
          <Image
            src="/assets/logo-animate.png"
            alt="Animate Logo"
            width={180}
            height={60}
            className="h-auto w-auto"
          />
          <p className="text-gray-500 text-sm leading-relaxed">
            Solusi kecantikan modern untuk kulit sehat dan bercahaya. Kami
            menghadirkan produk berkualitas tinggi yang telah teruji klinis
            untuk kecantikan alami.
          </p>
          <div className="flex gap-4">
            <SocialIcon Icon={FaInstagram} />
            <SocialIcon Icon={FaTiktok} />
            <SocialIcon Icon={FaYoutube} />
            <SocialIcon Icon={FaFacebookF} />
          </div>
        </div>

        {/* Kolom 2: Belanja */}
        <div>
          <h4 className="font-bold text-[#FF5F9D] mb-6 uppercase tracking-wider">
            Belanja
          </h4>
          <ul className="space-y-4 text-sm text-gray-600 font-medium">
            <li>
              <Link
                href="/shop/product?category=serums-essences-601619"
                className="hover:text-[#FF5F9D] transition"
              >
                Face Care
              </Link>
            </li>

            <li>
              <Link
                href="/shop/product?category=body-wash-soap-601493"
                className="hover:text-[#FF5F9D] transition"
              >
                Body Care
              </Link>
            </li>

            <li>
              <Link
                href="/shop/product?category=lipstick-lip-gloss-601534"
                className="hover:text-[#FF5F9D] transition"
              >
                Lippies
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#FF5F9D] transition">
                Bundling Package
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Bantuan */}
        <div>
          <h4 className="font-bold text-[#FF5F9D] mb-6 uppercase tracking-wider">
            Bantuan
          </h4>
          <ul className="space-y-4 text-sm text-gray-600 font-medium">
            <li>
              <Link
                href="/shop/tracking"
                className="hover:text-[#FF5F9D] transition"
              >
                Lacak Pesanan
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#FF5F9D] transition">
                Cara Pemesanan
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#FF5F9D] transition">
                Syarat & Ketentuan
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#FF5F9D] transition">
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#FF5F9D] transition">
                Hubungi Kami
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 4: Newsletter */}
        {/* <div className="space-y-6">
          <h4 className="font-bold text-[#FF5F9D] uppercase tracking-wider">
            Newsletter
          </h4>
          <p className="text-sm text-gray-500">
            Dapatkan info promo dan produk terbaru langsung di email kamu.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email Anda..."
              className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#FF5F9D] transition"
            />
            <button className="bg-[#FF5F9D] text-white px-6 py-3 rounded-lg font-bold text-xs uppercase hover:bg-[#e04d88] transition">
              Daftar
            </button>
          </div>
        </div> */}
      </div>

      {/* 2. Bagian Bawah: Copyright (Background #fff0f5) */}
      <div className="bg-[#fff0f5] py-6 text-center">
        <p className="text-gray-500 text-xs font-medium tracking-wide">
          © 2026 Animate All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

function SocialIcon({ Icon }: { Icon: any }) {
  return (
    <Link
      href="#"
      className="w-10 h-10 bg-pink-50 flex items-center justify-center rounded-full text-[#FF5F9D] hover:bg-[#FF5F9D] hover:text-white transition"
    >
      <Icon size={18} />
    </Link>
  );
}
