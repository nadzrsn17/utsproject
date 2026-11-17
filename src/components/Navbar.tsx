import React from 'react';
import { UserRole } from '../types';
import { 
  Building, 
  MessageSquare, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  Globe, 
  Cpu, 
  CalendarDays,
  Edit3
} from 'lucide-react';

interface NavbarProps {
  campusName: string;
  onChangeCampusName: () => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  activeView: 'booking' | 'sandbox' | 'skripsi' | 'admin';
  onChangeView: (view: 'booking' | 'sandbox' | 'skripsi' | 'admin') => void;
  onOpenWaDrawer: () => void;
  waMessagesCount: number;
  pendingApprovalsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  campusName,
  onChangeCampusName,
  currentRole,
  onChangeRole,
  activeView,
  onChangeView,
  onOpenWaDrawer,
  waMessagesCount,
  pendingApprovalsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top institution bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 text-[11px] text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Sistem Informasi Reservasi Fasilitas Kampus Terpadu</span>
          <span className="text-slate-500">•</span>
          <button
            onClick={onChangeCampusName}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1 transition"
          >
            <span>{campusName}</span>
            <Edit3 className="w-3 h-3" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-slate-400">Tech Stack: Laravel 11 • MySQL • Midtrans • Fonnte</span>
          <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            PRODUKSI SKRIPSI
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <button
            onClick={() => onChangeView('booking')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-emerald-950">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition">
                  VenuUS
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Kampus
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                {campusName}
              </p>
            </div>
          </button>

          {/* Mobile WA trigger */}
          <button
            onClick={onOpenWaDrawer}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-emerald-400 relative"
          >
            <MessageSquare className="w-5 h-5" />
            {waMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                {waMessagesCount}
              </span>
            )}
          </button>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => onChangeView('booking')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeView === 'booking'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Fasilitas & Sewa</span>
          </button>

          <button
            onClick={() => onChangeView('sandbox')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeView === 'sandbox'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Uji Anti Double-Booking</span>
          </button>

          <button
            onClick={() => onChangeView('admin')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeView === 'admin'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Dashboard Pengelola</span>
            {pendingApprovalsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeView('skripsi')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeView === 'skripsi'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Dokumen Skripsi & Koding</span>
          </button>
        </div>

        {/* Role Selector & WA Gateway Indicator */}
        <div className="flex items-center gap-3">
          {/* Multi-role Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => onChangeRole('mahasiswa')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition ${
                currentRole === 'mahasiswa'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Role Mahasiswa / UKM (Upload proposal & tarif gratis)"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Mahasiswa</span>
            </button>

            <button
              onClick={() => onChangeRole('umum')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition ${
                currentRole === 'umum'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Role Umum (Bayar Midtrans QRIS/VA)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Umum</span>
            </button>

            <button
              onClick={() => onChangeRole('admin')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition ${
                currentRole === 'admin'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Role Admin Pengelola (Approve, Scan QR, Laporan)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Admin</span>
            </button>
          </div>

          {/* WA Gateway Button (Desktop) */}
          <button
            onClick={onOpenWaDrawer}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition relative"
            title="Buka Log Fonnte WhatsApp Gateway"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WA Gateway</span>
            {waMessagesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                {waMessagesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
