"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import WishlistButton from "@/app/(main)/components/wishlist-button";
import { useCartStore } from "../../store/cart";
import { ChevronLeft, Minus, Plus, ShoppingBag, Check, ShoppingCart } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "NEXT_PUBLIC_API_URL";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  // STATES
  const [product, setProduct] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // VARIANT DERIVATION
  const [variants, setVariants] = useState<any[]>([]);
  const currentProduct = variants?.[selectedVariantIndex];

  const currentVar = currentProduct;

  const price = Number(currentVar?.retail_price ?? 0);
  const currency = "IDR";
  const stock = Number(currentVar?.quantity ?? 0);
  const isOutOfStock = !stock || stock <= 0;

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (!product || !currentVar) return;

    const cartItem = {
      id: currentVar.id,
      variation_id: currentVar.id,

      product_id: product.id,

      seller_sku: currentVar.seller_sku ?? currentVar.sku_id,

      parcel_weight: Number(product.parcel_weight ?? 0),

      name: product.name,
      image: selectedImg,
      price: Number(price),
      quantity: quantity,
    };

    addToCart(cartItem);
  };

  // =========================
  // FETCH PRODUCT DETAIL
  // =========================
  useEffect(() => {
    if (!slug) return;

    const fetchDetail = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${API_BASE_URL}/web-products/${slug}`);

        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();

        setProduct(data.data);

        setVariants(data.data?.variants || []);

        const firstImg =
          data?.data?.variants?.[0]?.variant_image ||
          data?.data?.images?.[0]?.image_url ||
          "/images/no-image.png";

        setSelectedImg(firstImg);
        setSelectedVariantIndex(0);
        setQuantity(1);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  // =========================
  // FETCH RECOMMENDATION
  // =========================
  useEffect(() => {
    if (!product?.slug) return;

    const fetchRecs = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/web-products/${product.slug}/recommendations`,
        );

        if (!res.ok) return;

        const json = await res.json();

        setRecommendations(json.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecs();
  }, [product?.slug]);

  // =========================
  // VARIANT CHANGE
  // =========================
  const handleVariantChange = (index: number) => {
    setSelectedVariantIndex(index);

    const varImg = variants?.[index]?.variant_image;

    if (varImg) {
      setSelectedImg(varImg);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF5F9D]" />
      </div>
    );
  }

  // =========================
  // NOT FOUND
  // =========================
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-bold text-xl">Produk tidak ditemukan.</p>
        <Link href="/shop/product" className="text-[#FF5F9D] hover:underline">
          Kembali Belanja
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-24 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-10">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 mb-8 hover:text-black transition-colors font-medium text-sm tracking-wide"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
          KEMBALI
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* LEFT COLUMN: IMAGES */}
          <div className="space-y-4 md:sticky md:top-6">
            {/* MAIN IMAGE CONTAINER */}
            <div className="aspect-square rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 shadow-sm">
              <img
                src={selectedImg}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* THUMBNAILS LIST */}
            {product?.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img.image_url)}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden border bg-white transition-all duration-200 flex-shrink-0 p-1 ${
                      selectedImg === img.image_url
                        ? "border-[#FF5F9D] ring-2 ring-[#FF5F9D]/10 scale-[0.98]"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover rounded-lg md:rounded-xl"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: DETAIL INFO */}
          <div className="flex flex-col space-y-6">
            <div>
              {/* PRODUCT TITLE */}
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                {/* SKU */}
                <p className="text-gray-400 text-xs font-medium tracking-wide">
                  SKU:{" "}
                  <span className="text-gray-600 font-semibold">
                    {currentVar?.seller_sku || "-"}
                  </span>
                </p>
                <span className="text-gray-200 text-xs">|</span>
                {/* STOCK STATUS */}
                <span
                  className={`font-semibold text-xs tracking-wide uppercase px-2.5 py-0.5 rounded-md ${
                    stock > 0
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
                      : "text-rose-600 bg-rose-50 border border-rose-100"
                  }`}
                >
                  {stock > 0 ? "Stok Tersedia" : "Stok Habis"}
                </span>
              </div>
            </div>

            {/* PRICE AREA */}
            <div className="border-y border-gray-100 py-5 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl font-bold tracking-tight text-[#FF5F9D]">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: currency || "IDR",
                  minimumFractionDigits: 0,
                }).format(price)}
              </span>
              {/* Optional: Tambahkan harga coret di detail jika tipe diskon aktif */}
              {price > 0 && (
                <span className="text-sm md:text-base text-gray-400 line-through font-medium">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: currency || "IDR",
                    minimumFractionDigits: 0,
                  }).format(price * 2)}
                </span>
              )}
            </div>

            <div className="pt-6 border-t border-gray-100 mt-auto">
              <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
                {/* QTY SELECTOR */}
                <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm h-14">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 transition-colors active:scale-95"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((prev) => Math.min(stock || 0, prev + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 transition-colors active:scale-95"
                    disabled={isOutOfStock}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* ADD TO CART BUTTON */}
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 flex-1 bg-[#FF5F9D] hover:bg-pink-600 text-white h-14 rounded-xl font-semibold transition-all"
                >
                  <ShoppingCart size={20} />
                  <span>Keranjang</span>
                </button>

                {/* WISHLIST BUTTON */}
                <WishlistButton
                  product={product}
                  className="relative flex items-center justify-center w-14 h-14 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50/20 transition-all active:scale-90 shadow-sm"
                />
              </div>
            </div>

            {/* VARIANT PICKER */}
            {variants?.length > 1 && (
              <div>
                <h4 className="text-xs font-medium tracking-wide uppercase text-gray-400 mb-3">
                  Pilih Varian
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {variants.map((v: any, i: number) => (
                    <button
                      key={v.id}
                      onClick={() => handleVariantChange(i)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-medium tracking-wide transition-all ${
                        selectedVariantIndex === i
                          ? "border-[#FF5F9D] bg-pink-50/30 text-[#FF5F9D] font-semibold shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {v?.variation_option || "-"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* BUNDLE ITEMS SECTION */}
            {currentVar?.bundleVariations?.length > 0 && (
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-gray-400 flex items-center gap-2 mb-4">
                  <ShoppingBag size={14} className="text-[#FF5F9D]" />
                  Isi Paket Bundle
                </h4>

                <div className="divide-y divide-gray-50 max-h-[240px] overflow-y-auto pr-1">
                  {currentVar.bundleVariations.map((bv: any, i: number) => (
                    <Link
                      key={i}
                      href={`/shop/product/${bv.slug}`}
                      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 group"
                    >
                      <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={bv.images?.[0] || "https://placehold.co/100x100"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          alt={bv.bundleProductName}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate group-hover:text-[#FF5F9D] transition-colors">
                          {bv.bundleProductName}
                        </p>
                        <p className="text-[11px] text-gray-400 font-bold mt-0.5">
                          Jumlah: {bv.quantity}x
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* PRODUCT DESCRIPTION */}
            <div>
              <h4 className="text-xs font-medium tracking-wide uppercase text-gray-400 mb-3">
                Deskripsi Produk
              </h4>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line break-words bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                {product.description?.replace(/\r\n/g, "\n")}
              </div>
            </div>

            {/* ACTION PANEL (QTY & ADD TO CART) */}
          </div>
        </div>

        {/* RECOMMENDATION SECTION */}
        {/* RECOMMENDATION SECTION */}
        {recommendations.length > 0 && (
          <section className="mt-28 border-t border-gray-200 pt-16">
            <div className="flex items-end justify-between mb-10 px-1">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
                  Mungkin Kamu Suka
                </h2>
                <p className="text-gray-400 text-xs font-medium tracking-wide uppercase mt-1">
                  Rekomendasi Produk Pilihan
                </p>
              </div>
              <Link href="/shop/product">
                <button className="text-xs font-bold tracking-wider uppercase text-[#FF5F9D] hover:opacity-70 transition-opacity">
                  Lihat Semua
                </button>
              </Link>
            </div>

            {/* MINIMALIST GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
              {recommendations.map((item) => {
                const img =
                  item.images?.[0]?.image_url ||
                  item.main_image ||
                  "https://placehold.co/400x400";

                const price = Number(item.variants?.[0]?.retail_price) || 0;
                const originalPrice = price * 2;

                // --- LOGIC FAKE RATING & REVIEWS SEED (Random 4.5 - 5.0 & 100 - 999) ---
                // Menggunakan item.id sebagai seed agar nilai tetap konsisten saat re-render
                const fakeRating =
                  4.5 + parseFloat((((item.id * 7) % 6) * 0.1).toFixed(1));
                const fakeReviews = ((item.id * 17) % 900) + 100;
                const fullStars = Math.floor(fakeRating);

                return (
                  <Link
                    key={item.id}
                    href={`/shop/product/${item.slug}`}
                    className="group flex flex-col bg-white rounded-xl overflow-hidden relative"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl mb-3">
                      <img
                        src={img}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />

                      {/* Badge Diskon Minimalist */}
                      {price > 0 && (
                        <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase">
                          50% OFF
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-grow px-1">
                      {/* FAKE RATING & REVIEWS UI */}
                      <div className="flex items-center gap-1 mb-1.5">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < fullStars
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium tracking-tight mt-0.5">
                          {fakeRating.toFixed(1)} ({fakeReviews})
                        </span>
                      </div>

                      {/* PRODUCT TITLE */}
                      <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed min-h-[36px] md:min-h-[40px] group-hover:underline underline-offset-2 decoration-gray-400">
                        {item.name}
                      </h3>

                      {/* PRICE AREA */}
                      <div className="mt-2">
                        {price > 0 ? (
                          <div className="flex flex-wrap items-baseline gap-1.5">
                            <p className="text-sm md:text-base font-semibold text-gray-950">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(price)}
                            </p>
                            <p className="text-[10px] md:text-xs text-gray-400 line-through">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(originalPrice)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-400 text-xs font-medium">
                            Hubungi Admin
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
