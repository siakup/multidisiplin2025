'use client';

import { Text } from '@/components/Text';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';
import { useEffect, useMemo, useState } from 'react';
import ChartComparison from './ChartComparison';
import { api } from '@/lib/common/utils/api';
import { format } from 'date-fns';

interface ElectricityBill {
  id: number;
  panel?: { id: number; namePanel?: string } | null;
  user?: { id: number; username?: string | null } | null;
  billingMonth: string;
  kwhUse: number | string;
  totalBills: number | string;
  statusPay?: string;
}

export default function DashboardPage() {
  useAutoLogout({ idleTime: 300000 });

  const [bills, setBills] = useState<ElectricityBill[]>([]);
  const [dormRecords, setDormRecords] = useState<Array<{ period: string; billAmount: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'facility-management' | 'student-housing'>('facility-management');

  useEffect(() => {
    fetchData();

    // Set default tab based on user role
    const userRole = localStorage.getItem('userRole');
    const studentRoles = ['student housing', 'student hausing', 'STUDENT_HOUSING', 'student_housing'];

    if (userRole && studentRoles.some(r => r.toLowerCase() === userRole.toLowerCase())) {
      setActiveTab('student-housing');
    } else {
      setActiveTab('facility-management');
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, dorm] = await Promise.all([
        api.get<ElectricityBill[]>('/electricity-bills'),
        api.get<any[]>('/dorm-record'),
      ]);
      setBills(data || []);
      setDormRecords((dorm || []).map((r) => ({ period: r.period, billAmount: Number(r.billAmount || 0) })));
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Gagal memuat data');
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const totalBills = useMemo(() => {
    return bills.reduce((s, b) => {
      const v = typeof b.totalBills === 'string' ? parseFloat(b.totalBills || '0') : Number(b.totalBills || 0);
      return s + (isNaN(v) ? 0 : v);
    }, 0);
  }, [bills]);

  const totalKwh = useMemo(() => {
    return bills.reduce((s, b) => {
      const v = typeof b.kwhUse === 'string' ? parseFloat(b.kwhUse || '0') : Number(b.kwhUse || 0);
      return s + (isNaN(v) ? 0 : v);
    }, 0);
  }, [bills]);

  const unpaidCount = bills.filter((b) => (b.statusPay || '').toLowerCase().includes('belum') || (b.statusPay || '').toLowerCase().includes('unpaid')).length;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  const DASHBOARD_URLS = {
    'facility-management': 'https://metabaseuppper.ac.id/public/dashboard/0ac24f91-9bb9-4b8c-a7cb-041d8722479c',
    'student-housing': 'https://metabaseuppper.ac.id/public/dashboard/0ac24f91-9bb9-4b8c-a7cb-041d8722479c', // TODO: Ganti dengan URL Student Housing yang sesuai
  };

  const handleExport = async (exportFormat: 'csv' | 'pdf') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/export/student-housing?format=${exportFormat}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal mengekspor data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_housing_export_${format(new Date(), 'yyyyMMdd')}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-bold text-black text-3xl mb-8">Dashboard Monitoring & Analisis</h1>

        {loading && !bills.length ? (
          <p className="text-gray-600">Memuat data...</p>
        ) : (
          <div className="space-y-8">
            {/* Dashboard Switcher Buttons */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <button
                onClick={() => setActiveTab('facility-management')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${activeTab === 'facility-management'
                  ? 'bg-[#12250F] text-white border-[#12250F] shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#12250F] hover:text-[#12250F]'
                  }`}
              >
                Facility Management
              </button>
              <button
                onClick={() => setActiveTab('student-housing')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${activeTab === 'student-housing'
                  ? 'bg-[#5EA127] text-white border-[#5EA127] shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#5EA127] hover:text-[#5EA127]'
                  }`}
              >
                Student Housing
              </button>

              {/* Export Buttons (Only visible for Student Housing tab) */}
              {activeTab === 'student-housing' && (
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export PDF
                  </button>
                </div>
              )}
            </div>

            {/* Metabase Iframe Section */}
            <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <iframe
                src={DASHBOARD_URLS[activeTab]}
                frameBorder="0"
                width="100%"
                height="800"
                allowTransparency
                style={{ minHeight: '800px' }}
                title={`${activeTab === 'facility-management' ? 'Facility Management' : 'Student Housing'} Dashboard`}
              ></iframe>
            </div>

            {/* Quick Stats Overview (Optional, from local data) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Tagihan (Local)</div>
                <div className="text-xl font-bold text-[#12250F] mt-1">{formatCurrency(totalBills)}</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total kWh (Local)</div>
                <div className="text-xl font-bold text-[#12250F] mt-1">{Number(totalKwh).toLocaleString('id-ID')}</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Belum Lunas</div>
                <div className="text-xl font-bold text-red-600 mt-1">{unpaidCount}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
