"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useCartStore } from "../store/cart";

const API = process.env.NEXT_PUBLIC_API_URL;

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order_code");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    const markAsPaid = async () => {
      if (!orderCode) return;

      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(`${API}/orders/code/${orderCode}/paid`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal update status");
        }

        clearCart(); // cukup di sini
        setSuccess(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    markAsPaid();
  }, [orderCode, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-md w-full space-y-6">
        {loading ? (
          <>
            <div className="animate-spin h-10 w-10 border-b-2 border-pink-500 mx-auto rounded-full" />
            <p className="text-gray-500">Memproses pembayaran...</p>
          </>
        ) : success ? (
          <>
            <h1 className="text-2xl font-bold text-green-600">
              🎉 Pembayaran Berhasil
            </h1>

            <p className="text-gray-600 text-sm">
              Order kamu berhasil dibayar.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
              <p className="font-semibold">Order Code:</p>
              <p className="text-[#FF5F9D] font-bold">{orderCode}</p>
            </div>

            <button
              onClick={() => router.push("/shop/product")}
              className="w-full py-3 bg-[#FF5F9D] text-white rounded-xl hover:bg-pink-600 transition"
            >
              Belanja Lagi
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-red-500">
              Gagal memproses pembayaran
            </h1>

            <button
              onClick={() => router.push("/shop/")}
              className="w-full py-3 bg-gray-200 rounded-xl"
            >
              Kembali
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
