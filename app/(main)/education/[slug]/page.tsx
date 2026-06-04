import { notFound } from "next/navigation";
import { Calendar, ChevronLeft, User } from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getPost(slug: string) {
  const res = await fetch(`${API}/posts/${slug}`, { cache: "no-store" });

  if (!res.ok) return null;

  const result = await res.json();

  return result; // ✅ FIX
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return notFound();

  return (
    <article className="min-h-screen bg-white">
      {/* Header / Navigation */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <Link
          href="/eduction"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF5F9D] transition-colors group"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Kembali ke Education
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Meta & Title */}
        <header className="space-y-6 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px]  tracking-[0.2em] text-[#FF5F9D]">
            <span className="px-3 py-1 bg-pink-50 rounded-full">
              Beauty Tips
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <Calendar size={14} />
              {new Date(post.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl  text-gray-900 leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-[#FF5F9D]">
              <User size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-gray-900">
                Admin ANIMATE
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Official Author
              </p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mt-12 relative group">
            <div className="absolute -inset-4 bg-pink-50 rounded-[3rem] scale-95 group-hover:scale-100 transition-transform duration-500 opacity-50 -z-10" />
            <img
              src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.featured_image}`}
              alt={post.title}
              className="w-full aspect-[16/9] object-cover rounded-[2.5rem] shadow-2xl shadow-pink-100 ring-1 ring-gray-100"
            />
          </div>
        )}

        {/* Article Body */}
        <div
          className="mt-16 
            prose prose-lg max-w-none
            prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-img:rounded-3xl prose-img:shadow-lg
            prose-a:text-[#FF5F9D] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900
            prose-blockquote:border-l-4 prose-blockquote:border-[#FF5F9D] prose-blockquote:bg-pink-50/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer Artikel */}
        <footer className="mt-20 pt-10 border-t border-gray-100">
          <div className="bg-gray-50 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-black text-gray-900">
                Bagikan kecantikan ini
              </h4>
              <p className="text-sm text-gray-500 font-medium">
                Bantu temanmu mendapatkan kulit impian!
              </p>
            </div>
            <div className="flex gap-3">
              {/* Tambahkan tombol sosmed di sini jika perlu */}
              <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs hover:shadow-md transition-all active:scale-95">
                Salin Link
              </button>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
