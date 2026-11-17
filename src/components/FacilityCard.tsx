import React from 'react';
import { Facility, UserRole } from '../types';
import { Users, MapPin, CheckCircle2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface FacilityCardProps {
  facility: Facility;
  currentRole: UserRole;
  onBookNow: (facility: Facility) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  currentRole,
  onBookNow
}) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Facility Image with Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-900">
        <img
          src={facility.image}
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-950/80 text-white backdrop-blur-md border border-white/20">
            {facility.category === 'aula' ? '🏛️ Gedung / Aula' : '⚽ Lapangan Olahraga'}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600/90 text-white backdrop-blur-md">
            Aktif Terbuka
          </span>
        </div>

        {/* Bottom Capacity & Location inside Image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Kapasitas {facility.capacity} Orang</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="truncate max-w-[180px]">{facility.location}</span>
          </div>
        </div>
      </div>

      {/* Facility Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div>
          <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-800 transition">
            {facility.name}
          </h3>
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {facility.description}
          </p>

          {/* Key Features Pill Matrix */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Fasilitas Unggulan:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {facility.features.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              {currentRole === 'mahasiswa' ? 'Tarif Mahasiswa / UKM' : 'Tarif Sewa Umum'}
            </span>
            <div className="text-lg font-black text-slate-900">
              {currentRole === 'mahasiswa' ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  Rp 0 <span className="text-xs font-normal text-slate-500">(Subsidi Kampus)</span>
                </span>
              ) : (
                <span>
                  Rp {facility.hourlyRateUmum.toLocaleString('id-ID')}
                  <span className="text-xs font-normal text-slate-500"> / jam</span>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onBookNow(facility)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 group/btn"
          >
            <span>Reservasi Slot</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
