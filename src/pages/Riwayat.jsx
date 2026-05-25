import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { Table, Button } from '../components';
import { pengajuanService } from '../services';
import { formatDate } from '../utils';
import { Clock, Check, XCircle, Trash2 } from 'lucide-react';

export default function Riwayat() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await pengajuanService.getList();
      const data = res?.data?.data || res?.data || [];
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch submissions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (id) => {
    try {
      await pengajuanService.cancel(id);
      await loadData();
    } catch (err) {
      console.error('Cancel failed', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await pengajuanService.delete(id);
      await loadData();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const columns = [
    {
      key: 'no',
      label: 'No',
      render: (_, row, idx) => idx + 1,
    },
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (val) => formatDate(val),
    },
    {
      key: 'kategori',
      label: 'Jenis Pengajuan',
    },
    {
      key: 'judulTA',
      label: 'Judul / Perihal',
      render: (val, row) => row.perihal || val,
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const lower = (status || '').toLowerCase();
        const colorClass =
          lower === 'pending'
            ? 'bg-yellow-100 text-yellow-700'
            : lower === 'disetujui' || lower === 'diterima'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700';
        return (
          `<span class="px-2 py-1 rounded-full text-xs font-semibold ${colorClass}">${status || 'Pending'}</span>`
        );
      },
    },
    {
      key: 'catatanDosen',
      label: 'Catatan Dosen',
    },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (_, row) => {
        const cancelBtn =
          row.status?.toLowerCase() === 'pending' ?
            `<button class=\"text-xs text-blue-600 hover:underline\" onClick=\"${`handleCancel(${row.id})`}\">Batal</button>` : '';
        const deleteBtn =
          `<button class=\"text-xs text-red-600 hover:underline ml-2\" onClick=\"${`handleDelete(${row.id})`}\">Hapus</button>`;
        return `<div>${cancelBtn}${deleteBtn}</div>`;
      },
    },
  ];

  return (
    <MainLayout>
      <div className="p-6 bg-white rounded-xl shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Riwayat Pengajuan</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <Table columns={columns} data={submissions} />
        )}
      </div>
    </MainLayout>
  );
}
