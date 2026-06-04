// app/page.tsx
import HeroSlider from "./components/slider";
import BlogSection from "./components/blog";


// Jika ada komponen lain nanti (seperti CategoryList, ProductGrid, dll)

export default function HomePage() {
  return (
    <div className="slider">
  
      {/* Hero Section */}
      <HeroSlider />

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-6">
        {/* <ProductGrid /> */}
    
       
      
        <BlogSection />
        {/* Kamu bisa buat komponen ProductCard di sini nanti */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Loop data produk */}
        </div>
      </section>

      {/* Footer bisa ditaruh di layout.tsx atau di sini */}
    </div>
  );
}
