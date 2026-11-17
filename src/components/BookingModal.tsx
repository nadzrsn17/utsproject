import React, { useState, useMemo } from 'react';
import { Facility, Booking, UserRole } from '../types';
import { checkSlotConflict, OPERATIONAL_HOURS } from '../utils/bookingLogic';
import { Calendar, Clock, AlertTriangle, CheckCircle, Upload, X, ShieldAlert, ArrowRight, User, Phone, FileText } from 'lucide-react';

interface BookingModalProps {
  facility: Facility;
  currentRole: UserRole;
  existingBookings: Booking[];
  onSubmitBooking: (bookingData: Partial<Booking>) => void;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  facility,
  currentRole,
  existingBookings,
  onSubmitBooking,
  onClose
}) => {
  // Default date: tomorrow
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(getTomorrowStr());
  const [startTime, setStartTime] = useState<string>('14:00');
  const [endTime, setEndTime] = useState<string>('16:00');

  // Form Fields
  const [userName, setUserName] = useState<string>(
    currentRole === 'mahasiswa' ? 'Ahmad Fauzan' : 'Bambang Sudarmono'
  );
  const [userPhone, setUserPhone] = useState<string>('081298765432');
  const [userEmail, setUserEmail] = useState<string>(
    currentRole === 'mahasiswa' ? 'fauzan@student.ac.id' : 'bambang.sudarmono@gmail.com'
  );
  const [organizationName, setOrganizationName] = useState<string>(
    currentRole === 'mahasiswa' ? 'BEM Fakultas Teknik' : ''
  );
  const [activityName, setActivityName] = useState<string>(
    currentRole === 'mahasiswa' ? 'Masa Bimbingan Mahasiswa Baru & Pameran Riset' : 'Latihan Rutin Komunitas & Sparring'
  );
  const [proposalFileName, setProposalFileName] = useState<string>(
    currentRole === 'mahasiswa' ? 'Proposal_Kegiatan_Maba_2026_Disposisi.pdf' : ''
  );

  // Anti Double-Booking Check
  const conflictResult = useMemo(() => {
    return checkSlotConflict(
      facility.id,
      date,
      startTime,
      endTime,
      existingBookings
    );
  }, [facility.id, date, startTime, endTime, existingBookings]);

  // Duration and Pricing Calculation
  const durationHours = useMemo(() => {
    const [startH] = startTime.split(':').map(Number);
    const [endH] = endTime.split(':').map(Number);
    return Math.max(0, endH - startH);
  }, [startTime, endTime]);

  const totalPrice = useMemo(() => {
    if (currentRole === 'mahasiswa') {
      return facility.hourlyRateMhs * durationHours;
    }
    return facility.hourlyRateUmum * durationHours;
  }, [currentRole, facility, durationHours]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflictResult.hasConflict) return;
    if (durationHours <= 0) return;

    const newBookingData: Partial<Booking> = {
      facilityId: facility.id,
      facilityName: facility.name,
      facilityCategory: facility.category,
      role: currentRole as 'mahasiswa' | 'umum',
      userName,
      userPhone,
      userEmail,
      organizationName: currentRole === 'mahasiswa' ? organizationName : undefined,
      activityName,
      date,
      startTime,
      endTime,
      durationHours,
      totalPrice,
      proposalFileName: currentRole === 'mahasiswa' ? (proposalFileName || 'Proposal_Kegiatan.pdf') : undefined,
      status: currentRole === 'mahasiswa' ? 'pending_approval' : 'pending_payment'
    };

    onSubmitBooking(newBookingData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                currentRole === 'mahasiswa' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {currentRole === 'mahasiswa' ? 'Jalur Mahasiswa / UKM' : 'Jalur Umum (Berbayar)'}
              </span>
              <span className="text-xs text-slate-400">• Anti-Conflict Active</span>
            </div>
            <h2 className="text-base font-bold text-white leading-tight">
              {facility.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tanggal & Waktu Pickers */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Pilih Tanggal & Rentang Waktu Reservasi
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Jam Mulai</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                >
                  {OPERATIONAL_HOURS.slice(0, -1).map((hour) => (
                    <option key={hour} value={hour}>{hour} WIB</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Jam Selesai</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                >
                  {OPERATIONAL_HOURS.slice(1).map((hour) => (
                    <option key={hour} value={hour}>{hour} WIB</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Anti Double-Booking Feedback Engine */}
            {conflictResult.hasConflict ? (
              <div className="mt-2 p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-rose-700">
                      BENTROK JADWAL TERDETEKSI (Double-Booking Blocked!)
                    </p>
                    <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                      {conflictResult.reason}
                    </p>
                    <div className="mt-2 text-[10px] font-mono bg-rose-100 text-rose-800 p-2 rounded border border-rose-200">
                      Anti-Conflict Rule: <code>start_time &lt; booked_end AND end_time &gt; booked_start</code>
                    </div>
                  </div>
                </div>
              </div>
            ) : durationHours <= 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Jam selesai harus lebih besar dari jam mulai.</span>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">Slot Tersedia ({durationHours} Jam Sewa)</span>
                </div>
                <span className="font-bold text-emerald-800">
                  {currentRole === 'mahasiswa' ? 'Gratis (Subsidi UKM)' : `Rp ${totalPrice.toLocaleString('id-ID')}`}
                </span>
              </div>
            )}
          </div>

          {/* User & Organization Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Nama Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  placeholder="Nama Lengkap PIC"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Nomor WhatsApp Aktif
                </label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  required
                  placeholder="08xxxxxxxxxx"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Kegiatan / Agenda Acara
              </label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                required
                placeholder="Misal: Seminar Nasional / Laga Persahabatan"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Mahasiswa-Specific Fields: UKM & Proposal Upload */}
            {currentRole === 'mahasiswa' && (
              <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-sky-900 mb-1">
                    Nama UKM / Lembaga Mahasiswa
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                    placeholder="Contoh: UKM Sepakbola / BEM FT / HIMATIF"
                    className="w-full text-xs px-3 py-2 bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sky-900 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-sky-700" />
                    Upload Berkas Proposal / Surat Izin (PDF)
                  </label>
                  <div className="border-2 border-dashed border-sky-300 bg-white rounded-lg p-3 text-center cursor-pointer hover:bg-sky-50 transition">
                    <Upload className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-slate-700">
                      {proposalFileName || 'Klik untuk memilih berkas proposal PDF'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Wajib bertanda tangan Pembina UKM / Dekanat (Maks. 10MB)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Breakdown & Action Button */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 uppercase font-semibold">Skema Biaya</p>
              <p className="text-lg font-bold text-slate-900">
                {currentRole === 'mahasiswa' ? (
                  <span className="text-emerald-700">Gratis (Dispensasi UKM)</span>
                ) : (
                  <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={conflictResult.hasConflict || durationHours <= 0}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed ${
                  currentRole === 'mahasiswa'
                    ? 'bg-sky-700 hover:bg-sky-600 text-white shadow-sky-900/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                }`}
              >
                <span>
                  {currentRole === 'mahasiswa'
                    ? 'Ajukan Proposal ke Admin'
                    : 'Lanjut ke Midtrans Checkout'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
