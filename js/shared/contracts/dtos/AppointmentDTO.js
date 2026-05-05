/**
 * Appointment DTO (Data Transfer Object)
 * 
 * Shared contract used for inter-service communication.
 */

export class AppointmentDTO {
  constructor(data = {}) {
    this.appointmentId = data.appointmentId;
    this.userId = data.userId;
    this.petId = data.petId;
    this.doctorId = data.doctorId;
    this.date = data.date;
    this.time = data.time;
    this.serviceType = data.serviceType;
    this.status = data.status;
    this.notes = data.notes;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Get full appointment datetime
   */
  getDateTime() {
    return `${this.date} ${this.time}`;
  }

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
   * Convert to plain object
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

export default AppointmentDTO;
