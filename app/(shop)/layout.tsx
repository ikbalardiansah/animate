import Navbar from "@/app/(shop)/shop/components/shop-navbar";
import Footer from "@/app/(main)/components/footer";
import WhatsAppFloating from "@/app/(main)/components/whatsapp-floating";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animate By Yunna Mercier",
    description:
    "Local Beauty Brand Skincare lokal viral halal BPOM & terpercaya, hadir untuk kulit sehat dan percaya diri.",
  icons: {
    icon: "/logo-square.jpg",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <WhatsAppFloating />
      <main>{children}</main>

      <Footer />
    </>
  );
}
