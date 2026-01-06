'use client';

import { Text } from '@/components/Text';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';
import { useEffect, useMemo, useState } from 'react';
import ChartComparison from './ChartComparison';
import { api } from '@/lib/common/utils/api';

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
      setDormRecords((dorm || []).map((r) => ({ period: r.period, billAmount: Number(r.billAmount || r.billAmount || 0) })));
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

  // prepare monthly series for comparison (last 6 months)
  const monthlySeries = useMemo(() => {
    const mapMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).toISOString();

    const monthsSet = new Set<string>();

    // collect months from both sources
    bills.forEach((b) => monthsSet.add(mapMonth(new Date(b.billingMonth))));
    dormRecords.forEach((r) => monthsSet.add(mapMonth(new Date(r.period))));

    const months = Array.from(monthsSet).sort().slice(-6);

    const billTotals = months.map((m) => {
      const total = bills.reduce((s, b) => {
        const mkey = mapMonth(new Date(b.billingMonth));
        if (mkey !== m) return s;
        const v = typeof b.totalBills === 'string' ? parseFloat(b.totalBills || '0') : Number(b.totalBills || 0);
        return s + (isNaN(v) ? 0 : v);
      }, 0);
      return total;
    });

    const dormTotals = months.map((m) => {
      const total = dormRecords.reduce((s, r) => {
        const mkey = mapMonth(new Date(r.period));
        if (mkey !== m) return s;
        return s + (isNaN(Number(r.billAmount)) ? 0 : Number(r.billAmount));
      }, 0);
      return total;
    });

    return { months, billTotals, dormTotals };
  }, [bills, dormRecords]);

  const totalKwh = useMemo(() => {
    return bills.reduce((s, b) => {
      const v = typeof b.kwhUse === 'string' ? parseFloat(b.kwhUse || '0') : Number(b.kwhUse || 0);
      return s + (isNaN(v) ? 0 : v);
    }, 0);
  }, [bills]);

  const avgKwh = bills.length > 0 ? totalKwh / bills.length : 0;

  const unpaidCount = bills.filter((b) => (b.statusPay || '').toLowerCase().includes('belum') || (b.statusPay || '').toLowerCase().includes('unpaid')).length;

  const latest = bills.slice().sort((a, b) => new Date(b.billingMonth).getTime() - new Date(a.billingMonth).getTime()).slice(0, 5);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('id-ID', { month: 'long' });
    return `${month} ${year}`;
  };

  // Metabase Dashboard URLs
  const DASHBOARD_URLS = {
    'facility-management': 'https://metabaseuppper.ac.id/public/dashboard/0ac24f91-9bb9-4b8c-a7cb-041d8722479c',
    'student-housing': 'https://metabaseuppper.ac.id/public/dashboard/0ac24f91-9bb9-4b8c-a7cb-041d8722479c', // TODO: Ganti dengan URL Student Housing yang sesuai
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
            <div className="flex flex-wrap gap-4 mb-6">
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

