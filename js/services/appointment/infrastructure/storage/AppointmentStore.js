/**
 * Appointment Service - Infrastructure Layer: Appointment Storage
 * 
 * Handles persistence for appointments.
 * Independent storage: localStorage['appointment_service_appointments']
 */

import Appointment from '../../domain/entity/Appointment.js';

const APPOINTMENTS_STORAGE_KEY = 'appointment_service_appointments';

export class AppointmentStore {
  /**
   * Get all appointments from storage
   * @returns {Appointment[]}
   */
  static getAllAppointments() {
    try {
      const data = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (!data) return [];

      const appointmentObjects = JSON.parse(data);
      return Array.isArray(appointmentObjects) ? appointmentObjects : [];
    } catch (error) {
      console.error('Error loading appointments from storage:', error);
      return [];
    }
  }

  /**
   * Save all appointments to storage
   * @param {Array} appointments
   * @returns {boolean}
   */
  static saveAppointments(appointments) {
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
      return true;
    } catch (error) {
      console.error('Error saving appointments to storage:', error);
      return false;
    }
  }

  /**
   * Add a new appointment to storage
   * @param {Appointment} appointment
   * @returns {boolean}
   */
  static addAppointment(appointment) {
    try {
      const appointments = this.getAllAppointments();
      appointments.push(appointment.toJSON());
      return this.saveAppointments(appointments);
    } catch (error) {
      console.error('Error adding appointment:', error);
      return false;
    }
  }

  /**
   * Find appointment by ID
   * @param {string} appointmentId
   * @returns {Object|null}
   */
  static findById(appointmentId) {
    try {
      const appointments = this.getAllAppointments();
      return appointments.find(appt => appt.appointmentId === appointmentId) || null;
    } catch (error) {
      console.error('Error finding appointment:', error);
      return null;
    }
  }

  /**
   * Find all appointments for a user
   * @param {string} userId
   * @returns {Object[]}
   */
  static findByUserId(userId) {
    try {
      const appointments = this.getAllAppointments();
      return appointments.filter(appt => appt.userId === userId);
    } catch (error) {
      console.error('Error finding appointments for user:', error);
      return [];
    }
  }

  /**
   * Find all appointments for a pet
   * @param {string} petId
   * @returns {Object[]}
   */
  static findByPetId(petId) {
    try {
      const appointments = this.getAllAppointments();
      return appointments.filter(appt => appt.petId === petId);
    } catch (error) {
      console.error('Error finding appointments for pet:', error);
      return [];
    }
  }

  /**
   * Update an appointment
   * @param {string} appointmentId
   * @param {Object} updates
   * @returns {boolean}
   */
  static updateAppointment(appointmentId, updates) {
    try {
      const appointments = this.getAllAppointments();
      const index = appointments.findIndex(appt => appt.appointmentId === appointmentId);

      if (index === -1) {
        console.warn(`Appointment ${appointmentId} not found`);
        return false;
      }

      appointments[index] = {
        ...appointments[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return this.saveAppointments(appointments);
    } catch (error) {
      console.error('Error updating appointment:', error);
      return false;
    }
  }

  /**
   * Delete an appointment
   * @param {string} appointmentId
   * @returns {boolean}
   */
  static deleteAppointment(appointmentId) {
    try {
      const appointments = this.getAllAppointments();
      const filteredAppointments = appointments.filter(
        appt => appt.appointmentId !== appointmentId
      );

      if (filteredAppointments.length === appointments.length) {
        console.warn(`Appointment ${appointmentId} not found`);
        return false;
      }

      return this.saveAppointments(filteredAppointments);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return false;
    }
  }

  /**
   * Cancel an appointment (soft delete)
   * @param {string} appointmentId
   * @returns {boolean}
   */
  static cancelAppointment(appointmentId) {
    return this.updateAppointment(appointmentId, {
      status: 'cancelled'
    });
  }

  /**
   * Clear all appointments (useful for testing)
   * @returns {boolean}
   */
  static clearAll() {
    try {
      localStorage.removeItem(APPOINTMENTS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing appointments:', error);
      return false;
    }
  }

  /**
   * Get appointment count for a user
   * @param {string} userId
   * @returns {number}
   */
  static getAppointmentCountForUser(userId) {
    try {
      const appointments = this.getAllAppointments();
      return appointments.filter(appt => appt.userId === userId).length;
    } catch (error) {
      console.error('Error counting appointments:', error);
      return 0;
    }
  }

  /**
   * Check if user owns an appointment
   * @param {string} userId
   * @param {string} appointmentId
   * @returns {boolean}
   */
  static userOwnsAppointment(userId, appointmentId) {
    try {
      const appointment = this.findById(appointmentId);
      return appointment ? appointment.userId === userId : false;
    } catch (error) {
      console.error('Error checking appointment ownership:', error);
      return false;
    }
  }

  /**
   * Find appointments for date (for availability checking)
   * @param {string} date
   * @returns {Object[]}
   */
  static findByDate(date) {
    try {
      const appointments = this.getAllAppointments();
      return appointments.filter(appt => appt.date === date);
    } catch (error) {
      console.error('Error finding appointments by date:', error);
      return [];
    }
  }
}

export default AppointmentStore;
