import React, { useState } from 'react';
import { Booking, Facility } from '../types';
import { checkSlotConflict, OPERATIONAL_HOURS, timeToMinutes } from '../utils/bookingLogic';
import { ShieldCheck, ShieldAlert, Cpu, Sparkles, CheckCircle2, Clock } from 'lucide-react';

interface AntiConflictSandboxProps {
  facilities: Facility[];
  bookings: Booking[];
}

export const AntiConflictSandbox: React.FC<AntiConflictSandboxProps> = ({
  facilities,
  bookings
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || 'fac-aula');
  const [testDate, setTestDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [testStart, setTestStart] = useState<string>('14:00');
  const [testEnd, setTestEnd] = useState<string>('16:00');

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId) || facilities[0];

  // Active bookings on this facility & date
  const dayBookings = bookings.filter(
    (b) => b.facilityId === selectedFacilityId && b.date === testDate && b.status !== 'rejected' && b.status !== 'cancelled'
  );

  const conflictCheck = checkSlotConflict(
    selectedFacilityId,
    testDate,
    testStart,
    testEnd,
    bookings
  );

  const startMin = timeToMinutes('07:00');
  const endMin = timeToMinutes('22:00');
  const totalDayMinutes = endMin - startMin;

  const testStartMin = timeToMinutes(testStart);
  const testEndMin = timeToMinutes(testEnd);

  // Position calculators for visual timeline
  const getPercent = (timeStr: string) => {
    const m = timeToMinutes(timeStr);
    return Math.max(0, Math.min(100, ((m - startMin) / totalDayMinutes) * 100));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Interactive Algorithm Simulator
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900">
            Anti Double-Booking Engine Sandbox
          </h2>
          <p className="text-xs text-slate-500">
            Simulator interaktif untuk pengujian skripsi: memverifikasi teorema irisan interval temporal waktu nyata.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
          >
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>{f.name.split('(')[0]}</option>
            ))}
          </select>
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
          />
        </div>
      </div>

      {/* Control sliders / selectors for candidate time */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-600" />
          Uji Coba Slot Waktu Pengajuan Baru:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Jam Mulai Calon Pemesan:</label>
            <select
              value={testStart}
              onChange={(e) => setTestStart(e.target.value)}
              className="w-full text-xs font-bold px-3 py-2 bg-white rounded-lg border border-slate-300"
            >
              {OPERATIONAL_HOURS.slice(0, -1).map((h) => (
                <option key={h} value={h}>{h} WIB</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Jam Selesai Calon Pemesan:</label>
            <select
              value={testEnd}
              onChange={(e) => setTestEnd(e.target.value)}
              className="w-full text-xs font-bold px-3 py-2 bg-white rounded-lg border border-slate-300"
            >
              {OPERATIONAL_HOURS.slice(1).map((h) => (
                <option key={h} value={h}>{h} WIB</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Timeline Bar representation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>07:00 WIB</span>
          <span>12:00 WIB</span>
          <span>17:00 WIB</span>
          <span>22:00 WIB</span>
        </div>

        {/* Timeline Grid Track */}
        <div className="relative h-20 bg-slate-100 rounded-xl border border-slate-300 overflow-hidden shadow-inner p-1">
          {/* Hour markers */}
          <div className="absolute inset-0 flex justify-between pointer-events-none px-2 opacity-20">
            {OPERATIONAL_HOURS.map((h) => (
              <div key={h} className="h-full border-r border-slate-900 w-0"></div>
            ))}
          </div>

          {/* Existing Booked Slots (Grey/Navy bars) */}
          {dayBookings.map((b) => {
            const left = getPercent(b.startTime);
            const right = getPercent(b.endTime);
            const width = Math.max(2, right - left);
            return (
              <div
                key={b.id}
                style={{ left: `${left}%`, width: `${width}%` }}
                className="absolute top-2 h-7 bg-slate-800 text-white rounded-md text-[10px] font-mono flex items-center justify-center px-1 overflow-hidden shadow border border-slate-700"
                title={`${b.activityName} (${b.startTime}-${b.endTime})`}
              >
                <span className="truncate">{b.startTime}-{b.endTime} ({b.userName.split(' ')[0]})</span>
              </div>
            );
          })}

          {/* Candidate Slot Bar (Green if safe, Red pulsating if conflict) */}
          {testEndMin > testStartMin && (
            <div
              style={{
                left: `${getPercent(testStart)}%`,
                width: `${Math.max(2, getPercent(testEnd) - getPercent(testStart))}%`
              }}
              className={`absolute bottom-2 h-7 rounded-md text-[10px] font-bold flex items-center justify-center px-1 transition-all duration-300 shadow-md ${
                conflictCheck.hasConflict
                  ? 'bg-rose-600 text-white ring-4 ring-rose-400/50 animate-pulse'
                  : 'bg-emerald-600 text-white ring-4 ring-emerald-400/50'
              }`}
            >
              <span className="truncate">Calon: {testStart} - {testEnd}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-800 inline-block"></span>
            <span className="text-slate-600">Jadwal Eksisting (Terpesan / Aktif)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600 inline-block"></span>
            <span className="text-slate-600">Slot Pengajuan Baru (Aman)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-600 inline-block"></span>
            <span className="text-slate-600">Bentrok Terdeteksi (Ditolak Sistem)</span>
          </div>
        </div>
      </div>

      {/* Engine Status Result Box */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        conflictCheck.hasConflict ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-emerald-50 border-emerald-300 text-emerald-950'
      }`}>
        {conflictCheck.hasConflict ? (
          <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <h4 className="font-bold text-sm">
            {conflictCheck.hasConflict ? 'STATUS: BENTROK TERDETEKSI (PENGAJUAN DITOLAK)' : 'STATUS: AMAN (SLOT TERSEDIA)'}
          </h4>
          <p className="text-xs">
            {conflictCheck.hasConflict
              ? conflictCheck.reason
              : `Slot ${testStart} - ${testEnd} WIB pada tanggal ${testDate} tidak memiliki irisan dengan jadwal mana pun.`}
          </p>
          <div className="mt-2 text-[11px] font-mono bg-white/80 p-2.5 rounded-lg border border-slate-200">
            <strong>Evaluasi Logika SQL Overlap:</strong><br />
            <code>WHERE start_time &lt; '{testEnd}' AND end_time &gt; '{testStart}'</code>
            <span className="ml-2 font-bold text-slate-800">
              =&gt; {conflictCheck.hasConflict ? 'TRUE (Bentrok ditemukan)' : 'FALSE (Nol bentrok)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
