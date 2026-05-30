import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { QRCodeSVG } from 'qrcode.react';
import { Search, ScanLine, ShieldCheck, ShieldX, GraduationCap, ArrowLeft } from 'lucide-react';
import { verifikasiService } from '../services';

function extractKodeFromScan(text) {
  const raw = (text || '').trim();
  if (!raw) return '';
  try {
    if (raw.includes('verifikasi')) {
      const url = new URL(raw.startsWith('http') ? raw : `https://x${raw.startsWith('/') ? '' : '/'}${raw}`);
      const fromQuery = url.searchParams.get('kode') || url.searchParams.get('code');
      if (fromQuery) return fromQuery;
      const parts = url.pathname.split('/').filter(Boolean);
      return parts[parts.length - 1] || raw;
    }
  } catch {
    /* plain kode */
  }
  if (raw.includes(':')) {
    const seg = raw.split(':').pop();
    if (seg) return seg.trim();
  }
  return raw;
}

export default function VerifikasiSurat() {
  const [searchParams] = useSearchParams();
  const [kode, setKode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const html5Ref = useRef(null);

  const stopScanner = async () => {
    if (html5Ref.current) {
      try {
        await html5Ref.current.stop();
        await html5Ref.current.clear();
      } catch {
        /* ignore */
      }
      html5Ref.current = null;
    }
    setScanning(false);
  };

  const verifikasi = async (kodeInput) => {
    const k = extractKodeFromScan(kodeInput).toUpperCase();
    if (!k) return;
    setKode(k);
    setLoading(true);
    setResult(null);
    try {
      const res = await verifikasiService.cek(k);
      setResult(res.data);
    } catch (err) {
      setResult({
        valid: false,
        pesan: err.response?.data?.detail || 'Gagal memverifikasi kode. Periksa koneksi server.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  useEffect(() => {
    const fromUrl = searchParams.get('kode');
    if (!fromUrl) return;
    const timer = setTimeout(() => {
      verifikasi(fromUrl);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const startScanner = async () => {
    await stopScanner();
    setScanning(true);
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader-verifikasi');
        html5Ref.current = scanner;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decoded) => {
            stopScanner();
            verifikasi(decoded);
          },
          () => {},
        );
      } catch {
        setScanning(false);
        setResult({
          valid: false,
          pesan: 'Tidak dapat mengakses kamera. Izinkan akses kamera atau ketik kode manual.',
        });
      }
    }, 100);
  };

  const qrValue =
    typeof window !== 'undefined' && result?.valid && result?.kode_verifikasi
      ? `${window.location.origin}/verifikasi?kode=${result.kode_verifikasi}`
      : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold">
            <GraduationCap size={28} />
            E-Office Kampus
          </Link>
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={16} /> Beranda
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Verifikasi Surat</h1>
          <p className="text-gray-600 mt-2">
            Ketik atau pindai kode QR/barcode pada surat fisik untuk memastikan keasliannya di sistem.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={kode}
                onChange={(e) => setKode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && verifikasi(kode)}
                placeholder="Contoh: EO-2026-0001-A1B2C3"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => verifikasi(kode)}
              disabled={loading || !kode.trim()}
              className="px-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              Cek
            </button>
          </div>

          <button
            type="button"
            onClick={scanning ? stopScanner : startScanner}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-700 font-semibold hover:bg-blue-50"
          >
            <ScanLine size={20} />
            {scanning ? 'Hentikan Pemindaian' : 'Pindai Kode QR dengan Kamera'}
          </button>

          {scanning && (
            <div
              id="qr-reader-verifikasi"
              ref={scannerRef}
              className="w-full max-w-sm mx-auto rounded-xl overflow-hidden border border-gray-200"
            />
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {result && !loading && (
          <div
            className={`rounded-2xl border-2 p-6 ${
              result.valid
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start gap-4">
              {result.valid ? (
                <ShieldCheck className="text-green-600 shrink-0" size={40} />
              ) : (
                <ShieldX className="text-red-600 shrink-0" size={40} />
              )}
              <div className="flex-1">
                <h2 className={`text-xl font-bold ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
                  {result.valid ? 'Surat Terverifikasi' : 'Verifikasi Gagal'}
                </h2>
                <p className={`mt-1 text-sm ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
                  {result.pesan}
                </p>

                {result.kode_verifikasi && (
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex gap-2">
                      <dt className="font-semibold text-gray-600 w-32">Kode</dt>
                      <dd className="font-mono font-bold text-gray-900">{result.kode_verifikasi}</dd>
                    </div>
                    {result.judul_perihal && (
                      <div className="flex gap-2">
                        <dt className="font-semibold text-gray-600 w-32">Perihal</dt>
                        <dd className="text-gray-800">{result.judul_perihal}</dd>
                      </div>
                    )}
                    {result.kategori && (
                      <div className="flex gap-2">
                        <dt className="font-semibold text-gray-600 w-32">Kategori</dt>
                        <dd className="text-gray-800">{result.kategori}</dd>
                      </div>
                    )}
                    {result.nama_mahasiswa && (
                      <div className="flex gap-2">
                        <dt className="font-semibold text-gray-600 w-32">Pemohon</dt>
                        <dd className="text-gray-800">{result.nama_mahasiswa}</dd>
                      </div>
                    )}
                    {result.status && (
                      <div className="flex gap-2">
                        <dt className="font-semibold text-gray-600 w-32">Status</dt>
                        <dd className="text-gray-800 capitalize">{result.status.replace(/_/g, ' ')}</dd>
                      </div>
                    )}
                  </dl>
                )}

                {result.valid && qrValue && (
                  <div className="mt-6 flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-green-100">
                    <p className="text-xs text-gray-500">QR resmi surat ini</p>
                    <QRCodeSVG value={qrValue} size={140} level="M" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
