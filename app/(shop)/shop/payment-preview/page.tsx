"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Swal from "sweetalert2";

const API = process.env.NEXT_PUBLIC_API_URL;

function PaymentPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order_code");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const subtotal =
    order?.items?.reduce((t: number, i: any) => {
      const price = Number(i.price) || 0;
      const qty = Number(i.qty) || 0;

      return t + (Number(i.subtotal) || price * qty);
    }, 0) || 0;

  const shippingCost = order?.shipping_cost || 0;
  const discount = order?.discount || 0;
  const [paying, setPaying] = useState(false);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderCode) return;

      try {
        const res = await fetch(`${API}/public/orders/code/${orderCode}`, {
          headers: {
            Accept: "application/json",
          },
        });

        const data = await res.json();

        setOrder(data.data);
      } catch (err) {
        console.error("ERROR FETCH ORDER:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderCode]);

  const handlePay = async () => {
    // 🔥 prevent spam click
    if (paying) return;

    try {
      setPaying(true);

      const token = localStorage.getItem("access_token");

      /*
    |--------------------------------------------------------------------------
    | CREATE INVOICE
    |--------------------------------------------------------------------------
    */
      const res = await fetch(`${API}/create-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_code: orderCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat invoice");
      }

      /*
    |--------------------------------------------------------------------------
    | MOCK MODE (DEVELOPMENT)
    |--------------------------------------------------------------------------
    */
      if (data.is_mock) {
        const successRes = await fetch(`${API}/payment-success`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_code: orderCode,
          }),
        });

        const successData = await successRes.json();

        if (!successRes.ok) {
          throw new Error(successData.message || "Payment gagal");
        }

        await Swal.fire({
          icon: "success",
          title: "Pembayaran Berhasil 🎉",
          text: "Pesanan kamu sedang diproses",
          confirmButtonColor: "#FF5F9D",
          timer: 2000,
          showConfirmButton: false,
        });

        window.location.href = `/shop/payment-success?order_code=${orderCode}`;

        return;
      }

      /*
    |--------------------------------------------------------------------------
    | PRODUCTION MODE
    |--------------------------------------------------------------------------
    */
      window.location.href = data.invoice_url;
    } catch (err: any) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
        confirmButtonColor: "#FF5F9D",
      });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 text-center space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Detail Belanja</h1>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-gray-500">
          Order ID
        </p>
        <p className="font-mono font-bold text-[#FF5F9D] text-lg">
          {orderCode}
        </p>
      </div>

      {/* ========================= */}
      {/* 🔥 ORDER ITEMS */}
      {/* ========================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5 text-left space-y-4 max-w-md mx-auto">
        <h2 className="font-bold text-sm text-gray-700 border-b border-gray-100 pb-2">
          Produk Dibeli
        </h2>

        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF5F9D]"></div>
          </div>
        )}

        <div className="space-y-4">
          {order?.items?.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {item.product_name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.qty} x {formatRupiah(item.price)}
                </p>
              </div>
              <p className="text-sm font-bold text-gray-700">
                {formatRupiah(item.qty * item.price)}
              </p>
            </div>
          ))}
        </div>

        {/* ========================= */}
        {/* 🔥 TOTAL SECTION */}
        {/* ========================= */}
        {/* 🔥 TOTAL BREAKDOWN */}
        {order && (
          <div className="space-y-3 pt-4 border-t border-dashed border-gray-200 mt-4 text-sm">
            {/* Subtotal */}
            <div className="flex justify-between text-gray-500">
              <span>Subtotal Produk</span>
              <span className="text-gray-900 font-medium">
                {formatRupiah(subtotal)}
              </span>
            </div>

            {/* Ongkir */}
            <div className="flex justify-between text-gray-500">
              <span>Ongkos Kirim</span>
              <span
                className={
                  shippingCost > 0
                    ? "text-gray-900 font-medium"
                    : "text-green-500 font-medium"
                }
              >
                {shippingCost > 0 ? formatRupiah(shippingCost) : "Gratis"}
              </span>
            </div>

            {/* Diskon */}
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon</span>
                <span>- {formatRupiah(discount)}</span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
              <span className="text-base font-bold text-gray-900">
                Total Bayar
              </span>
              <span className="text-lg font-bold text-[#FF5F9D]">
                {formatRupiah(order.total_price)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* ACTION */}
      {/* ========================= */}
      <div className="max-w-md mx-auto pt-4">
        <button
          onClick={handlePay}
          disabled={paying}
          className={`
    w-full py-4 rounded-xl
    text-white font-bold
    transition-all
    active:scale-95

    ${
      paying
        ? "bg-pink-300 cursor-not-allowed"
        : "bg-[#FF5F9D] hover:bg-[#e6558e] shadow-lg shadow-pink-200"
    }
  `}
        >
          {paying ? (
            <div className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

              <span>Memproses Pembayaran...</span>
            </div>
          ) : (
            "Bayar Sekarang"
          )}
        </button>

        <button
          onClick={() => router.push("/shop/cart")}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 font-medium"
        >
          Kembali ke Keranjang
        </button>
      </div>
    </div>
  );
}

export default function PaymentPreview() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPreviewContent />
    </Suspense>
  );
}
