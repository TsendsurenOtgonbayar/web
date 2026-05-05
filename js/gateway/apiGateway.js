/**
 * API Gateway / Backend-for-Frontend
 * 
 * Single entry point for presentation layer.
 * Orchestrates requests across multiple services.
 * Composition logic lives here, not in individual services.
 * 
 * Benefits:
 * - Presentation layer only imports gateway, not individual services
 * - Gateway can aggregate data from multiple services
 * - Easy to add cross-cutting concerns (logging, caching, authorization)
 * - Services remain independent
 */

import IdentityServiceAPI from '../services/identity/api/IdentityServiceAPI.js';
import PatientServiceAPI from '../services/patient/api/PatientServiceAPI.js';
import AppointmentServiceAPI from '../services/appointment/api/AppointmentServiceAPI.js';
import FeedbackServiceAPI from '../services/feedback/api/FeedbackServiceAPI.js';

const SERVICE_CATALOG = [
  { id: 1, name: 'Ерөнхий үзлэг', price: 30000, doctors: ['Д.Бат', 'Д.Сараа'] },
  { id: 2, name: 'Вакцин', price: 20000, doctors: ['Д.Тэмүүжин', 'Д.Номин'] },
  { id: 3, name: 'Мэс засал', price: 150000, doctors: ['Д.Болд', 'Д.Ганаа'] },
  { id: 4, name: 'Лабораторийн шинжилгээ', price: 20000, doctors: ['Д.Болд', 'Д.Ганаа'] },
  { id: 5, name: 'Шүдний эмчилгээ', price: 100000, doctors: ['Д.Номин', 'Д.Бат'] },
  { id: 6, name: 'Арьс үсний арчилгаа', price: 100000, doctors: ['Д.Сараа', 'Д.Бат'] }
];

const DOCTOR_SCHEDULES = {
  'Д.Бат': { workingDays: 'Даваа, Лхагва, Баасан', workingHours: '09:00-13:00' },
  'Д.Сараа': { workingDays: 'Мягмар, Пүрэв, Бямба', workingHours: '10:00-16:00' },
  'Д.Тэмүүжин': { workingDays: 'Даваа, Мягмар, Баасан', workingHours: '11:00-17:00' },
  'Д.Номин': { workingDays: 'Лхагва, Пүрэв, Бямба', workingHours: '09:30-15:30' },
  'Д.Болд': { workingDays: 'Даваа-Баасан', workingHours: '08:30-14:30' },
  'Д.Ганаа': { workingDays: 'Даваа, Лхагва, Баасан', workingHours: '12:00-18:00' }
};

export class APIGateway {
  static normalizeUser(user) {
    if (!user) {
      return null;
    }

    const fullName = user.Name || user.name || user.displayName || `${user.lastName || ''} ${user.firstName || ''}`.trim();

    return {
      ...user,
      id: user.id || user.userId,
      userId: user.userId || user.id,
      name: fullName,
      Name: fullName,
      email: user.email || user.Email,
      Email: user.Email || user.email,
      currentRole: user.currentRole || 'User'
    };
  }

  /**
   * ==================== AUTH ==================
   */

  static async login(email, password) {
    const result = await IdentityServiceAPI.login(email, password);
    if (!result.success) {
      return result;
    }

    return {
      ...result,
      user: this.normalizeUser(result.user?.toJSON ? result.user.toJSON() : result.user)
    };
  }

  static async register(userData) {
    const result = await IdentityServiceAPI.register(userData);
    if (!result.success) {
      return result;
    }

    return {
      ...result,
      user: this.normalizeUser(result.user?.toJSON ? result.user.toJSON() : result.user)
    };
  }

  static async logout() {
    return IdentityServiceAPI.logout();
  }

  static getCurrentUser() {
    const user = IdentityServiceAPI.getCurrentUser();
    return this.normalizeUser(user);
  }

  static isAdmin(user = null) {
    return IdentityServiceAPI.isAdmin(user ? this.normalizeUser(user) : null);
  }

  static getRedirectRoute(user = null) {
    return IdentityServiceAPI.getRedirectRoute(user ? this.normalizeUser(user) : null);
  }

  static checkAuthAndRedirect(redirectTo = '/UI/logIn.html') {
    return IdentityServiceAPI.checkAuthAndRedirect(redirectTo);
  }

  static async updateCurrentUser(updates = {}) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Нэвтэрсэн хэрэглэгч олдсонгүй' };
    }

    return IdentityServiceAPI.updateProfile(currentUser.userId, updates);
  }

  /**
   * ==================== PATIENT & PETS ==================
   */
  static async getPatientDashboard(userId) {
    try {
      const [patientProfile, currentUser] = await Promise.all([
        PatientServiceAPI.getPatientProfile(userId),
        this.getCurrentUser()
      ]);

      if (!patientProfile || !patientProfile.success) {
        return null;
      }

      const pets = patientProfile.pets || [];
      const petsWithHistory = await Promise.all(
        pets.map(async pet => ({
          ...pet,
          appointments: (await AppointmentServiceAPI.getAppointmentsForPet(pet.petId)).appointments || []
        }))
      );

      return {
        user: currentUser || this.normalizeUser({ userId, Name: 'Хэрэглэгч' }),
        pets: petsWithHistory
      };
    } catch (error) {
      console.error('Error getting patient dashboard:', error);
      return null;
    }
  }

  static async addPet(userId, petData) {
    return PatientServiceAPI.addPet(userId, petData);
  }

  static async deletePet(userId, petId) {
    return PatientServiceAPI.deletePet(userId, petId);
  }

  static async getPatientProfile(userId) {
    return PatientServiceAPI.getPatientProfile(userId);
  }

  static async getPetsByUserId(userId) {
    return PatientServiceAPI.getPetsByUserId(userId);
  }

  /**
   * ==================== APPOINTMENTS ==================
   */

  /**
   * Get booking page data
   * Orchestrates: Appointment Service (services, availability)
   * @returns {Promise<{services, doctors, times}>}
   */
  static async getBookingPageData() {
    try {
      const [services, availability] = await Promise.all([
        AppointmentServiceAPI.getServiceOfferings(),
        Promise.resolve([])
      ]);

      return {
        services,
        availability
      };
    } catch (error) {
      console.error('Error getting booking data:', error);
      return null;
    }
  }

  /**
   * Get availability for a doctor on a specific date
   * @param {string} doctorId
   * @param {string} date (YYYY-MM-DD)
   * @returns {Promise<string[]>}
   */
  static getAvailableSlots(doctorId, date) {
    return AppointmentServiceAPI.getAvailableSlots(date);
  }

  /**
   * Book an appointment
   * Orchestrates: Appointment Service (booking)
   * Validates: Patient Service (pet ownership)
   * @param {Object} appointmentData
   * @returns {Promise<{success, appointment, error}>}
   */
  static async bookAppointment(appointmentData) {
    try {
      const currentUser = await this.getCurrentUser();
      const userId = appointmentData.userId || currentUser?.userId;

      if (!userId) {
        return {
          success: false,
          error: 'Та эхлээд нэвтэрч орно уу'
        };
      }

      const petsResult = await PatientServiceAPI.getPetsByUserId(userId);
      if (!petsResult.success || !petsResult.pets || petsResult.pets.length === 0) {
        return {
          success: false,
          error: 'Цаг захиалахын тулд эхлээд дор хаяж нэг амьтан бүртгэнэ үү'
        };
      }

      const resolvedPetId = appointmentData.petId || petsResult.pets[0].petId;

      return AppointmentServiceAPI.bookAppointment(userId, {
        ...appointmentData,
        userId,
        petId: resolvedPetId
      });
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getUserAppointments(userId) {
    return AppointmentServiceAPI.getAppointmentsForUser(userId);
  }

  static async cancelAppointment(appointmentId, userId = null) {
    const currentUser = userId ? this.normalizeUser({ userId }) : await this.getCurrentUser();
    return AppointmentServiceAPI.cancelAppointment(appointmentId, currentUser?.userId);
  }

  static async getAppointmentById(appointmentId) {
    return AppointmentServiceAPI.getAppointmentById(appointmentId);
  }

  static async getAppointmentsForPet(petId) {
    return AppointmentServiceAPI.getAppointmentsForPet(petId);
  }

  static async getServiceOfferings() {
    return AppointmentServiceAPI.getServiceOfferings();
  }

  static getServiceOptions() {
    return [...SERVICE_CATALOG];
  }

  static getServiceById(serviceId) {
    return SERVICE_CATALOG.find(service => service.id === serviceId) || null;
  }

  static getServiceByName(serviceName) {
    return SERVICE_CATALOG.find(service => service.name === serviceName) || null;
  }

  static getDoctorOptions(serviceId) {
    const service = this.getServiceById(serviceId);
    return service ? [...service.doctors] : [];
  }

  static getDoctorSchedule(doctorName) {
    return DOCTOR_SCHEDULES[doctorName] || null;
  }

  static getAvailableTimeSlots() {
    return [
      '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30',
      '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30'
    ];
  }

  /**
   * ==================== REVIEWS & FEEDBACK ==================
   */

  /**
   * Submit a review for an appointment
   * Orchestrates: Feedback Service (create review)
   * Validates: Appointment Service (appointment exists and is completed)
   * @param {string} userId
   * @param {Object} reviewData
   * @returns {Promise<{success, review, error}>}
   */
  static async submitReview(userId, reviewData) {
    try {
      const targetUserId = userId || (await this.getCurrentUser())?.userId;
      if (!targetUserId) {
        return { success: false, error: 'Нэвтэрсэн хэрэглэгч олдсонгүй' };
      }

      // Verify appointment exists and belongs to user
      const appointmentResult = await AppointmentServiceAPI.getAppointmentById(reviewData.appointmentId);
      const appointment = appointmentResult?.appointment;

      if (!appointmentResult?.success || !appointment || appointment.userId !== targetUserId) {
        return {
          success: false,
          error: 'Appointment not found'
        };
      }

      if (appointment.status !== 'completed') {
        return {
          success: false,
          error: 'Can only review completed appointments'
        };
      }

      // Submit review
      return FeedbackServiceAPI.submitReview(targetUserId, reviewData);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getRecentReviews(limit = 10) {
    return FeedbackServiceAPI.getRecentReviews(limit);
  }

  static async getUserReviews(userId) {
    return FeedbackServiceAPI.getReviewsByUserId(userId);
  }
}

export default APIGateway;
