import React, { useState } from 'react';
import { X, Building, Check } from 'lucide-react';

interface CampusModalProps {
  currentCampusName: string;
  onSave: (newName: string) => void;
  onClose: () => void;
}

export const CampusModal: React.FC<CampusModalProps> = ({
  currentCampusName,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(currentCampusName);

  const presets = [
    'UNIVERSITAS KOMPUTAMA',
    'Universitas Gadjah Mada (UGM)',
    'Universitas Indonesia (UI)',
    'Institut Teknologi Bandung (ITB)',
    'Universitas Diponegoro (UNDIP)',
    'Universitas Brawijaya (UB)',
    'Universitas Sebelas Maret (UNS)',
    'Politeknik Negeri Jakarta (PNJ)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Ubah [Nama Kampusmu]</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Ketik Nama Kampus / Institusi:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Universitas Diponegoro"
              className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-slate-400 mb-2">
              Atau pilih rekomendasi kampus:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setName(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                    name === preset
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition"
            >
              Simpan & Terapkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
