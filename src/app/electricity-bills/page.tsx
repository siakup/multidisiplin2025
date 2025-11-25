'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/common/utils/api';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

interface ElectricityBill {
  id: number;
  panel: {
    id: number;
    namePanel: string;
  };
  user: {
    id: number;
    username: string | null;
  };
  billingMonth: string;
  kwhUse: number;
  totalBills: number;
  vaStatus?: string;
}

export default function ElectricityBillsPage() {
  // Auto logout setelah 5 menit tidak ada aktivitas
  useAutoLogout({ idleTime: 300000 }); // 5 menit = 300000ms

  const { isAuthorized, isChecking } = useRequireAuth({
    allowedRoles: ['Facility management', 'facility_management', 'FACILITY_MANAGEMENT'],
    allowedUsernames: ['Facility management'],
    fallbackPath: '/dashboard',
  });

  const router = useRouter();
  const [bills, setBills] = useState<ElectricityBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportErrorMessage, setExportErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<ElectricityBill[]>('/electricity-bills');
      setBills(data || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data');
      console.error('Error fetching bills:', err);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('id-ID', { month: 'long' });
    return `${year} ${month}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const handleEdit = (bill: ElectricityBill) => {
    router.push(`/electricity-bills/edit/${bill.id}`);
  };

  const handleExportData = () => {
    try {
      if (!bills || bills.length === 0) {
        setExportErrorMessage('Tidak ada data untuk diekspor');
        setShowExportErrorModal(true);
        return;
      }

      // Prepare CSV header
      const headers = ['No', 'Nama Panel', 'Bulan', 'kWh', 'Jumlah Tagihan'];
      
      // Convert bills to CSV rows
      const csvRows = [
        headers.join(','),
        ...bills.map((bill, index) => {
          const date = new Date(bill.billingMonth);
          const year = date.getFullYear();
          const month = date.toLocaleDateString('id-ID', { month: 'long' });
          const monthYear = `${year} ${month}`;
          // Handle Decimal type from Prisma (might be string or number)
          const totalBillsValue = typeof bill.totalBills === 'string' 
            ? parseFloat(bill.totalBills) 
            : Number(bill.totalBills);
          const kwhValue = typeof bill.kwhUse === 'string'
            ? parseFloat(bill.kwhUse)
            : Number(bill.kwhUse);
          const totalBills = totalBillsValue.toLocaleString('id-ID');
          
          return [
            index + 1,
            `"${bill.panel?.namePanel || ''}"`,
            `"${monthYear}"`,
            kwhValue,
            totalBills,
          ].join(',');
        })
      ];
      
      // Create CSV content
      const csvContent = csvRows.join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `data_tagihan_listrik_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Tampilkan modal success
      setShowExportSuccessModal(true);
    } catch (err: any) {
      console.error('Export error:', err);
      setExportErrorMessage(err.message || 'Terjadi kesalahan saat mengekspor data');
      setShowExportErrorModal(true);
    }
  };

  const handleCloseExportSuccessModal = () => {
    setShowExportSuccessModal(false);
  };

  const handleCloseExportErrorModal = () => {
    setShowExportErrorModal(false);
    setExportErrorMessage('');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Page Title */}
        <h1 className="font-bold text-black text-center mb-8" style={{fontSize: '48pt'}}>
          Data Tagihan Listrik
        </h1>

        {/* Action Buttons */}
        <div className="flex justify-center items-center mb-4">
          {/* Left side buttons */}
          <div className="flex" style={{gap: '17px'}}>
            <button 
              className="text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200" 
              style={{backgroundColor: '#172813', fontSize: '20px'}} 
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = '#1a2f15'; }} 
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.backgroundColor = '#172813'; }}
              onClick={handleExportData}
            >
              Export Data
            </button>
            <Link
              href="/electricity-bills/import"
              className="text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              style={{backgroundColor: '#172813', fontSize: '20px'}}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.backgroundColor = '#1a2f15'; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.backgroundColor = '#172813'; }}
            >
              Import Data
            </Link>
          </div>

          {/* Spacer */}
          <div style={{width: '532px'}}></div>

          {/* Right side button */}
          <div>
            <Link
              href="/electricity-bills/input"
              className="inline-flex items-center space-x-2 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              style={{backgroundColor: '#5EA127', fontSize: '20px'}}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.backgroundColor = '#6bb52d'; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.backgroundColor = '#5EA127'; }}
            >
              <span>Tambah Data</span>
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex justify-center" style={{marginTop: '39px'}}>
          <div className="bg-white rounded-lg overflow-hidden" style={{
            width: 'calc(170px + 17px + 170px + 532px + 210px)',
            border: '1px solid #345915'
          }}>
            <table className="w-full" style={{borderCollapse: 'collapse'}}>
            {/* Table Header */}
            <thead style={{backgroundColor: '#93C06E'}}>
              <tr>
                <th className="px-6 py-4 text-center text-gray-900 border-b border-r" style={{fontSize: '20px', fontWeight: '600', borderColor: '#345915'}}>
                  No.
                </th>
                <th className="px-6 py-4 text-center text-gray-900 border-b border-r" style={{fontSize: '20px', fontWeight: '600', borderColor: '#345915'}}>
                  Nama Panel
                </th>
                <th className="px-6 py-4 text-center text-gray-900 border-b border-r" style={{fontSize: '20px', fontWeight: '600', borderColor: '#345915'}}>
                  Bulan
                </th>
                <th className="px-6 py-4 text-center text-gray-900 border-b border-r" style={{fontSize: '20px', fontWeight: '600', borderColor: '#345915'}}>
                  kWh
                </th>
                <th className="px-6 py-4 text-center text-gray-900 border-b border-r" style={{fontSize: '20px', fontWeight: '600', borderColor: '#345915'}}>
                  Jumlah Tagihan
                </th>
                <th className="px-6 py-4 text-center text-gray-900 border-b" style={{fontSize: '20px', fontWeight: '600', borderColor: '#345915'}}>
                  Action
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-gray-500" style={{fontSize: '20px'}}>
                    Memuat data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-red-500" style={{fontSize: '20px'}}>
                    {error}
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-gray-500" style={{fontSize: '20px'}}>
                    Belum ada data
                  </td>
                </tr>
              ) : (
                bills.map((bill, index) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-6 whitespace-nowrap text-gray-900 border-r text-center" style={{borderColor: '#345915', borderBottom: index === bills.length - 1 ? 'none' : '1px solid #345915', fontSize: '20px'}}>
                      {index + 1}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-gray-900 border-r text-center" style={{borderColor: '#345915', borderBottom: index === bills.length - 1 ? 'none' : '1px solid #345915', fontSize: '20px'}}>
                      {bill.panel?.namePanel || '-'}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-gray-900 border-r text-center" style={{borderColor: '#345915', borderBottom: index === bills.length - 1 ? 'none' : '1px solid #345915', fontSize: '20px'}}>
                      {formatDate(bill.billingMonth)}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-gray-900 border-r text-center" style={{borderColor: '#345915', borderBottom: index === bills.length - 1 ? 'none' : '1px solid #345915', fontSize: '20px'}}>
                      {typeof bill.kwhUse === 'string' ? parseFloat(bill.kwhUse) : Number(bill.kwhUse)}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-gray-900 border-r text-center" style={{borderColor: '#345915', borderBottom: index === bills.length - 1 ? 'none' : '1px solid #345915', fontSize: '20px'}}>
                      {formatCurrency(typeof bill.totalBills === 'string' ? parseFloat(bill.totalBills) : Number(bill.totalBills))}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-gray-900 text-center" style={{borderBottom: index === bills.length - 1 ? 'none' : '1px solid #345915', fontSize: '20px'}}>
                      <div className="flex justify-center gap-2">
                        <button
                          className="flex items-center justify-center rounded transition-colors duration-200 hover:opacity-80"
                          style={{
                            backgroundColor: '#F59E0B',
                            width: '32px',
                            height: '32px',
                            padding: '0'
                          }}
                          onClick={() => handleEdit(bill)}
                          title="Edit"
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Export Success Modal */}
        {showExportSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ paddingTop: '80px', top: 0 }}>
            <div 
              className="absolute inset-0 backdrop-blur-md bg-white/20"
              onClick={handleCloseExportSuccessModal}
            ></div>
            
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
                onClick={handleCloseExportSuccessModal}
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
                  Data berhasil diekspor!
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Export Error Modal */}
        {showExportErrorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ paddingTop: '80px', top: 0 }}>
            <div 
              className="absolute inset-0 backdrop-blur-md bg-white/20"
              onClick={handleCloseExportErrorModal}
            ></div>
            
            <div 
              className="relative bg-white rounded-lg p-8"
              style={{
                width: '408px',
                height: '226px',
                boxShadow: '0 35px 60px -12px rgba(239, 68, 68, 0.5), 0 0 0 1px rgba(239, 68, 68, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <button
                onClick={handleCloseExportErrorModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

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

              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Data tidak berhasil diekspor!
                </h3>
                <p className="text-sm text-gray-500">
                  {exportErrorMessage || '*Terjadi kesalahan saat mengekspor data'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}