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
      <main className="min-h-screen">{children}</main>
    </>
  );
}
