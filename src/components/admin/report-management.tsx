/**
 * Admin Report Management
 *
 * Paginated moderation UI for handling user content reports.
 * Features:
 * - List reports with filtering by status
 * - Resolve/Dismiss via modal with optional resolution notes
 * - View resolution notes, including the moderator identity
 * - Toast notifications for feedback
 */
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Notification } from '@/src/components/notification';

/** Report lifecycle status */
type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED';

/** Minimal user shape for table/avatar links */
interface ReporterInfo {
  id: string;
  username?: string | null;
  name?: string | null;
  image?: string | null;
}

/**
 * Single report row returned by /api/report/list
 * Contains reporter/reported user and, when resolved, the moderator.
 */
interface ReportItem {
  id: number;
  reporter: ReporterInfo;
  reporterId: string;
  reportedUser?: ReporterInfo | null;
  moderator?: ReporterInfo | null;
  targetType: string;
  targetId: number;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string | null;
  targetUrl?: string | null;
  targetContent?: string | null;
  resolutionNotes?: string | null;
}

export const ReportManagement: React.FC = () => {
  // Pagination, filtering and UX state
  const [items, setItems] = useState<ReportItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [status, setStatus] = useState<ReportStatus | 'ALL'>('PENDING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal state for updating status with resolution notes
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalAction, setModalAction] = useState<ReportStatus | null>(null); // RESOLVED or DISMISSED
  const [modalReport, setModalReport] = useState<ReportItem | null>(null);
  const [modalNotes, setModalNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Modal state for viewing resolution notes
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesReport, setNotesReport] = useState<ReportItem | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  /** Fetch paginated reports with optional status filter */
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (status !== 'ALL') params.set('status', status);
      const res = await fetch(`/api/report/list?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load reports');
      setItems(data.items);
      setTotal(data.total);
    } catch (e: any) {
      setError(e.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, status]);

  /** Prepare and show the Resolve/Dismiss modal */
  const openStatusModal = (report: ReportItem, action: ReportStatus) => {
    setModalReport(report);
    setModalAction(action);
    setModalNotes('');
    setShowStatusModal(true);
  };

  /**
   * Submit the moderation decision to /api/report/update
   * Optimistically update the table and surface a toast on success/error.
   */
  const submitStatusUpdate = async () => {
    if (!modalReport || !modalAction) return;
    setSaving(true);
    try {
      const res = await fetch('/api/report/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: modalReport.id, status: modalAction, resolutionNotes: modalNotes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update report');
      setItems(prev => prev.map(it => it.id === modalReport.id ? { ...it, status: modalAction, resolvedAt: modalAction === 'RESOLVED' ? new Date().toISOString() : it.resolvedAt, resolutionNotes: modalNotes || it.resolutionNotes } : it));
      setShowStatusModal(false);
      setToast({ message: `Report ${modalAction === 'RESOLVED' ? 'resolved' : 'dismissed'} successfully`, type: 'success' });
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to update report');
      setToast({ message: e.message || 'Failed to update report', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-color_text">Reports</h2>
        <div className="flex gap-2 items-center">
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="px-3 py-2 border border-border_detail rounded-lg bg-color_main text-color_text">
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-3 py-2 border border-border_detail rounded-lg bg-color_main text-color_text">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-400 text-red-200 bg-red-900/20">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border_detail">
        <table className="min-w-full text-sm">
          <thead className="bg-color_main text-color_text_sec">
            <tr>
              <th className="p-3 text-left">Reporter</th>
              <th className="p-3 text-left">Target</th>
              <th className="p-3 text-left">Reported User</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Notes</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-6 text-center text-color_text_sec">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={8} className="p-6 text-center text-color_text_sec">No reports found</td></tr>
            ) : (
              items.map((r) => (
                <tr key={r.id} className="border-t border-border_detail">
                  <td className="p-3 text-color_text">
                    <div className="flex items-center gap-2">
                      <Image src={r.reporter?.image || '/placeholder-user.webp'} alt={r.reporter?.username || r.reporter?.name || 'User'} width={24} height={24} className="rounded-full" />
                      {r.reporter?.username ? (
                        <a href={`/user/${r.reporter.username}`} target="_blank" rel="noreferrer" className="hover:underline">
                          {r.reporter.username}
                        </a>
                      ) : (
                        <span>{r.reporter?.name || r.reporterId}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-color_text">
                    <div className="flex flex-col gap-1">
                      <span className="px-2 py-1 rounded bg-color_hover text-xs w-fit">{r.targetType} {r.targetId}</span>
                      {r.targetUrl && (
                        <a href={r.targetUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">Open target ↗</a>
                      )}
                      {r.targetContent && (
                        <div className="text-xs text-color_text_sec max-w-md line-clamp-2 italic">“{r.targetContent}”</div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-color_text">
                    {r.reportedUser ? (
                      <div className="flex items-center gap-2">
                        <Image src={r.reportedUser.image || '/placeholder-user.webp'} alt={r.reportedUser.username || r.reportedUser.name || 'User'} width={24} height={24} className="rounded-full" />
                        {r.reportedUser.username ? (
                          <a href={`/user/${r.reportedUser.username}`} target="_blank" rel="noreferrer" className="hover:underline">
                            {r.reportedUser.username}
                          </a>
                        ) : (
                          <span>{r.reportedUser.name || r.reportedUser.id}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-color_text_sec text-xs">—</span>
                    )}
                  </td>
                  <td className="p-3 text-color_text max-w-md">
                    <div className="line-clamp-3">{r.reason}</div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${r.status === 'PENDING' ? 'bg-yellow-900/30 text-yellow-300' : r.status === 'RESOLVED' ? 'bg-green-900/30 text-green-300' : 'bg-gray-700 text-gray-200'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-color_text_sec">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="p-3 text-color_text">
                    {r.resolutionNotes ? (
                      <button onClick={() => { setNotesReport(r); setShowNotesModal(true); }} className="text-xs text-blue-400 hover:underline">View notes</button>
                    ) : (
                      <span className="text-color_text_sec text-xs">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => openStatusModal(r, 'RESOLVED')} className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs">Resolve</button>
                      <button onClick={() => openStatusModal(r, 'DISMISSED')} className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white text-xs">Dismiss</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-color_text_sec text-sm">Total: {total}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border border-border_detail text-color_text disabled:opacity-50">Prev</button>
          <span className="text-color_text text-sm">Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border border-border_detail text-color_text disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
    {/* Status Update Modal */}
    {showStatusModal && modalAction && modalReport && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-color_sec rounded-xl p-6 max-w-md w-full border border-border_detail shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full grid place-items-center ${modalAction === 'RESOLVED' ? 'bg-green-100' : 'bg-gray-200'}`}>
              <svg className={`w-6 h-6 ${modalAction === 'RESOLVED' ? 'text-green-700' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {modalAction === 'RESOLVED' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-color_text text-lg">{modalAction === 'RESOLVED' ? 'Resolve Report' : 'Dismiss Report'}</h3>
              <p className="text-color_text_sec text-sm">Add optional notes to document your decision.</p>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="resolutionNotes" className="block text-sm font-medium text-color_text mb-2">Resolution notes</label>
            <textarea
              id="resolutionNotes"
              value={modalNotes}
              onChange={(e) => setModalNotes(e.target.value)}
              className="w-full px-3 py-2 border border-border_detail rounded-lg bg-color_main text-color_text resize-none"
              placeholder="Describe the action taken or provide context (optional)"
              rows={4}
              maxLength={1000}
            />
            <div className="text-xs text-color_text_sec mt-1">{modalNotes.length}/1000 characters</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowStatusModal(false)}
              className="flex-1 px-4 py-2 border border-border_detail text-color_text rounded-lg hover:bg-color_hover transition-all duration-200"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={submitStatusUpdate}
              disabled={saving}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-all duration-200 font-semibold ${modalAction === 'RESOLVED' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
            >
              {saving ? 'Saving...' : (modalAction === 'RESOLVED' ? 'Resolve' : 'Dismiss')}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* View Notes Modal */}
    {showNotesModal && notesReport && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-color_sec rounded-xl p-6 max-w-md w-full border border-border_detail shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full grid place-items-center">
              <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-5-9-5-9 5 9 5zm0-10l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-color_text text-lg">Resolution Notes</h3>
              <p className="text-color_text_sec text-sm">Provided by the moderator when resolving/dismissing.</p>
              {notesReport.moderator && (
                <div className="flex items-center gap-2 mt-2">
                  <Image src={notesReport.moderator.image || '/placeholder-user.webp'} alt={notesReport.moderator.username || notesReport.moderator.name || 'User'} width={20} height={20} className="rounded-full" />
                  {notesReport.moderator.username ? (
                    <a href={`/user/${notesReport.moderator.username}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">
                      {notesReport.moderator.username}
                    </a>
                  ) : (
                    <span className="text-xs text-color_text_sec">{notesReport.moderator.name || notesReport.moderator.id}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="bg-color_main rounded-lg p-3 border border-border_detail text-color_text text-sm whitespace-pre-wrap">
            {notesReport?.resolutionNotes ?? '—'}
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => setShowNotesModal(false)} className="px-4 py-2 border border-border_detail text-color_text rounded-lg hover:bg-color_hover transition-all duration-200">Close</button>
          </div>
        </div>
      </div>
    )}

    {toast && (
      <Notification message={toast?.message || ''} type={toast?.type || 'success'} position="bottom-right" onClose={() => setToast(null)} />
    )}
    </>
  );
};
