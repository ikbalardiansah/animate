"use client";

import { useState } from "react";
import {
  Search,
  Truck,
  MapPin,
  Clock3,
  PackageCheck,
  AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TrackingPage() {
  const [awb, setAwb] = useState("");
  const [courier, setCourier] = useState("jne");

  const [loading, setLoading] = useState(false);

  const [tracking, setTracking] = useState<any>(null);

  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!awb) {
      setError("Nomor resi wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTracking(null);

      const res = await fetch(
        `${API_URL}/tracking?awb=${awb}&courier=${courier}`,
      );

      const data = await res.json();

      console.log(data);

      if (!res.ok || data.status === false) {
        throw new Error(data.message || "Tracking tidak ditemukan");
      }

      setTracking(data.data);
    } catch (err: any) {
      console.log(err);

      setError(err.message || "Terjadi kesalahan saat tracking");
    } finally {
      setLoading(false);
    }
  };

  const summary = tracking?.summary;

  const history = tracking?.history || [];

  return (
    <main className="min-h-screen bg-[#FFF7FA] py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#FF5F9D] to-pink-500 text-white p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 opacity-10 text-[220px] font-black leading-none select-none">
            #
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 mb-6">
              <Truck size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Live Package Tracking
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl  leading-tight">
              Lacak Paket Pesananmu
            </h1>

            <p className="mt-5 text-pink-50 leading-relaxed text-base md:text-lg">
              Masukkan nomor resi untuk melihat perjalanan paketmu secara
              realtime.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-[2rem] border border-pink-100 shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px] gap-4">
            {/* INPUT RESI */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Nomor Resi
              </label>

              <input
                type="text"
                placeholder="Contoh: JX293829392"
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl border border-pink-100 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-[#FF5F9D] text-gray-800"
              />
            </div>

            {/* COURIER */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Courier
              </label>

              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl border border-pink-100 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-[#FF5F9D] text-gray-800"
              >
                <option value="jne">JNE</option>
                <option value="jnt">J&T</option>
                <option value="sicepat">SiCepat</option>
              </select>
            </div>

            {/* BUTTON */}
            <div className="flex items-end">
              <button
                onClick={handleTrack}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-[#FF5F9D] hover:bg-pink-500 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Lacak
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
              <AlertCircle className="text-red-500" />
            </div>

            <div>
              <h2 className="font-bold text-red-600 text-lg">Tracking Gagal</h2>

              <p className="text-red-500 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* RESULT */}
        {tracking && (
          <>
            {/* SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-white rounded-3xl border border-pink-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <PackageCheck className="text-[#FF5F9D]" />

                  <p className="text-sm text-gray-500 font-medium">Status</p>
                </div>

                <h2 className="text-xl font-bold text-gray-800">
                  {summary?.status || "-"}
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-pink-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="text-[#FF5F9D]" />

                  <p className="text-sm text-gray-500 font-medium">Courier</p>
                </div>

                <h2 className="text-xl font-bold uppercase text-gray-800">
                  {summary?.courier || courier}
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-pink-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock3 className="text-[#FF5F9D]" />

                  <p className="text-sm text-gray-500 font-medium">Service</p>
                </div>

                <h2 className="text-xl font-bold uppercase text-gray-800">
                  {summary?.service || "-"}
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-pink-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="text-[#FF5F9D]" />

                  <p className="text-sm text-gray-500 font-medium">Resi</p>
                </div>

                <h2 className="text-sm font-bold break-all text-gray-800">
                  {summary?.awb || awb}
                </h2>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="bg-white rounded-[2rem] border border-pink-100 shadow-sm p-6 md:p-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center">
                  <Truck className="text-[#FF5F9D]" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Riwayat Pengiriman
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Perjalanan paketmu secara realtime
                  </p>
                </div>
              </div>

              {history.length > 0 ? (
                <div className="space-y-8">
                  {history.map((item: any, index: number) => (
                    <div key={index} className="relative pl-10">
                      {/* LINE */}
                      {index !== history.length - 1 && (
                        <div className="absolute left-[15px] top-8 w-[2px] h-[calc(100%+32px)] bg-pink-200"></div>
                      )}

                      {/* DOT */}
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#FF5F9D] border-4 border-pink-100 shadow-md"></div>

                      <div className="bg-pink-50 border border-pink-100 rounded-3xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                          <h3 className="font-bold text-gray-800 text-lg leading-relaxed">
                            {item.desc ||
                              item.description ||
                              item.manifest_description}
                          </h3>

                          <div className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-pink-100 text-sm font-medium text-gray-600 w-fit">
                            <Clock3 size={14} className="text-[#FF5F9D]" />

                            {item.date || item.manifest_date}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={15} className="text-[#FF5F9D]" />

                          <span>
                            {item.location || item.city_name || "Indonesia"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-6">
                    <Truck className="text-[#FF5F9D]" size={40} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Belum Ada Riwayat Tracking
                  </h3>

                  <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                    Paket sedang diproses oleh seller atau kurir belum
                    mengupdate status pengiriman.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
