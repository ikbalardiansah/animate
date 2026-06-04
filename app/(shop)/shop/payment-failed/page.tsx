"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order_code");

  useEffect(() => {
    if (!orderCode) return;

    fetch(`${API}/orders/code/${orderCode}/failed`, {
      method: "POST",
    });
  }, [orderCode]);

  return <div>❌ Pembayaran Gagal</div>;
}

export default function PaymentFailed() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}