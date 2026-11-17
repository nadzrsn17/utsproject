import { Booking } from '../types';

/**
 * Anti Double-Booking Engine Core Logic
 * Mathematical Overlap Condition:
 * Two time intervals [S1, E1] and [S2, E2] intersect if and only if:
 * S1 < E2 AND E1 > S2
 */
export function checkSlotConflict(
  facilityId: string,
  date: string,
  startTime: string,
  endTime: string,
  existingBookings: Booking[],
  excludeBookingId?: string
): { hasConflict: boolean; conflictingBooking?: Booking; reason?: string } {
  // Only consider active bookings that reserve the slot
  const activeStatuses = ['paid', 'pending_approval', 'pending_payment', 'checked_in'];

  const candidateStartMinutes = timeToMinutes(startTime);
  const candidateEndMinutes = timeToMinutes(endTime);

  if (candidateEndMinutes <= candidateStartMinutes) {
    return {
      hasConflict: true,
      reason: 'Jam selesai harus lebih besar dari jam mulai.'
    };
  }

  for (const booking of existingBookings) {
    if (excludeBookingId && booking.id === excludeBookingId) continue;
    if (booking.facilityId !== facilityId) continue;
    if (booking.date !== date) continue;
    if (!activeStatuses.includes(booking.status)) continue;

    const existStartMinutes = timeToMinutes(booking.startTime);
    const existEndMinutes = timeToMinutes(booking.endTime);

    // Overlap condition: candidateStart < existEnd AND candidateEnd > existStart
    if (candidateStartMinutes < existEndMinutes && candidateEndMinutes > existStartMinutes) {
      return {
        hasConflict: true,
        conflictingBooking: booking,
        reason: `Bentrok dengan jadwal: ${booking.activityName} (${booking.startTime} - ${booking.endTime} WIB) oleh ${booking.userName} [Status: ${booking.status.toUpperCase()}]`
      };
    }
  }

  return { hasConflict: false };
}

export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Generate 1-hour slots from 07:00 to 22:00
export const OPERATIONAL_HOURS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00'
];

export function getFacilityOccupancyForDate(
  facilityId: string,
  date: string,
  bookings: Booking[]
): { time: string; isBooked: boolean; booking?: Booking }[] {
  const dayBookings = bookings.filter(
    (b) => b.facilityId === facilityId && b.date === date && b.status !== 'rejected' && b.status !== 'cancelled'
  );

  return OPERATIONAL_HOURS.slice(0, -1).map((slotHour, index) => {
    const nextSlotHour = OPERATIONAL_HOURS[index + 1];
    const slotStartMin = timeToMinutes(slotHour);
    const slotEndMin = timeToMinutes(nextSlotHour);

    const match = dayBookings.find((b) => {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      return slotStartMin < bEnd && slotEndMin > bStart;
    });

    return {
      time: `${slotHour} - ${nextSlotHour}`,
      isBooked: Boolean(match),
      booking: match
    };
  });
}
