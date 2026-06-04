"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Receipt,
  Info,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

type Item = {
  product_name: string;
  qty: number;
  price: number;
  image?: string;

  product?: {
    image?: string;
    slug?: string;
  };
};

type Order = {
  order_code: string;
  status: string;
  total_price: number;

  // 👤 PENERIMA
  recipient_name: string;
  phone: string;

  // 📍 ALAMAT
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  postal_code: string;

  courier?: string;
  tracking_number: string;

  // 💳 PAYMENT
  payment_status: string;

  // 📦 ITEMS
  items: Item[];

  // 💰 EXTRA
  shipping_cost: number;
  discount?: number;

  created_at: string;
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const shippingCost = Number(order?.shipping_cost ?? 0);
  const discount = order?.discount || 0;
  const [copied, setCopied] = useState(false);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    Accept: "application/json",
  });

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "Menunggu Pembayaran";

      case "PROCESSING":
        return "Pesanan Sedang Diproses";

      case "SHIPPED":
        return "Pesanan Sedang Dikirim";

      case "DELIVERED":
        return "Pesanan Telah Diterima";

      case "CANCELED":
      case "CANCELLED":
        return "Pesanan Dibatalkan";

      default:
        return status;
    }
  };

  const handleCopy = async (trackingNumber: string) => {
    try {
      await navigator.clipboard.writeText(trackingNumber);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/${id}`, {
          headers: getHeaders(),
        });
        if (!res.ok) throw new Error("Failed fetch");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF5F8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#FF5F9D]"></div>
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Info className="mx-auto mb-4 text-[#FF5F9D] opacity-30" size={64} />
          <p className="text-lg font-medium">Order tidak ditemukan</p>
        </div>
      </div>
    );

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  return (
    <div className="min-h-screen bg-[#FFFBFD] pb-20 font-sans">
      {/* Top Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-[#FF5F9D] rounded-b-[3rem] opacity-10 -z-10" />

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-white shadow-sm border border-pink-50 text-[#FF5F9D] hover:bg-[#FF5F9D] hover:text-white transition-all"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="text-right">
            <h1 className="text-xl  text-gray-800">Detail Pesanan</h1>
            <p className="text-[10px] text-[#FF5F9D] font-bold tracking-widest uppercase opacity-70">
              ID: {order.order_code}
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50 grid grid-cols-2 gap-4 relative overflow-hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={14} className="text-[#FF5F9D]" />
              <span className="text-xs font-semibold ">Status</span>
            </div>
            <p className="text-sm text-gray-800">
              {getStatusLabel(order.status)}
            </p>
          </div>
          <div className="space-y-1 border-l pl-4 border-pink-50">
            <div className="flex items-center gap-2 text-gray-400">
              <CreditCard size={14} className="text-[#FF5F9D]" />
              <span className="text-xs font-semibold ">Pembayaran</span>
            </div>
            <p className="text-lg text-emerald-500 leading-tight">
              {order.payment_status}
            </p>
          </div>
        </div>

        {order.status === "SHIPPED" && order.tracking_number && (
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50 ">
            <p className=" mb-2 font-bold text-gray-800" >
              Informasi Pengiriman
            </p>

            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm">Ekspedisi</span>
              <span className="font-medium">{order.courier}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">No. Resi</span>

              <div className="flex items-center gap-2">
                <span className="font-semibold">{order.tracking_number}</span>

                <button
                  onClick={() => handleCopy(order.tracking_number)}
                  className={`text-xs px-2 py-1 rounded-lg transition-all ${
                    copied
                      ? "bg-green-100 text-green-600"
                      : "bg-pink-50 text-[#FF5F9D]"
                  }`}
                >
                  {copied ? "✓ Tersalin" : "Salin"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Item List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Package size={18} className="text-[#FF5F9D]" />
              </div>
              <h2 className="font-bold text-gray-800">Item Pesanan</h2>
            </div>
            <span className="text-xs font-bold text-[#FF5F9D] bg-pink-50 px-3 py-1 rounded-full">
              {order.items.length} Produk
            </span>
          </div>

          <div className="space-y-3">
            {order.items.map((item, i) => {
              const imageUrl = item.image || item.product?.image;

              return (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-pink-50 shadow-sm"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-pink-50 bg-[#FFF5F8] flex-shrink-0 cursor-pointer hover:opacity-80 transition">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[10px] font-bold text-pink-200">
                        NO IMG
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className=" text-gray-800">{item.product_name}</h3>
                    <p className="text-xs text-[#FF5F9D]">
                      {item.qty} × {formatRupiah(item.price)}
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {formatRupiah(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Shipping */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <div className="p-2 bg-pink-100 rounded-lg">
              <MapPin size={18} className="text-[#FF5F9D]" />
            </div>
            <h2 className="font-bold text-gray-800">Tujuan Pengiriman</h2>
          </div>

          <div className="bg-[#FFF5F8] p-5 rounded-3xl border border-dashed border-[#FF5F9D]/30 relative overflow-hidden">
            <div className="absolute top-[-10px] right-[-10px] opacity-5">
              <MapPin size={80} className="text-[#FF5F9D]" />
            </div>

            <div className="relative z-10 space-y-1">
              {/* 👤 Nama + Phone */}
              <p className="font-semibold text-gray-800">
                {order.recipient_name} ({order.phone})
              </p>

              {/* 📍 Alamat jalan */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.shipping_address}
              </p>

              {/* 🌆 Kota + Provinsi */}
              <p className="text-sm text-gray-600">
                {order.shipping_city}, {order.shipping_province}
              </p>

              {/* 📮 Kode Pos */}
              <p className="text-sm text-gray-600">
                {order.postal_code || "-"}
              </p>
            </div>
          </div>
        </section>
        {/* Summary Billing */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-pink-100/50 border border-pink-50 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5F9D] opacity-[0.03] rounded-full -mr-16 -mt-16" />

          <div className="flex items-center gap-2 mb-2">
            <Receipt size={18} className="text-[#FF5F9D]" />
            <h2 className="font-bold text-gray-800">Ringkasan Biaya</h2>
          </div>

          <div className="space-y-3 text-sm font-medium">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal Produk</span>
              <span className="text-gray-800">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Ongkos Kirim</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                  shippingCost === 0
                    ? "text-emerald-500 bg-emerald-50"
                    : "text-[#FF5F9D] bg-pink-50"
                }`}
              >
                {shippingCost === 0 ? "Gratis" : formatRupiah(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Diskon</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                  discount > 0
                    ? "text-emerald-500 bg-emerald-50"
                    : "text-gray-400 bg-gray-100"
                }`}
              >
                {discount > 0 ? `- ${formatRupiah(discount)}` : "Tidak ada"}
              </span>
            </div>

            <div className="border-t border-pink-50 pt-4 flex justify-between items-center">
              <span className="text-base font-bold text-gray-800">
                Total Pembayaran
              </span>
              <span className="text-2xl text-[#FF5F9D]">
                {formatRupiah(order.total_price)}
              </span>
            </div>
          </div>

          {order.status === "PENDING" && (
            <div className="bg-amber-50 p-4 rounded-2xl text-center mt-4">
              <span className="text-amber-600 text-xs">
                Menunggu Pembayaran
              </span>
            </div>
          )}

          {order.status === "PROCESSING" && (
            <div className="bg-blue-50 p-4 rounded-2xl text-center mt-4">
              <span className="text-blue-600 text-xs">
                Pesanan Sedang Diproses
              </span>
            </div>
          )}

          {order.status === "SHIPPED" && order.tracking_number && (
            <Link
              href={`/shop/tracking?resi=${order.tracking_number}&courier=${order.courier}`}
              className="bg-[#FF5F9D] p-4 rounded-2xl flex items-center justify-center mt-4"
            >
              <span className="text-white text-xs">Lacak Paket</span>
            </Link>
          )}

          {order.status === "DELIVERED" && (
            <div className="bg-emerald-50 p-4 rounded-2xl text-center mt-4">
              <span className="text-emerald-600 text-xs">
                Pesanan Telah Diterima
              </span>
            </div>
          )}

          {order.status === "CANCELED" && (
            <div className="bg-rose-50 p-4 rounded-2xl text-center mt-4">
              <span className="text-rose-600 text-xs">Pesanan Dibatalkan</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
