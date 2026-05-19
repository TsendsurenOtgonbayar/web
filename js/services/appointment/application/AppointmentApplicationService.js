/**
 * Appointment Service - Application Layer: Appointment Application Service
 * 
 * Orchestrates appointment operations.
 * KEY: Calls PatientService to verify user has pets before booking.
 * This demonstrates inter-service communication in SOA.
 */

import Appointment from '../domain/entity/Appointment.js';
import AppointmentDomainService from '../domain/services/AppointmentDomainService.js';
import AppointmentStore from '../infrastructure/storage/AppointmentStore.js';
import PatientService from '../../patient/index.js';

export class AppointmentApplicationService {
  /**
   * Book an appointment for a pet
   * 
   * CRITICAL: This method demonstrates inter-service communication.
   * It calls PatientService.getPetsByUserId(userId) to verify the user has at least one pet.
   * 
   * @param {string} userId - User ID
   * @param {Object} appointmentData - {petId, date, time, serviceType, notes, doctorId}
   * @returns {Object} - {success: boolean, appointment?: Appointment, errors?: string[]}
   */
  static async bookAppointment(userId, appointmentData) {
    if (!userId) {
      return {
        success: false,
        errors: ['User ID is required']
      };
    }

    // Step 1: Validate appointment data format
    const validation = AppointmentDomainService.validateAppointmentData(appointmentData);
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    try {
      // ====================================================
      // STEP 2: INTER-SERVICE CALL (SOA Pattern)
      // ====================================================
      // Get user's pets from Patient Service
      // This is a SYNCHRONOUS call across service boundaries
      console.log(`\n📞 Appointment Service calling Patient Service...`);
      const petsResult = await PatientService.getPetsByUserId(userId);

      if (!petsResult.success) {
        return {
          success: false,
          errors: ['Failed to retrieve user pets']
        };
      }

      // Check if user has at least one pet
      if (!petsResult.pets || petsResult.pets.length === 0) {
        console.log(`❌ User ${userId} has no pets - appointment rejected`);
        return {
          success: false,
          errors: ['ต้องลงทะเบียนสัตว์เลี้ยงอย่างน้อยหนึ่งตัวก่อนจองนัด']
          // Translation: "Must register at least one pet before booking an appointment"
        };
      }

      console.log(`✅ User has ${petsResult.pets.length} pet(s) - proceeding with booking`);

      // Step 3: Verify the requested petId exists in user's pets
      const petIds = petsResult.pets.map(p => p.petId);
      if (!petIds.includes(appointmentData.petId)) {
        return {
          success: false,
          errors: ['Сонгосон амьтан хэрэглэгчийн эзэмшиггүй байна']
          // Translation: "Selected pet does not belong to the user"
        };
      }

      // Step 4: Check slot availability
      const existingAppointments = AppointmentStore.findByDate(appointmentData.date);
      const slotAvailable = AppointmentDomainService.isSlotAvailable(
        appointmentData.date,
        appointmentData.time,
        existingAppointments
      );

      if (!slotAvailable) {
        return {
          success: false,
          errors: ['Сонгосон цаг зөвшөөрөгдөхгүй байна']
          // Translation: "Selected time slot is not available"
        };
      }

      // Step 5: Create appointment entity
      const appointment = new Appointment({
        userId: userId,
        petId: appointmentData.petId,
        date: appointmentData.date,
        time: appointmentData.time,
        serviceType: appointmentData.serviceType,
        notes: appointmentData.notes || '',
        doctorId: appointmentData.doctorId || null,
        status: 'confirmed' // Automatically confirmed after validation
      });

      // Step 6: Persist to storage
      const saved = AppointmentStore.addAppointment(appointment);

      if (!saved) {
        return {
          success: false,
          errors: ['Нэмэлт хүсэлт хадгалахад алдаа гарлаа']
          // Translation: "Failed to save appointment"
        };
      }

      // Step 7: Publish event (for other services to react)
      // In real system: eventBus.publish(new AppointmentBookedEvent(...))
      console.log(`📢 Published: AppointmentBookedEvent for user ${userId}`);

      return {
        success: true,
        appointment: appointment
      };
    } catch (error) {
      console.error('Error booking appointment:', error);
      return {
        success: false,
        errors: ['Нэмэлт хүсэлт үүсгэхэд алдаа гарлаа']
        // Translation: "An error occurred while booking the appointment"
      };
    }
  }

  /**
   * Get all appointments for a user
   * @param {string} userId
   * @returns {Object} - {success: boolean, appointments?: Appointment[]}
   */
  static getAppointmentsForUser(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          appointments: []
        };
      }

      const appointmentData = AppointmentStore.findByUserId(userId);
      const appointments = appointmentData.map(data => new Appointment(data));

      return {
        success: true,
        appointments: appointments
      };
    } catch (error) {
      console.error('Error getting appointments for user:', error);
      return {
        success: false,
        appointments: []
      };
    }
  }

  /**
   * Get appointments for a specific pet
   * @param {string} petId
   * @returns {Object} - {success: boolean, appointments?: Appointment[]}
   */
  static getAppointmentsForPet(petId) {
    try {
      const appointmentData = AppointmentStore.findByPetId(petId);
      const appointments = appointmentData.map(data => new Appointment(data));

      return {
        success: true,
        appointments: appointments
      };
    } catch (error) {
      console.error('Error getting appointments for pet:', error);
      return {
        success: false,
        appointments: []
      };
    }
  }

  /**
   * Get a specific appointment by ID
   * @param {string} appointmentId
   * @returns {Object} - {success: boolean, appointment?: Appointment}
   */
  static getAppointmentById(appointmentId) {
    try {
      const appointmentData = AppointmentStore.findById(appointmentId);

      if (!appointmentData) {
        return {
          success: false,
          appointment: null
        };
      }

      const appointment = new Appointment(appointmentData);

      return {
        success: true,
        appointment: appointment
      };
    } catch (error) {
      console.error('Error getting appointment:', error);
      return {
        success: false,
        appointment: null
      };
    }
  }

  /**
   * Cancel an appointment
   * @param {string} appointmentId
   * @param {string} userId - For ownership verification
   * @returns {Object} - {success: boolean}
   */
  static cancelAppointment(appointmentId, userId) {
    try {
      // Verify ownership
      if (!AppointmentStore.userOwnsAppointment(userId, appointmentId)) {
        return {
          success: false,
          errors: ['Нэмэлт хүсэлт эзэмшиггүй байна']
          // Translation: "You do not own this appointment"
        };
      }

      // Cancel in storage
      const cancelled = AppointmentStore.cancelAppointment(appointmentId);

      if (!cancelled) {
        return {
          success: false,
          errors: ['Нэмэлт хүсэлт олдсонгүй']
          // Translation: "Appointment not found"
        };
      }

      // Publish event: AppointmentCancelledEvent
      console.log(`📢 Published: AppointmentCancelledEvent for appointment ${appointmentId}`);

      return {
        success: true
      };
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return {
        success: false,
        errors: ['Нэмэлт хүсэлт цуцлахад алдаа гарлаа']
        // Translation: "An error occurred while cancelling the appointment"
      };
    }
  }

  /**
   * Get available time slots for a date
   * @param {string} date
   * @returns {Array} - Available times [HH:mm]
   */
  static getAvailableSlots(date) {
    try {
      const appointmentsOnDate = AppointmentStore.findByDate(date);
      return AppointmentDomainService.getAvailableSlots(date, appointmentsOnDate);
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  }

  /**
   * Get service offerings
   * @returns {Array} - Available services
   */
  static getServiceOfferings() {
    return AppointmentDomainService.getServiceOfferings();
  }
}

export default AppointmentApplicationService;
