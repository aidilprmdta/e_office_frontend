import { STATUS_FLOW, getStatusIndex, normalizeStatus, formatDateTime } from '../utils';

export default function PengajuanTimeline({ status, timeline = [] }) {
  const current = normalizeStatus(status);
  const activeIdx = getStatusIndex(status);
  const isRejected = current === 'ditolak';
  const needsRevision = current === 'perlu_revisi';

  if (needsRevision) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 p-4">
        <p className="font-semibold text-amber-800 dark:text-amber-200">Perlu Revisi</p>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
          Admin meminta perbaikan. Gunakan tombol Edit/Revisi untuk memperbarui pengajuan.
        </p>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800 p-4">
        <p className="font-semibold text-red-800 dark:text-red-200">Pengajuan Ditolak</p>
      </div>
    );
  }

  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-600 ms-4 space-y-0">
      {STATUS_FLOW.map((step, idx) => {
        const done = activeIdx >= 0 && idx <= activeIdx;
        const isCurrent = activeIdx === idx;
        const stepLogs = timeline.filter(
          (t) => normalizeStatus(t.status) === step.key,
        );

        return (
          <li key={step.key} className="mb-8 ms-6 last:mb-2">
            <span
              className={`absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900 text-xs font-bold ${
                done ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}
            >
              {idx + 1}
            </span>
            <h4
              className={`font-semibold text-sm ${
                isCurrent
                  ? 'text-blue-700 dark:text-blue-400'
                  : done
                  ? 'text-gray-800 dark:text-gray-200'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {step.label}
              {isCurrent && (
                <span className="ml-2 text-xs font-normal text-blue-500">(saat ini)</span>
              )}
            </h4>
            {stepLogs.map((t, i) => (
              <p key={i} className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t.catatan && <span>{t.catatan} · </span>}
                {t.at && formatDateTime(t.at)}
              </p>
            ))}
          </li>
        );
      })}
    </ol>
  );
}
