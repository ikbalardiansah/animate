import Navbar from "./components/navbar";
import Footer from "./components/footer";

export const metadata = {
  title: "Animate By Yunna Mercier",
  icons: {
    icon: "/logo-bulet.jpg",
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}