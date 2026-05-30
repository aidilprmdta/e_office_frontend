import { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { adminService } from '../services';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const PIE_COLORS = [
  'rgba(37, 99, 235, 0.85)',
  'rgba(22, 163, 74, 0.85)',
  'rgba(245, 158, 11, 0.85)',
  'rgba(139, 92, 246, 0.85)',
  'rgba(236, 72, 153, 0.85)',
  'rgba(6, 182, 212, 0.85)',
  'rgba(100, 116, 139, 0.85)',
];

export default function AdminAnalyticsCharts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAnalytics(12)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const barChartData = useMemo(() => {
    const beban = data?.beban_bulanan || [];
    return {
      labels: beban.map((b) => b.label),
      datasets: [
        {
          label: 'Jumlah Pengajuan',
          data: beban.map((b) => b.jumlah),
          backgroundColor: 'rgba(37, 99, 235, 0.75)',
          borderRadius: 6,
        },
      ],
    };
  }, [data]);

  const pieChartData = useMemo(() => {
    const kategori = data?.distribusi_kategori || [];
    return {
      labels: kategori.map((k) => k.kategori),
      datasets: [
        {
          data: kategori.map((k) => k.jumlah),
          backgroundColor: kategori.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
          borderWidth: 1,
          borderColor: '#fff',
        },
      ],
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, font: { size: 11 } },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-gray-500 py-4">Gagal memuat data analitik.</p>;
  }

  const beban = data.beban_bulanan || [];
  const kategori = data.distribusi_kategori || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <BarChart3 className="text-blue-600" size={22} />
          Beban Surat per Bulan
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Volume pengajuan surat ({data.total_surat_periode ?? 0} total dalam periode)
        </p>
        {beban.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Belum ada data surat.</p>
        ) : (
          <div className="h-[280px]">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
          <PieIcon className="text-violet-600" size={22} />
          Distribusi Kategori Surat
        </h3>
        <p className="text-xs text-gray-500 mb-4">Proporsi jenis/kategori surat yang diajukan</p>
        {kategori.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Belum ada kategori terdata.</p>
        ) : (
          <div className="h-[280px]">
            <Pie data={pieChartData} options={pieOptions} />
          </div>
        )}
      </div>
    </div>
  );
}
