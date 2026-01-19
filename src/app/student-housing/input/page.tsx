'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { api } from '@/lib/common/utils/api';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

interface Dorm {
  id: string;
  name: string;
  gender: string;
  capacity: number;
  powerCapacity: number;
  paymentType?: string;
}

const EMISSION_FACTOR = 0.85;

const PLN_TARIFF_BY_POWER: Record<number, number> = {
  1300: 1444.7,
  2200: 1444.7,
  3500: 1699.53,
  4400: 1699.53,
  5500: 1699.53,
};

export default function StudentHousingInputPage() {
  // Auto logout setelah 5 menit tidak ada aktivitas
  useAutoLogout({ idleTime: 300000 });

  const { isAuthorized, isChecking } = useRequireAuth({
    allowedRoles: ['Student Housing', 'student_housing', 'STUDENT_HOUSING'],
    allowedUsernames: ['Student Housing'],
    fallbackPath: '/dashboard',
  });

  const router = useRouter();

  // State
  const [dormOptions, setDormOptions] = useState<Dorm[]>([]);
  const [selectedDormId, setSelectedDormId] = useState("");
  const [selectedDormDetail, setSelectedDormDetail] = useState<Dorm | null>(null);
  const [periode, setPeriode] = useState("");
  const [kWh, setKWh] = useState("");
  const [bill, setBill] = useState("");
  const [inputSource, setInputSource] = useState<"kwh" | "bill" | null>(null);

  // Modals & Errors
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [periodError, setPeriodError] = useState<string | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  // Add Dorm State
  const [showAddDorm, setShowAddDorm] = useState(false);
  const [newDorm, setNewDorm] = useState("");
  const [newGender, setNewGender] = useState("PUTRA");
  const [newCapacity, setNewCapacity] = useState("");
  const [newPower, setNewPower] = useState("");

  // Existing Records for duplicate check
  const [existingRecords, setExistingRecords] = useState<any[]>([]);

  const HOURS_PER_DAY = 24;
  const DAYS_PER_MONTH = 30;

  // Selected Dorm Name
  const selectedDormName = dormOptions.find(d => d.id === selectedDormId)?.name || "";

  // limit kWh berdasarkan daya asrama
  const maxKwh = selectedDormDetail
    ? (selectedDormDetail.powerCapacity * HOURS_PER_DAY * DAYS_PER_MONTH) / 1000
    : null;

  const isKwhValid = kWh !== "" && !isNaN(Number(kWh)) && Number(kWh) > 0;
  const isKwhOverLimit = isKwhValid && maxKwh !== null && Number(kWh) > maxKwh;

  const emission = isKwhValid ? Number(kWh) * EMISSION_FACTOR : 0;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [dorms, records] = await Promise.all([
        api.get<Dorm[]>('/dorm'),
        api.get<any[]>('/dorm-record')
      ]);
      setDormOptions(dorms || []);
      setExistingRecords(records || []);
    } catch (err) {
      console.error("Fetch initial data error:", err);
    }
  };

  useEffect(() => {
    if (!selectedDormId || selectedDormId === "") {
      setSelectedDormDetail(null);
      return;
    }

    const fetchDormDetail = async () => {
      try {
        const data = await api.get<Dorm>(`/dorm/${selectedDormId}`);
        setSelectedDormDetail(data);
      } catch (error) {
        console.error("Fetch dorm detail error:", error);
        setSelectedDormDetail(null);
      }
    };

    fetchDormDetail();
  }, [selectedDormId]);

  // Handle auto-calculation
  useEffect(() => {
    if (!selectedDormDetail) return;

    const power = selectedDormDetail.powerCapacity;
    const tariff = PLN_TARIFF_BY_POWER[power] ?? 1444.7;

    if (inputSource === "kwh" && kWh) {
      setBill(String(Math.round(Number(kWh) * tariff)));
    } else if (inputSource === "bill" && bill) {
      setKWh(String(Math.round(Number(bill) / tariff)));
    }
  }, [kWh, bill, inputSource, selectedDormDetail]);

  const validatePeriodValue = (value: string): string | null => {
    if (!value) return "Periode wajib diisi";
    const selected = new Date(value);
    const now = new Date();
    const monthDiff = (now.getFullYear() - selected.getFullYear()) * 12 + (now.getMonth() - selected.getMonth());

    if (monthDiff < 0) return "Periode belum dimulai";
    if (monthDiff >= 2) return "Periode sudah tertutup";
    return null;
  };

  const validateDuplicateValue = (period: string, dormName: string): string | null => {
    if (!period || !dormName) return null;
    const inputDate = new Date(period);

    const isDuplicate = existingRecords.some((record) => {
      const recordDate = new Date(record.period);
      return (
        record.dormName === dormName &&
        recordDate.getFullYear() === inputDate.getFullYear() &&
        recordDate.getMonth() === inputDate.getMonth()
      );
    });

    return isDuplicate ? "Data untuk asrama dan periode ini sudah pernah diinput" : null;
  };

  const runAllValidations = (periodValue: string, dormName: string) => {
    const pErr = validatePeriodValue(periodValue);
    setPeriodError(pErr);
    if (!pErr) {
      setDuplicateError(validateDuplicateValue(periodValue, dormName));
    } else {
      setDuplicateError(null);
    }
  };

  const handlePeriodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // YYYY-MM
    const formatted = `${value}-01`;
    setPeriode(formatted);
    runAllValidations(formatted, selectedDormName);
  };

  useEffect(() => {
    if (periode && selectedDormName) {
      runAllValidations(periode, selectedDormName);
    }
  }, [periode, selectedDormName]);

  const handleAddDorm = async () => {
    if (!newDorm.trim() || !newGender || !newCapacity || !newPower) {
      alert("Semua field asrama wajib diisi!");
      return;
    }

    const payload = {
      name: newDorm.trim(),
      gender: newGender,
      capacity: Number(newCapacity),
      powerCapacity: Number(newPower)
    };

    try {
      const created = await api.post<Dorm>('/dorm', payload);
      setDormOptions(prev => [...prev, created]);
      setSelectedDormId(created.id);
      setNewDorm("");
      setNewGender("PUTRA");
      setNewCapacity("");
      setNewPower("");
      setShowAddDorm(false);
    } catch (err: any) {
      console.error("Add dorm error:", err);
      alert(err.message || "Gagal menambahkan asrama");
    }
  };

  const resetForm = () => {
    setPeriode("");
    setSelectedDormId("");
    setKWh("");
    setBill("");
    setPeriodError(null);
    setDuplicateError(null);
    setSelectedDormDetail(null);
    setShowAddDorm(false);
  };

  const handleSaveClick = () => {
    if (!periode || !selectedDormId || !kWh || !bill) {
      setErrorMessage("Silahkan isi semua field yang wajib");
      setShowError(true);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmYes = async () => {
    setShowConfirm(false);
    try {
      const payload = {
        period: periode,
        dormName: selectedDormName,
        totalKwh: Number(kWh),
        billAmount: Number(bill),
      };

      const savedRecord = await api.post<any>('/dorm-record', payload);
      setExistingRecords(prev => [...prev, savedRecord]);
      setShowSuccess(true);
      resetForm();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Gagal menyimpan data");
      setShowError(true);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <main className="min-h-screen w-full bg-[#f2ecf9] flex flex-col">
      <style jsx global>{`
        input[type="month"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0.75rem;
          cursor: pointer;
          width: 20px;
          height: 20px;
        }
      `}</style>

      <section className="flex-1 flex flex-col justify-start items-center w-full px-6 sm:px-8 py-12 bg-white shadow-inner pb-[150px]">
        <div className="w-full max-w-6xl">
          {/* Header & Back Button */}
          <div className="relative mb-10 flex items-center justify-center">
            <Link
              href="/student-housing"
              className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
            >
              <img
                src="https://cdn-icons-png.freepik.com/512/3114/3114883.png"
                alt="Back"
                className="w-6 h-6 object-contain"
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center">
              Pendataan Asrama Mahasiswa
            </h1>
          </div>

          <form className="space-y-8 mt-12">
            {/* Periode */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <label className="w-full md:w-80 text-black font-semibold text-xl">
                Periode
              </label>
              <div className="flex-1 w-full">
                <div className="relative">
                  <input
                    type="month"
                    onChange={handlePeriodeChange}
                    className="w-full border border-gray-300 rounded-md p-3 bg-white text-gray-700 focus:ring-3 focus:ring-brand-accent appearance-none"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                </div>
                {periodError && <p className="text-sm text-red-600 mt-1">{periodError}</p>}
                {duplicateError && <p className="text-sm text-red-600 mt-1">{duplicateError}</p>}
              </div>
            </div>

            {/* Nama Asrama */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <label className="w-full md:w-80 text-black font-semibold text-xl">
                  Nama Asrama
                </label>
                <select
                  className="flex-1 border bg-white border-gray-300 rounded-md p-3 text-black focus:ring-2 focus:ring-brand-accent w-full"
                  value={selectedDormId}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "add-new") {
                      setShowAddDorm(true);
                      setSelectedDormId("");
                    } else {
                      setShowAddDorm(false);
                      setSelectedDormId(value);
                    }
                  }}
                >
                  <option value="">Pilih Nama Asrama</option>
                  {dormOptions.map((dorm) => (
                    <option key={dorm.id} value={dorm.id}>{dorm.name}</option>
                  ))}
                  <option value="add-new">+ Tambahkan Nama Asrama</option>
                </select>
              </div>

              {/* Detail Card */}
              {selectedDormDetail && (
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="w-full md:w-80" />
                  <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Detail Data Asrama</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Jumlah Penghuni</p>
                        <p className="text-base font-semibold text-black">{selectedDormDetail.capacity} orang</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Gender</p>
                        <p className="text-base font-semibold text-black">{selectedDormDetail.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Daya Listrik</p>
                        <p className="text-base font-semibold text-black">{selectedDormDetail.powerCapacity} VA</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tipe Pembayaran</p>
                        <p className="text-base font-semibold text-black">{selectedDormDetail.paymentType ?? "Prabayar"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add New Dorm Form */}
            {showAddDorm && (
              <div className="flex flex-col gap-4 p-6 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <label className="w-full md:w-80 text-black font-semibold text-lg">Nama Asrama Baru</label>
                  <input
                    type="text"
                    value={newDorm}
                    onChange={(e) => setNewDorm(e.target.value)}
                    placeholder="Contoh: Asrama Baru"
                    className="flex-1 border border-gray-300 rounded-md p-2 bg-white text-black"
                  />
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <label className="w-full md:w-80 text-black font-semibold text-lg">Gender Asrama</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="flex-1 border border-gray-300 bg-white rounded-md p-2 text-black"
                  >
                    <option value="PUTRA">PUTRA</option>
                    <option value="PUTRI">PUTRI</option>
                  </select>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <label className="w-full md:w-80 text-black font-semibold text-lg">Kapasitas Penghuni</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    placeholder="Contoh: 24"
                    className="flex-1 border border-gray-300 rounded-md p-2 bg-white text-black"
                  />
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <label className="w-full md:w-80 text-black font-semibold text-lg">Daya Listrik (VA)</label>
                  <input
                    type="number"
                    value={newPower}
                    onChange={(e) => setNewPower(e.target.value)}
                    placeholder="Contoh: 2200"
                    className="flex-1 border border-gray-300 rounded-md p-2 bg-white text-black"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowAddDorm(false)} className="bg-gray-300 px-6 py-2 rounded-md font-medium">Batal</button>
                  <button type="button" onClick={handleAddDorm} className="bg-brand-primary text-white px-6 py-2 rounded-md font-medium hover:bg-brand-secondary transition-colors">Simpan</button>
                </div>
              </div>
            )}

            {/* Tagihan Listrik */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <label className="w-full md:w-80 text-black font-semibold text-xl">
                Tagihan Listrik (Rp/Bulan)
              </label>
              <div className="flex-1 relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">Rp.</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Masukkan jumlah tagihan"
                  value={bill === "" ? "" : new Intl.NumberFormat("id-ID").format(Number(bill))}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    setInputSource("bill");
                    setBill(rawValue);
                  }}
                  className="w-full border border-gray-300 rounded-md p-3 pl-12 bg-white text-black focus:ring-3 focus:ring-brand-accent"
                />
              </div>
            </div>

            {/* Total Konsumsi Listrik */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <label className="w-full md:w-80 text-black font-semibold text-xl">
                Total Konsumsi Listrik (kWh)
              </label>
              <div className="flex-1 w-full">
                <input
                  type="number"
                  placeholder="Masukkan Jumlah kWh"
                  value={kWh}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInputSource("kwh");
                    setKWh(value);
                  }}
                  className="w-full border border-gray-300 rounded-md p-3 bg-white text-black focus:ring-3 focus:ring-brand-accent"
                />
                {isKwhOverLimit && (
                  <p className="text-sm text-red-600 mt-2">
                    Konsumsi listrik melebihi batas maksimum teoritis ({maxKwh?.toFixed(0)} kWh/bulan).
                  </p>
                )}
              </div>
            </div>

            {/* Emisi Karbon Card */}
            {isKwhValid && (
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="w-full md:w-80" />
                <div className="flex-1 bg-brand-accent/20 border border-brand-accent rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-black mb-2">Emisi Karbon (Otomatis)</h3>
                  <p className="text-3xl font-bold text-brand-secondary">{emission.toFixed(2)} kg CO₂e</p>
                  <p className="text-sm text-brand-primary mt-2">Faktor emisi: {EMISSION_FACTOR} kg CO₂e/kWh</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-8 flex justify-center">
              <button
                type="button"
                onClick={handleSaveClick}
                disabled={isKwhOverLimit || !!periodError || !!duplicateError}
                className={`w-full sm:w-2/3 md:w-1/2 lg:w-1/3 py-4 rounded-md font-bold text-lg transition duration-200 ${isKwhOverLimit || periodError || duplicateError
                  ? "bg-gray-400 cursor-not-allowed text-gray-200"
                  : "bg-black hover:bg-brand-secondary text-white shadow-lg"
                  }`}
              >
                Simpan Data
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 bg-black/20">
          <div className="bg-white rounded-xl p-8 w-[400px] text-center shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Apa anda yakin ingin menyimpannya?</h3>
            <div className="flex justify-center gap-4">
              <button onClick={handleConfirmYes} className="flex-1 border-2 border-black px-6 py-3 bg-white hover:bg-gray-100 rounded-md font-bold text-black transition">Ya</button>
              <button onClick={() => setShowConfirm(false)} className="flex-1 border-2 border-black px-6 py-3 bg-white hover:bg-gray-100 rounded-md font-bold text-black transition">Tidak</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 bg-black/10">
          <div className="bg-white rounded-xl p-8 w-[400px] text-center shadow-2xl border border-brand-accent animate-in fade-in zoom-in duration-200">
            <CheckCircle className="text-brand-primary w-16 h-16 mx-auto mb-4" />
            <p className="text-2xl font-bold text-gray-900">Data berhasil disimpan!</p>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 bg-black/20">
          <div className="bg-white rounded-xl p-8 w-[400px] text-center shadow-2xl relative border border-red-100 animate-in fade-in zoom-in duration-200">
            <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600" onClick={() => setShowError(false)}>✕</button>
            <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-900 mb-2">Data tidak berhasil disimpan!</p>
            <p className="text-gray-600">{errorMessage || 'Silakan cek kembali data yang anda inputkan.'}</p>
          </div>
        </div>
      )}
    </main>
  );
}
