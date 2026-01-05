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

  useEffect(() => {
    fetchData();
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

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-bold text-black text-3xl mb-6">Dashboard Tagihan Listrik</h1>

        {loading ? (
          <p className="text-gray-600">Memuat data...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-white rounded shadow border">
                <div className="text-sm text-gray-500">Total Jumlah Tagihan</div>
                <div className="text-2xl font-semibold mt-2">{formatCurrency(totalBills)}</div>
              </div>
              <div className="p-4 bg-white rounded shadow border">
                <div className="text-sm text-gray-500">Total kWh</div>
                <div className="text-2xl font-semibold mt-2">{Number(totalKwh).toLocaleString('id-ID')}</div>
              </div>
              <div className="p-4 bg-white rounded shadow border">
                <div className="text-sm text-gray-500">Rata-rata kWh per Tagihan</div>
                <div className="text-2xl font-semibold mt-2">{avgKwh.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-white rounded shadow border">
                <div className="text-sm text-gray-500">Belum Lunas</div>
                <div className="text-2xl font-semibold mt-2">{unpaidCount}</div>
              </div>
            </div>

            {/* Chart: perbandingan Tagihan Listrik vs Student Housing */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Perbandingan: Tagihan Listrik vs Student Housing (6 bulan)</h2>
              <div className="bg-white rounded shadow border p-4">
                <div style={{ width: '100%', height: 260 }}>
                  <ChartComparison series={monthlySeries} />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">5 Tagihan Terbaru</h2>
              <div className="bg-white rounded shadow border overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Panel</th>
                      <th className="px-4 py-2 text-left">Bulan</th>
                      <th className="px-4 py-2 text-left">kWh</th>
                      <th className="px-4 py-2 text-left">Jumlah</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latest.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-gray-500">Belum ada data</td>
                      </tr>
                    ) : (
                      latest.map((b, i) => (
                        <tr key={b.id} className="border-t">
                          <td className="px-4 py-3">{i + 1}</td>
                          <td className="px-4 py-3">{b.panel?.namePanel || '-'}</td>
                          <td className="px-4 py-3">{formatDate(b.billingMonth)}</td>
                          <td className="px-4 py-3">{typeof b.kwhUse === 'string' ? parseFloat(b.kwhUse) : Number(b.kwhUse)}</td>
                          <td className="px-4 py-3">{formatCurrency(typeof b.totalBills === 'string' ? parseFloat(b.totalBills) : Number(b.totalBills))}</td>
                          <td className="px-4 py-3">{b.statusPay || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
