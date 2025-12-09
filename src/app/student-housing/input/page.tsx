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
      setErrorMessage(err.message || 'Gagal menyimpan data');
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
        <h1 className="font-bold text-black text-center mb-12" style={{fontSize: '48px'}}>
          Masukkan Data Konsumsi Listrik Asrama
        </h1>

        {/* Form */}
        <div className="bg-white mx-auto flex justify-center">
          <form onSubmit={handleSubmit} style={{gap: '30px', display: 'flex', flexDirection: 'column'}}>
            {/* Nama Asrama */}
            <div className="flex items-center gap-4 justify-center">
              <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '20px', width: '200px'}}>
                Nama Asrama :
              </label>
              <div className="relative flex-1">
                <div
                  className="border rounded-lg bg-white cursor-pointer"
                  style={{
                    width: '648px',
                    height: '45px',
                    borderColor: '#646F61',
                    color: formData.dormName ? 'black' : '#9ca3af',
                    fontSize: '16px',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onClick={() => setShowDormDropdown(!showDormDropdown)}
                >
                  {dormsLoading ? 'Memuat asrama...' : (formData.dormName || 'Pilih nama asrama')}
                </div>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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
                
                {/* Custom Dropdown */}
                {showDormDropdown && (
                  <div 
                    className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                    style={{ borderColor: '#646F61' }}
                  >
                    {dormOptions.map((dorm) => (
                      <div
                        key={dorm.id}
                        className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                        style={{
                          backgroundColor: 'white',
                          color: 'black',
                          fontSize: '16px'
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.backgroundColor = '#D0E7BD'; }}
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.backgroundColor = 'white'; }}
                        onClick={() => handleSelectDorm(dorm)}
                      >
                        {dorm.name}
                      </div>
                    ))}
                    <div
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors border-t"
                      style={{
                        backgroundColor: 'white',
                        color: 'black',
                        fontSize: '16px',
                        borderTopColor: '#e5e7eb'
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.backgroundColor = '#D0E7BD'; }}
                      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.backgroundColor = 'white'; }}
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
              <div className="flex flex-col gap-6 p-6 bg-gray-50 border rounded-lg" style={{ borderColor: '#646F61', marginLeft: '220px', width: '648px' }}>
                
                {/* Nama Asrama Baru */}
                <div className="flex items-center gap-4">
                  <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '16px', width: '150px'}}>
                    Nama Asrama Baru :
                  </label>
                  <input
                    type="text"
                    value={newDorm}
                    onChange={(e) => setNewDorm(e.target.value)}
                    placeholder="Contoh: Asrama Baru"
                    className="flex-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
                    style={{
                      height: '40px',
                      borderColor: '#646F61',
                      color: 'black',
                      fontSize: '14px',
                      padding: '0 12px'
                    }}
                  />
                </div>

                {/* Gender */}
                <div className="flex items-center gap-4">
                  <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '16px', width: '150px'}}>
                    Gender Asrama :
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="flex-1 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 transition duration-200"
                    style={{
                      height: '40px',
                      borderColor: '#646F61',
                      color: 'black',
                      fontSize: '14px',
                      padding: '0 12px'
                    }}
                  >
                    <option value="PUTRA">PUTRA</option>
                    <option value="PUTRI">PUTRI</option>
                    <option value="CAMPUR">CAMPUR</option>
                  </select>
                </div>

                {/* Kapasitas */}
                <div className="flex items-center gap-4">
                  <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '16px', width: '150px'}}>
                    Kapasitas Penghuni :
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCapacity}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || Number(value) >= 0) {
                        setNewCapacity(value);
                      }
                    }}
                    placeholder="Contoh: 24"
                    className="flex-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
                    style={{
                      height: '40px',
                      borderColor: '#646F61',
                      color: 'black',
                      fontSize: '14px',
                      padding: '0 12px'
                    }}
                  />
                </div>

                {/* Power Capacity */}
                <div className="flex items-center gap-4">
                  <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '16px', width: '150px'}}>
                    Daya Listrik (VA) :
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPower}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || Number(value) >= 0) {
                        setNewPower(value);
                      }
                    }}
                    placeholder="Contoh: 2200"
                    className="flex-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
                    style={{
                      height: '40px',
                      borderColor: '#646F61',
                      color: 'black',
                      fontSize: '14px',
                      padding: '0 12px'
                    }}
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
                    className="px-6 py-2 rounded-lg font-medium transition-colors duration-200 border"
                    style={{
                      backgroundColor: '#fff',
                      borderColor: '#d1d5db',
                      color: '#374151',
                      fontSize: '14px',
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDorm}
                    className="px-6 py-2 rounded-lg font-medium text-white transition-colors duration-200"
                    style={{
                      backgroundColor: '#5EA127',
                      fontSize: '14px',
                    }}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            )}

            {/* Bulan */}
            <div className="flex items-center gap-4 justify-center">
              <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '20px', width: '200px'}}>
                Bulan :
              </label>
              <div className="relative flex-1">
                <input
                  type="month"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
                  style={{
                    width: '648px',
                    height: '45px',
                    borderColor: '#646F61',
                    color: 'black',
                    fontSize: '16px',
                    padding: '0 16px'
                  }}
                  required
                />
              </div>
            </div>

            {/* Jumlah kWh */}
            <div className="flex items-center gap-4 justify-center">
              <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '20px', width: '200px'}}>
                Jumlah kWh :
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  name="totalKwh"
                  value={formData.totalKwh}
                  onChange={handleInputChange}
                  placeholder="Ketik disini !"
                  className="border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
                  style={{
                    width: '648px',
                    height: '45px',
                    borderColor: '#646F61',
                    color: 'black',
                    fontSize: '16px',
                    padding: '0 16px'
                  }}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Hanya angka saja. Contoh: 4000
                </p>
              </div>
            </div>

            {/* Jumlah Tagihan */}
            <div className="flex items-center gap-4 justify-center">
              <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '20px', width: '200px'}}>
                Jumlah Tagihan :
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  name="billAmount"
                  value={formData.billAmount}
                  onChange={handleInputChange}
                  placeholder="Ketik disini !"
                  className="border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
                  style={{
                    width: '648px',
                    height: '45px',
                    borderColor: '#646F61',
                    color: 'black',
                    fontSize: '16px',
                    padding: '0 16px'
                  }}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Hanya angka saja. Contoh: 800000
                </p>
              </div>
            </div>


            {/* Submit Button */}
            <div className="flex justify-center" style={{marginTop: '91px'}}>
              <button
                type="submit"
                disabled={loading}
                className="text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-60"
                style={{
                  backgroundColor: '#172813',
                  width: '500px',
                  height: '45px',
                  fontSize: '20px'
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = '#1a2f15'; }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = '#172813'; }}
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
