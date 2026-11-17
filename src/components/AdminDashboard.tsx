import React, { useState } from 'react';
import { Booking, Facility } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  QrCode, 
  FileText, 
  BarChart3, 
  Search, 
  Calendar, 
  Eye, 
  Download, 
  Building2, 
  DollarSign, 
  Users, 
  AlertCircle,
  ScanLine
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  bookings: Booking[];
  facilities: Facility[];
  onApproveBooking: (bookingId: string, notes: string) => void;
  onRejectBooking: (bookingId: string, notes: string) => void;
  onCheckInByCode: (code: string) => { success: boolean; message: string; booking?: Booking };
  onViewVoucher: (booking: Booking) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  facilities,
  onApproveBooking,
  onRejectBooking,
  onCheckInByCode,
  onViewVoucher
}) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'all_bookings' | 'qr_scanner' | 'occupancy'>('approvals');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal for Approval / Rejection action with notes
  const [actionModal, setActionModal] = useState<{
    booking: Booking;
    type: 'approve' | 'reject';
    notes: string;
  } | null>(null);

  // Scanner Simulator State
  const [scanInputCode, setScanInputCode] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; booking?: Booking } | null>(null);

  // Stats calculation
  const pendingApprovals = bookings.filter((b) => b.status === 'pending_approval');
  const totalRevenue = bookings
    .filter((b) => b.status === 'paid' || b.status === 'checked_in')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalCheckedIn = bookings.filter((b) => b.status === 'checked_in').length;
  const totalBookingsCount = bookings.length;

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInputCode.trim()) return;
    const res = onCheckInByCode(scanInputCode.trim());
    setScanResult(res);
    if (res.success) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.organizationName && b.organizationName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menunggu Persetujuan</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingApprovals.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Proposal kegiatan Mahasiswa/UKM</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pendapatan (PNBP)</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Dari penyewaan jalur umum</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telah Check-In (Hadir)</p>
            <p className="text-2xl font-black text-sky-700 mt-1">{totalCheckedIn}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Validasi via QR Code scanner</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <ScanLine className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Transaksi</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totalBookingsCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Gabungan UKM dan Umum</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'approvals'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Antrean Persetujuan Proposal UKM</span>
          {pendingApprovals.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
              {pendingApprovals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all_bookings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'all_bookings'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Seluruh Reservasi</span>
        </button>

        <button
          onClick={() => setActiveTab('qr_scanner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'qr_scanner'
              ? 'bg-emerald-700 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Scanner QR Code Check-In (Petugas Gerbang)</span>
        </button>
      </div>

      {/* Tab 1: Approval Center */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Verifikasi Pengajuan Fasilitas Kegiatan Kemahasiswaan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Setiap proposal mahasiswa berhak mendapatkan tarif gratis / subsidi setelah ditinjau oleh Biro Sarpras & Kemahasiswaan.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              {pendingApprovals.length} Berkas Perlu Tindakan
            </span>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">Semua Pengajuan Telah Ditinjau</p>
              <p className="text-xs text-slate-500 mt-1">Tidak ada proposal mahasiswa yang tertunda saat ini.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {pendingApprovals.map((b) => (
                <div key={b.id} className="p-5 hover:bg-slate-50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {b.bookingCode}
                      </span>
                      <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                        {b.organizationName || 'Organisasi Mahasiswa'}
                      </span>
                      <span className="text-xs text-slate-500">
                        PIC: <strong>{b.userName}</strong> ({b.userPhone})
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{b.activityName}</h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-medium text-emerald-800">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700" /> {b.facilityName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> {b.date}
                      </span>
                      <span className="flex items-center gap-1 font-mono font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> {b.startTime} - {b.endTime} WIB ({b.durationHours} Jam)
                      </span>
                    </div>

                    {b.proposalFileName && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-[11px] text-slate-700 border border-slate-300 font-mono">
                        <FileText className="w-3 h-3 text-red-600" />
                        <span>{b.proposalFileName}</span>
                        <span className="text-[10px] text-slate-400">• Terlampir</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActionModal({
                        booking: b,
                        type: 'reject',
                        notes: 'Proposal belum dilengkapi tanda tangan pembina organisasi / jadwal bertabrakan dengan agenda wisuda universitas.'
                      })}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Tolak</span>
                    </button>

                    <button
                      onClick={() => setActionModal({
                        booking: b,
                        type: 'approve',
                        notes: 'Proposal disetujui. Harap menghubungi tim sarpras 1 hari sebelum acara untuk serah terima kunci.'
                      })}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/20 transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Setujui & Terbitkan E-Voucher</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: All Bookings Table */}
      {activeTab === 'all_bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari kode, nama, atau kegiatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 bg-white rounded-lg border border-slate-300 font-medium"
              >
                <option value="all">Semua Status</option>
                <option value="paid">Paid / Disetujui</option>
                <option value="checked_in">Checked In</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="rejected">Ditolak</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  const headers = "Kode Booking,Fasilitas,Pemesan,Kegiatan,Tanggal,Waktu,Total Biaya,Status\n";
                  const rows = filteredBookings.map(b => 
                    `"${b.bookingCode}","${b.facilityName}","${b.userName}","${b.activityName}","${b.date}","${b.startTime}-${b.endTime}","${b.totalPrice}","${b.status}"`
                  ).join("\n");
                  const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Laporan_VenuUS_${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                }}
                className="text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Kode & Tanggal</th>
                  <th className="p-3.5">Fasilitas & Jadwal</th>
                  <th className="p-3.5">Pemesan / Instansi</th>
                  <th className="p-3.5">Biaya</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-slate-900 block">{b.bookingCode}</span>
                      <span className="text-[11px] text-slate-500">{b.date}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 block">{b.facilityName.split('(')[0]}</span>
                      <span className="font-mono text-[11px] text-slate-500">{b.startTime} - {b.endTime} WIB ({b.durationHours} Jam)</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-900 block">{b.userName}</span>
                      <span className="text-[11px] text-emerald-700">
                        {b.organizationName || 'Umum'} • {b.userPhone}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">
                        {b.totalPrice === 0 ? 'Rp 0 (Subsidi)' : `Rp ${b.totalPrice.toLocaleString('id-ID')}`}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{b.paymentMethod || '-'}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        b.status === 'checked_in'
                          ? 'bg-sky-100 text-sky-800 border border-sky-300'
                          : b.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : b.status === 'pending_approval'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : b.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {(b.status === 'paid' || b.status === 'checked_in') && (
                        <button
                          onClick={() => onViewVoucher(b)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                          title="Lihat E-Voucher"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Gatekeeper QR Code Scanner */}
      {activeTab === 'qr_scanner' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <ScanLine className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Modul Pemindai (QR Scanner) Check-In Petugas Gerbang
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Validasi kedatangan penyewa aula/lapangan secara real-time. Tunjukkan atau masukkan kode booking voucher.
            </p>
          </div>

          <form onSubmit={handleScanSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Input Kode Booking atau Token QR
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scanInputCode}
                  onChange={(e) => setScanInputCode(e.target.value)}
                  placeholder="Contoh: VEN-202610-8812"
                  className="flex-1 text-sm font-mono font-bold px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Validasi & Check-In</span>
                </button>
              </div>
            </div>

            {/* Quick Test Chips for Testing Examiner */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Klik contoh kode:</span>
              {bookings.filter(b => b.status === 'paid').map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setScanInputCode(b.bookingCode)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 font-mono text-[11px] border border-slate-200 transition"
                >
                  {b.bookingCode} ({b.userName.split(' ')[0]})
                </button>
              ))}
            </div>
          </form>

          {/* Scan Result Feedback Card */}
          {scanResult && (
            <div className={`p-4 rounded-xl border animate-in fade-in ${
              scanResult.success ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-start gap-3">
                {scanResult.success ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-bold text-sm">
                    {scanResult.success ? 'CHECK-IN BERHASIL DIKONFIRMASI!' : 'VALIDASI GAGAL'}
                  </p>
                  <p className="text-xs mt-0.5">{scanResult.message}</p>

                  {scanResult.booking && (
                    <div className="mt-3 p-3 bg-white/80 rounded-lg border border-emerald-200 text-xs space-y-1">
                      <p><strong>Fasilitas:</strong> {scanResult.booking.facilityName}</p>
                      <p><strong>PIC / Organisasi:</strong> {scanResult.booking.userName} {scanResult.booking.organizationName ? `(${scanResult.booking.organizationName})` : ''}</p>
                      <p><strong>Jadwal:</strong> {scanResult.booking.date} • {scanResult.booking.startTime} - {scanResult.booking.endTime} WIB</p>
                      <p><strong>Waktu Check-In Tercatat:</strong> {scanResult.booking.checkedInAt}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Admin (Approve/Reject) */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {actionModal.type === 'approve' ? 'Konfirmasi Persetujuan Proposal' : 'Konfirmasi Penolakan Proposal'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {actionModal.type === 'approve'
                ? 'Proposal akan disetujui, kuota dikunci, dan E-Voucher resmi langsung diterbitkan & dikirim via WhatsApp.'
                : 'Berikan alasan penolakan agar mahasiswa dapat merevisi atau memilih tanggal alternatif.'}
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Resmi Admin / Sarpras:
              </label>
              <textarea
                rows={3}
                value={actionModal.notes}
                onChange={(e) => setActionModal({ ...actionModal, notes: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setActionModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (actionModal.type === 'approve') {
                    onApproveBooking(actionModal.booking.id, actionModal.notes);
                  } else {
                    onRejectBooking(actionModal.booking.id, actionModal.notes);
                  }
                  setActionModal(null);
                }}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow transition ${
                  actionModal.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {actionModal.type === 'approve' ? 'Setujui Sekarang' : 'Tolak Proposal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
