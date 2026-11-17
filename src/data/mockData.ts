import { Facility, Booking, WaMessage } from '../types';

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-aula',
    name: 'Aula Serba Guna Utama (Auditorium Graha Widya)',
    category: 'aula',
    description: 'Gedung representatif serba guna berkapasitas besar dengan tata suara akustik modern, tata cahaya panggung digital, AC sentral, dan ruang transit VIP. Cocok untuk seminar nasional, wisuda, gathering, dan pementasan seni.',
    capacity: 850,
    location: 'Gedung Rektorat Lt. 2, Sayap Barat',
    hourlyRateUmum: 500000,
    hourlyRateMhs: 0, // Subsidi Kampus (Wajib Proposal UKM)
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80',
    features: [
      'Sound System Line-Array 15.000 Watt',
      'Videotron LED P2.5 Screen 8x4 Meter',
      'Central Full Air Conditioner (AC)',
      'Ruang Rias & Ruang Transit VIP Ber-AC',
      'Kursi Banquet 800 Unit & Podium Akrilik',
      'Akses Parkir VIP & Genset Backup 250 kVA'
    ],
    rules: [
      'Pengajuan internal UKM/HIMA wajib melampirkan proposal bertanda tangan Wadek III.',
      'Dilarang memasang paku/perekat permanen pada dinding peredam suara.',
      'Batas maksimal kegiatan berakhir pukul 22.00 WIB sesuai regulasi ketertiban kampus.'
    ]
  },
  {
    id: 'fac-minisoccer',
    name: 'Lapangan Mini Soccer Kampus (Arena Garudaprana)',
    category: 'olahraga',
    description: 'Lapangan sepak bola mini 7 vs 7 standar internasional dengan rumput sintetis monofilament tebal 50mm, sistem drainase anti-genangan, lampu sorot LED 1000 Lux untuk laga malam, serta kamar bilas modern.',
    capacity: 40,
    location: 'Kompleks Olahraga Kampus, Depan Stadion Atletik',
    hourlyRateUmum: 250000,
    hourlyRateMhs: 0, // Bebas biaya untuk jadwal latihan rutin UKM Bola/Futsal
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1000&q=80',
    features: [
      'Rumput Sintetis Standar FIFA (Monofilament 50mm)',
      'Lampu Sorot LED Philips Stadium Pro 1000 Lux',
      'Tribun Penonton Kanopi Kapasitas 150 Orang',
      'Kamar Ganti & Bilas Air Panas/Dingin (4 Bilik)',
      'Rompi Pertandingan (3 Warna) & Bola FIFA Quality',
      'Scoreboard Digital & Papan Pergantian Pemain'
    ],
    rules: [
      'Wajib menggunakan sepatu sol karet khusus turf (TF/AG), dilarang sepatu besi (SG).',
      'Dilarang merokok dan membawa makanan berat ke dalam area karpet hijau.',
      'Durasi sewa dihitung tepat waktu termasuk jeda pemanasan.'
    ]
  }
];

// Helper to get formatted date string for today and upcoming dates
const getFormattedDate = (daysAhead: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-001',
    bookingCode: 'VEN-202610-8812',
    facilityId: 'fac-aula',
    facilityName: 'Aula Serba Guna Utama (Auditorium Graha Widya)',
    facilityCategory: 'aula',
    role: 'mahasiswa',
    userName: 'Dimas Wahyu Pratama',
    userEmail: 'dimas.ukm.musik@student.ac.id',
    userPhone: '081234567890',
    organizationName: 'UKM Paduan Suara & Seni Musik',
    activityName: 'Konser Tahunan Symphony of Youth 2026',
    date: getFormattedDate(1),
    startTime: '13:00',
    endTime: '17:00',
    durationHours: 4,
    totalPrice: 0,
    status: 'paid', // approved by admin
    proposalFileName: 'Proposal_Konser_Symphony_Youth_2026_Approved.pdf',
    proposalUrl: '#',
    adminNotes: 'Proposal disetujui. Koordinasikan kebutuhan tata panggung dengan tim teknis gedung 1 hari sebelumnya.',
    paymentMethod: 'free_ukm',
    paidAt: '2026-10-18 10:15:00',
    createdAt: '2026-10-17 09:30:00'
  },
  {
    id: 'b-002',
    bookingCode: 'VEN-202610-9043',
    facilityId: 'fac-minisoccer',
    facilityName: 'Lapangan Mini Soccer Kampus (Arena Garudaprana)',
    facilityCategory: 'olahraga',
    role: 'umum',
    userName: 'Rendy Hartanto (FC Mandiri Mitra)',
    userEmail: 'rendy.hartanto@gmail.com',
    userPhone: '082198765432',
    activityName: 'Friendly Match Alumni & Korporasi',
    date: getFormattedDate(0), // today
    startTime: '19:00',
    endTime: '21:00',
    durationHours: 2,
    totalPrice: 500000,
    status: 'paid',
    paymentMethod: 'qris',
    midtransTransactionId: 'MID-TXN-202610-9941',
    paidAt: '2026-10-19 14:22:10',
    createdAt: '2026-10-19 14:15:00'
  },
  {
    id: 'b-003',
    bookingCode: 'VEN-202610-4421',
    facilityId: 'fac-aula',
    facilityName: 'Aula Serba Guna Utama (Auditorium Graha Widya)',
    facilityCategory: 'aula',
    role: 'mahasiswa',
    userName: 'Siti Rahmawati',
    userEmail: 'siti.rahmawati@student.ac.id',
    userPhone: '085712349988',
    organizationName: 'Himpunan Mahasiswa Informatika (HIMATIF)',
    activityName: 'Seminar Nasional AI & Cloud Computing',
    date: getFormattedDate(3),
    startTime: '08:00',
    endTime: '12:00',
    durationHours: 4,
    totalPrice: 0,
    status: 'pending_approval',
    proposalFileName: 'Proposal_Semnas_AI_2026_HIMATIF.pdf',
    proposalUrl: '#',
    createdAt: '2026-10-19 16:45:00'
  },
  {
    id: 'b-004',
    bookingCode: 'VEN-202610-3301',
    facilityId: 'fac-minisoccer',
    facilityName: 'Lapangan Mini Soccer Kampus (Arena Garudaprana)',
    facilityCategory: 'olahraga',
    role: 'umum',
    userName: 'Budi Santoso',
    userEmail: 'budi.santoso@startup.id',
    userPhone: '081399887766',
    activityName: 'Trofeo Mini Soccer Komunitas IT',
    date: getFormattedDate(2),
    startTime: '16:00',
    endTime: '18:00',
    durationHours: 2,
    totalPrice: 500000,
    status: 'checked_in',
    paymentMethod: 'bca_va',
    midtransTransactionId: 'MID-TXN-202610-1102',
    paidAt: '2026-10-17 11:00:00',
    checkedInAt: '2026-10-19 15:55:00',
    createdAt: '2026-10-17 10:45:00'
  }
];

export const INITIAL_WA_MESSAGES: WaMessage[] = [
  {
    id: 'wa-001',
    phone: '081234567890',
    recipientName: 'Dimas Wahyu Pratama',
    bookingCode: 'VEN-202610-8812',
    message: `*VenuUS UNIVERSITAS KOMPUTAMA - PEMBERITAHUAN E-VOUCHER*\n\nYth. *Dimas Wahyu Pratama* (UKM Paduan Suara & Seni Musik),\n\nProposal peminjaman fasilitas *Aula Serba Guna Utama* telah *DISETUJUI* oleh Admin Pengelola VenuUS.\n\n📅 Tanggal: ${getFormattedDate(1)}\n⏰ Waktu: 13:00 - 17:00 WIB\n🎟️ Kode Booking: *VEN-202610-8812*\n💰 Status: Terverifikasi (Bebas Biaya / Subsidi UKM)\n\nSilakan tunjukkan E-Voucher & QR Code saat serah terima kunci kepada security/pengelola. Terima kasih.`,
    timestamp: '10:15 WIB',
    status: 'read'
  },
  {
    id: 'wa-002',
    phone: '082198765432',
    recipientName: 'Rendy Hartanto',
    bookingCode: 'VEN-202610-9043',
    message: `*VenuUS UNIVERSITAS KOMPUTAMA - PEMBAYARAN BERHASIL*\n\nYth. *Rendy Hartanto*,\n\nPembayaran reservasi melalui Midtrans (QRIS) telah *TERKONFIRMASI (PAID)*.\n\n🏟️ Fasilitas: *Lapangan Mini Soccer Kampus*\n📅 Tanggal: ${getFormattedDate(0)}\n⏰ Waktu: 19:00 - 21:00 WIB (2 Jam)\n💳 Total Bayar: *Rp 500.000*\n🎟️ Kode Booking: *VEN-202610-9043*\n\nE-Voucher QR Code resmi Anda telah terbit. Tunjukkan QR Code pada layar ini kepada petugas gerbang untuk check-in. Salam olahraga!`,
    timestamp: '14:22 WIB',
    status: 'delivered'
  }
];
