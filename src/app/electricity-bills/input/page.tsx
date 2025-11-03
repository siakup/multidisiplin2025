'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ElectricityBillsInputPage() {
  const [formData, setFormData] = useState({
    namaPanel: '',
    bulan: '',
    jumlahKwh: '',
    tagihanListrik: '',
    panelBaru: ''
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showNamaPanelDropdown, setShowNamaPanelDropdown] = useState(false);
  const [showPanelBaruInput, setShowPanelBaruInput] = useState(false);
  const [namaPanelOptions, setNamaPanelOptions] = useState([
    'GL 01', 'GL 02', 'GOR 01', 'GOR 02', 'Modular 01'
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Jika memilih "Tambah Nama Panel Gedung", validasi panelBaru harus diisi
    let isAllFieldsFilled = Boolean(formData.namaPanel && formData.bulan && formData.jumlahKwh && formData.tagihanListrik);
    
    if (showPanelBaruInput) {
      isAllFieldsFilled = isAllFieldsFilled && formData.panelBaru.trim() !== '';
      
      // Jika semua valid, tambahkan panel baru ke dalam daftar opsi
      if (isAllFieldsFilled && formData.panelBaru.trim() !== '' && !namaPanelOptions.includes(formData.panelBaru)) {
        setNamaPanelOptions(prev => [...prev, formData.panelBaru]);
        // Update namaPanel dengan nilai panel baru
        setFormData(prev => ({
          ...prev,
          namaPanel: formData.panelBaru
        }));
      }
    }
    
    // Validasi input harus berupa angka untuk kWh dan Tagihan
    const isJumlahKwhValid = /^\d+$/.test(formData.jumlahKwh);
    const isTagihanListrikValid = /^\d+$/.test(formData.tagihanListrik);
    
    // Jika ada field kosong atau input angka tidak valid, tampilkan error
    if (!isAllFieldsFilled || !isJumlahKwhValid || !isTagihanListrikValid) {
      setShowErrorModal(true);
      return;
    }
    
    // Logic untuk menyimpan data akan ditambahkan nanti
    console.log('Data yang disimpan:', formData);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Redirect kembali ke halaman electricity bills
    window.location.href = '/electricity-bills';
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleSelectOption = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setShowNamaPanelDropdown(false);
    
    // Jika memilih "Tambah Nama Panel Gedung", tampilkan form Panel Baru
    if (value === 'Tambah Nama Panel Gedung') {
      setShowPanelBaruInput(true);
    } else {
      setShowPanelBaruInput(false);
    }
  };

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
                  {formData.namaPanel || 'Pilih nama panel gedung'}
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
                    {namaPanelOptions.map((option, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                        style={{
                          backgroundColor: 'white',
                          color: 'black',
                          fontSize: '16px'
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.backgroundColor = '#D0E7BD'; }}
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.backgroundColor = 'white'; }}
                        onClick={() => handleSelectOption('namaPanel', option)}
                      >
                        {option}
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
                      onClick={() => handleSelectOption('namaPanel', 'Tambah Nama Panel Gedung')}
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
                  type="text"
                  name="jumlahKwh"
                  value={formData.jumlahKwh}
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

            {/* Tagihan Listrik */}
            <div className="flex items-center gap-4 justify-center">
              <label className="font-medium text-gray-900 flex-shrink-0" style={{fontSize: '20px', width: '200px'}}>
                Tagihan Listrik :
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  name="tagihanListrik"
                  value={formData.tagihanListrik}
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
                className="text-white rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: '#172813',
                  width: '500px',
                  height: '45px',
                  fontSize: '20px'
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = '#1a2f15'; }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = '#172813'; }}
              >
                Simpan Data
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
                *Silahkan cek kembali data yang anda inputkan
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
