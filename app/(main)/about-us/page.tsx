import {
  Eye,
  Target,
  Leaf,
  Microscope,
  Heart,
  CheckCircle,
} from "lucide-react";
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen font-sans antialiased text-[#333333]">
      
      {/* =========================================================================
          1. HERO SECTION (Mobile-First)
          ========================================================================= */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/COVER-8.jpg"
            fill
            priority
            className="object-cover opacity-50"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FF5F9D]/50 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-md">
            Tentang Kami
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-xl font-medium leading-relaxed">
            Mendefinisikan Ulang Kecantikan dengan Sentuhan Alami & Sains Modern.
          </p>
        </div>
      </section>

      {/* =========================================================================
          2. BRAND INTRODUCTION & CO-FOUNDER GREETING (Pink Section)
          ========================================================================= */}
      <section className="bg-[#FFC0CB]/60 px-4 py-16 md:py-24 text-slate-800">
        <div className="max-w-6xl mx-auto">
          
          {/* Sub-Section A: Brand Intro */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            {/* Judul Overlap Efek */}
            <div className="relative mb-6 flex flex-col items-center justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-wide opacity-95 leading-tight drop-shadow-sm">
                Bring Your Beauty To Life
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-[#FF5F9D] mt-[-8px] md:mt-[-15px] tracking-wide drop-shadow-sm">
                Animate By Yunna Mercier
              </h3>
            </div>

            {/* Deskripsi Brand */}
            <div className="space-y-4 text-xs sm:text-sm md:text-base leading-relaxed text-slate-700 font-medium">
              <p>
                Sejak 2022, Animate hadir sebagai <span className="font-bold text-[#FF5F9D]">beauty brand</span> yang menggabungkan kreativitas dan teknologi terkini dalam setiap produk face & body care. Didesain untuk memenuhi setiap kebutuhan kulit, Animate mendampingi perjalanan perawatan kulit semua insan.
              </p>
              <p>
                Dengan mengedepankan komitmen, kualitas serta inovasi, Animate telah menjadi pilihan favorit untuk merawat kulit sehat dengan rasa aman dan nyaman untuk meraih kecantikan alami.
              </p>
              <p className="pt-4 italic text-slate-900 font-semibold">
                <span className="text-[#FF5F9D] font-black not-italic">Transformasi Kulitmu</span> Bersama Animate, Wujudkan Cantik Versi Terbaikmu!
              </p>
            </div>
          </div>

          {/* Sub-Section B: Greetings Co-Founder */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 max-w-5xl mx-auto">
            {/* Foto Co-Founder */}
            <div className="w-full max-w-[280px] sm:max-w-[320px] md:w-[350px] shrink-0">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image 
                  src="/images/a.webp" 
                  alt="Yunna Mercier - Co-Founder Animate"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Pesan Co-Founder */}
            <div className="w-full flex flex-col text-center md:text-left">
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FF5F9D] tracking-wide uppercase leading-none">
                Greetings From
              </h4>
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FF5F9D] tracking-wide uppercase leading-tight mb-2">
                Our Co-Founder
              </h4>
              
              <span className="text-xs md:text-sm font-bold text-slate-600 block mb-6 italic uppercase tracking-wider">
                Her Perspective
              </span>

              <div className="space-y-4 text-xs sm:text-sm md:text-base leading-relaxed text-slate-700 font-medium">
                <p>
                  Setiap orang memiliki <span className="italic font-bold text-[#FF5F9D]">beauty goals</span> yang berbeda seiring berjalannya waktu.
                </p>
                <p>
                  Setiap perjalanan menuju kulit sehat itu unik. Animate percaya bahwa setiap individu berhak menemukan versi terbaik dirinya. Dengan inovasi dan perhatian pada setiap detail, kami menciptakan produk yang mendukung journey-mu, karena kecantikan sejati berasal dari dalam dan luar. Temukan produk yang cocok untukmu dan nikmati pengalaman baru dalam merawat diri bersama Animate.
                </p>
                <p className="pt-2 font-bold text-[#FF5F9D] text-sm sm:text-base">
                  Coba dan temukan cantikmu di produk Animate!
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. BRAND STORY SECTION (Who We Are)
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Kolom Visual (Pindah ke bawah saat mobile jika diperlukan, atau tetap di atas) */}
          <div className="relative w-full max-w-lg lg:w-1/2 group px-4 mb-6 lg:mb-0">
            <div className="relative rounded-3xl md:rounded-[3rem] overflow-hidden shadow-xl transition-transform group-hover:scale-[1.01] duration-500">
              <img
                src="/images/ADU-VIRAL-1-M.jpg"
                alt="Brand Story"
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
              />
            </div>
            {/* Badge Tahun Inovasi */}
            <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-[#FF5F9D] p-5 sm:p-7 rounded-2xl md:rounded-[2rem] text-white shadow-xl text-center">
              <span className="block text-2xl sm:text-4xl font-black">4+</span>
              <p className="text-[9px] sm:text-xs font-bold uppercase tracking-widest opacity-90 whitespace-nowrap">
                Tahun Inovasi
              </p>
            </div>
          </div>

          {/* Kolom Konten Teks */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left mt-6 lg:mt-0">
            <span className="inline-block px-4 py-1.5 bg-[#FF5F9D]/10 text-[#FF5F9D] rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
              Who We Are
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 leading-snug">
              Berawal dari Keinginan untuk Memberikan yang Terbaik
            </h2>
            <div className="space-y-4 text-sm md:text-base text-gray-500 font-medium leading-relaxed">
              <p>
                Didirikan pada tahun 2016, brand kami lahir dari filosofi bahwa kecantikan sejati berasal dari kulit yang sehat. Kami percaya bahwa setiap orang berhak mendapatkan perawatan terbaik tanpa kompromi.
              </p>
              <p>
                Kami menggabungkan bahan-bahan alami premium dengan formulasi dermatologi tercanggih untuk menciptakan solusi yang nyata bagi kulit Indonesia.
              </p>
            </div>

            {/* Visi & Misi Box Stack */}
            <div className="grid gap-4 pt-4 max-w-xl mx-auto lg:mx-0 text-left">
              {/* Visi */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-[#FF5F9D]/5 border border-[#FF5F9D]/10">
                <div className="bg-[#FF5F9D] p-3 rounded-xl text-white shrink-0 shadow-md">
                  <Eye size={22} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-slate-800 text-base mb-1">Visi Kami</h4>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Menjadi inspirasi kepercayaan diri bagi setiap wanita melalui kulit yang sehat.
                  </p>
                </div>
              </div>
              {/* Misi */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-[#FF5F9D]/5 border border-[#FF5F9D]/10">
                <div className="bg-[#FF5F9D] p-3 rounded-xl text-white shrink-0 shadow-md">
                  <Target size={22} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-slate-800 text-base mb-1">Misi Kami</h4>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Menghadirkan produk berkualitas tinggi yang aman, halal, dan terjangkau.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. CORE VALUES SECTION
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#FF5F9D]/5 border-t border-[#FF5F9D]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[#FF5F9D] text-xs font-black tracking-[0.3em] uppercase">
              Core Values
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-800 mt-2">
              Nilai Utama Kami
            </h2>
          </div>

          {/* Grid responsive - 1 Kolom (Mobile) -> 2 Kolom (Tablet) -> 4 Kolom (Desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: <Leaf size={26} />,
                title: "Bahan Alami",
                desc: "Hanya menggunakan ekstrak botani murni tanpa bahan kimia berbahaya.",
              },
              {
                icon: <Microscope size={26} />,
                title: "Teruji Klinis",
                desc: "Setiap produk melewati uji lab yang ketat untuk menjamin efektivitas.",
              },
              {
                icon: <Heart size={26} />,
                title: "Cruelty Free",
                desc: "Kami sangat mencintai hewan dan tidak melakukan tes pada mereka.",
              },
              {
                icon: <CheckCircle size={26} />,
                title: "BPOM & Halal",
                desc: "Seluruh rangkaian produk kami sudah terdaftar resmi dan terjamin aman.",
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-white p-8 md:p-10 rounded-2xl md:rounded-[2.5rem] text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-[#FF5F9D]/10"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FF5F9D]/10 text-[#FF5F9D] rounded-xl md:rounded-[1.25rem] mb-5 shadow-inner">
                  {value.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}