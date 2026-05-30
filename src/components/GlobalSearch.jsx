import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, User, Loader2, Filter } from 'lucide-react';
import { searchService } from '../services';
import { getStatusLabel } from '../utils';

function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [jenis, setJenis] = useState('');
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const wrapperRef = useRef(null);
  const debouncedQuery = useDebounce(query);

  const runSearch = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchService.search({
        q: debouncedQuery.trim(),
        jenis: jenis || undefined,
        status: status || undefined,
      });
      setResults(res.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, jenis, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      runSearch();
    }, 0);
    return () => clearTimeout(timer);
  }, [runSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setOpen(false);
    setQuery('');
    if (item.tipe === 'user') {
      navigate(item.route_hint || '/users');
      return;
    }
    const base = item.route_hint || '/riwayat-pengajuan';
    if (base.includes('riwayat')) {
      navigate(`${base}?detail=${item.id}`);
    } else {
      navigate(base);
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 w-full max-w-xl mx-0 md:mx-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Cari surat, kode verifikasi, mahasiswa..."
          className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg ${
            showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
          title="Filter"
        >
          <Filter size={16} />
        </button>
      </div>

      {showFilters && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex gap-2">
          <select
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5"
          >
            <option value="">Semua jenis</option>
            <option value="Surat">Surat</option>
            <option value="Tugas Akhir">Tugas Akhir</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5"
          >
            <option value="">Semua status</option>
            <option value="diajukan">Diajukan</option>
            <option value="diproses_admin">Diproses</option>
            <option value="selesai">Selesai</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      )}

      {open && query.trim() && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-gray-500 text-sm">
              <Loader2 className="animate-spin" size={18} /> Mencari...
            </div>
          ) : results.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">Tidak ada hasil untuk &quot;{query}&quot;</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {results.map((item) => (
                <li key={`${item.tipe}-${item.id}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex gap-3"
                  >
                    <span className="mt-0.5 text-blue-600">
                      {item.tipe === 'user' ? <User size={18} /> : <FileText size={18} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-gray-800 truncate">{item.judul}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {item.tipe === 'user'
                          ? item.subjudul
                          : [
                              item.nama_mahasiswa,
                              item.kategori,
                              item.kode_verifikasi,
                              item.status && getStatusLabel(item.status),
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
