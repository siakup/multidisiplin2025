'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/common/utils/api';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

interface Panel {
  id: number;
  namePanel: string;
}

export default function ElectricityBillsInputPage() {
  // Auto logout setelah 5 menit tidak ada aktivitas
  useAutoLogout({ idleTime: 300000 }); // 5 menit = 300000ms

  const { isAuthorized, isChecking } = useRequireAuth({
    allowedRoles: ['Facility management', 'facility_management', 'FACILITY_MANAGEMENT'],
    allowedUsernames: ['Facility management'],
    fallbackPath: '/dashboard',
  });

  const router = useRouter();
  const [formData, setFormData] = useState({
    namaPanel: '',
    panelId: 0,
    bulan: '',
    jumlahKwh: '',
    tagihanListrik: '',
    panelBaru: ''
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showNamaPanelDropdown, setShowNamaPanelDropdown] = useState(false);
  const [showPanelBaruInput, setShowPanelBaruInput] = useState(false);
  const [namaPanelOptions, setNamaPanelOptions] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(false);
  const [panelsLoading, setPanelsLoading] = useState(true);

  useEffect(() => {
    fetchPanels();
  }, []);

  const fetchPanels = async () => {
    try {
      setPanelsLoading(true);
      const panels = await api.get<Panel[]>('/panel');
      setNamaPanelOptions(panels);
    } catch (err: any) {
      console.error('Error fetching panels:', err);
      setErrorMessage('Gagal memuat daftar panel');
    } finally {
      setPanelsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    try {
      // Validasi field kosong - termasuk panel baru jika dipilih
      if (!formData.bulan || !formData.jumlahKwh || !formData.tagihanListrik) {
        throw new Error('Silahkan isi field yang kosong');
      }

      // Jika memilih tambah panel baru, validasi panelBaru harus diisi
      if (showPanelBaruInput && !formData.panelBaru.trim()) {
        throw new Error('Silahkan isi field Panel Baru yang kosong');
      }

      // Validasi nama panel harus dipilih atau panel baru diisi
      if (!showPanelBaruInput && !formData.namaPanel) {
        throw new Error('Silahkan pilih atau tambah nama panel');
      }

      // Jika panel baru, buat panel dulu
      let panelId = formData.panelId;
      if (showPanelBaruInput && formData.panelBaru.trim()) {
        const newPanel = await api.post<Panel>('/panel', {
          namePanel: formData.panelBaru.trim()
        });
        panelId = newPanel.id;
      } else if (!panelId) {
        // Cari panel berdasarkan name
        const selectedPanel = namaPanelOptions.find((p: Panel) => p.namePanel === formData.namaPanel);
        if (!selectedPanel) {
          throw new Error('Panel tidak ditemukan');
        }
        panelId = selectedPanel.id;
      }

      // Validasi input angka
      const kwhValue = parseFloat(formData.jumlahKwh);
      const tagihanValue = parseFloat(formData.tagihanListrik);
      
      if (isNaN(kwhValue) || kwhValue <= 0) {
        throw new Error('Jumlah kWh harus berupa angka yang valid');
      }
      
      if (isNaN(tagihanValue) || tagihanValue <= 0) {
        throw new Error('Tagihan listrik harus berupa angka yang valid');
      }

      const userId = 1; 

      // Submit data ke API
      const billingMonth = new Date(formData.bulan + '-01');
      
      await api.post('/electricity-bills', {
        panelId,
        userId,
        billingMonth: billingMonth.toISOString(),
        kwhUse: kwhValue,
        totalBills: tagihanValue,
        vaStatus: '' // Optional
      });

      setShowSuccessModal(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan data');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push('/electricity-bills');
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleSelectOption = (panel: Panel) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      namaPanel: panel.namePanel,
      panelId: panel.id
    }));
    setShowNamaPanelDropdown(false);
    setShowPanelBaruInput(false);
  };

  const handleSelectNewPanel = () => {
    setShowPanelBaruInput(true);
    setShowNamaPanelDropdown(false);
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
        * {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        select option {
          background-color: white !important;
          color: black !important;
        }
        select option:hover,
        select option:active,
        select option:focus {
          background-color: #D0E7BD !important;
          color: black !important;
        }
        select option:checked {
          background-color: #D0E7BD !important;
          color: black !important;
        }
        select:focus option:checked {
          background-color: #D0E7BD !important;
          color: black !important;
        }
        select:focus option:hover {
          background-color: #D0E7BD !important;
          color: black !important;
        }
        input[type="month"]:invalid {
          color: transparent;
        }
        input[type="month"]:valid {
          color: black !important;
        }
        input[type="month"]:invalid::before {
          content: "Pilih Bulan";
          color: #9ca3af;
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
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
        input[type="month"]:valid::before {
          content: attr(value);
          color: black !important;
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        input[type="month"]::-webkit-datetime-edit-text {
          display: none;
        }
        input[type="month"]::-webkit-datetime-edit-month-field {
          display: none;
        }
        input[type="month"]::-webkit-datetime-edit-year-field {
          display: none;
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/electricity-bills" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200">
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
          Masukkan Data Tagihan
        </h1>

        {/* Form */}
        <div className="bg-white mx-auto flex justify-center">
          <form onSubmit={handleSubmit} style={{gap: '30px', display: 'flex', flexDirection: 'column'}}>
            {/* Nama Panel */}
            <div className="flex items-center gap-4 justify-center">
              <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '20px', width: '200px'}}>
                Nama Panel :
              </label>
              <div className="relative flex-1">
                <div
                  className="border rounded-lg bg-white cursor-pointer"
                  style={{
                    width: '648px',
                    height: '45px',
                    borderColor: '#646F61',
                    color: formData.namaPanel ? 'black' : '#9ca3af',
                    fontSize: '16px',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onClick={() => setShowNamaPanelDropdown(!showNamaPanelDropdown)}
                >
                  {panelsLoading ? 'Memuat panel...' : (formData.namaPanel || 'Pilih nama panel gedung')}
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
                {showNamaPanelDropdown && (
                  <div 
                    className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                    style={{ borderColor: '#646F61' }}
                  >
                    {namaPanelOptions.map((panel) => (
                      <div
                        key={panel.id}
                        className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                        style={{
                          backgroundColor: 'white',
                          color: 'black',
                          fontSize: '16px'
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.backgroundColor = '#D0E7BD'; }}
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.backgroundColor = 'white'; }}
                        onClick={() => handleSelectOption(panel)}
                      >
                        {panel.namePanel}
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
                      onClick={handleSelectNewPanel}
                    >
                      Tambah Nama Panel Gedung
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Panel Baru Input - Muncul ketika memilih "Tambah Nama Panel Gedung" */}
            {showPanelBaruInput && (
              <div className="flex items-center gap-4 justify-center">
                <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '20px', width: '200px'}}>
                  Panel Baru :
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="panelBaru"
                    value={formData.panelBaru}
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
                    Penulisan &quot;NamaGedung NomorPanel&quot;. Contoh: Modular 01
                  </p>
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
                  name="bulan"
                  value={formData.bulan}
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
                  type="number"
                  min="0"
                  name="jumlahKwh"
                  value={formData.jumlahKwh}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || e.key === '.' || e.key === '=') {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || Number(value) >= 0) {
                      setFormData(prev => ({ ...prev, jumlahKwh: value }));
                    }
                  }}
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

            {/* Tagihan Listrik */}
            <div className="flex items-center gap-4 justify-center">
              <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '20px', width: '200px'}}>
                Tagihan Listrik :
              </label>
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  name="tagihanListrik"
                  value={formData.tagihanListrik}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || e.key === '.' || e.key === '=') {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || Number(value) >= 0) {
                      setFormData(prev => ({ ...prev, tagihanListrik: value }));
                    }
                  }}
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
