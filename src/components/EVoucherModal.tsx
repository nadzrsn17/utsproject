import React from 'react';
import { Booking } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Printer, X, ShieldCheck, CheckCircle2, Calendar, Clock, MapPin, UserCheck, AlertCircle } from 'lucide-react';

interface EVoucherModalProps {
  booking: Booking;
  campusName: string;
  onClose: () => void;
}

export const EVoucherModal: React.FC<EVoucherModalProps> = ({
  booking,
  campusName,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const isFree = booking.totalPrice === 0 || booking.role === 'mahasiswa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8 print:shadow-none print:border-none print:my-0">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">VenuUS E-Voucher Viewer (DomPDF Engine)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* E-Voucher Body (Styled for Print & Display) */}
        <div className="p-8 bg-white print:p-4 text-slate-900">
          {/* Header Surat Resmi */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center relative">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-xl border-2 border-amber-400">
                🏛️
              </div>
              <div className="text-left">
                <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  VenuUS - SISTEM INFORMASI RESERVASI FASILITAS
                </h1>
                <p className="text-sm font-bold text-emerald-800 uppercase tracking-wide">
                  {campusName}
                </p>
                <p className="text-[11px] text-slate-500">
                  Unit Pengelola Sarana, Prasarana, dan Usaha Fasilitas Kampus
                </p>
              </div>
            </div>
            <div className="mt-3 py-1 px-4 bg-slate-100 rounded-lg inline-block border border-slate-300">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-800">
                E-VOUCHER & SURAT IZIN PEMINJAMAN RESMI
              </span>
            </div>
          </div>

          {/* Verification Banner */}
          <div className="flex items-center justify-between p-3.5 mb-6 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Status: {booking.status === 'checked_in' ? 'TELAH CHECK-IN' : 'TERVERIFIKASI & AKTIF'}
                </p>
                <p className="text-[11px] text-emerald-700">
                  {isFree
                    ? 'Disetujui oleh Bagian Kemahasiswaan & Sarpras'
                    : `Lunas via Midtrans Sandbox (${booking.paymentMethod?.toUpperCase()})`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-mono">Kode Booking</p>
              <p className="text-base font-black font-mono text-slate-900 tracking-wider">
                {booking.bookingCode}
              </p>
            </div>
          </div>

          {/* Grid Layout: Detail & QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 space-y-3.5 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Fasilitas Kampus</p>
                <p className="font-bold text-slate-900 text-base flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  {booking.facilityName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Tanggal Acara
                  </p>
                  <p className="font-bold text-slate-900 mt-1">
                    {new Date(booking.date + 'T00:00:00').toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Waktu Sewa
                  </p>
                  <p className="font-bold text-slate-900 mt-1">
                    {booking.startTime} - {booking.endTime} WIB ({booking.durationHours} Jam)
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Nama Kegiatan / Agenda</p>
                <p className="font-semibold text-slate-800 mt-0.5">{booking.activityName}</p>
                {booking.organizationName && (
                  <p className="text-xs text-emerald-700 font-medium mt-1">
                    Organisasi: {booking.organizationName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Penanggung Jawab (PIC)</p>
                  <p className="font-medium text-slate-800 text-xs mt-1 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    {booking.userName}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">{booking.userPhone}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Biaya / Tarif</p>
                  <p className="font-black text-slate-900 text-base mt-0.5">
                    {isFree ? 'Rp 0 (Subsidi Kampus)' : `Rp ${booking.totalPrice.toLocaleString('id-ID')}`}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium">Status: LUNAS / APPROVED</p>
                </div>
              </div>
            </div>

            {/* QR Code Security Column */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-700 uppercase mb-2">
                QR CODE CHECK-IN
              </span>
              <QRCodeDisplay
                value={`VEN-${booking.bookingCode}-${booking.date}`}
                size={140}
                label={booking.bookingCode}
              />
              <p className="text-[10px] text-slate-500 mt-3 leading-tight">
                Scan oleh petugas gerbang dengan modul Admin Scanner.
              </p>
              {booking.checkedInAt && (
                <div className="mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded">
                  Check-in: {booking.checkedInAt}
                </div>
              )}
            </div>
          </div>

          {/* Terms & Conditions Box */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
            <div className="flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Ketentuan Penggunaan Fasilitas:</span>
                <ol className="list-decimal ml-4 mt-1 space-y-0.5">
                  <li>Tunjukkan tiket ini (cetak atau layar ponsel) kepada petugas security sebelum memasuki fasilitas.</li>
                  <li>Wajib menjaga kebersihan, mematuhi tata tertib kampus, dan dilarang membawa senjata tajam atau miras.</li>
                  <li>Penggunaan fasilitas harus dihentikan tepat pada jam selesai yang tertera di e-voucher.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Footer Timestamp */}
          <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Diterbitkan Otomatis oleh VenuUS Cloud Engine</span>
            <span>Doc ID: {booking.id} • Hash: SHA256-OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
