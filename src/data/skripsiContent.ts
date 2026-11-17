export const SKRIPSI_DATA = {
  bagian1: {
    title: "BAGIAN 1: RANCANGAN TEKNIS & ARSITEKTUR KODING (SISTEM)",
    erd: {
      summary: "Rancangan basis data relasional ternormalisasi (3NF) dirancang untuk menjamin integritas data, mendukung transaksi pemesanan bersamaan (concurrency), dan mempercepat kueri anti double-booking dengan indexing komposit.",
      tables: [
        {
          name: "users",
          description: "Menyimpan data identitas pengguna sistem dari berbagai role (Mahasiswa/UKM, Umum, Admin).",
          columns: [
            { field: "id", type: "BIGINT UNSIGNED (PK)", isNullable: false, desc: "Auto increment identifier" },
            { field: "name", type: "VARCHAR(255)", isNullable: false, desc: "Nama lengkap pengguna / PIC" },
            { field: "email", type: "VARCHAR(255) (UNIQUE)", isNullable: false, desc: "Email aktif untuk login & notifikasi" },
            { field: "password", type: "VARCHAR(255)", isNullable: false, desc: "Hashed password bcrypt" },
            { field: "phone_number", type: "VARCHAR(20)", isNullable: false, desc: "Nomor WhatsApp (format: 08xxx / 628xxx)" },
            { field: "role", type: "ENUM('admin', 'mahasiswa', 'umum')", isNullable: false, desc: "Hak akses pengguna" },
            { field: "nim_or_identity", type: "VARCHAR(50)", isNullable: true, desc: "NIM (Mahasiswa) atau NIK/KTP (Umum)" },
            { field: "organization_name", type: "VARCHAR(150)", isNullable: true, desc: "Nama UKM/HIMA/Instansi luar" },
            { field: "created_at / updated_at", type: "TIMESTAMP", isNullable: true, desc: "Audit trail timestamp" }
          ]
        },
        {
          name: "facilities",
          description: "Katalog aset fisik kampus yang dapat disewa (Aula Serba Guna & Lapangan Mini Soccer).",
          columns: [
            { field: "id", type: "BIGINT UNSIGNED (PK)", isNullable: false, desc: "Primary key fasilitas" },
            { field: "name", type: "VARCHAR(150)", isNullable: false, desc: "Nama gedung / lapangan" },
            { field: "slug", type: "VARCHAR(150) (UNIQUE)", isNullable: false, desc: "URL friendly identifier" },
            { field: "category", type: "ENUM('aula', 'olahraga')", isNullable: false, desc: "Kategori fasilitas" },
            { field: "capacity", type: "INT UNSIGNED", isNullable: false, desc: "Kapasitas daya tampung orang" },
            { field: "location", type: "VARCHAR(255)", isNullable: false, desc: "Lokasi fisik gedung/lapangan" },
            { field: "hourly_rate_umum", type: "DECIMAL(12,2)", isNullable: false, desc: "Tarif per jam untuk umum" },
            { field: "hourly_rate_mhs", type: "DECIMAL(12,2)", isNullable: false, desc: "Tarif mahasiswa (Rp 0 jika subsidi)" },
            { field: "is_active", type: "BOOLEAN", isNullable: false, desc: "Status aktif peminjaman (1/0)" },
            { field: "image_url", type: "VARCHAR(255)", isNullable: true, desc: "Foto representasi fasilitas" },
            { field: "created_at / updated_at", type: "TIMESTAMP", isNullable: true, desc: "Timestamp" }
          ]
        },
        {
          name: "schedules",
          description: "Jadwal slot jam operasional default dan hari libur/maintenance fasilitas.",
          columns: [
            { field: "id", type: "BIGINT UNSIGNED (PK)", isNullable: false, desc: "Primary key schedule" },
            { field: "facility_id", type: "BIGINT UNSIGNED (FK -> facilities.id)", isNullable: false, desc: "Relasi fasilitas" },
            { field: "day_of_week", type: "TINYINT", isNullable: false, desc: "Hari (0 = Minggu, 1 = Senin, dst)" },
            { field: "open_time", type: "TIME", isNullable: false, desc: "Jam buka (misal: 07:00:00)" },
            { field: "close_time", type: "TIME", isNullable: false, desc: "Jam tutup (misal: 22:00:00)" },
            { field: "is_holiday", type: "BOOLEAN", isNullable: false, desc: "Flag hari libur/maintenance" }
          ]
        },
        {
          name: "bookings",
          description: "Tabel inti transaksi reservasi yang menyimpan tanggal, jam, status approval, dan kode booking.",
          columns: [
            { field: "id", type: "BIGINT UNSIGNED (PK)", isNullable: false, desc: "Primary key pemesanan" },
            { field: "booking_code", type: "VARCHAR(30) (UNIQUE)", isNullable: false, desc: "Format: RES-YYYYMM-XXXX" },
            { field: "user_id", type: "BIGINT UNSIGNED (FK -> users.id)", isNullable: false, desc: "Pengguna pemesan" },
            { field: "facility_id", type: "BIGINT UNSIGNED (FK -> facilities.id)", isNullable: false, desc: "Fasilitas yang dipinjam" },
            { field: "booking_date", type: "DATE", isNullable: false, desc: "Tanggal pelaksanaan kegiatan" },
            { field: "start_time", type: "TIME", isNullable: false, desc: "Jam mulai reservasi" },
            { field: "end_time", type: "TIME", isNullable: false, desc: "Jam selesai reservasi" },
            { field: "duration_hours", type: "DECIMAL(4,2)", isNullable: false, desc: "Total durasi jam sewa" },
            { field: "activity_name", type: "VARCHAR(255)", isNullable: false, desc: "Nama kegiatan / acara" },
            { field: "status", type: "ENUM('pending_approval', 'pending_payment', 'paid', 'rejected', 'checked_in', 'cancelled')", isNullable: false, desc: "Status state machine" },
            { field: "proposal_file", type: "VARCHAR(255)", isNullable: true, desc: "Path PDF proposal mahasiswa" },
            { field: "total_amount", type: "DECIMAL(12,2)", isNullable: false, desc: "Total tagihan (Rp)" },
            { field: "admin_notes", type: "TEXT", isNullable: true, desc: "Catatan penolakan/persetujuan" },
            { field: "qr_token", type: "VARCHAR(100) (UNIQUE)", isNullable: false, desc: "Token verifikasi QR check-in" },
            { field: "checked_in_at", type: "TIMESTAMP", isNullable: true, desc: "Waktu scan QR oleh petugas" },
            { field: "created_at / updated_at", type: "TIMESTAMP", isNullable: true, desc: "Audit timestamp" }
          ]
        },
        {
          name: "payments",
          description: "Menyimpan riwayat transaksi gateway Midtrans, payment method, settlement time, dan callback response.",
          columns: [
            { field: "id", type: "BIGINT UNSIGNED (PK)", isNullable: false, desc: "Primary key pembayaran" },
            { field: "booking_id", type: "BIGINT UNSIGNED (FK -> bookings.id)", isNullable: false, desc: "Relasi ke pemesanan" },
            { field: "order_id", type: "VARCHAR(50) (UNIQUE)", isNullable: false, desc: "Midtrans Order ID" },
            { field: "transaction_id", type: "VARCHAR(100)", isNullable: true, desc: "Midtrans Transaction UUID" },
            { field: "payment_type", type: "VARCHAR(50)", isNullable: true, desc: "qris, bca_va, mandiri_bill, dll" },
            { field: "gross_amount", type: "DECIMAL(12,2)", isNullable: false, desc: "Jumlah bayar sesuai invoice" },
            { field: "transaction_status", type: "VARCHAR(50)", isNullable: false, desc: "pending, settlement, expire, cancel" },
            { field: "fraud_status", type: "VARCHAR(50)", isNullable: true, desc: "accept, challenge, deny" },
            { field: "snap_token", type: "VARCHAR(100)", isNullable: true, desc: "Token Midtrans Snap Popup" },
            { field: "paid_at", type: "TIMESTAMP", isNullable: true, desc: "Waktu uang sukses diterima" },
            { field: "raw_response", type: "JSON", isNullable: true, desc: "Payload webhook lengkap" },
            { field: "created_at / updated_at", type: "TIMESTAMP", isNullable: true, desc: "Timestamp" }
          ]
        }
      ],
      sqlScript: `-- =================================================================
-- DDL DATABASE: VenuUS (Sistem Informasi Reservasi Fasilitas UNIVERSITAS KOMPUTAMA)
-- MySQL / MariaDB Script Siap Pakai
-- =================================================================

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role ENUM('admin', 'mahasiswa', 'umum') NOT NULL DEFAULT 'umum',
    nim_or_identity VARCHAR(50) NULL,
    organization_name VARCHAR(150) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE facilities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category ENUM('aula', 'olahraga') NOT NULL,
    capacity INT UNSIGNED NOT NULL,
    location VARCHAR(255) NOT NULL,
    hourly_rate_umum DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    hourly_rate_mhs DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    image_url VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(30) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    facility_id BIGINT UNSIGNED NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(4,2) NOT NULL,
    activity_name VARCHAR(255) NOT NULL,
    status ENUM('pending_approval', 'pending_payment', 'paid', 'rejected', 'checked_in', 'cancelled') NOT NULL DEFAULT 'pending_approval',
    proposal_file VARCHAR(255) NULL,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    admin_notes TEXT NULL,
    qr_token VARCHAR(100) NOT NULL UNIQUE,
    checked_in_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_facility FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    -- COMPOSITE INDEX UNTUK PERFORMA ANTI DOUBLE-BOOKING QUERY MAKSIMAL
    INDEX idx_anti_conflict (facility_id, booking_date, status, start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    transaction_id VARCHAR(100) NULL,
    payment_type VARCHAR(50) NULL,
    gross_amount DECIMAL(12,2) NOT NULL,
    transaction_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    fraud_status VARCHAR(50) NULL,
    snap_token VARCHAR(100) NULL,
    paid_at TIMESTAMP NULL,
    raw_response JSON NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_payments_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    },
    antiDoubleBooking: {
      formula: "candidate_start < existing_end AND candidate_end > existing_start",
      explanation: "Dua rentang waktu [S1, E1] dan [S2, E2] saling beririsan (overlap) jika dan hanya jika S1 < E2 dan E1 > S2. Aturan ini secara matematis meng-cover 4 skenario bentrok: (1) parsial awal, (2) parsial akhir, (3) menyeluruh di dalam, dan (4) menyeluruh di luar (enclosing). Slot yang berdampingan pas (misal: 14:00-16:00 dengan 16:00-18:00) DILEGALKAN karena 16:00 tidak lebih kecil dari 16:00.",
      pseudoCode: `ALGORITMA VALIDASI_BENTROK_JADWAL(facility_id, tanggal, jam_mulai, jam_selesai, booking_id_exclude = null)
BEGIN
    // 1. Validasi batas operasional dan logika jam
    IF jam_selesai <= jam_mulai THEN
        RETURN ERROR "Jam selesai harus melebihi jam mulai";
    END IF;

    // 2. Kueri tabel bookings mencari irisan interval
    active_conflict_count = COUNT(bookings) WHERE
        facility_id = facility_id
        AND booking_date = tanggal
        AND status IN ('pending_approval', 'pending_payment', 'paid', 'checked_in')
        AND (id != booking_id_exclude OR booking_id_exclude IS NULL)
        AND (
            start_time < jam_selesai 
            AND 
            end_time > jam_mulai
        );

    // 3. Evaluasi hasil
    IF active_conflict_count > 0 THEN
        RETURN CONFLICT_DETECTED (Jadwal tidak tersedia / bentrok);
    ELSE
        RETURN SAFE_TO_BOOK (Jadwal aman untuk dipesan);
    END IF;
END`,
      laravelEloquentCode: `<?php

namespace App\\Rules;

use App\\Models\\Booking;
use Illuminate\\Contracts\\Validation\\Rule;

class AntiDoubleBookingRule implements Rule
{
    protected $facilityId;
    protected $bookingDate;
    protected $startTime;
    protected $excludeBookingId;

    public function __construct($facilityId, $bookingDate, $startTime, $excludeBookingId = null)
    {
        $this->facilityId = $facilityId;
        $this->bookingDate = $bookingDate;
        $this->startTime = $startTime;
        $this->excludeBookingId = $excludeBookingId;
    }

    public function passes($attribute, $endTime)
    {
        if (strtotime($endTime) <= strtotime($this->startTime)) {
            return false;
        }

        // Eloquent Anti Double-Booking Query
        $hasConflict = Booking::query()
            ->where('facility_id', $this->facilityId)
            ->where('booking_date', $this->bookingDate)
            ->whereIn('status', ['paid', 'pending_approval', 'pending_payment', 'checked_in'])
            ->when($this->excludeBookingId, function ($query) {
                $query->where('id', '!=', $this->excludeBookingId);
            })
            // KONDISI MATEMATIS OVERLAP INTERVAL:
            // start_time < candidate_end AND end_time > candidate_start
            ->where(function ($query) use ($endTime) {
                $query->where('start_time', '<', $endTime)
                      ->where('end_time', '>', $this->startTime);
            })
            ->exists();

        return !$hasConflict;
    }

    public function message()
    {
        return 'Jadwal fasilitas yang Anda pilih telah terisi oleh pemesanan lain (Bentrok). Silakan pilih slot jam lain.';
    }
}`
    },
    integrations: {
      workflowTitle: "Alur Otomatisasi Webhook Midtrans -> Update DB -> Kirim WA Gateway Fonnte -> E-Voucher PDF",
      steps: [
        {
          num: 1,
          title: "User Umum Checkout & Snap Token",
          desc: "Front-end memanggil endpoint `/api/booking/checkout`, server memvalidasi anti double-booking, mengunci slot dengan status `pending_payment`, dan membuat transaksi ke Midtrans Snap API untuk memperoleh Snap Token."
        },
        {
          num: 2,
          title: "User Melakukan Pembayaran (QRIS / Virtual Account)",
          desc: "User menyelesaikan pembayaran di sandbox Midtrans (misal: scan QRIS via GoPay Simulator atau transfer BCA Virtual Account)."
        },
        {
          num: 3,
          title: "Midtrans Menembak Webhook HTTP POST ke Kampus",
          desc: "Midtrans mengirim HTTP POST JSON notification ke `https://kampus.ac.id/api/midtrans/callback` berisi `order_id`, `status_code`, `gross_amount`, `transaction_status`, dan `signature_key`."
        },
        {
          num: 4,
          title: "Verifikasi Hash Signature SHA512",
          desc: "Server Laravel memvalidasi keaslian webhook dengan mencocokkan SHA512 hash: `hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey)` untuk mencegah manipulasi data dari pihak ketiga."
        },
        {
          num: 5,
          title: "Database State Update & Otomatisasi Fonnte WA",
          desc: "Jika `transaction_status == 'settlement'`, status booking diubah menjadi `'paid'`. Event `BookingPaidEvent` langsung memicu `FonnteNotificationService` untuk mengirim template pesan WhatsApp beserta link & E-Voucher QR Code."
        }
      ],
      controllerCode: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Booking;
use App\\Models\\Payment;
use App\\Services\\FonnteService;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Facades\\Log;

class MidtransCallbackController extends Controller
{
    public function handle(Request $request, FonnteService $waService)
    {
        $payload = $request->all();
        $serverKey = config('services.midtrans.server_key');

        // 1. Verifikasi Keaslian Signature Key SHA512
        $signaturePayload = $payload['order_id'] . $payload['status_code'] . $payload['gross_amount'] . $serverKey;
        $localSignature = hash('sha512', $signaturePayload);

        if ($localSignature !== $payload['signature_key']) {
            Log::warning('Midtrans Webhook: Invalid Signature', ['order_id' => $payload['order_id']]);
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // 2. Transaksi Database Atomic
        return DB::transaction(function () use ($payload, $waService) {
            $payment = Payment::where('order_id', $payload['order_id'])->firstOrFail();
            $booking = $payment->booking;

            $transactionStatus = $payload['transaction_status'];
            $fraudStatus = $payload['fraud_status'] ?? null;

            if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
                if ($fraudStatus == 'challenge') {
                    $payment->update(['transaction_status' => 'challenge']);
                } else {
                    $payment->update([
                        'transaction_status' => 'settlement',
                        'paid_at' => now(),
                        'transaction_id' => $payload['transaction_id'] ?? null,
                        'raw_response' => $payload
                    ]);

                    $booking->update(['status' => 'paid']);

                    // 3. Otomatis Trigger WhatsApp Gateway via Fonnte
                    $waService->sendBookingVoucherNotification($booking);
                }
            } elseif ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
                $payment->update(['transaction_status' => $transactionStatus]);
                $booking->update(['status' => 'cancelled']);
            }

            return response()->json(['status' => 'success', 'message' => 'Notification handled']);
        });
    }
}`,
      fonnteServiceCode: `<?php

namespace App\\Services;

use App\\Models\\Booking;
use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Facades\\Log;

class FonnteService
{
    protected string $apiKey;
    protected string $apiUrl = 'https://api.fonnte.com/send';

    public function __construct()
    {
        $this->apiKey = config('services.fonnte.token');
    }

    public function sendBookingVoucherNotification(Booking $booking): bool
    {
        $phone = $booking->user->phone_number;
        $voucherUrl = url("/e-voucher/{$booking->qr_token}");

        $pesan = "*VenuUS UNIVERSITAS KOMPUTAMA - E-VOUCHER RESMI*\\n\\n";
        $pesan .= "Halo *{$booking->user->name}*, pembayaran Anda telah *BERHASIL (PAID)*.\\n\\n";
        $pesan .= "🏛️ Fasilitas: *{$booking->facility->name}*\\n";
        $pesan .= "📅 Tanggal: " . date('d F Y', strtotime($booking->booking_date)) . "\\n";
        $pesan .= "⏰ Waktu: {$booking->start_time} - {$booking->end_time} WIB\\n";
        $pesan .= "🎟️ Kode Booking: *{$booking->booking_code}*\\n";
        $pesan .= "💰 Total Bayar: Rp " . number_format($booking->total_amount, 0, ',', '.') . "\\n\\n";
        $pesan .= "📲 Akses E-Voucher & QR Code Check-in:\\n{$voucherUrl}\\n\\n";
        $pesan .= "Tunjukkan QR Code ini kepada petugas gerbang sebelum memasuki fasilitas. Terima kasih!";

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
            ])->asForm()->post($this->apiUrl, [
                'target' => $phone,
                'message' => $pesan,
                'countryCode' => '62',
            ]);

            Log::info('Fonnte WA Sent', ['booking_code' => $booking->booking_code, 'response' => $response->json()]);
            return $response->successful();
        } catch (\\Exception $e) {
            Log::error('Fonnte WA Failed: ' . $e->getMessage());
            return false;
        }
    }
}`
    }
  },
  bagian2: {
    title: "BAGIAN 2: DOKUMEN SKRIPSI (BAB 1 & ANALISIS)",
    bab1: {
      latarBelakang: [
        "Perkembangan teknologi informasi dalam tata kelola fasilitas perguruan tinggi di era Industri 4.0 dan Society 5.0 menuntut efisiensi, transparansi, serta akuntabilitas aset kampus. Fasilitas publik seperti Aula/Gedung Serba Guna dan Lapangan Olahraga Mini Soccer merupakan sarana vital penunjang Tri Dharma Perguruan Tinggi, pengembangan bakat mahasiswa (UKM), serta sarana optimalisasi Pendapatan Negara Bukan Pajak (PNBP) atau unit usaha kampus melalui penyewaan kepada masyarakat umum. Namun, pengelolaan fasilitas yang baik tidak hanya diukur dari kuantitas sarana, melainkan dari kehandalan sistem reservasi yang mampu mengintegrasikan seluruh segmen pemangku kepentingan secara tertib.",
        "Fakta di lapangan pada [Nama Kampusmu] menunjukkan bahwa proses reservasi fasilitas masih didominasi oleh prosedur konvensional (manual). Mahasiswa atau pengurus Unit Kegiatan Mahasiswa (UKM) harus menyerahkan proposal cetak secara tatap muka, meminta tanda tangan disposisi pejabat secara berantai, serta mencocokkan jadwal pada buku agenda fisik staf pengelola. Sementara itu, pihak luar/umum yang ingin menyewa lapangan olahraga kerap mengalami kendala ketiadaan informasi ketersediaan slot jam secara waktu nyata (real-time), ketidakjelasan konfirmasi pembayaran, serta risiko friksi tumpang tindih jadwal (double-booking). Kejadian bentrok jadwal tersebut memicu kerugian waktu, reputasi instansi kampus, hingga potensi kebocoran penerimaan dana sewa.",
        "Sebagai langkah solutif dan sistematis, penelitian ini merancang dan membangun 'Sistem Informasi Reservasi Fasilitas Kampus Berbasis Web' menggunakan arsitektur modern Framework Laravel dan basis data MySQL. Sistem ini dirancang dengan mesin pencegah bentrok (Anti Double-Booking Engine) yang memvalidasi irisan slot waktu (temporal overlap) secara otomatis pada tingkat basis data dan logika aplikasi. Untuk segmentasi mahasiswa, sistem menyediakan alur pengunggahan proposal digital nir-kertas (paperless) dengan alur persetujuan admin berjenjang. Sedangkan untuk pengguna umum, sistem menghadirkan checkout reservasi instan yang terintegrasi langsung dengan Payment Gateway Midtrans (QRIS dan Virtual Account otomatis) tanpa verifikasi manual mutasi bank.",
        "Kebaruan (novelty) dan nilai tambah dari penelitian ini terletak pada integrasi hulu-ke-hilir: sinkronisasi pembayaran otomatis Midtrans webhook yang secara simultan menerbitkan E-Voucher digital berstandar QR Code terenkripsi (via DomPDF), serta seketika memicu notifikasi tiket ke nomor ponsel pemohon melalui WhatsApp Gateway (Fonnte API). Selain itu, sistem menyertakan modul pemindai (scanner) QR Code di gerbang masuk bagi staf pengelola untuk validasi check-in instan. Dengan demikian, sistem ini tidak hanya mengatasi problem administratif dan tumpang tindih jadwal, melainkan juga mentransformasi tata kelola fasilitas kampus menjadi modern, transparan, dan terukur."
      ],
      rumusanMasalah: [
        "1. Bagaimana merancang dan mengimplementasikan algoritma Anti Double-Booking Engine berbasis interval overlap untuk mencegah terjadinya tumpang tindih jadwal peminjaman fasilitas kampus secara otomatis dan presisi?",
        "2. Bagaimana membangun arsitektur sistem multi-role yang membedakan alur persetujuan berkas proposal kegiatan mahasiswa (UKM) dengan alur transaksi berbayar instan untuk masyarakat umum?",
        "3. Bagaimana mengintegrasikan Payment Gateway Midtrans Sandbox dan WhatsApp Gateway (Fonnte API) secara otomatis (event-driven webhook) dalam memvalidasi pelunasan sewa dan penerbitan E-Voucher QR Code?"
      ],
      batasanMasalah: [
        "1. Objek fasilitas yang dikelola dalam penelitian ini dibatasi pada Gedung/Aula Serba Guna dan Lapangan Mini Soccer pada [Nama Kampusmu].",
        "2. Gateway pembayaran menggunakan fasilitas Midtrans Sandbox API dengan kanal pembayaran QRIS dan Virtual Account (BCA, Mandiri, BNI).",
        "3. Integrasi pengiriman pesan instan E-Voucher memanfaatkan layanan Fonnte API pihak ketiga dengan nomor pengirim resmi institusi.",
        "4. Validasi keabsahan proposal mahasiswa didasarkan pada tinjauan digital berkas format PDF yang diunggah oleh pimpinan organisasi/UKM terdaftar.",
        "5. Validasi kehadiran (check-in) menggunakan pemindaian QR Code E-Voucher melalui kamera smartphone atau webcam petugas pengelola gedung."
      ]
    },
    kebutuhanFungsional: {
      mahasiswa: [
        { code: "FR-MHS-01", name: "Katalog & Jadwal", desc: "Mahasiswa dapat melihat kalender ketersediaan slot jam Aula dan Mini Soccer secara transparan dan real-time." },
        { code: "FR-MHS-02", name: "Pengajuan Berkas Digital", desc: "Mahasiswa/UKM dapat mengunggah berkas proposal kegiatan (PDF) dengan tarif khusus / gratis (subsidi kampus)." },
        { code: "FR-MHS-03", name: "Pelacakan Status Approval", desc: "Mahasiswa dapat memantau linimasa status pengajuan (Menunggu Persetujuan, Disetujui, atau Ditolak disertai catatan perbaikan dari Admin)." },
        { code: "FR-MHS-04", name: "Unduh E-Voucher QR Code", desc: "Mahasiswa dapat mengunduh tiket/surat izin resmi ber-QR Code setelah proposal disetujui untuk serah terima kunci fasilitas." }
      ],
      umum: [
        { code: "FR-UMM-01", name: "Pemilihan Slot Real-Time", desc: "Pengguna umum dapat memilih tanggal, durasi, dan slot jam main yang masih kosong tanpa risiko bentrok." },
        { code: "FR-UMM-02", name: "Kalkulasi Tagihan Otomatis", desc: "Sistem mengalkulasi total biaya sewa secara otomatis berdasarkan tarif per jam fasilitas yang dipilih." },
        { code: "FR-UMM-03", name: "Pembayaran Instan Gateway", desc: "Pengguna dapat membayar tagihan langsung via Midtrans Snap (QRIS, BCA VA, Mandiri Bill) dengan konfirmasi otomatis." },
        { code: "FR-UMM-04", name: "Penerimaan E-Voucher & WA", desc: "Sistem otomatis mengirim tautan E-Voucher QR Code dan ringkasan pemesanan langsung ke nomor WhatsApp pengguna." }
      ],
      admin: [
        { code: "FR-ADM-01", name: "Approval Center Mahasiswa", desc: "Admin pengelola dapat meninjau berkas proposal UKM, membaca detail kegiatan, serta memutuskan Terima / Tolak dengan catatan resmi." },
        { code: "FR-ADM-02", name: "Pemindai QR Code Check-In", desc: "Admin/Petugas gerbang dapat memindai QR Code E-Voucher penyewa untuk validasi izin masuk dan mencatat jam kehadiran (check-in timestamp)." },
        { code: "FR-ADM-03", name: "Manajemen Fasilitas & Jadwal", desc: "Admin dapat menambah fasilitas baru, mengatur tarif sewa per jam, mengubah kapasitas, atau menutup slot tertentu untuk perawatan/maintenance." },
        { code: "FR-ADM-04", name: "Dashboard Rekapitulasi & Keuangan", desc: "Admin dapat melihat analitik tingkat okupansi gedung, total PNBP/pendapatan sewa, riwayat transaksi pembayaran, dan mengekspor laporan pemesanan." }
      ]
    }
  }
};
