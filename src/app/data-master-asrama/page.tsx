'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/common/utils/api';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';
import Link from 'next/link';

interface Dorm {
  id: string;
  name: string;
  gender: string;
  powerCapacity: number;
  capacity: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function DataMasterAsramaPage() {
  const router = useRouter();
  useAutoLogout({ idleTime: 300000 });

  const [dorms, setDorms] = useState<Dorm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState<Dorm | null>(null);

  // Form states
  const [newDormName, setNewDormName] = useState('');
  const [newDormGender, setNewDormGender] = useState('PUTRA');
  const [newDormPower, setNewDormPower] = useState('');
  const [newDormCapacity, setNewDormCapacity] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');

    if (!token || !role) {
      router.push('/login');
      return;
    }

    // Check if user has Student Housing role
    const allowedRoles = ['Student Housing', 'student housing'];
    if (!allowedRoles.includes(role)) {
      router.push('/dashboard');
      return;
    }

    fetchDorms();
  }, [router]);

  const fetchDorms = async () => {
    try {
      setLoading(true);
      const data = await api.get<Dorm[]>('/dorm');
      setDorms(data || []);
    } catch (error: any) {
      console.error('Error fetching dorms:', error);
      setErrorMessage(error.message || 'Gagal memuat data');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async () => {
    try {
      if (!newDormName.trim() || !newDormPower || !newDormCapacity) {
        setErrorMessage('Semua field harus diisi');
        setShowErrorModal(true);
        return;
      }

      await api.post('/dorm', {
        name: newDormName,
        gender: newDormGender,
        powerCapacity: parseInt(newDormPower),
        capacity: parseInt(newDormCapacity),
      });

      setNewDormName('');
      setNewDormGender('PUTRA');
      setNewDormPower('');
      setNewDormCapacity('');
      setShowAddModal(false);
      setShowSuccessModal(true);
      await fetchDorms();
    } catch (error: any) {
      console.error('Error adding dorm:', error);
      setErrorMessage(error.message || 'Gagal menambah data');
      setShowErrorModal(true);
    }
  };

  const handleDeleteClick = (dorm: Dorm) => {
    setItemToDelete(dorm);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await api.delete(`/dorm/${itemToDelete.id}`);
      setShowDeleteModal(false);
      setItemToDelete(null);
      setShowSuccessModal(true);
      await fetchDorms();
    } catch (error: any) {
      console.error('Error deleting dorm:', error);
      setErrorMessage(error.message || 'Gagal menghapus data');
      setShowDeleteModal(false);
      setShowErrorModal(true);
    }
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
          Data Master Asrama
        </h1>

        {/* Action Buttons */}
        <div className="flex justify-center items-center mb-4">
          {/* Left side - Back button */}
          <div className="flex" style={{ gap: '17px' }}>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              style={{ backgroundColor: '#172813', fontSize: '20px' }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = '#1a2f15';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = '#172813';
              }}
            >
              ← Kembali
            </button>
          </div>

          {/* Spacer */}
          <div style={{ width: '532px' }}></div>

          {/* Right side - Add button */}
          <div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              style={{ backgroundColor: '#5EA127', fontSize: '20px' }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = '#6bb52d';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = '#5EA127';
              }}
            >
              <span>Tambah Asrama</span>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex justify-center" style={{ marginTop: '39px' }}>
          <div
            className="bg-white rounded-lg overflow-hidden"
            style={{
              width: '100%',
              maxWidth: '1200px',
              border: '1px solid #345915',
            }}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: '#345915' }}>
                <tr>
                  <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                    Nama Asrama
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                    Jenis
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                    Daya Listrik (VA)
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                    Kapasitas Penghuni
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dorms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Belum ada data asrama
                    </td>
                  </tr>
                ) : (
                  dorms.map((dorm, index) => (
                    <tr key={dorm.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {dorm.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {dorm.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {dorm.powerCapacity} VA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {dorm.capacity || '-'} orang
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleDeleteClick(dorm)}
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-center">Tambah Asrama Baru</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Asrama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDormName}
                  onChange={(e) => setNewDormName(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                  placeholder="Contoh: Asrama Putra 1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jenis <span className="text-red-500">*</span>
                </label>
                <select
                  value={newDormGender}
                  onChange={(e) => setNewDormGender(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                >
                  <option value="PUTRA">PUTRA</option>
                  <option value="PUTRI">PUTRI</option>
                  <option value="CAMPUR">CAMPUR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Daya Listrik (VA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newDormPower}
                  onChange={(e) => setNewDormPower(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                  placeholder="Contoh: 2200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kapasitas Penghuni <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newDormCapacity}
                  onChange={(e) => setNewDormCapacity(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                  placeholder="Contoh: 50"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewDormName('');
                  setNewDormGender('PUTRA');
                  setNewDormPower('');
                  setNewDormCapacity('');
                }}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleAddSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center">
            <div className="text-red-500 text-5xl mb-4">⚠</div>
            <h3 className="text-xl font-bold mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-2">Apakah Anda yakin ingin menghapus asrama:</p>
            <p className="font-bold text-lg mb-6">{itemToDelete?.name}?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold mb-2">Berhasil!</h3>
            <p className="text-gray-600 mb-4">Operasi berhasil dilakukan</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center">
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
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
