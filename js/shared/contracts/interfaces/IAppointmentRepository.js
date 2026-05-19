/**
 * Shared Contract Interface: IAppointmentRepository
 * 
 * Services use this interface to query appointment information from Appointment Service.
 * Feedback Service uses this to link reviews to appointments.
 * Patient Service uses this to show appointment history.
 */

export class IAppointmentRepository {
  /**
   * Get appointment by ID
   * @param {string} appointmentId
   * @returns {Promise<AppointmentDTO>}
   */
  async getAppointmentById(appointmentId) {
    throw new Error('getAppointmentById must be implemented');
  }

  /**
   * Get all appointments for a user
   * @param {string} userId
   * @returns {Promise<AppointmentDTO[]>}
   */
  async getAppointmentsByUserId(userId) {
    throw new Error('getAppointmentsByUserId must be implemented');
  }

  /**
   * Get all appointments for a pet
   * @param {string} petId
   * @returns {Promise<AppointmentDTO[]>}
   */
  async getAppointmentsByPetId(petId) {
    throw new Error('getAppointmentsByPetId must be implemented');
  }

  /**
   * Check if appointment exists
   * @param {string} appointmentId
   * @returns {Promise<boolean>}
   */
  async appointmentExists(appointmentId) {
    throw new Error('appointmentExists must be implemented');
  }

  /**
   * Get completed appointments (for billing/feedback)
   * @param {string} userId
   * @returns {Promise<AppointmentDTO[]>}
   */
  async getCompletedAppointmentsByUserId(userId) {
    throw new Error('getCompletedAppointmentsByUserId must be implemented');
  }
}

export default IAppointmentRepository;
