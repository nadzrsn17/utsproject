import React, { useState } from 'react';
import { WaMessage } from '../types';
import { MessageSquare, CheckCheck, Send, ShieldCheck, X, ExternalLink, Smartphone } from 'lucide-react';

interface WaGatewayDrawerProps {
  messages: WaMessage[];
  isOpen: boolean;
  onClose: () => void;
  onOpenBookingVoucher: (bookingCode: string) => void;
}

export const WaGatewayDrawer: React.FC<WaGatewayDrawerProps> = ({
  messages,
  isOpen,
  onClose,
  onOpenBookingVoucher
}) => {
  const [selectedMessage, setSelectedMessage] = useState<WaMessage | null>(
    messages.length > 0 ? messages[messages.length - 1] : null
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 text-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-800">
        {/* Gateway Header */}
        <div className="p-4 bg-emerald-900/40 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Fonnte WA Gateway</span>
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  CONNECTED
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 font-mono">VenuUS Official Bot (+62 812-3344-5566)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info banner */}
        <div className="p-3 bg-slate-800/80 border-b border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Notifikasi otomatis terkirim saat Midtrans Webhook diterima atau proposal disetujui.</span>
        </div>

        {/* Message Selector List */}
        <div className="p-3 border-b border-slate-800 overflow-x-auto flex gap-2">
          {messages.map((msg, idx) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedMessage?.id === msg.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>#{idx + 1} {msg.recipientName.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* WhatsApp Chat Simulator Screen */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950/70 flex flex-col justify-end">
          {selectedMessage ? (
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  Pesan Terenkripsi End-to-End
                </span>
              </div>

              {/* Chat Bubble from Official VenuUS */}
              <div className="bg-[#005c4b] text-white p-4 rounded-2xl rounded-tr-none shadow-lg max-w-[92%] ml-auto border border-emerald-700/50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-600/40 text-[11px] text-emerald-200">
                  <span className="font-semibold">VenuUS Official Bot</span>
                  <span>{selectedMessage.timestamp}</span>
                </div>

                <div className="text-xs space-y-2 whitespace-pre-wrap leading-relaxed font-sans">
                  {selectedMessage.message}
                </div>

                <div className="mt-3 pt-2 border-t border-emerald-600/40 flex items-center justify-between">
                  <button
                    onClick={() => onOpenBookingVoucher(selectedMessage.bookingCode)}
                    className="text-[11px] font-semibold text-emerald-100 hover:text-white bg-emerald-800/60 hover:bg-emerald-800 px-2.5 py-1 rounded flex items-center gap-1 transition"
                  >
                    <span>Buka E-Voucher</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1 text-[11px] text-emerald-300">
                    <span>Terkirim</span>
                    <CheckCheck className="w-4 h-4 text-emerald-300" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/90 p-2.5 rounded-xl text-[11px] text-slate-300 flex items-center justify-between font-mono">
                <span>Target: {selectedMessage.phone}</span>
                <span className="text-emerald-400">HTTP 200 OK (Fonnte API)</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Belum ada pesan WhatsApp yang dipicu.
            </div>
          )}
        </div>

        {/* Footer Simulation Controls */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Send className="w-3.5 h-3.5 text-emerald-500" /> Fonnte REST v2.0
          </span>
          <span className="font-mono text-[10px]">Latency: 142ms</span>
        </div>
      </div>
    </div>
  );
};
