"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Package, Truck, CreditCard, MapPin } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Order {
  order_code: string;
  recipient_name: string;
  phone: string;
  email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  postal_code: string;

  payment_status: string;
  status: string;
  shipping_cost: number;
  discount: number;
  courier: string;
  tracking_number?: string;
  total_price: number;
  items: any[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderCode = params.orderCode as string;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  const [copied, setCopied] = useState(false);

  const getStatusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Menunggu Pembayaran";

      case "PROCESSING":
        return "Sedang Diproses";

      case "SHIPPED":
        return "Sedang Dikirim";

      case "DELIVERED":
        return "Pesanan Selesai";

      case "CANCELED":
        return "Pesanan Dibatalkan";

      default:
        return status;
    }
  };

  const handleCopy = async () => {
    if (!order?.tracking_number) return;

    await navigator.clipboard.writeText(order.tracking_number);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API}/public/orders/code/${orderCode}`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        if (res.ok) setOrder(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderCode]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-6 w-6 border-2 border-[#FF5F9D]/20 border-t-[#FF5F9D] rounded-full animate-spin" />
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-gray-500 mb-4">Pesanan tidak ditemukan</p>
          <button
            onClick={() => router.push("/shop")}
            className="text-[#FF5F9D] text-sm"
          >
            Kembali Belanja
          </button>
        </div>
      </div>
    );

  const subtotal = order.total_price - order.shipping_cost + order.discount;

  return (
    <div className="min-h-screen bg-[#FCFCFC] pb-20">
      {/* Sticky Simple Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeft size={22} className="text-gray-600" />
        </button>
        <h1 className="text-base font-medium text-gray-800">Detail Pesanan</h1>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Status Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">
                Kode Pesanan
              </p>
              <p className="text-sm font-medium text-gray-700">
                {order.order_code}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FF5F9D]/10 text-[#FF5F9D] text-[11px] font-medium">
              {getStatusLabel(order.status)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
            <CreditCard size={14} className="text-gray-400" />
            <span>
              Pembayaran:{" "}
              <span className="text-gray-700">{order.payment_status}</span>
            </span>
          </div>
        </div>

        {/* Shipping Section */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-[#FF5F9D]">
            <MapPin size={16} />
            <h2 className="text-sm font-medium text-gray-800">
              Alamat Pengiriman
            </h2>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-700">{order.recipient_name}</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              {order.phone} <br />
              {order.shipping_address}, {order.shipping_city},{" "}
              {order.postal_code}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Truck size={14} />
              <span className="uppercase tracking-tight">{order.courier}</span>
            </div>
          </div>

          {order.status === "SHIPPED" && order.tracking_number && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">
                Nomor Resi
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  {order.tracking_number}
                </span>

                <button
                  onClick={handleCopy}
                  className={`text-xs px-3 py-1 rounded-lg transition-all ${
                    copied
                      ? "bg-green-100 text-green-600"
                      : "bg-pink-50 text-[#FF5F9D]"
                  }`}
                >
                  {copied ? "✓ Tersalin" : "Salin"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-[#FF5F9D]">
            <Package size={16} />
            <h2 className="text-sm font-medium text-gray-800">Daftar Produk</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="py-4 first:pt-0 last:pb-0 flex gap-4"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate mb-1">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.qty} x Rp {Number(item.price).toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    Rp {Number(item.subtotal).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            Ringkasan Pembayaran
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-700">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ongkos Kirim</span>
              <span className="text-gray-700">
                Rp {Number(order.shipping_cost).toLocaleString("id-ID")}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Diskon</span>
                <span>
                  -Rp {Number(order.discount).toLocaleString("id-ID")}
                </span>
              </div>
            )}
            <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-800">
                Total Harga
              </span>
              <span className="text-lg font-semibold text-[#FF5F9D]">
                Rp {Number(order.total_price).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
