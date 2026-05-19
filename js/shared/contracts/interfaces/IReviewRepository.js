/**
 * Shared Contract Interface: IReviewRepository
 * 
 * Services use this interface to query review information from Feedback Service.
 * Appointment Service uses this to get reviews linked to appointments.
 */

export class IReviewRepository {
  /**
   * Get review by ID
   * @param {string} reviewId
   * @returns {Promise<ReviewDTO>}
   */
  async getReviewById(reviewId) {
    throw new Error('getReviewById must be implemented');
  }

  /**
   * Get all reviews for a user
   * @param {string} userId
   * @returns {Promise<ReviewDTO[]>}
   */
  async getReviewsByUserId(userId) {
    throw new Error('getReviewsByUserId must be implemented');
  }

  /**
   * Get all reviews for an appointment
   * @param {string} appointmentId
   * @returns {Promise<ReviewDTO[]>}
   */
  async getReviewsByAppointmentId(appointmentId) {
    throw new Error('getReviewsByAppointmentId must be implemented');
  }

  /**
   * Get recent reviews (for public display)
   * @param {number} limit
   * @returns {Promise<ReviewDTO[]>}
   */
  async getRecentReviews(limit = 10) {
    throw new Error('getRecentReviews must be implemented');
  }

  /**
   * Check if user can review appointment
   * @param {string} userId
   * @param {string} appointmentId
   * @returns {Promise<boolean>}
   */
  async canUserReviewAppointment(userId, appointmentId) {
    throw new Error('canUserReviewAppointment must be implemented');
  }
}

export default IReviewRepository;
