import React, { useState } from 'react';
import { UserRole, Facility, Booking, WaMessage } from './types';
import { INITIAL_FACILITIES, INITIAL_BOOKINGS, INITIAL_WA_MESSAGES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { FacilityCard } from './components/FacilityCard';
import { ScheduleOccupancyView } from './components/ScheduleOccupancyView';
import { BookingModal } from './components/BookingModal';
import { MidtransModal } from './components/MidtransModal';
import { EVoucherModal } from './components/EVoucherModal';
import { WaGatewayDrawer } from './components/WaGatewayDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { AntiConflictSandbox } from './components/AntiConflictSandbox';
import { SkripsiHub } from './components/SkripsiHub';
import { CampusModal } from './components/CampusModal';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  BookOpen, 
  GraduationCap, 
  Globe, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  MessageSquare,
  QrCode,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [campusName, setCampusName] = useState<string>('UNIVERSITAS KOMPUTAMA');
  const [currentRole, setCurrentRole] = useState<UserRole>('umum');
  const [activeView, setActiveView] = useState<'booking' | 'sandbox' | 'skripsi' | 'admin'>('booking');

  // Master Data State
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [waMessages, setWaMessages] = useState<WaMessage[]>(INITIAL_WA_MESSAGES);

  // Modals & Drawers State
  const [bookingFacility, setBookingFacility] = useState<Facility | null>(null);
  const [pendingMidtransBooking, setPendingMidtransBooking] = useState<Booking | null>(null);
  const [viewingVoucherBooking, setViewingVoucherBooking] = useState<Booking | null>(null);
  const [isWaDrawerOpen, setIsWaDrawerOpen] = useState(false);
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper: Trigger Fonnte WhatsApp Simulation
  const triggerWaNotification = (
    phone: string,
    recipientName: string,
    bookingCode: string,
    messageText: string
  ) => {
    const newMsg: WaMessage = {
      id: 'wa-' + Date.now(),
      phone,
      recipientName,
      bookingCode,
      message: messageText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: 'delivered'
    };
    setWaMessages((prev) => [...prev, newMsg]);
  };

  // 1. Submit Booking Flow
  const handleBookingSubmit = (bookingData: Partial<Booking>) => {
    const bookingCode = `VEN-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: 'b-' + Date.now(),
      bookingCode,
      facilityId: bookingData.facilityId!,
      facilityName: bookingData.facilityName!,
      facilityCategory: bookingData.facilityCategory!,
      role: bookingData.role!,
      userName: bookingData.userName!,
      userEmail: bookingData.userEmail!,
      userPhone: bookingData.userPhone!,
      organizationName: bookingData.organizationName,
      activityName: bookingData.activityName!,
      date: bookingData.date!,
      startTime: bookingData.startTime!,
      endTime: bookingData.endTime!,
      durationHours: bookingData.durationHours!,
      totalPrice: bookingData.totalPrice || 0,
      status: bookingData.status as any,
      proposalFileName: bookingData.proposalFileName,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    setBookingFacility(null); // close booking modal

    if (bookingData.role === 'mahasiswa') {
      // Add to bookings list as pending approval
      setBookings((prev) => [newBooking, ...prev]);
      
      // Send WA notification to Student
      const waText = `*VenuUS ${campusName} - PENGAJUAN BERHASIL DIAJUKAN*\n\nHalo *${newBooking.userName}* (${newBooking.organizationName}),\n\nProposal peminjaman fasilitas *${newBooking.facilityName}* telah diterima oleh sistem VenuUS.\n\n📅 Tanggal: ${newBooking.date}\n⏰ Waktu: ${newBooking.startTime} - ${newBooking.endTime} WIB\n🎟️ Kode Booking: *${bookingCode}*\n📄 Berkas: ${newBooking.proposalFileName}\n\nStatus saat ini: *MENUNGGU PERSETUJUAN (PENDING)*. Kami akan mengabari Anda kembali via WhatsApp begitu berkas disetujui Admin Sarpras.`;
      
      triggerWaNotification(newBooking.userPhone, newBooking.userName, bookingCode, waText);
      showToast(`Pengajuan berhasil dikirim! Kode: ${bookingCode}. Menunggu approval Admin.`);
    } else {
      // Role Umum: Open Midtrans Sandbox Simulator
      setPendingMidtransBooking(newBooking);
    }
  };

  // 2. Midtrans Payment Success Flow
  const handleMidtransPaymentSuccess = (paymentType: 'qris' | 'bca_va' | 'mandiri_va', txnId: string) => {
    if (!pendingMidtransBooking) return;

    const paidBooking: Booking = {
      ...pendingMidtransBooking,
      status: 'paid',
      paymentMethod: paymentType,
      midtransTransactionId: txnId,
      paidAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    setBookings((prev) => [paidBooking, ...prev]);
    setPendingMidtransBooking(null);

    // Trigger WhatsApp notification with E-Voucher link
    const waText = `*VenuUS ${campusName} - PEMBAYARAN MIDTRANS BERHASIL (PAID)*\n\nYth. *${paidBooking.userName}*,\n\nPembayaran reservasi melalui Midtrans (${paymentType.toUpperCase()}) sebesar *Rp ${paidBooking.totalPrice.toLocaleString('id-ID')}* telah diverifikasi secara otomatis!\n\n🏛️ Fasilitas: *${paidBooking.facilityName}*\n📅 Tanggal: ${paidBooking.date}\n⏰ Jam: ${paidBooking.startTime} - ${paidBooking.endTime} WIB\n🎟️ Kode Booking: *${paidBooking.bookingCode}*\n\nE-Voucher resmi ber-QR Code telah aktif. Silakan simpan dan tunjukkan kepada petugas gerbang saat tiba di lokasi. Terima kasih!`;

    triggerWaNotification(paidBooking.userPhone, paidBooking.userName, paidBooking.bookingCode, waText);
    
    // Automatically open E-Voucher modal
    setViewingVoucherBooking(paidBooking);
    showToast(`Pembayaran Midtrans Berhasil! E-Voucher ${paidBooking.bookingCode} telah diterbitkan.`);
  };

  // 3. Admin Approval Action
  const handleApproveBooking = (bookingId: string, notes: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const approved = {
            ...b,
            status: 'paid' as const, // approved & finalized
            adminNotes: notes,
            paidAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
          };

          // Trigger WhatsApp
          const waText = `*VenuUS ${campusName} - PROPOSAL DISETUJUI*\n\nYth. *${b.userName}* (${b.organizationName || 'Mahasiswa'}),\n\nSelamat! Pengajuan peminjaman *${b.facilityName}* telah *DISETUJUI* oleh Biro Sarpras & Kemahasiswaan.\n\n📅 Tanggal: ${b.date}\n⏰ Waktu: ${b.startTime} - ${b.endTime} WIB\n🎟️ Kode Booking: *${b.bookingCode}*\n💰 Tarif: Rp 0 (Dispensasi Subsidi Kampus)\n📝 Catatan Admin: "${notes}"\n\nSilakan akses dan cetak E-Voucher resmi ber-QR Code untuk serah terima kunci.`;

          triggerWaNotification(b.userPhone, b.userName, b.bookingCode, waText);
          return approved;
        }
        return b;
      })
    );
    showToast('Proposal kegiatan mahasiswa berhasil disetujui & E-Voucher WA terkirim!');
  };

  // 4. Admin Rejection Action
  const handleRejectBooking = (bookingId: string, notes: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const rejected = {
            ...b,
            status: 'rejected' as const,
            adminNotes: notes
          };

          const waText = `*VenuUS ${campusName} - PEMBERITAHUAN PENOLAKAN PROPOSAL*\n\nYth. *${b.userName}* (${b.organizationName || 'Mahasiswa'}),\n\nMohon maaf, pengajuan peminjaman *${b.facilityName}* untuk tanggal ${b.date} *BELUM DAPAT DISETUJUI*.\n\nAlasan/Catatan: "${notes}"\n\nSilakan berkoordinasi dengan pengelola atau memilih jadwal alternatif di portal VenuUS.`;
          triggerWaNotification(b.userPhone, b.userName, b.bookingCode, waText);
          return rejected;
        }
        return b;
      })
    );
    showToast('Proposal telah ditolak dan notifikasi perbaikan dikirim via WA.');
  };

  // 5. Gatekeeper QR Code Check-In
  const handleCheckInByCode = (code: string) => {
    const cleanCode = code.replace(/^VEN-|^VNS-|^SIMRES-/, '').split('-').slice(0, 3).join('-');
    const match = bookings.find(
      (b) => b.bookingCode.toUpperCase() === code.toUpperCase() || b.bookingCode.toUpperCase() === cleanCode.toUpperCase()
    );

    if (!match) {
      return { success: false, message: `Kode booking "${code}" tidak ditemukan dalam sistem database VenuUS.` };
    }

    if (match.status === 'checked_in') {
      return {
        success: false,
        message: `Tiket ini SUDAH PERNAH CHECK-IN pada ${match.checkedInAt}. Tiket tidak dapat digunakan berulang kali.`,
        booking: match
      };
    }

    if (match.status !== 'paid') {
      return {
        success: false,
        message: `Status tiket adalah ${match.status.toUpperCase()}. Belum lunas atau belum disetujui. Check-in ditolak!`,
        booking: match
      };
    }

    const checkInTime = new Date().toLocaleTimeString('id-ID') + ' WIB';
    setBookings((prev) =>
      prev.map((b) => (b.id === match.id ? { ...b, status: 'checked_in' as const, checkedInAt: checkInTime } : b))
    );

    return {
      success: true,
      message: `Verifikasi valid! Pemegang tiket dipersilakan memasuki area fasilitas kampus.`,
      booking: { ...match, status: 'checked_in' as const, checkedInAt: checkInTime }
    };
  };

  const pendingApprovalsCount = bookings.filter((b) => b.status === 'pending_approval').length;

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Global Navbar */}
      <Navbar
        campusName={campusName}
        onChangeCampusName={() => setIsCampusModalOpen(true)}
        currentRole={currentRole}
        onChangeRole={(role) => {
          setCurrentRole(role);
          if (role === 'admin') setActiveView('admin');
        }}
        activeView={activeView}
        onChangeView={setActiveView}
        onOpenWaDrawer={() => setIsWaDrawerOpen(true)}
        waMessagesCount={waMessages.length}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-8">
        {/* VIEW 1: KATALOG FASILITAS & RESERVASI */}
        {activeView === 'booking' && (
          <div className="space-y-8">
            {/* Hero Executive Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-8 md:p-10 shadow-xl border border-slate-800">
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Portal Terpadu Pengelolaan & Reservasi Aset Kampus</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  Reservasi Aula Serba Guna & Lapangan Mini Soccer {campusName}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Didukung <strong>Anti Double-Booking Engine</strong> pencegah bentrok waktu nyata, integrasi pembayaran <strong>Midtrans Sandbox (QRIS & VA)</strong>, alur proposal <strong>Mahasiswa/UKM</strong>, serta penerbitan otomatis <strong>E-Voucher QR Code via WhatsApp Gateway</strong>.
                </p>

                {/* Role Status Bar Banner */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3.5 py-2 rounded-xl text-xs">
                    <span className="text-slate-400">Mode Aktif Saat Ini:</span>
                    <span className="font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                      {currentRole === 'mahasiswa' && <GraduationCap className="w-4 h-4 text-sky-400" />}
                      {currentRole === 'umum' && <Globe className="w-4 h-4 text-emerald-400" />}
                      {currentRole === 'admin' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                      {currentRole === 'mahasiswa' ? 'Mahasiswa / UKM (Upload Berkas & Tarif Gratis)' : currentRole === 'umum' ? 'Masyarakat Umum (Bayar Instan Midtrans)' : 'Admin Pengelola'}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveView('skripsi')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Buka Draf Skripsi & Koding</span>
                  </button>
                </div>
              </div>

              {/* Background ambient lighting */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-600/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Catalog of Facilities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Fasilitas Unggulan Siap Pakai
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pilih fasilitas untuk melihat fasilitas, spesifikasi teknis, serta melakukan reservasi slot.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {facilities.map((fac) => (
                  <FacilityCard
                    key={fac.id}
                    facility={fac}
                    currentRole={currentRole}
                    onBookNow={(f) => setBookingFacility(f)}
                  />
                ))}
              </div>
            </div>

            {/* Timetable Schedule Grid */}
            <ScheduleOccupancyView
              facilities={facilities}
              bookings={bookings}
              selectedDate={selectedScheduleDate}
              onSelectDate={setSelectedScheduleDate}
              onBookSlot={(facility) => setBookingFacility(facility)}
            />

            {/* Recent Bookings & E-Voucher Access Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-base text-slate-900">
                    Akses E-Voucher & Status Pemesanan Terkini
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {bookings.length} Data Tersimpan
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {bookings.slice(0, 6).map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-mono font-bold text-slate-900">
                          {b.bookingCode}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          b.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'checked_in'
                            ? 'bg-sky-100 text-sky-800'
                            : b.status === 'pending_approval'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="font-bold text-xs text-slate-800 line-clamp-1">{b.activityName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {b.facilityName.split('(')[0]}
                      </p>
                      <p className="text-[11px] font-mono text-emerald-800 mt-1">
                        📅 {b.date} • {b.startTime}-{b.endTime} WIB
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-700">
                        {b.totalPrice === 0 ? 'Rp 0 (UKM)' : `Rp ${b.totalPrice.toLocaleString('id-ID')}`}
                      </span>

                      {(b.status === 'paid' || b.status === 'checked_in') && (
                        <button
                          onClick={() => setViewingVoucherBooking(b)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>E-Voucher</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE ANTI CONFLICT SANDBOX */}
        {activeView === 'sandbox' && (
          <AntiConflictSandbox
            facilities={facilities}
            bookings={bookings}
          />
        )}

        {/* VIEW 3: ADMIN DASHBOARD */}
        {activeView === 'admin' && (
          <AdminDashboard
            bookings={bookings}
            facilities={facilities}
            onApproveBooking={handleApproveBooking}
            onRejectBooking={handleRejectBooking}
            onCheckInByCode={handleCheckInByCode}
            onViewVoucher={(b) => setViewingVoucherBooking(b)}
          />
        )}

        {/* VIEW 4: SKRIPSI HUB (BAB 1 & ANALISIS & KODING) */}
        {activeView === 'skripsi' && (
          <SkripsiHub campusName={campusName} />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Booking Modal */}
      {bookingFacility && (
        <BookingModal
          facility={bookingFacility}
          currentRole={currentRole}
          existingBookings={bookings}
          onSubmitBooking={handleBookingSubmit}
          onClose={() => setBookingFacility(null)}
        />
      )}

      {/* 2. Midtrans Sandbox Modal */}
      {pendingMidtransBooking && (
        <MidtransModal
          booking={pendingMidtransBooking}
          onSuccess={handleMidtransPaymentSuccess}
          onClose={() => setPendingMidtransBooking(null)}
        />
      )}

      {/* 3. Official E-Voucher Modal */}
      {viewingVoucherBooking && (
        <EVoucherModal
          booking={viewingVoucherBooking}
          campusName={campusName}
          onClose={() => setViewingVoucherBooking(null)}
        />
      )}

      {/* 4. WhatsApp Drawer Simulator */}
      <WaGatewayDrawer
        messages={waMessages}
        isOpen={isWaDrawerOpen}
        onClose={() => setIsWaDrawerOpen(false)}
        onOpenBookingVoucher={(code) => {
          const match = bookings.find((b) => b.bookingCode === code);
          if (match) {
            setViewingVoucherBooking(match);
            setIsWaDrawerOpen(false);
          }
        }}
      />

      {/* 5. Campus Customizer Modal */}
      {isCampusModalOpen && (
        <CampusModal
          currentCampusName={campusName}
          onSave={setCampusName}
          onClose={() => setIsCampusModalOpen(false)}
        />
      )}

      {/* Floating WA Button (Fixed Bottom-Right) */}
      <button
        onClick={() => setIsWaDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-950 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
        title="Buka WhatsApp Gateway Simulator"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-xs pl-0 group-hover:pl-2">
          Fonnte WA Bot ({waMessages.length})
        </span>
        {waMessages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-white">
            {waMessages.length}
          </span>
        )}
      </button>

      {/* Footer */}
      <footer className="mt-12 bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-sm">
              VenuUS - {campusName}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sistem Informasi Reservasi Fasilitas Kampus (Aula & Mini Soccer) • Proyek Skripsi Terpadu
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setActiveView('skripsi')} className="hover:text-emerald-400">
              Bab 1 Skripsi
            </button>
            <span>•</span>
            <button onClick={() => setActiveView('sandbox')} className="hover:text-emerald-400">
              Anti Double-Booking
            </button>
            <span>•</span>
            <button onClick={() => setActiveView('admin')} className="hover:text-emerald-400">
              Admin Gateway
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
