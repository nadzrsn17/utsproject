export type UserRole = 'mahasiswa' | 'umum' | 'admin';

export interface Facility {
  id: string;
  name: string;
  category: 'aula' | 'olahraga';
  description: string;
  capacity: number;
  location: string;
  hourlyRateUmum: number;
  hourlyRateMhs: number; // usually 0 or discounted
  image: string;
  features: string[];
  rules: string[];
}

export type BookingStatus = 'pending_approval' | 'pending_payment' | 'paid' | 'rejected' | 'checked_in' | 'cancelled';

export interface Booking {
  id: string;
  bookingCode: string; // e.g. "RES-202610-001"
  facilityId: string;
  facilityName: string;
  facilityCategory: 'aula' | 'olahraga';
  role: 'mahasiswa' | 'umum';
  userName: string;
  userEmail: string;
  userPhone: string;
  organizationName?: string; // for UKM / Mahasiswa
  activityName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "14:00"
  endTime: string; // "16:00"
  durationHours: number;
  totalPrice: number;
  status: BookingStatus;
  proposalFileName?: string;
  proposalUrl?: string;
  adminNotes?: string;
  paymentMethod?: 'qris' | 'bca_va' | 'mandiri_va' | 'free_ukm';
  midtransTransactionId?: string;
  paidAt?: string;
  checkedInAt?: string;
  createdAt: string;
}

export interface WaMessage {
  id: string;
  phone: string;
  recipientName: string;
  bookingCode: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}
