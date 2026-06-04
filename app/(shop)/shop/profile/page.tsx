"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  MapPin,
  Phone,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  Home,
  Mail,
} from "lucide-react";
import { Poppins } from "next/font/google";

type Address = {
  id?: number;
  recipient_name: string;
  phone: string;
  province: string;
  province_id?: string;
  city: string;
  city_id: string;
  shipping_city_id?: string;
  district?: string;
  email: string;
  district_id?: string;
  village?: string;
  village_id?: string;
  postal_code: string;
  full_address: string;
  is_default: boolean;
};

type Region = { id: string; name: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  const [formData, setFormData] = useState<Address>({
    recipient_name: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    shipping_city_id: "",
    city_id: "",
    postal_code: "",
    district: "",
    village: "",
    full_address: "",
    is_default: false,
  });

  // ======================
  // 🔐 HEADERS
  // ======================
  const getHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  };

  // ======================
  // 📦 FETCH INITIAL
  // ======================
  const fetchInitialData = async () => {
    try {
      const [provRes, addrRes] = await Promise.all([
        fetch(`${API_URL}/provinces`),
        fetch(`${API_URL}/addresses`, { headers: getHeaders() }),
      ]);

      const provJson = await provRes.json();
      setProvinces(provJson.data ?? provJson);

      if (!addrRes.ok) {
        console.error(await addrRes.text());
        return;
      }

      const addrJson = await addrRes.json();
      setAddresses(
        (addrJson.data ?? []).sort(
          (a: any, b: any) => b.is_default - a.is_default,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // ======================
  // 🌍 PROVINCE
  // ======================
  const handleProvinceChange = async (id: string) => {
    const selected = provinces.find((p) => String(p.id) === String(id));

    if (selected) {
      setFormData((prev) => ({
        ...prev,
        province_id: id,
        province: selected.name,
        city: "",
        city_id: "",
        district: "",
        district_id: "",
        village: "",
        village_id: "",
      }));
    }

    // reset dependent dropdown
    setCities([]);
    setDistricts([]);
    setVillages([]);

    try {
      const res = await fetch(`${API_URL}/regencies/${id}`);

      if (!res.ok) {
        const text = await res.text();
        console.error("API ERROR:", text);
        return;
      }

      const json = await res.json();

      const data = json.data ?? json;

      if (!Array.isArray(data)) {
        console.error("FORMAT SALAH:", data);
        return;
      }

      setCities(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  // ======================
  // 🏙 CITY
  // ======================
  const handleCityChange = async (id: string) => {
    const selected = cities.find((c) => String(c.id) === String(id));

    if (!selected) return;

    try {
      const shippingRes = await fetch(
        `${API_URL}/shipping/cities?search=${encodeURIComponent(selected.name)}`,
      );

      const shippingJson = await shippingRes.json();

      const shipping = shippingJson.data?.[0];

      setFormData((prev) => ({
        ...prev,
        city: selected.name,
        city_id: id, // regional id

        shipping_city_id: String(shipping?.id || ""),

        district: "",
        district_id: "",
        village: "",
        village_id: "",
      }));

      const res = await fetch(`${API_URL}/districts/${id}`);

      if (!res.ok) return;

      const json = await res.json();
      setDistricts(json.data ?? json);
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // 🏘 DISTRICT
  // ======================
  const handleDistrictChange = async (id: string) => {
    const selected = districts.find((d) => String(d.id) === String(id));

    if (selected) {
      setFormData((prev) => ({
        ...prev,
        district_id: id,
        district: selected.name,
        village: "",
        village_id: "",
      }));
    }

    try {
      const res = await fetch(`${API_URL}/villages/${id}`);
      const json = await res.json();

      setVillages(json.data ?? json);
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // 🏡 VILLAGE
  // ======================
  const handleVillageChange = (id: string) => {
    const selected = villages.find((v) => String(v.id) === String(id));

    if (selected) {
      setFormData((prev) => ({
        ...prev,
        village_id: id,
        village: selected.name,
      }));
    }
  };

  // ======================
  // 💾 SUBMIT
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.province || !formData.city || !formData.city_id) {
      alert("Lengkapi provinsi & kota dulu");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/addresses/${editingId}`
        : `${API_URL}/addresses`;

      const payload = {
        ...formData,
        postal_code: String(formData.postal_code),
        is_default: !!formData.is_default,
      };

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(
          Object.values(err.errors || {})
            .flat()
            .join("\n"),
        );
        return;
      }

      fetchInitialData();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  // ======================
  // 🗑 DELETE
  // ======================
  const handleDelete = async (id: number) => {
    if (!confirm("Hapus alamat?")) return;

    await fetch(`${API_URL}/addresses/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    fetchInitialData();
  };

  // ======================
  // 🔄 RESET
  // ======================
  const resetForm = () => {
    setFormData({
      recipient_name: "",
      phone: "",
      email: "",
      province: "",
      city: "",
      city_id: "",
      postal_code: "",
      district: "",
      village: "",
      full_address: "",
      is_default: false,
    });

    setCities([]);
    setDistricts([]);
    setVillages([]);
    setEditingId(null);
  };

  useEffect(() => {
    if (formData.province_id) {
      handleProvinceChange(formData.province_id);
    }
  }, [formData.province_id]);

  useEffect(() => {
    if (formData.city_id) {
      handleCityChange(formData.city_id);
    }
  }, [formData.city_id]);

  useEffect(() => {
    if (formData.district_id) {
      handleDistrictChange(formData.district_id);
    }
  }, [formData.district_id]);

  return (
    <>
      <div className="m-h-screen bg-gray-50/50 antialiased pb-20">
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
          {/* TOP BAR */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Daftar Alamat
              </h1>
              <p className="text-gray-500 mt-1">
                Kelola lokasi pengiriman pesananmu
              </p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="group bg-[#FF5F9D] hover:bg-[#ff4a90] text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-pink-100 active:scale-95"
            >
              <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform"
              />
              <span className="font-semibold">Tambah Alamat Baru</span>
            </button>
          </div>

          {/* LIST SECTION */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF5F9D]"></div>
            </div>
          ) : (
            <div className="grid gap-5">
              {addresses.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] text-center border border-dashed border-gray-200">
                  <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500 font-medium">
                    Belum ada alamat tersimpan
                  </p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`group relative bg-white p-6 sm:p-8 rounded-[2rem] border-2 transition-all hover:shadow-xl hover:shadow-gray-200/50 ${
                      addr.is_default
                        ? "border-[#FF5F9D]/30"
                        : "border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-bold text-gray-900">
                            {addr.recipient_name}
                          </p>

                          {Boolean(addr.is_default) && (
                            <span className="flex items-center gap-1 text-[10px]  tracking-widest bg-pink-50 text-[#FF5F9D] font-bold px-3 py-1 rounded-full border border-pink-100s">
                              Utama
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 flex items-center gap-2 text-sm font-medium">
                          <Phone size={14} className="text-gray-400" />{" "}
                          {addr.phone}
                        </p>
                        <p className="text-gray-500 flex items-center gap-2 text-sm font-medium">
                          <Mail size={14} className="text-gray-400" />
                          {""}
                          {addr.email}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(addr.id!);
                            setFormData(addr);
                            setIsModalOpen(true);
                          }}
                          className="p-2.5 text-gray-400 hover:text-[#FF5F9D] hover:bg-pink-50 rounded-xl transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        {!addr.is_default && (
                          <button
                            onClick={() => handleDelete(addr.id!)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <MapPin
                        size={20}
                        className="text-[#FF5F9D] shrink-0 mt-0.5"
                      />
                      <div className="text-sm leading-relaxed">
                        <p className="font-medium text-gray-800">
                          {addr.full_address}
                        </p>
                        <p className="text-gray-500 mt-1">
                          {addr.village}, {addr.district}, {addr.city},{" "}
                          {addr.province} • {addr.postal_code}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MODAL OVERLAY */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsModalOpen(false)}
              />

              {/* Modal Container */}
              <div className="relative bg-white w-full max-w-xl max-h-[95vh] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* FIXED HEADER */}
                <div className="px-6 py-5 sm:px-8 sm:pt-8 sm:pb-4 flex justify-between items-center border-b sm:border-none border-gray-100 bg-white z-10">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editingId ? "Edit Alamat" : "Alamat Baru"}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={22} className="text-gray-400" />
                  </button>
                </div>

                {/* SCROLLABLE FORM BODY */}
                <form
                  onSubmit={handleSubmit}
                  className="p-6 sm:p-8 pt-4 space-y-4 overflow-y-auto custom-scrollbar"
                >
                  {/* ROW 1: Nama & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">
                        Nama Penerima
                      </label>
                      <input
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={formData.recipient_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recipient_name: e.target.value,
                          })
                        }
                        className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 focus:border-[#FF5F9D] outline-none transition-all text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">
                        No. WhatsApp
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="0812xxxx"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 focus:border-[#FF5F9D] outline-none transition-all text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">
                      Email
                    </label>

                    <input
                      required
                      type="email"
                      placeholder="contoh@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 focus:border-[#FF5F9D] outline-none transition-all text-sm sm:text-base"
                    />
                  </div>

                  {/* ROW 2: Provinsi & Kota */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">
                        Provinsi
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={formData.province_id || ""}
                          onChange={(e) => {
                            const id = e.target.value;

                            // 🔥 SET DULU (PENTING)
                            setFormData((prev) => ({
                              ...prev,
                              province_id: id,
                            }));

                            handleProvinceChange(id);
                          }}
                          className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none appearance-none cursor-pointer text-sm sm:text-base"
                        >
                          <option value="">Pilih Provinsi</option>
                          {provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={18}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">
                        Kota/Kabupaten
                      </label>
                      <div className="relative">
                        <select
                          required
                          disabled={!cities.length}
                          value={formData.city_id || ""}
                          onChange={(e) => {
                            const id = e.target.value;

                            // 🔥 SET DULU (INI KUNCI)
                            setFormData((prev) => ({
                              ...prev,
                              city_id: id,
                            }));

                            handleCityChange(id);
                          }}
                          className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none appearance-none disabled:opacity-50 cursor-pointer text-sm sm:text-base"
                        >
                          <option value="">Pilih Kota</option>
                          {cities.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={18}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ROW 3: Kecamatan & Kelurahan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">
                        Kecamatan
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={formData.district_id || ""}
                          onChange={(e) => {
                            const id = e.target.value;

                            setFormData((prev) => ({
                              ...prev,
                              district_id: id,
                            }));

                            handleDistrictChange(id);
                          }}
                          className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none appearance-none disabled:opacity-50 cursor-pointer text-sm sm:text-base"
                        >
                          <option value="">Pilih Kecamatan</option>
                          {districts.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={18}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">
                        Kelurahan / Desa
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={formData.village_id || ""}
                          onChange={(e) => {
                            const id = e.target.value;

                            setFormData((prev) => ({
                              ...prev,
                              village_id: id,
                            }));

                            handleVillageChange(id);
                          }}
                          className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none appearance-none disabled:opacity-50 cursor-pointer text-sm sm:text-base"
                        >
                          <option value="">Pilih Kelurahan</option>
                          {villages.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={18}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Kode Pos */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">
                      Kode Pos
                    </label>
                    <input
                      required
                      placeholder="12345"
                      value={formData.postal_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          postal_code: e.target.value,
                        })
                      }
                      className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none transition-all text-sm sm:text-base"
                    />
                  </div>

                  {/* Alamat Lengkap */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">
                      Alamat Lengkap
                    </label>
                    <textarea
                      required
                      placeholder="Nama jalan, Nomor rumah, RT/RW..."
                      rows={2}
                      value={formData.full_address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          full_address: e.target.value,
                        })
                      }
                      className="w-full p-3.5 sm:p-4 bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#FF5F9D]/20 outline-none transition-all resize-none text-sm sm:text-base"
                    />
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer group py-2 select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.is_default}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_default: e.target.checked,
                          })
                        }
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-200 rounded-lg peer-checked:bg-[#FF5F9D] peer-checked:border-[#FF5F9D] transition-all" />
                      <CheckCircle2
                        size={16}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      Jadikan alamat utama
                    </span>
                  </label>

                  {/* FIXED FOOTER BUTTON (Inside form but at the bottom) */}
                  <div className="sticky bottom-0 bg-white pt-2 pb-2">
                    <button
                      type="submit"
                      className="w-full bg-[#FF5F9D] hover:bg-[#ff4a90] text-white py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-pink-100 transition-all active:scale-[0.98]"
                    >
                      {editingId ? "Simpan Perubahan" : "Tambah Alamat"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
