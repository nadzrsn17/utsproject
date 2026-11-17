import React from 'react';
import { Facility, Booking } from '../types';
import { getFacilityOccupancyForDate } from '../utils/bookingLogic';
import { Calendar, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface ScheduleOccupancyViewProps {
  facilities: Facility[];
  bookings: Booking[];
  selectedDate: string;
  onSelectDate: (d: string) => void;
  onBookSlot: (facility: Facility, timeSlot: string) => void;
}

export const ScheduleOccupancyView: React.FC<ScheduleOccupancyViewProps> = ({
  facilities,
  bookings,
  selectedDate,
  onSelectDate,
  onBookSlot
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Real-Time Slot Engine
          </span>
          <h2 className="text-lg font-black text-slate-900 mt-0.5">
            Papan Jadwal Ketersediaan Slot Fasilitas
          </h2>
          <p className="text-xs text-slate-500">
            Pilih tanggal untuk memantau slot yang telah terisi (booked) dan slot yang masih kosong.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => onSelectDate(e.target.value)}
            className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {facilities.map((facility) => {
          const slots = getFacilityOccupancyForDate(facility.id, selectedDate, bookings);
          const bookedCount = slots.filter((s) => s.isBooked).length;
          const availableCount = slots.length - bookedCount;

          return (
            <div
              key={facility.id}
              className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                      {facility.category === 'aula' ? 'Gedung' : 'Olahraga'}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">
                      {facility.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      {availableCount} Slot Kosong
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 mb-3 flex items-center justify-between">
                  <span>Operasional: 07:00 - 22:00 WIB</span>
                  <span>{bookedCount} Slot Terisi</span>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {slots.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={s.isBooked}
                      onClick={() => !s.isBooked && onBookSlot(facility, s.time.split(' - ')[0])}
                      className={`p-2 rounded-lg text-center transition flex flex-col items-center justify-center text-[11px] font-mono border ${
                        s.isBooked
                          ? 'bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-white border-emerald-300 text-emerald-900 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-2xs font-semibold'
                      }`}
                      title={s.isBooked ? `Terisi: ${s.booking?.activityName}` : 'Slot Kosong - Klik untuk Pesan'}
                    >
                      <span>{s.time.split(' - ')[0]}</span>
                      <span className="text-[9px] mt-0.5 uppercase font-sans">
                        {s.isBooked ? 'Terisi' : 'Kosong'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Tarif: <strong>Rp {facility.hourlyRateUmum.toLocaleString('id-ID')}</strong>/jam (Umum)
                </span>
                <button
                  onClick={() => onBookSlot(facility, '14:00')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
                >
                  <span>Pesan Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
