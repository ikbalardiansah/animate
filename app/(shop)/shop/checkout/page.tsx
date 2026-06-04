"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useCartStore } from "../store/cart";
import {
  MapPin,
  Truck,
  CheckCircle2,
  ArrowLeft,
  Search,
  X,
} from "lucide-react";
import { Poppins } from "next/font/google";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Address {
  id: number;
  recipient_name: string;
  phone: string;
  province: string;
  city: string;
  city_id: string;
  district?: string;
  village?: string;
  postal_code: string;
  full_address: string;
  is_default: boolean;
  shipping_city_id?: string;
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type ShippingOption = {
  code: string;
  service: string;
  description: string;
  etd: string;
  cost: number;
  courier: string;
};

type City = {
  id: number;
  label: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.cart);

  const [isHydrated, setIsHydrated] = useState(false);

  // Logic States
  const [search, setSearch] = useState("");
  const [destinations, setDestinations] = useState<City[]>([]);
  const [destinationId, setDestinationId] = useState<string | null>(null);
  const [selectedCityLabel, setSelectedCityLabel] = useState("");
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [addressDetail, setAddressDetail] = useState("");

  useEffect(() => setIsHydrated(true), []);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shippingCost = selectedShipping?.cost || 0;
  const total = subtotal + shippingCost;

  const API = process.env.NEXT_PUBLIC_API_URL;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastQueryRef = useRef("");

  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<any>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const discount = promoResult?.discount || 0;
  const finalTotal = Math.max(total - discount, 0);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const isLimitHit = destinations.length === 0 && search.length > 3;
  const [isOngkirError, setIsOngkirError] = useState(false);

  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, province] = selectedCityLabel.split(",").map((v) => v.trim());
  const [postalCode, setPostalCode] = useState("");
  const [email, setEmail] = useState("");

  const finalAddress = {
    recipient_name: selectedAddress?.recipient_name || recipientName,
    phone: selectedAddress?.phone || phone,

    full_address: selectedAddress?.full_address || addressDetail,
    postal_code: selectedAddress?.postal_code || postalCode,

    location: selectedAddress
      ? [
          selectedAddress.village,
          selectedAddress.district,
          selectedAddress.city,
          selectedAddress.province,
        ]
          .filter(Boolean)
          .join(", ")
      : selectedCityLabel,
  };

  const searchCity = async (q: string) => {
    if (q.length < 3 || q === lastQueryRef.current) return;

    lastQueryRef.current = q;

    try {
      const res = await fetch(`${API}/shipping/cities?search=${q}`);

      // 🔥 langsung parse JSON (karena backend udah bener)
      const data = await res.json();
      if (!res.ok) {
        console.error("HTTP ERROR:", res.status);
        setDestinations([]);
        return;
      }

      if (!data.success) {
        console.warn("API ERROR:", data.message);
        setDestinations([]);
        return;
      }

      setDestinations(data.data || []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setDestinations([]);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchCity(value);
    }, 500); // delay 500ms
  };

  const fetchOngkir = async (destId: string) => {
    if (items.length === 0) return;

    setIsLoadingShipping(true);

    try {
      const res = await fetch(`${API}/shipping/cost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destId,
          courier: ["jne", "jnt", "sicepat"], // kirim array
          items: items.map((item) => ({
            product_id: item.product_id,
            qty: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message);

      // const normalized = (data.data || [])
      //   .map((item: any) => ({
      //     code: item.code,
      //     service: item.service,
      //     description: item.description,
      //     etd: item.etd,
      //     cost: Number(item.cost) || 0, //
      //     courier: item.code?.toUpperCase(),
      //   }))
      //   .sort((a: ShippingOption, b: ShippingOption) => a.cost - b.cost);

      const blockedKeywords = [
        "jtr",
        "cargo",
        "trucking",
        "gokil",
        "minimum 10kg",
      ];

      const maxShippingCost = subtotal * 0.5;

      const normalized = (data.data || [])
        .map((item: any) => ({
          code: item.code,
          service: item.service,
          description: item.description,
          etd: item.etd,
          cost: Number(item.cost) || 0,
          courier: item.code?.toUpperCase(),
        }))
        .filter((item: ShippingOption) => {
          const text =
            `${item.code} ${item.service} ${item.description}`.toLowerCase();

          const isBlocked = blockedKeywords.some((keyword) =>
            text.includes(keyword),
          );

          const isTooExpensive = item.cost > maxShippingCost;

          return !isBlocked && !isTooExpensive;
        })
        .sort((a: ShippingOption, b: ShippingOption) => a.cost - b.cost);

      setShippingOptions(normalized);

      setShippingOptions(normalized);
      setSelectedShipping(null);
    } catch (e) {
      console.warn("ONGKIR ERROR:", e);
      setShippingOptions([]);
    } finally {
      setIsLoadingShipping(false);
    }
  };

  const applyPromo = async () => {
    if (!promoCode) return;

    setPromoLoading(true);
    setPromoResult(null);

    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${API}/promos/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          code: promoCode,
          total: total,
        }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server error (bukan JSON)");
      }

      if (!res.ok) {
        return Swal.fire({
          icon: "error",
          title: "Promo Tidak Valid",
          text: data?.message || "Kode promo tidak bisa digunakan",
          confirmButtonColor: "#FF5F9D",
        });
      }

      if (!data?.data) {
        throw new Error("Response tidak valid dari server");
      }

      setPromoResult(data.data);

      Swal.fire({
        icon: "success",
        title: "Promo Berhasil 🎉",
        text: `Diskon Rp ${data.data.discount?.toLocaleString("id-ID")}`,
        confirmButtonColor: "#FF5F9D",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);

      const message = err instanceof Error ? err.message : "Terjadi kesalahan";

      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: message,
        confirmButtonColor: "#FF5F9D",
      });
    } finally {
      setPromoLoading(false);
    }
  };

  // ❌ belum login

  const handleCheckout = async () => {
    localStorage.removeItem("guest_city_id");
    localStorage.removeItem("guest_shipping");

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      // ❗ VALIDASI
      if (!selectedShipping) {
        return Swal.fire("Pilih pengiriman dulu");
      }

      if (items.length === 0) {
        return Swal.fire("Keranjang kosong");
      }

      if (loading) return;
      setLoading(true);

      const finalRecipient = recipientName || selectedAddress?.recipient_name;

      const finalPhone = phone || selectedAddress?.phone;

      const finalAddressDetail = addressDetail || selectedAddress?.full_address;

      const finalPostalCode = postalCode || selectedAddress?.postal_code;

      const finalCity = city || selectedAddress?.city;

      const finalProvince = province || selectedAddress?.province;

      if (
        !finalRecipient ||
        !finalPhone ||
        !email ||
        !finalAddressDetail ||
        !finalCity
      ) {
        return Swal.fire("Lengkapi alamat dulu!");
      }

      // 🔥 CREATE ORDER
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              variation_id: item.variation_id,
              qty: item.quantity,
            })),

            // 🔥 FIX UTAMA
            recipient_name:
              recipientName || selectedAddress?.recipient_name || "Guest",

            phone: phone || selectedAddress?.phone || "-",
            email: email,

            shipping_address: finalAddressDetail,
            shipping_city: finalCity,
            shipping_province: finalProvince,
            postal_code: finalPostalCode,
            courier: selectedShipping?.code?.toUpperCase(),

            shipping_cost: shippingCost,
            shipping_service: selectedShipping?.service,
            payment_method: "xendit",
            discount: promoResult?.discount || 0,
          }),
        },
      );

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || "Gagal membuat order");
      }

      const orderCode = orderData.data.order_code;

      // 🔥 CREATE INVOICE
      const invoiceRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/create-invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_code: orderCode,
          }),
        },
      );

      // 🔥 handle kalau response bukan JSON
      let invoiceData: any;
      try {
        invoiceData = await invoiceRes.json();
      } catch {
        throw new Error("Response bukan JSON (server error)");
      }

      if (!invoiceRes.ok) {
        throw new Error(
          invoiceData.message || invoiceData.error || "Gagal membuat invoice",
        );
      }

      // 🔥 VALIDASI
      if (!invoiceData.invoice_url) {
        throw new Error("Invoice URL tidak ditemukan");
      }

      // 🔥 REDIRECT
      window.location.href = invoiceData.invoice_url;

      return;
    } finally {
      setLoading(false);
    }
  };

  const handleResetAddress = () => {
    setDestinationId(null);
    setSelectedCityLabel("");
    setAddressDetail("");
    setShippingOptions([]);
    setSelectedShipping(null);
  };

  useEffect(() => {
    // ❌ STOP kalau sudah pilih kota
    if (destinationId) return;

    const delay = setTimeout(() => {
      searchCity(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search, destinationId]);

  useEffect(() => {
    if (destinationId && isConfirmed && items.length > 0) {
      fetchOngkir(destinationId);
    }
  }, [destinationId, isConfirmed, items]);

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await fetch(`${API}/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data?.data?.length) return;

        const defaultAddr =
          data.data.find((addr: Address) => addr.is_default) || data.data[0];

        setSelectedAddress(defaultAddr);
        // setDestinationId(defaultAddr.city_id);
        setDestinationId(defaultAddr.shipping_city_id ?? defaultAddr.city_id);

        setRecipientName(defaultAddr.recipient_name);
        setPhone(defaultAddr.phone);
        setEmail(defaultAddr.email);
        setAddressDetail(defaultAddr.full_address);
        setPostalCode(defaultAddr.postal_code);
        setSelectedCityLabel(`${defaultAddr.city}, ${defaultAddr.province}`);
        setSearch(defaultAddr.city);
      } catch (err) {
        console.error("Gagal fetch data user/alamat:", err);
      }
    };

    if (isHydrated) fetchDefaultAddress();
  }, [isHydrated, API]);

  useEffect(() => {
    if (selectedAddress && items.length > 0 && !isConfirmed) {
      setIsConfirmed(true);
    }
  }, [selectedAddress, items, isConfirmed]);

  useEffect(() => {}, [selectedShipping]);

  useEffect(() => {
    setSelectedShipping(null);
  }, [destinationId]);

  if (!isHydrated) return null;

  return (
    <main className={`${poppins.className} min-h-screen bg-gray-50/50 pb-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
          className="inline-flex items-center gap-2 text-gray-900 hover:text-[#FF5F9D] transition-colors mt-2 mb-5 text-sm sm:text-base"
        >
          <ArrowLeft size={18} />
          Kembali
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* KIRI: ALAMAT & PENGIRIMAN */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-2xl text-[#FF5F9D] mb-8">
              Informasi Pengiriman
            </h1>

            {/* CARD: ALAMAT */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-2 rounded-lg text-[#FF5F9D]">
                    <MapPin size={20} />
                  </div>
                  <h2 className="font-semibold text-lg">Alamat Pengiriman</h2>
                </div>

                {/* Tombol Ganti Alamat jika user punya banyak alamat */}
              </div>

              {isConfirmed ? (
                /* TAMPILAN JIKA SUDAH DIKONFIRMASI */
                <div className="space-y-3">
                  <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-2xl relative">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-gray-800">
                            <p className="font-bold text-sm text-gray-800">
                              {finalAddress.recipient_name || "Alamat Terpilih"}
                            </p>

                            <p className="text-xs text-gray-600">
                              {finalAddress.phone || "-"}
                            </p>
                            <p className="text-xs text-gray-600">
                              {email || "-"}
                            </p>
                          </p>
                        </div>

                        <p className="text-xs text-gray-600">
                          {finalAddress.full_address || "-"}
                        </p>
                        <p className="text-xs font-semibold text-[#FF5F9D]">
                          {[finalAddress.location, finalAddress.postal_code]
                            .filter(Boolean)
                            .join(" • ") || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* INPUT FORM (TIDAK AKAN HILANG SAAT NGETIK) */
                <div className="space-y-4">
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />

                    <input
                      disabled={isOngkirError}
                      type="text"
                      placeholder="Cari Kota/Kecamatan..."
                      value={search}
                      onChange={(e) => {
                        handleSearch(e.target.value);
                        setSelectedAddress(null);
                        setIsConfirmed(false);
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none transition-all"
                    />

                    {/* Dropdown */}
                    {destinations.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                        {destinations.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              setSelectedCity(item);
                              setDestinationId(String(item.id));
                              setSelectedCityLabel(item.label);
                              setSearch(item.label);
                              setDestinations([]);
                              setSelectedShipping(null);

                              localStorage.setItem(
                                "guest_city_id",
                                String(item.id),
                              );
                            }}
                          >
                            {item.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Nama Penerima"
                    value={recipientName}
                    onChange={(e) => {
                      setRecipientName(e.target.value);
                      setSelectedAddress(null);
                      setIsConfirmed(false);
                    }}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Nomor WhatsApp"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setSelectedAddress(null);
                      setIsConfirmed(false);
                    }}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none"
                  />
                  <input
                    type="mail"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSelectedAddress(null);
                      setIsConfirmed(false);
                    }}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Kode Pos"
                    value={postalCode}
                    maxLength={5}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setPostalCode(value);
                      setSelectedAddress(null);
                      setIsConfirmed(false);
                    }}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none"
                  />

                  <textarea
                    placeholder="Alamat lengkap"
                    value={addressDetail}
                    onChange={(e) => {
                      setAddressDetail(e.target.value);
                      setSelectedAddress(null);
                    }}
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none transition-all"
                  />

                  {/* 🔥 TOMBOL CONFIRM */}
                  <button
                    onClick={() => {
                      setSelectedShipping(null);
                      setIsConfirmed(true);
                    }}
                    disabled={
                      !destinationId ||
                      addressDetail.length < 5 ||
                      recipientName.length < 3 ||
                      phone.length < 8 ||
                      postalCode.length < 5
                    }
                    className="w-full py-4 rounded-2xl bg-[#FF5F9D] text-white disabled:bg-gray-300"
                  >
                    Gunakan Alamat Ini
                  </button>
                </div>
              )}
            </div>

            {/* CARD: EKSPEDISI */}
            <div
              className={`bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-opacity ${!destinationId ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#FF5F9D]-100 p-2 rounded-lg text-pink-500">
                  <Truck size={20} />
                </div>
                <h2 className="font-semibold text-lg">Metode Pengiriman</h2>
              </div>

              {isLoadingShipping ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5F9D]"></div>
                </div>
              ) : shippingOptions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">
                  Lengkapi Alamat Terlebih Dahulu
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {shippingOptions.map((item, index) => (
                    <div
                      key={`${item.code}-${item.service}-${item.cost}-${index}`}
                      onClick={() => setSelectedShipping(item)}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                        selectedShipping?.service === item.service &&
                        selectedShipping?.cost === item.cost
                          ? "border-[#FF5F9D] bg-pink-50/30"
                          : "border-gray-100 hover:border-pink-200"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                          {item.code} {item.service}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.description} ({item.etd} Hari)
                        </span>
                      </div>
                      <span className="font-bold text-[#FF5F9D]">
                        Rp {item.cost.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* KANAN: RINGKASAN PESANAN */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] lg:sticky lg:top-10">
              <h2 className="text-xl text-[#FF5F9D] mb-6">Ringkasan Pesanan</h2>

              {/* LIST ITEM KECIL */}
              <div className="space-y-4 mb-8 max-h-[200px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <img
                        src={item.image}
                        className="w-full h-full object-cover"
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.quantity} Produk •{" "}
                        {(
                          (item.quantity * (item.parcel_weight || 0)) /
                          1000
                        ).toFixed(2)}
                        kg
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-gray-50 pt-6">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal Produk</span>
                  <span className="text-gray-900 font-medium">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Ongkos Kirim</span>
                  <span
                    className={
                      shippingCost > 0
                        ? "text-gray-900 font-medium"
                        : "text-green-500 font-medium"
                    }
                  >
                    {selectedShipping
                      ? selectedShipping.cost > 0
                        ? `Rp ${selectedShipping.cost.toLocaleString("id-ID")}`
                        : "Gratis"
                      : "Pilih pengiriman"}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon</span>
                    <span>- Rp {discount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                  <span className="text-lg font-bold text-gray-900">
                    Total Bayar
                  </span>
                  <span className="text-lg font-bold text-[#FF5F9D]">
                    Rp {finalTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <label className="text-[10px] text-gray-400  tracking-widest ml-4">
                  Punya Kode Promo?
                </label>

                <div className="relative group">
                  {/* Input Field */}
                  <input
                    type="text"
                    placeholder="Contoh: ANIMATE20"
                    className={`w-full py-5 pl-6 pr-28 rounded-[2rem] text-sm  border-2 transition-all outline-none
        ${
          selectedShipping
            ? "bg-white border-pink-50 focus:border-[#FF5F9D] focus:ring-4 focus:ring-pink-50 text-gray-800"
            : "bg-gray-50 border-transparent text-gray-400 cursor-not-allowed"
        }`}
                    disabled={!selectedShipping}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />

                  {/* Tombol Apply di dalam Input */}
                  <button
                    onClick={applyPromo}
                    disabled={!selectedShipping || promoLoading}
                    className={`absolute right-2 top-2 bottom-2 px-6 rounded-[1.5rem] text-xs tracking-wider transition-all
  ${
    selectedShipping
      ? "bg-[#FF5F9D] text-white shadow-lg shadow-pink-100 hover:bg-[#ff4a90] active:scale-95"
      : "bg-gray-200 text-gray-400 cursor-not-allowed"
  }`}
                  >
                    {promoLoading ? "Loading..." : "Klaim"}
                  </button>
                </div>

                {!selectedShipping && (
                  <p className="text-[10px] text-gray-400 ml-4 flex items-center gap-1 italic">
                    * Pilih pengiriman terlebih dahulu untuk menggunakan promo
                  </p>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={!selectedShipping || loading}
                className={`w-full mt-8 py-5 rounded-3xl text-lg shadow-xl transition-all ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : selectedShipping
                      ? "bg-[#FF5F9D] text-white shadow-pink-100 hover:bg-[#ff4a90] active:scale-95"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                {loading ? "Memproses..." : "Bayar Sekarang"}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
                <CheckCircle2 size={14} className="text-green-500" />
                Pembayaran Aman & Terenkripsi
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
