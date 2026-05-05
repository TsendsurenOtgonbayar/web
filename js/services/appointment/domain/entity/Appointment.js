/**
 * Appointment Service - Domain Layer: Appointment Entity
 * 
 * Represents a veterinary appointment.
 * Stores userId and petId as string references ONLY (not nested objects).
 */

export class Appointment {
  constructor(data = {}) {
    this.appointmentId = data.appointmentId || `appt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.userId = data.userId; // String reference to user
    this.petId = data.petId; // String reference to pet
    this.doctorId = data.doctorId || null;
    this.date = data.date; // Format: YYYY-MM-DD
    this.time = data.time; // Format: HH:mm
    this.serviceType = data.serviceType || 'checkup'; // checkup, vaccination, surgery, etc.
    this.status = data.status || 'pending'; // pending, confirmed, completed, cancelled
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Get appointment status display name (Mongolian)
   */
  getStatusDisplay() {
    const statuses = {
      pending: 'Хүлээгдэж буй',
      confirmed: 'Баталгаажсан',
      completed: 'Дууссан',
      cancelled: 'Цуцлагдсан'
    };
    return statuses[this.status] || this.status;
  }

  /**
   * Get full appointment datetime
   */
  getDateTime() {
    return `${this.date} ${this.time}`;
  }

  /**
   * Check if appointment is in the past
   */
  isPast() {
    const now = new Date();
    const appointmentDateTime = new Date(`${this.date}T${this.time}`);
    return appointmentDateTime < now;
  }

  /**
   * Check if appointment can be cancelled
   */
  canBeCancelled() {
    return this.status !== 'completed' && this.status !== 'cancelled';
  }

  /**
   * Convert to plain object for storage/transmission
   */
  toJSON() {
    return {
      appointmentId: this.appointmentId,
      userId: this.userId,
      petId: this.petId,
      doctorId: this.doctorId,
      date: this.date,
      time: this.time,
      serviceType: this.serviceType,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Appointment;
