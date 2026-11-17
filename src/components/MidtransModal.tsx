import React, { useState } from 'react';
import { Booking } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { ShieldCheck, ArrowRight, CheckCircle2, Clock, Smartphone, Building, RefreshCw, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MidtransModalProps {
  booking: Booking;
  onSuccess: (paymentType: 'qris' | 'bca_va' | 'mandiri_va', txnId: string) => void;
  onClose: () => void;
}

export const MidtransModal: React.FC<MidtransModalProps> = ({
  booking,
  onSuccess,
  onClose
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'bca_va' | 'mandiri_va'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWebhookLog, setShowWebhookLog] = useState(false);

  const virtualAccountNumbers = {
    bca_va: '80777' + booking.userPhone.replace(/^0/, '62').slice(-8),
    mandiri_va: '70012' + booking.userPhone.replace(/^0/, '62').slice(-8)
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
      const fakeTxnId = 'MID-TXN-' + Math.floor(100000 + Math.random() * 900000);
      onSuccess(selectedMethod, fakeTxnId);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Midtrans Sandbox Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-wide">Midtrans Snap</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Sandbox Environment
                </span>
              </div>
              <p className="text-xs text-slate-400">Order ID: {booking.bookingCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Total Tagihan</p>
            <p className="text-2xl font-bold text-slate-900">
              Rp {booking.totalPrice.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 font-medium px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL Encrypted
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Sewa {booking.durationHours} Jam • {booking.facilityName.split('(')[0]}</p>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="p-5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Pilih Metode Pembayaran Sandbox
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setSelectedMethod('qris')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                selectedMethod === 'qris'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <Smartphone className={`w-5 h-5 mb-2 ${selectedMethod === 'qris' ? 'text-emerald-700' : 'text-slate-600'}`} />
              <div>
                <p className="text-xs font-bold text-slate-900">QRIS Instan</p>
                <p className="text-[10px] text-slate-500">GoPay, OVO, Dana</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('bca_va')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                selectedMethod === 'bca_va'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <Building className={`w-5 h-5 mb-2 ${selectedMethod === 'bca_va' ? 'text-emerald-700' : 'text-slate-600'}`} />
              <div>
                <p className="text-xs font-bold text-slate-900">BCA VA</p>
                <p className="text-[10px] text-slate-500">Virtual Account</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('mandiri_va')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                selectedMethod === 'mandiri_va'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <Building className={`w-5 h-5 mb-2 ${selectedMethod === 'mandiri_va' ? 'text-emerald-700' : 'text-slate-600'}`} />
              <div>
                <p className="text-xs font-bold text-slate-900">Mandiri Bill</p>
                <p className="text-[10px] text-slate-500">Virtual Account</p>
              </div>
            </button>
          </div>

          {/* Payment Detail Display */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-5">
            {selectedMethod === 'qris' ? (
              <div className="flex flex-col items-center text-center">
                <span className="text-[11px] font-semibold text-slate-600 mb-2">
                  Scan QRIS Menggunakan Aplikasi M-Banking atau E-Wallet Apapun
                </span>
                <QRCodeDisplay
                  value={`MIDTRANS-QRIS-${booking.bookingCode}-${booking.totalPrice}`}
                  size={140}
                  label="NMID: ID102003889102"
                />
                <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Waktu bayar tersisa: <span className="font-mono font-bold text-slate-800">14:59</span>
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-600 font-medium">Nomor Virtual Account ({selectedMethod === 'bca_va' ? 'BCA' : 'Mandiri'}):</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Otomatis Verifikasi</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-300 flex items-center justify-between font-mono text-base font-bold text-slate-900">
                  <span>{virtualAccountNumbers[selectedMethod]}</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(virtualAccountNumbers[selectedMethod])}
                    className="text-xs font-sans text-emerald-600 hover:underline"
                  >
                    Salin
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Gunakan simulator m-Banking atau ATM untuk transfer tepat jumlah <strong>Rp {booking.totalPrice.toLocaleString('id-ID')}</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Action Simulator Button */}
          <button
            type="button"
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Memproses Webhook Midtrans & Menembak Fonnte API...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Simulasikan Pembayaran Sukses (Trigger Webhook)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          {/* Webhook JSON Preview Toggle */}
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setShowWebhookLog(!showWebhookLog)}
              className="text-[11px] text-slate-500 hover:text-slate-800 underline font-mono"
            >
              {showWebhookLog ? 'Sembunyikan Webhook JSON Payload' : 'Lihat Simulasi Webhook HTTP POST JSON'}
            </button>
            {showWebhookLog && (
              <pre className="mt-2 text-left bg-slate-900 text-emerald-400 p-3 rounded-lg text-[10px] font-mono overflow-x-auto border border-slate-800">
{JSON.stringify({
  order_id: booking.bookingCode,
  transaction_status: "settlement",
  gross_amount: booking.totalPrice.toString() + ".00",
  payment_type: selectedMethod,
  transaction_time: new Date().toISOString(),
  signature_key: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855..."
}, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
