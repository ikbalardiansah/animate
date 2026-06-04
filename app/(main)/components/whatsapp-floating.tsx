"use client";

import Link from "next/link";
import Image from "next/image";

export default function WhatsAppFloating() {
  const phoneNumber = "+6288294153403";
  const message = "Halo admin, saya ingin bertanya";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message
        )}`}
        target="_blank"
        className="transition-transform duration-300 hover:scale-110"
      >
        <Image
          src="/images/whatsapp.png"
          alt="WhatsApp"
          width={65}
          height={65}
          className="drop-shadow-2xl"
        />
      </Link>
    </div>
  );
}