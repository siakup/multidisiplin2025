'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/common/utils/api';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';

interface DormRecord {
  id: string;
  period: string;
  dormName: string;
  totalKwh: number;
  billAmount: number;
  createdAt: string;
  createdBy: number;
}

export default function StudentHousingPage() {
  useAutoLogout({ idleTime: 300000 });

  const router = useRouter();
  const [records, setRecords] = useState<DormRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<DormRecord | null>(null);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');

    if (!token || !role) {
      router.push('/login');
      return;
    }

    const allowedRoles = ['Student Housing', 'student housing'];
    if (!allowedRoles.includes(role)) {
      router.push('/dashboard');
      return;
    }

    fetchRecords();
  }, [router]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<DormRecord[]>('/dorm-record');
      setRecords(data || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data');
      console.error('Error fetching records:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('id-ID', { month: 'long' });
    return `${month} ${year}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const handleDeleteClick = (record: DormRecord) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    try {
      await api.delete(`/dorm-record/${recordToDelete.id}`);
      await fetchRecords();
      setShowDeleteModal(false);
      setRecordToDelete(null);
      setShowDeleteSuccessModal(true);
    } catch (err: any) {
      console.error('Error deleting record:', err);
      setDeleteErrorMessage(err.message || 'Gagal menghapus data');
      setShowDeleteModal(false);
      setRecordToDelete(null);
      setShowDeleteErrorModal(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Page Title */}
        <h1 className="font-bold text-black text-center mb-8" style={{ fontSize: '48pt' }}>
          Data Konsumsi Listrik Asrama
        </h1>

        {/* Action Buttons */}
        <div className="flex justify-end mb-4">
          <Link
            href="/student-housing/input"
            className="inline-flex items-center space-x-2 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            style={{ backgroundColor: '#5EA127', fontSize: '20px' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.backgroundColor = '#6bb52d';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.backgroundColor = '#5EA127';
            }}
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

        {/* Data Table */}
        <div className="flex justify-center" style={{ marginTop: '39px' }}>
          <div
            className="bg-white rounded-lg overflow-hidden"
            style={{
              width: 'calc(170px + 17px + 170px + 532px + 210px)',
              border: '1px solid #345915',
            }}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: '#345915' }}>
                <tr>
                  <th
                    className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider"
                    style={{ width: '80px' }}
                  >
                    No
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider"
                    style={{ width: '250px' }}
                  >
                    Nama Asrama
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider"
                    style={{ width: '180px' }}
                  >
                    Bulan
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider"
                    style={{ width: '150px' }}
                  >
                    kWh
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider"
                    style={{ width: '200px' }}
                  >
                    Tagihan Listrik (Rp/Bulan)
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider"
                    style={{ width: '120px' }}
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="text-gray-500">Memuat data...</div>
                      </div>
                    </td>
                  </tr>
                )}

                {error && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="text-red-500">{error}</div>
                    </td>
                  </tr>
                )}

                {!loading && !error && records.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="text-gray-500">Belum ada data</div>
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  records.map((record, index) => (
                    <tr key={record.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td className="px-6 py-4 text-center" style={{ fontSize: '14px' }}>
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-center" style={{ fontSize: '14px' }}>
                        {record.dormName}
                      </td>
                      <td className="px-6 py-4 text-center" style={{ fontSize: '14px' }}>
                        {formatDate(record.period)}
                      </td>
                      <td className="px-6 py-4 text-center" style={{ fontSize: '14px' }}>
                        {record.totalKwh.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-center" style={{ fontSize: '14px' }}>
                        {formatCurrency(record.billAmount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteClick(record)}
                          className="text-red-600 hover:text-red-800 font-medium"
                          style={{ fontSize: '14px' }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center shadow-xl">
            <div className="text-yellow-500 text-5xl mb-4">⚠</div>
            <h3 className="text-xl font-bold mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-2">Apakah Anda yakin ingin menghapus data:</p>
            <p className="font-bold text-lg mb-1">{recordToDelete?.dormName}</p>
            <p className="text-gray-600 mb-6">{recordToDelete && formatDate(recordToDelete.period)}?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCancelDelete}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {showDeleteSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center shadow-xl">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold mb-2">Berhasil Dihapus!</h3>
            <p className="text-gray-600 mb-4">Data berhasil dihapus dari sistem</p>
            <button
              onClick={() => setShowDeleteSuccessModal(false)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Delete Error Modal */}
      {showDeleteErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center shadow-xl">
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h3 className="text-xl font-bold mb-2">Gagal Menghapus</h3>
            <p className="text-gray-600 mb-4">{deleteErrorMessage}</p>
            <button
              onClick={() => {
                setShowDeleteErrorModal(false);
                setDeleteErrorMessage('');
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
