"use client";

import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function BrandNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/about-us",
    },

    {
      name: "Education",
      href: "/education",
    },
    {
      name: "Careers",
      href: "/careers",
    },
  ];

  return (
    <header className="w-full border-b border-pink-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="relative flex items-center h-20">
          {/* Left Menu Desktop */}
          {/* Left Menu Desktop */}
          <nav className="hidden lg:flex flex-1 items-center gap-8">
            {menus.map((menu) => (
              <Link
                key={menu.name}
                href={menu.href}
                className="text-sm font-medium text-slate-700 hover:text-[#FF5F9D] transition-colors duration-300"
              >
                {menu.name}
              </Link>
            ))}
          </nav>

          {/* Logo Center */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/logo-animate.png"
                alt="Langsea"
                width={140}
                height={40}
                priority
                className="object-contain"
              />
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex flex-1 justify-end items-center gap-4">
            <Link
              href="/shop"
              className="hidden lg:flex items-center gap-2 bg-[#FF5F9D] hover:bg-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            >
              <ShoppingCart size={16} />
              Shop
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-slate-700"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="px-5 pb-6 pt-2 bg-white border-t border-pink-100">
          <div className="flex flex-col gap-5">
            {menus.map((menu) => (
              <Link
                key={menu.name}
                href={menu.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-slate-700 hover:text-[#FF5F9D] transition-colors"
              >
                {menu.name}
              </Link>
            ))}

            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 bg-[#FF5F9D] hover:bg-pink-500 text-white px-5 py-3 rounded-full text-sm font-medium transition-all duration-300"
            >
              <ShoppingCart size={16} />
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
