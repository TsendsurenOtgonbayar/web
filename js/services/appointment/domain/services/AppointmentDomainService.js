/**
 * Appointment Service - Domain Layer: Appointment Service
 * 
 * Pure business logic for appointment management.
 * Does NOT access infrastructure or other services.
 */

export class AppointmentDomainService {
  /**
   * Validate appointment booking data
   * @param {Object} appointmentData
   * @returns {Object} - { valid: boolean, errors: Array<string> }
   */
  static validateAppointmentData(appointmentData) {
    const errors = [];

    if (!appointmentData.petId || appointmentData.petId.trim() === '') {
      errors.push('Амьтны ID оруулна уу');
    }

    if (!appointmentData.date || appointmentData.date.trim() === '') {
      errors.push('Үзүүлэлтийн өдөр сонгоно уу');
    } else {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(appointmentData.date)) {
        errors.push('Өдрийн формат: YYYY-MM-DD');
      }

      // Check if date is in the future
      const appointmentDate = new Date(appointmentData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (appointmentDate < today) {
        errors.push('Өнгөрсөн өдөр сонгох боломжгүй');
      }
    }

    if (!appointmentData.time || appointmentData.time.trim() === '') {
      errors.push('Цаг сонгоно уу');
    } else {
      // Validate time format (HH:mm)
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(appointmentData.time)) {
        errors.push('Цагийн формат: HH:mm');
      }

      // Check if time is during business hours (9:00-17:00)
      const [hours] = appointmentData.time.split(':').map(Number);
      if (hours < 9 || hours >= 17) {
        errors.push('Үзүүлэлтийг 09:00-17:00 цагт авах боломжтой');
      }
    }

    if (!appointmentData.serviceType || appointmentData.serviceType.trim() === '') {
      errors.push('Үйлчилгээний төрөл сонгоно уу');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Check if appointment slot is available
   * @param {string} date
   * @param {string} time
   * @param {Array} existingAppointments - Appointments already booked
   * @returns {boolean}
   */
  static isSlotAvailable(date, time, existingAppointments = []) {
    // Check if any appointment exists at same time
    // In real system: would check doctor availability, slot limits, etc.
    const conflictingAppointments = existingAppointments.filter(
      appt => appt.date === date && appt.time === time && appt.status !== 'cancelled'
    );

    return conflictingAppointments.length === 0;
  }

  /**
   * Get service offerings/types
   * @returns {Array} - Available service types
   */
  static getServiceOfferings() {
    return [
      { id: 'checkup', name: 'Ерөнхий үзүүлэлт', duration: 30 },
      { id: 'vaccination', name: 'Сувилга', duration: 20 },
      { id: 'surgery', name: 'Мэс засал', duration: 90 },
      { id: 'dental', name: 'Шүдний эмчилгээ', duration: 45 },
      { id: 'emergency', name: 'Яаралтай тусламж', duration: 20 }
    ];
  }

  /**
   * Get available time slots for a date
   * @param {string} date
   * @param {Array} existingAppointments - Appointments already booked
   * @returns {Array} - Available times [HH:mm]
   */
  static getAvailableSlots(date, existingAppointments = []) {
    const slots = [];
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Don't show slots for past dates
    if (appointmentDate < today) {
      return slots;
    }

    // Generate slots from 09:00 to 17:00 in 30-minute intervals
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const isAvailable = this.isSlotAvailable(date, time, existingAppointments);

        if (isAvailable) {
          slots.push(time);
        }
      }
    }

    return slots;
  }

  /**
   * Calculate appointment duration
   * @param {string} serviceType
   * @returns {number} - Duration in minutes
   */
  static calculateDuration(serviceType) {
    const offerings = this.getServiceOfferings();
    const offering = offerings.find(o => o.id === serviceType);
    return offering ? offering.duration : 30;
  }

  /**
   * Format appointment info for display
   * @param {Appointment} appointment
   * @returns {Object} - Formatted display info
   */
  static formatAppointmentInfo(appointment) {
    return {
      appointmentId: appointment.appointmentId,
      userId: appointment.userId,
      petId: appointment.petId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      time: appointment.time,
      dateTime: appointment.getDateTime(),
      serviceType: appointment.serviceType,
      status: appointment.status,
      statusDisplay: appointment.getStatusDisplay(),
      notes: appointment.notes,
      isPast: appointment.isPast(),
      canBeCancelled: appointment.canBeCancelled(),
      createdAt: appointment.createdAt
    };
  }
}

export default AppointmentDomainService;
