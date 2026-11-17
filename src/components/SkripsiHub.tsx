import React, { useState } from 'react';
import { SKRIPSI_DATA } from '../data/skripsiContent';
import { 
  BookOpen, 
  Database, 
  Cpu, 
  CreditCard, 
  ClipboardCheck, 
  Copy, 
  FileText, 
  Check, 
  Layers, 
  ShieldCheck,
  Send,
  Code
} from 'lucide-react';

interface SkripsiHubProps {
  campusName: string;
}

export const SkripsiHub: React.FC<SkripsiHubProps> = ({ campusName }) => {
  const [activeSection, setActiveSection] = useState<'bab1' | 'analisis' | 'erd' | 'anticonflict' | 'midtrans_wa'>('bab1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    // Replace placeholder with dynamic campus name
    const finalizedText = text.replace(/\[Nama Kampusmu\]/g, campusName);
    navigator.clipboard.writeText(finalizedText);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Pusat Dokumen Skripsi & Spesifikasi Koding
              </span>
              <span className="text-xs text-slate-400">• Standar Akademik Ilmiah</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              VenuUS - Sistem Informasi Reservasi Fasilitas {campusName}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Arsitektur teknis lengkap (Laravel, MySQL, Midtrans, Fonnte WA) dan draf naskah skripsi Bab 1 & Analisis Kebutuhan, terstruktur dan siap pakai untuk sidang & penyusunan skripsi.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const fullBab1 = `BAB I PENDAHULUAN\n\n1.1 Latar Belakang\n\n` + 
                  SKRIPSI_DATA.bagian2.bab1.latarBelakang.join("\n\n") + 
                  `\n\n1.2 Rumusan Masalah\n\n` + 
                  SKRIPSI_DATA.bagian2.bab1.rumusanMasalah.join("\n") +
                  `\n\n1.3 Batasan Masalah\n\n` +
                  SKRIPSI_DATA.bagian2.bab1.batasanMasalah.join("\n");
                handleCopy(fullBab1, 'full_bab1_btn');
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              {copiedKey === 'full_bab1_btn' ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'full_bab1_btn' ? 'Tersalin ke Clipboard!' : 'Salin Seluruh BAB 1 (Word)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSection('bab1')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeSection === 'bab1'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>BAB 1: Latar Belakang & Masalah</span>
        </button>

        <button
          onClick={() => setActiveSection('analisis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeSection === 'analisis'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Analisis Kebutuhan Fungsional (FR)</span>
        </button>

        <button
          onClick={() => setActiveSection('erd')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeSection === 'erd'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Struktur Database (ERD & SQL DDL)</span>
        </button>

        <button
          onClick={() => setActiveSection('anticonflict')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeSection === 'anticonflict'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Logika Anti Double-Booking & Eloquent</span>
        </button>

        <button
          onClick={() => setActiveSection('midtrans_wa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeSection === 'midtrans_wa'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Midtrans & WA Gateway Architecture</span>
        </button>
      </div>

      {/* Content Section: BAB 1 */}
      {activeSection === 'bab1' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-8">
          {/* Header */}
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Dokumen Skripsi - Bab I
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                BAB I PENDAHULUAN
              </h2>
            </div>
            <button
              onClick={() => handleCopy(SKRIPSI_DATA.bagian2.bab1.latarBelakang.join("\n\n"), 'lb')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition"
            >
              {copiedKey === 'lb' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'lb' ? 'Tersalin' : 'Salin Latar Belakang'}</span>
            </button>
          </div>

          {/* 1.1 Latar Belakang */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="text-emerald-700 font-mono">1.1</span> Latar Belakang Masalah
            </h3>
            <div className="prose text-slate-700 text-sm leading-relaxed space-y-4 text-justify font-serif">
              {SKRIPSI_DATA.bagian2.bab1.latarBelakang.map((p, idx) => (
                <div key={idx} className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 relative">
                  <span className="absolute top-2 right-3 text-[10px] font-mono text-slate-400 font-sans">
                    Paragraf {idx + 1}: {idx === 0 ? 'Idealita & Konteks' : idx === 1 ? 'Masalah Faktual Lapangan' : idx === 2 ? 'Solusi Sistem yang Diajukan' : 'Kebaruan & Kontribusi'}
                  </span>
                  <p className="indent-8 leading-relaxed">
                    {p.replace(/\[Nama Kampusmu\]/g, campusName)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 1.2 Rumusan Masalah */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-emerald-700 font-mono">1.2</span> Rumusan Masalah
              </h3>
              <button
                onClick={() => handleCopy(SKRIPSI_DATA.bagian2.bab1.rumusanMasalah.join("\n"), 'rm')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Salin Rumusan
              </button>
            </div>
            <div className="space-y-2">
              {SKRIPSI_DATA.bagian2.bab1.rumusanMasalah.map((rm, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium leading-relaxed">
                  {rm}
                </div>
              ))}
            </div>
          </div>

          {/* 1.3 Batasan Masalah */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-emerald-700 font-mono">1.3</span> Batasan Masalah
              </h3>
              <button
                onClick={() => handleCopy(SKRIPSI_DATA.bagian2.bab1.batasanMasalah.join("\n"), 'bm')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Salin Batasan
              </button>
            </div>
            <div className="space-y-2">
              {SKRIPSI_DATA.bagian2.bab1.batasanMasalah.map((bm, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                  <span>{bm.replace(/\[Nama Kampusmu\]/g, campusName)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Section: Analisis Kebutuhan Fungsional */}
      {activeSection === 'analisis' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-8">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              Software Requirements Specification (SRS)
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Analisis Kebutuhan Fungsional Berdasarkan Role Pengguna
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Daftar fungsi sistem yang wajib ada untuk menjamin alur bisnis reservasi terintegrasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role Mahasiswa */}
            <div className="p-5 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-4">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-sm border-b border-sky-200 pb-2">
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs">
                  🎓
                </div>
                <span>Role: Mahasiswa / UKM</span>
              </div>
              <div className="space-y-3">
                {SKRIPSI_DATA.bagian2.kebutuhanFungsional.mahasiswa.map((fr) => (
                  <div key={fr.code} className="bg-white p-3 rounded-xl border border-sky-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded">
                        {fr.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">Priority: MUST</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{fr.name}</p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">{fr.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Umum */}
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm border-b border-emerald-200 pb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs">
                  🌐
                </div>
                <span>Role: Masyarakat Umum / Eksternal</span>
              </div>
              <div className="space-y-3">
                {SKRIPSI_DATA.bagian2.kebutuhanFungsional.umum.map((fr) => (
                  <div key={fr.code} className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {fr.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">Priority: MUST</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{fr.name}</p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">{fr.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Admin */}
            <div className="p-5 rounded-2xl border border-slate-300 bg-slate-50 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-300 pb-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">
                  🛡️
                </div>
                <span>Role: Admin / Pengelola Sarpras</span>
              </div>
              <div className="space-y-3">
                {SKRIPSI_DATA.bagian2.kebutuhanFungsional.admin.map((fr) => (
                  <div key={fr.code} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded">
                        {fr.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">Priority: MUST</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{fr.name}</p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">{fr.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section: ERD & Database Structure */}
      {activeSection === 'erd' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Entity Relationship Diagram (ERD) & Skema Basis Data
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Struktur Tabel Relasional MySQL (Normalized 3NF)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {SKRIPSI_DATA.bagian1.erd.summary}
              </p>
            </div>

            <button
              onClick={() => handleCopy(SKRIPSI_DATA.bagian1.erd.sqlScript, 'sql')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              {copiedKey === 'sql' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'sql' ? 'DDL SQL Tersalin!' : 'Salin Script SQL (DDL)'}</span>
            </button>
          </div>

          {/* Interactive ERD Visual Representation */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Tabel-Tabel Utama Basis Data:
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {SKRIPSI_DATA.bagian1.erd.tables.map((table) => (
                <div key={table.name} className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span className="font-mono font-bold text-xs">{table.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">InnoDB • UTF8MB4</span>
                  </div>
                  <div className="p-3 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 italic">
                    {table.description}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 font-mono">
                        <tr>
                          <th className="p-2">Field</th>
                          <th className="p-2">Type / Constraint</th>
                          <th className="p-2">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono">
                        {table.columns.map((col, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-slate-900">{col.field}</td>
                            <td className="p-2 text-emerald-700">{col.type}</td>
                            <td className="p-2 font-sans text-slate-600 text-[10px]">{col.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw SQL Script Drawer */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-700" />
                Script DDL MySQL Siap Eksekusi (phpMyAdmin / Laravel Migration):
              </span>
            </div>
            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-72 border border-slate-800">
              {SKRIPSI_DATA.bagian1.erd.sqlScript}
            </pre>
          </div>
        </div>
      )}

      {/* Content Section: Logika Anti Double-Booking */}
      {activeSection === 'anticonflict' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Algoritma Inti (Core Engine)
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Logika Matematika Anti Double-Booking & Eloquent Rule
              </h2>
            </div>
            <button
              onClick={() => handleCopy(SKRIPSI_DATA.bagian1.antiDoubleBooking.laravelEloquentCode, 'eloquent')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow transition"
            >
              {copiedKey === 'eloquent' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'eloquent' ? 'Tersalin' : 'Salin Rule Laravel'}</span>
            </button>
          </div>

          {/* Teorema & Penjelasan */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
            <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
              Formula Irisan Interval Waktu (Interval Overlap Theorem):
            </p>
            <div className="p-3 bg-slate-800 rounded-lg text-emerald-400 font-mono text-sm font-bold border border-slate-700">
              {SKRIPSI_DATA.bagian1.antiDoubleBooking.formula}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {SKRIPSI_DATA.bagian1.antiDoubleBooking.explanation}
            </p>
          </div>

          {/* Pseudo-Code */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
              Pseudo-code Algoritma Validasi Jadwal:
            </span>
            <pre className="bg-slate-50 text-slate-800 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-300">
              {SKRIPSI_DATA.bagian1.antiDoubleBooking.pseudoCode}
            </pre>
          </div>

          {/* Laravel Eloquent Source Code */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-700" />
              Implementasi Nyata: Custom Validation Rule Laravel (PHP):
            </span>
            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
              {SKRIPSI_DATA.bagian1.antiDoubleBooking.laravelEloquentCode}
            </pre>
          </div>
        </div>
      )}

      {/* Content Section: Midtrans & WhatsApp Integration */}
      {activeSection === 'midtrans_wa' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              Arsitektur Webhook & Event-Driven Notification
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Integrasi Payment Gateway Midtrans Sandbox & Fonnte WhatsApp API
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {SKRIPSI_DATA.bagian1.integrations.workflowTitle}
            </p>
          </div>

          {/* Step-by-Step Flow */}
          <div className="space-y-3">
            {SKRIPSI_DATA.bagian1.integrations.steps.map((step) => (
              <div key={step.num} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Midtrans Controller Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                MidtransCallbackController.php (Validasi Signature SHA512 & DB Transaction):
              </span>
              <button
                onClick={() => handleCopy(SKRIPSI_DATA.bagian1.integrations.controllerCode, 'midtrans_ctrl')}
                className="text-xs text-emerald-700 hover:underline font-semibold"
              >
                {copiedKey === 'midtrans_ctrl' ? 'Tersalin!' : 'Salin Kode Controller'}
              </button>
            </div>
            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
              {SKRIPSI_DATA.bagian1.integrations.controllerCode}
            </pre>
          </div>

          {/* Fonnte Service Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-600" />
                FonnteService.php (Kirim Tiket & Link QR Code ke WhatsApp Pemesan):
              </span>
              <button
                onClick={() => handleCopy(SKRIPSI_DATA.bagian1.integrations.fonnteServiceCode, 'fonnte_srv')}
                className="text-xs text-emerald-700 hover:underline font-semibold"
              >
                {copiedKey === 'fonnte_srv' ? 'Tersalin!' : 'Salin Kode Fonnte'}
              </button>
            </div>
            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
              {SKRIPSI_DATA.bagian1.integrations.fonnteServiceCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
