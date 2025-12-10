'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/common/utils/api';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

interface Dorm {
  id: number;
  name: string;
  gender: string;
  powerCapacity: number;
  capacity: number;
}

export default function StudentHousingInputPage() {
  // Auto logout setelah 5 menit tidak ada aktivitas
  useAutoLogout({ idleTime: 300000 });

  const { isAuthorized, isChecking } = useRequireAuth({
    allowedRoles: ['Student Housing', 'student_housing', 'STUDENT_HOUSING'],
    allowedUsernames: ['Student Housing'],
    fallbackPath: '/dashboard',
  });

  const router = useRouter();
  const [formData, setFormData] = useState({
    dormName: '',
    period: '',
    totalKwh: '',
    billAmount: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDormDropdown, setShowDormDropdown] = useState(false);
  const [showAddDorm, setShowAddDorm] = useState(false);
  const [dormOptions, setDormOptions] = useState<Dorm[]>([]);
  const [loading, setLoading] = useState(false);
  const [dormsLoading, setDormsLoading] = useState(true);
  const [newDorm, setNewDorm] = useState('');
  const [newGender, setNewGender] = useState('PUTRA');
  const [newCapacity, setNewCapacity] = useState('');
  const [newPower, setNewPower] = useState('');

  useEffect(() => {
    fetchDorms();
  }, []);

  const fetchDorms = async () => {
    try {
      setDormsLoading(true);
      const dorms = await api.get<Dorm[]>('/dorm');
      setDormOptions(dorms || []);
    } catch (err: any) {
      console.error('Error fetching dorms:', err);
      setErrorMessage('Gagal memuat daftar asrama');
    } finally {
      setDormsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Check if user is authenticated
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!token) {
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
      }

      // Validasi field kosong
      if (!formData.dormName || !formData.period || !formData.totalKwh || !formData.billAmount) {
        throw new Error('Silahkan isi semua field yang kosong');
      }

      // Validasi angka
      const kwh = parseFloat(formData.totalKwh);
      const amount = parseFloat(formData.billAmount);
      
      if (isNaN(kwh) || kwh <= 0) {
        throw new Error('Jumlah kWh harus berupa angka positif');
      }
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Jumlah tagihan harus berupa angka positif');
      }

      // Convert period dari "2025-01" ke "Januari 2025"
      const [year, month] = formData.period.split('-');
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const formattedPeriod = `${monthNames[parseInt(month) - 1]} ${year}`;

      // Submit data
      await api.post('/dorm-record', {
        dormName: formData.dormName,
        period: formattedPeriod,
        totalKwh: kwh,
        billAmount: amount,
      });

      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Submit error:', err);
      const errorMsg = err.message || 'Gagal menyimpan data';
      
      // If unauthorized, redirect to login
      if (errorMsg.toLowerCase().includes('unauthorized') || errorMsg.includes('sesi')) {
        setErrorMessage('Sesi Anda telah berakhir. Silakan login kembali.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setErrorMessage(errorMsg);
      }
      
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push('/student-housing');
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleSelectDorm = (dorm: Dorm) => {
    setFormData((prev) => ({
      ...prev,
      dormName: dorm.name
    }));
    setShowDormDropdown(false);
  };

  const handleAddNewDormClick = () => {
    setShowAddDorm(true);
    setShowDormDropdown(false);
  };

  const handleAddDorm = async () => {
    if (!newDorm.trim() || !newGender || !newCapacity || !newPower) {
      setErrorMessage('Semua field asrama wajib diisi!');
      setShowErrorModal(true);
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

      // Update dropdown
      setDormOptions(prev => [...prev, created]);
      setFormData(prev => ({ ...prev, dormName: created.name }));

      // Reset state
      setNewDorm('');
      setNewGender('PUTRA');
      setNewCapacity('');
      setNewPower('');
      setShowAddDorm(false);

    } catch (err: any) {
      console.error('Add dorm error:', err);
      setErrorMessage(err.message || 'Gagal menambahkan asrama');
      setShowErrorModal(true);
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
    <div className="min-h-screen bg-white font-sans">
      <style jsx global>{`
        input[type="month"]:invalid {
          color: transparent;
        }
        input[type="month"]:valid {
          color: black !important;
        }
        input[type="month"]::-webkit-datetime-edit {
          color: black !important;
        }
        input[type="month"]::-webkit-datetime-edit-month-field,
        input[type="month"]::-webkit-datetime-edit-year-field {
          color: black !important;
        }
        input[type="month"]::-webkit-datetime-edit-fields-wrapper {
          color: black !important;
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/student-housing" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>  
          </Link>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center">
            Pendataan Asrama Mahasiswa
          </h1>
        </div>

        {/* Form */}
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Periode */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <label className="w-full md:w-80 text-black font-semibold text-xl">
                Periode
              </label>
              <div className="relative flex-1 w-full">
                <input
                  type="month"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 pl-3 pr-10 bg-white text-gray-700 placeholder-gray-400 focus:ring-3 focus:ring-green-300"
                  required
                />
              </div>
            </div>

            {/* Nama Asrama */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <label className="w-full md:w-80 text-black font-semibold text-xl">
                Nama Asrama
              </label>
              <div className="relative flex-1 w-full">
                <div
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-700 cursor-pointer flex items-center justify-between"
                  onClick={() => setShowDormDropdown(!showDormDropdown)}
                  style={{ color: formData.dormName ? 'black' : '#9ca3af' }}
                >
                  {dormsLoading ? 'Memuat asrama...' : (formData.dormName || 'Pilih Nama Asrama')}
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                
                {/* Custom Dropdown */}
                {showDormDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto mt-1">
                    {dormOptions.map((dorm) => (
                      <div
                        key={dorm.id}
                        className="px-4 py-2 cursor-pointer hover:bg-green-100 transition-colors text-gray-700"
                        onClick={() => handleSelectDorm(dorm)}
                      >
                        {dorm.name}
                      </div>
                    ))}
                    <div
                      className="px-4 py-2 cursor-pointer hover:bg-green-100 transition-colors border-t border-gray-300 text-gray-700"
                      onClick={handleAddNewDormClick}
                    >
                      + Tambahkan Nama Asrama
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tambah Asrama Baru */}
            {showAddDorm && (
              <div className="flex flex-col gap-4 p-4 bg-gray-50 border rounded-md animate-fadeIn">

                {/* Nama Asrama */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <label className="w-full md:w-80 text-black font-semibold text-xl">
                    Nama Asrama Baru
                  </label>
                  <input
                    type="text"
                    value={newDorm}
                    onChange={(e) => setNewDorm(e.target.value)}
                    placeholder="Contoh: Asrama Baru"
                    className="flex-1 border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:ring-2 focus:ring-green-300"
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <label className="w-full md:w-80 text-black font-semibold text-xl">
                    Gender Asrama
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="flex-1 border border-gray-300 bg-white rounded-md p-2 text-gray-600 focus:ring-2 focus:ring-green-300"
                  >
                    <option value="PUTRA">PUTRA</option>
                    <option value="PUTRI">PUTRI</option>
                    <option value="CAMPUR">CAMPUR</option>
                  </select>
                </div>

                {/* Kapasitas */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <label className="w-full md:w-80 text-black font-semibold text-xl">
                    Kapasitas Penghuni
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCapacity}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || Number(value) >= 0) {
                        setNewCapacity(value);
                      }
                    }}
                    placeholder="Contoh: 24"
                    className="flex-1 border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:ring-2 focus:ring-green-300"
                  />
                </div>

                {/* Power Capacity */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <label className="w-full md:w-80 text-black font-semibold text-xl">
                    Daya Listrik (VA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPower}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || Number(value) >= 0) {
                        setNewPower(value);
                      }
                    }}
                    placeholder="Contoh: 2200"
                    className="flex-1 border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:ring-2 focus:ring-green-300"
                  />
                </div>

                {/* Tombol */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddDorm(false);
                      setNewDorm('');
                      setNewGender('PUTRA');
                      setNewCapacity('');
                      setNewPower('');
                    }}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    onClick={handleAddDorm}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Simpan
                  </button>
                </div>

              </div>
            )}

            {/* Total Konsumsi Listrik */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <label className="w-full md:w-80 text-black font-semibold text-xl">
                Total Konsumsi Listrik (kWh)
              </label>
              <div className="flex-1 relative w-full">
                <input
                  type="number"
                  min="0"
                  name="totalKwh"
                  placeholder="Masukkan Jumlah kWh"
                  value={formData.totalKwh}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) >= 0) {
                      setFormData(prev => ({ ...prev, totalKwh: value }));
                    }
                  }}
                  className="w-full border left-2 border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:ring-3 focus:ring-green-300"
                  required
                />
              </div>
            </div>

            {/* Tagihan Listrik */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <label className="w-full md:w-80 text-black font-semibold text-xl">
                Tagihan Listrik (Rp/Bulan)
              </label>
              <div className="flex-1 relative w-full">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600">
                  Rp.
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  name="billAmount"
                  placeholder="Masukkan jumlah tagihan"
                  value={
                    formData.billAmount === ""
                      ? ""
                      : new Intl.NumberFormat("id-ID").format(Number(formData.billAmount))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    setFormData(prev => ({ ...prev, billAmount: rawValue }));
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 pl-10 bg-white text-gray-700 focus:ring-3 focus:ring-green-300"
                  required
                />
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-6 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-black hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-md transition duration-200 text-sm sm:text-base disabled:opacity-60"
              >
                {loading ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Blur Overlay */}
          <div 
            className="absolute inset-0 backdrop-blur-md bg-white/20"
            onClick={handleCloseSuccessModal}
          ></div>
          
          {/* Modal Content */}
          <div 
            className="relative bg-white rounded-lg"
            style={{
              width: '408px',
              height: '226px',
              boxShadow: '0 35px 60px -12px rgba(94, 161, 39, 0.5), 0 0 0 1px rgba(94, 161, 39, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#5EA127',
                  boxShadow: '0 15px 35px -5px rgba(94, 161, 39, 0.6), 0 0 0 1px rgba(94, 161, 39, 0.2)'
                }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Data anda berhasil disimpan!
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Blur Overlay */}
          <div 
            className="absolute inset-0 backdrop-blur-md bg-white/20"
            onClick={handleCloseErrorModal}
          ></div>
          
          {/* Modal Content */}
          <div 
            className="relative bg-white rounded-lg p-8"
            style={{
              width: '408px',
              height: '226px',
              boxShadow: '0 35px 60px -12px rgba(239, 68, 68, 0.5), 0 0 0 1px rgba(239, 68, 68, 0.1)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseErrorModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#ef4444',
                  boxShadow: '0 15px 35px -5px rgba(239, 68, 68, 0.6), 0 0 0 1px rgba(239, 68, 68, 0.2)'
                }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Data anda tidak berhasil disimpan!
              </h3>
              <p className="text-sm text-gray-500">
                {errorMessage || '*Silahkan cek kembali data yang anda inputkan'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
