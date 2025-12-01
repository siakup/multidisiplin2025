'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/common/utils/api';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

export default function ImportDataPage() {
  // Auto logout setelah 5 menit tidak ada aktivitas
  useAutoLogout({ idleTime: 300000 });

  const { isAuthorized, isChecking } = useRequireAuth({
    allowedRoles: ['Facility management', 'facility_management', 'FACILITY_MANAGEMENT'],
    allowedUsernames: ['Facility management'],
    fallbackPath: '/dashboard',
  });

  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      console.log('File dropped:', e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      console.log('File selected:', e.target.files[0]);
    }
  };

  const handleSelectFile = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const parseCSV = (text: string): string[][] => {
    const rows: string[][] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.trim()) {
        // Simple CSV parsing (handles quoted fields)
        const row: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            row.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        row.push(current.trim());
        rows.push(row);
      }
    }
    
    return rows;
  };

  const handleImportData = async () => {
    if (!selectedFile) {
      setErrorMessage('Pilih file terlebih dahulu');
      setShowErrorModal(true);
      return;
    }

    if (!selectedFile.name.endsWith('.csv')) {
      setErrorMessage('File harus berformat CSV');
      setShowErrorModal(true);
      return;
    }

    setImporting(true);
    setErrorMessage('');

    try {
      // Read file
      const text = await selectedFile.text();
      const rows = parseCSV(text);

      if (rows.length < 2) {
        throw new Error('File CSV minimal harus memiliki header dan 1 baris data');
      }

      // Skip header row
      const dataRows = rows.slice(1);
      const errors: string[] = [];
      let successCount = 0;

      // Get panels for mapping
      const panels = await api.get<Array<{ id: number; namePanel: string }>>('/panel');
      const panelMap = new Map(panels.map(p => [p.namePanel.toLowerCase(), p.id]));

      // Process each row
      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        
        if (row.length < 4) {
          errors.push(`Baris ${i + 2}: Data tidak lengkap (minimal 4 kolom: Nama Panel, Bulan, kWh, Jumlah Tagihan)`);
          continue;
        }

        try {
          const panelName = row[0]?.trim() || '';
          const bulan = row[1]?.trim() || '';
          const kwhUse = parseFloat(row[2]?.trim() || '0');
          const totalBills = parseFloat(row[3]?.replace(/[^\d.]/g, '') || '0');

          // Validasi
          if (!panelName) {
            errors.push(`Baris ${i + 2}: Nama Panel kosong`);
            continue;
          }

          const panelId = panelMap.get(panelName.toLowerCase());
          if (!panelId) {
            errors.push(`Baris ${i + 2}: Panel "${panelName}" tidak ditemukan`);
            continue;
          }

          if (!bulan || !/^\d{4}-\d{2}$/.test(bulan)) {
            errors.push(`Baris ${i + 2}: Format bulan tidak valid (harus YYYY-MM)`);
            continue;
          }

          if (isNaN(kwhUse) || kwhUse <= 0) {
            errors.push(`Baris ${i + 2}: kWh tidak valid`);
            continue;
          }

          if (isNaN(totalBills) || totalBills <= 0) {
            errors.push(`Baris ${i + 2}: Jumlah tagihan tidak valid`);
            continue;
          }

          // Create bill
          const billingMonth = new Date(bulan + '-01');
          const userId = 1; // TODO: Get from auth context

          await api.post('/electricity-bills', {
            panelId,
            userId,
            billingMonth: billingMonth.toISOString(),
            kwhUse,
            totalBills,
            vaStatus: ''
          });

          successCount++;
        } catch (err: any) {
          errors.push(`Baris ${i + 2}: ${err.message || 'Gagal menyimpan'}`);
        }
      }

      if (errors.length > 0 && successCount === 0) {
        throw new Error(`Semua data gagal diimport:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... dan ${errors.length - 5} error lainnya` : ''}`);
      }

      if (successCount > 0) {
        setShowSuccessModal(true);
      }

      if (errors.length > 0 && successCount > 0) {
        setErrorMessage(`Berhasil mengimport ${successCount} data. ${errors.length} data gagal:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... dan ${errors.length - 5} error lainnya` : ''}`);
        setShowErrorModal(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengimport data');
      setShowErrorModal(true);
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const headers = ['Nama Panel', 'Bulan (YYYY-MM)', 'kWh', 'Jumlah Tagihan'];
    const exampleRow = ['GL 01', '2024-01', '1500.50', '2500000'];
    
    const csvContent = [
      headers.join(','),
      exampleRow.join(','),
      'GL 02,2024-02,2000.00,3000000'
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_import_electricity.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success modal
    setShowDownloadModal(true);
  };

  const handleCloseDownloadModal = () => {
    setShowDownloadModal(false);
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

        {/* Page Header */}
        <div style={{marginBottom: '49px'}}>
          {/* Title */}
          <h1 className="font-bold text-black text-center mb-8" style={{fontSize: '48px'}}>
            Pilih Data
          </h1>
          
          {/* Action Buttons - Sejajar dengan area drop file */}
          <div className="flex justify-center">
            <div style={{width: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center justify-center space-x-2 text-white rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: '#5EA127', 
                  fontSize: '20px',
                  width: '251px',
                  height: '45px'
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = '#6bb52d'; }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = '#5EA127'; }}
              >
                <span>Unduh Template</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
              
              <button
                onClick={handleSelectFile}
                className="inline-flex items-center justify-center space-x-2 text-white rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: '#5EA127', 
                  fontSize: '20px',
                  width: '251px',
                  height: '45px'
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = '#6bb52d'; }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = '#5EA127'; }}
              >
                <span>Pilih File</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* File Upload Zone */}
        <div className="flex justify-center">
          <div
            className={`relative border-2 border-dashed rounded-lg transition-colors duration-200 ${
              dragActive ? 'border-green-600' : ''
            }`}
            style={{
              width: '600px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: dragActive ? '#EFF6E9' : '#EFF6E9',
              borderColor: '#5EA127'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Hidden file input */}
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {/* Upload Icon */}
            <svg
              className="w-16 h-16 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{color: '#646F61'}}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            
            {/* Instruction Text */}
            <p 
              className="mb-2"
              style={{
                color: '#646F61',
                fontSize: '20px',
                fontWeight: '600'
              }}
            >
              {selectedFile ? selectedFile.name : 'Pilih file yang ingin anda inputkan'}
            </p>
            
            {/* File Type Specification */}
            <p 
              style={{
                color: '#646F61',
                fontSize: '20px',
                fontWeight: '600'
              }}
            >
              File harus .csv
            </p>
          </div>
        </div>

        {/* Import Data Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleImportData}
            disabled={importing || !selectedFile}
            className="inline-flex items-center justify-center text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#172813',
              fontSize: '20px',
              width: '600px',
              height: '45px'
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { 
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = '#1a2f15';
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { 
              e.currentTarget.style.backgroundColor = '#172813';
            }}
          >
            <span>{importing ? 'Mengimport...' : 'Import Data'}</span>
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ paddingTop: '80px', top: 0 }}>
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => { setShowSuccessModal(false); router.push('/electricity-bills'); }}></div>
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
            <button
              onClick={() => { setShowSuccessModal(false); router.push('/electricity-bills'); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Data berhasil diimport
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ paddingTop: '80px', top: 0 }}>
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowErrorModal(false)}></div>
          <div 
            className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4"
            style={{
              boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.5)',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-100">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Gagal Import Data
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-line text-left">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Download Success Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Blur Overlay */}
          <div 
            className="absolute inset-0 backdrop-blur-md bg-white/20"
            onClick={handleCloseDownloadModal}
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
              onClick={handleCloseDownloadModal}
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
                Template berhasil diunduh
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
