import Navbar from "@/app/(shop)/shop/components/shop-navbar";
import Footer from "@/app/(main)/components/footer";
import WhatsAppFloating from "@/app/(main)/components/whatsapp-floating";

export const metadata = {
  title: "Animate By Yunna Mercier",
  icons: {
    icon: "/logo-bulet.jpg",
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
