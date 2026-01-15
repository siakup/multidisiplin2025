'use client';

import { Text } from '@/components/Text';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { api } from '@/lib/common/utils/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



export default function DashboardPage() {
  useAutoLogout({ idleTime: 300000 });


  const [dormRecords, setDormRecords] = useState<Array<{ period: string; billAmount: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'facility-management' | 'student-housing'>('facility-management');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [metabaseUrls, setMetabaseUrls] = useState<{
    'facility-management': string;
    'student-housing': string;
  }>({
    'facility-management': '',
    'student-housing': '',
  });

  useEffect(() => {
    fetchData();
    fetchMetabaseUrls();

    // Set default tab based on user role
    let role = localStorage.getItem('userRole');
    // Sanitize role
    if (role) {
      role = role.replace(/^"|"$/g, '').trim();
      if (role === 'null' || role === 'undefined' || role === '') role = null;
    }
    setUserRole(role);
    const studentRoles = ['student housing', 'student hausing', 'STUDENT_HOUSING', 'student_housing'];
    const facilityRoles = ['facility management', 'FACILITY_MANAGEMENT', 'facility_management'];

    // Only set active tab if user is logged in (has role)
    if (role) {
      if (studentRoles.some(r => r.toLowerCase() === role.toLowerCase())) {
        setActiveTab('student-housing');
      } else if (facilityRoles.some(r => r.toLowerCase() === role.toLowerCase())) {
        setActiveTab('facility-management');
      }
    } else {
      // Explicitly set to facility-management if no role (not logged in)
      setActiveTab('facility-management');
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dorm = await api.get<any[]>('/dorm-record');
      setDormRecords((dorm || []).map((r) => ({ period: r.period, billAmount: Number(r.billAmount || r.billAmount || 0) })));
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetabaseUrls = async () => {
    try {
      const [facilityUrl, studentUrl] = await Promise.all([
        fetch('/api/metabase-token?type=facility-management').then(r => r.json()),
        fetch('/api/metabase-token?type=student-housing').then(r => r.json()),
      ]);

      setMetabaseUrls({
        'facility-management': facilityUrl.url || 'http://10.10.75.20:3000/public/dashboard/707ab46e-4d75-4cfc-8a58-d5d04321d97b',
        'student-housing': studentUrl.url || 'http://10.10.75.20:3000/public/dashboard/f7ef96ab-63d4-48b2-9951-835ffb507f4f',
      });
    } catch (err) {
      console.error('Failed to fetch Metabase URLs, using public URLs as fallback:', err);
      // Fallback to public URLs if JWT generation fails
      setMetabaseUrls({
        'facility-management': 'http://10.10.75.20:3000/public/dashboard/707ab46e-4d75-4cfc-8a58-d5d04321d97b',
        'student-housing': 'http://10.10.75.20:3000/public/dashboard/f7ef96ab-63d4-48b2-9951-835ffb507f4f',
      });
    }
  };



  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('id-ID', { month: 'long' });
    return `${month} ${year}`;
  };

  // Export functions
  const handleExportCSV = () => {
    if (dormRecords.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    const headers = ['Period', 'Bill Amount (IDR)'];
    const rows = dormRecords.map(record => [
      formatDate(record.period),
      formatCurrency(record.billAmount)
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `student_housing_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (dormRecords.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Student Housing - Electricity Report', 14, 22);

    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

    // Prepare table data
    const tableData = dormRecords.map(record => [
      formatDate(record.period),
      formatCurrency(record.billAmount)
    ]);

    // Add table
    autoTable(doc, {
      head: [['Period', 'Bill Amount (IDR)']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [94, 161, 39] }, // Student Housing green color
    });

    doc.save(`student_housing_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  // Check if user is Student Housing (ignored if on landing page)
  const studentRoles = ['student housing', 'student hausing', 'STUDENT_HOUSING', 'student_housing'];
  const isStudentHousingUser = !isLandingPage && userRole && studentRoles.some(
    r => r.toLowerCase() === userRole.toLowerCase()
  );

  // Check if user is Facility Management (ignored if on landing page)
  const facilityRoles = ['facility management', 'FACILITY_MANAGEMENT', 'facility_management'];
  const isFacilityManagementUser = !isLandingPage && userRole && facilityRoles.some(
    r => r.toLowerCase() === userRole.toLowerCase()
  );

  // Guest if no role OR if on landing page (forced guest mode)
  const isGuest = !userRole || isLandingPage;

  // Visibility Logic
  const showFacilityButton = isGuest || isFacilityManagementUser;
  // Show Student Housing button if Guest OR Student Housing User
  const showStudentButton = isGuest || isStudentHousingUser;

  // Export only for logged-in Student Housing users (and NOT on landing page)
  const showExport = isStudentHousingUser;

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-bold text-black text-3xl mb-8">Dashboard Emisi Carbon Universitas Pertamina</h1>

        {loading && !dormRecords.length ? (
          <p className="text-gray-600">Memuat data...</p>
        ) : (
          <div className="space-y-8">
            {/* Dashboard Switcher Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              {showFacilityButton && (
                <button
                  onClick={() => setActiveTab('facility-management')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${activeTab === 'facility-management'
                    ? 'bg-brand-primary text-white border-brand-primary shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary hover:text-brand-primary'
                    }`}
                >
                  Facility Management
                </button>
              )}

              {showStudentButton && (
                <button
                  onClick={() => setActiveTab('student-housing')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${activeTab === 'student-housing'
                    ? 'bg-brand-primary text-white border-brand-primary shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary hover:text-brand-primary'
                    }`}
                >
                  Student Housing
                </button>
              )}

              {/* Export Buttons - Only for logged-in Student Housing users */}
              {showExport && activeTab === 'student-housing' && (
                <div className="flex gap-3">
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-colors font-medium shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-brand-danger text-white rounded-lg hover:opacity-90 transition-colors font-medium shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Export PDF
                  </button>
                </div>
              )}
            </div>

            {/* Metabase Iframe Section */}
            {metabaseUrls[activeTab] ? (
              <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <iframe
                  src={metabaseUrls[activeTab]}
                  width="100%"
                  height="800"
                  style={{ minHeight: '800px', border: 0 }}
                  title={`${activeTab === 'facility-management' ? 'Facility Management' : 'Student Housing'} Dashboard`}
                ></iframe>
              </div>
            ) : (
              <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
                <p className="text-gray-500">Loading dashboard...</p>
              </div>
            )}


          </div>
        )}
      </div>
    </div>
  );
}
