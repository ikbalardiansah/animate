import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    id: "serums-essences-601619",
    name: "Skincare",
    src: "/images/pic-1.jpeg",
  },
  {
    id: "lipstick-lip-gloss-601534",
    name: "Lippies",
    src: "/images/pic-2.jpeg",
  },
  {
    id: "body-wash-soap-601493",
    name: "Bodycare",
    src: "/images/pic-3.jpeg",
  },
  {
    id: "skin-care-kits-601611",
    name: "Bundling",
    src: "/images/pic-4.jpeg",
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl  text-gray-900 mb-4 tracking-tight">
            Hidupkan <span className="text-[#FF5F9D]">Cantikmu</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Temukan rangkaian produk terbaik yang dirancang khusus untuk
            kebutuhan kulit dan kecantikanmu. Mulai dari perawatan wajah hingga
            paket bundling hemat.
          </p>
          <div className="w-20 h-1.5 bg-[#FF5F9D] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Grid Wrapper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/product?category=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image with Next.js Optimization */}
              <Image
                src={cat.src}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay - Menggunakan Warna #FF5F9D */}
              <div className="absolute inset-0 bg-[#FF5F9D]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10"></div>

              {/* Default Label (Bottom Label) */}
              <div className="absolute bottom-4 left-0 right-0 text-center z-20 transition-all duration-300 group-hover:opacity-0"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
