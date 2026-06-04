"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Calendar,
  ChevronRight,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
} from "lucide-react";

type Order = {
  id: number;
  order_code: string;
  status: string;
  total_price: number;
  created_at: string;
  tracking_number?: string;
};

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah pesanan per halaman

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    Accept: "application/json",
  });

  useEffect(() => {
    fetch(`${API_URL}/orders`, {
      headers: getHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        const ordersData = data?.data ?? data;
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  // --- LOGIC PAGINATION ---
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusDetails = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return {
          color: "bg-amber-50 text-amber-600 border-amber-100",
          icon: <Clock size={14} />,
          label: "Menunggu Pembayaran",
        };

      case "PROCESSING":
        return {
          color: "bg-blue-50 text-blue-600 border-blue-100",
          icon: <Package size={14} />,
          label: "Diproses",
        };

      case "SHIPPED":
        return {
          color: "bg-purple-50 text-purple-600 border-purple-100",
          icon: <Truck size={14} />,
          label: "Dikirim",
        };

      case "DELIVERED":
        return {
          color: "bg-emerald-50 text-emerald-600 border-emerald-100",
          icon: <CheckCircle size={14} />,
          label: "Diterima",
        };

      case "CANCELED":
      case "CANCELLED":
        return {
          color: "bg-rose-50 text-rose-600 border-rose-100",
          icon: <XCircle size={14} />,
          label: "Dibatalkan",
        };

      default:
        return {
          color: "bg-gray-50 text-gray-500 border-gray-100",
          icon: <Package size={14} />,
          label: status,
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen bg-white">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl text-[#FF6F9D] tracking-tight mb-2">
          Pesanan Saya
        </h1>
        <p className="text-gray-400 font-medium">
          Pantau status pengiriman kecantikanmu di sini.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#FF5F9D]"></div>
          <p className="text-gray-400 animate-pulse font-medium">
            Memuat pesanan...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShoppingBag className="text-pink-200" size={32} />
          </div>
          <p className="text-gray-400 font-bold mb-4">
            Belum ada transaksi nih
          </p>
          <Link
            href="/shop/product"
            className="inline-block bg-[#FF5F9D] text-white px-8 py-3 rounded-2xl shadow-lg shadow-pink-100 hover:bg-[#ff468b] transition-all"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-5">
            {currentOrders.map((order) => {
              const status = getStatusDetails(order.status);
              return (
                <Link
                  key={order.id}
                  href={`/shop/orders/${order.order_code}`}
                  className="group relative bg-white border border-gray-100 p-6 rounded-[2.5rem] transition-all hover:border-pink-200 hover:shadow-xl hover:shadow-pink-50/50 active:scale-[0.98]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className="hidden sm:flex bg-pink-50 w-14 h-14 rounded-2xl items-center justify-center text-[#FF5F9D] group-hover:bg-[#FF5F9D] group-hover:text-white transition-colors">
                        <Package size={24} />
                      </div>

                      <div className="space-y-1">
                        <p className="text-[#444] text-lg tracking-tight group-hover:text-[#FF5F9D] transition-colors">
                          {order.order_code}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} className="text-pink-300" />
                            {new Date(order.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-gray-300 tracking-widest mb-1 uppercase font-bold">
                          Total Belanja
                        </p>
                        <p className="text-[#FF5F9D] text-lg font-bold">
                          {formatRupiah(order?.total_price || 0)}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full border font-bold text-xs ${status.color}`}
                      >
                        {status.icon}
                        {status.label.toUpperCase()}
                      </div>

                      <div className="hidden md:block text-gray-300 group-hover:text-[#FF5F9D] group-hover:translate-x-1 transition-all">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* --- PAGINATION CONTROLS --- */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-12 gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-pink-50 hover:text-[#FF5F9D] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                        currentPage === pageNum
                          ? "bg-[#FF5F9D] text-white shadow-lg shadow-pink-100"
                          : "bg-white border border-gray-100 text-gray-400 hover:border-pink-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-pink-50 hover:text-[#FF5F9D] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
