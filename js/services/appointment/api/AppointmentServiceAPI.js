/**
 * Appointment Service - Public API
 * 
 * This is the only interface other services and the presentation layer should use.
 * 
 * KEY FEATURE: bookAppointment() calls PatientService.getPetsByUserId() internally
 * to verify user has at least one pet before confirming the booking.
 * This demonstrates inter-service communication in SOA.
 */

import AppointmentApplicationService from '../application/AppointmentApplicationService.js';
import { AppointmentDTO } from '../../../shared/contracts/dtos/AppointmentDTO.js';
import { AppointmentBookedEvent } from '../../../shared/contracts/events/AppointmentEvents.js';
import { eventBus } from '../../../shared/eventBus/EventBus.js';

/**
 * ============================================
 * APPOINTMENT SERVICE API - PUBLIC FUNCTIONS
 * ============================================
 * These are the only functions other services should call.
 */

/**
 * Book an appointment for a user's pet
 * 
 * CRITICAL: This method calls PatientService.getPetsByUserId(userId) internally
 * to verify the user has at least one registered pet.
 * 
 * Endpoint: POST /appointments
 * 
 * @param {string} userId - User ID
 * @param {Object} appointmentData - {petId, date, time, serviceType, notes, doctorId}
 * @returns {Promise<{success: boolean, appointment?: AppointmentDTO, errors?: string[]}>}
 */
export async function bookAppointment(userId, appointmentData) {
  try {
    const result = await AppointmentApplicationService.bookAppointment(userId, appointmentData);

    if (!result.success) {
      return {
        success: false,
        errors: result.errors
      };
    }

    const appointmentDTO = new AppointmentDTO(result.appointment.toJSON());

    // Emit event for async side effects
    eventBus.publish(new AppointmentBookedEvent(
      userId,
      result.appointment.petId,
      result.appointment.toJSON()
    ));

    return {
      success: true,
      appointment: appointmentDTO
    };
  } catch (error) {
    console.error('Error in bookAppointment:', error);
    return {
      success: false,
      errors: [error.message]
    };
  }
}

/**
 * Get all appointments for a user
 * Endpoint: GET /appointments?userId={userId}
 * 
 * @param {string} userId
 * @returns {Promise<{success: boolean, appointments?: AppointmentDTO[]}>}
 */
export async function getAppointmentsForUser(userId) {
  try {
    const result = AppointmentApplicationService.getAppointmentsForUser(userId);

    if (!result.success) {
      return {
        success: false,
        appointments: []
      };
    }

    const appointmentDTOs = result.appointments.map(
      appt => new AppointmentDTO(appt.toJSON())
    );

    return {
      success: true,
      appointments: appointmentDTOs
    };
  } catch (error) {
    console.error('Error in getAppointmentsForUser:', error);
    return {
      success: false,
      appointments: []
    };
  }
}

/**
 * Get appointments for a specific pet
 * Endpoint: GET /appointments/pet/{petId}
 * 
 * @param {string} petId
 * @returns {Promise<{success: boolean, appointments?: AppointmentDTO[]}>}
 */
export async function getAppointmentsForPet(petId) {
  try {
    const result = AppointmentApplicationService.getAppointmentsForPet(petId);

    if (!result.success) {
      return {
        success: false,
        appointments: []
      };
    }

    const appointmentDTOs = result.appointments.map(
      appt => new AppointmentDTO(appt.toJSON())
    );

    return {
      success: true,
      appointments: appointmentDTOs
    };
  } catch (error) {
    console.error('Error in getAppointmentsForPet:', error);
    return {
      success: false,
      appointments: []
    };
  }
}

/**
 * Get a specific appointment
 * Endpoint: GET /appointments/{appointmentId}
 * 
 * @param {string} appointmentId
 * @returns {Promise<{success: boolean, appointment?: AppointmentDTO}>}
 */
export async function getAppointmentById(appointmentId) {
  try {
    const result = AppointmentApplicationService.getAppointmentById(appointmentId);

    if (!result.success) {
      return {
        success: false,
        error: 'Appointment not found'
      };
    }

    const appointmentDTO = new AppointmentDTO(result.appointment.toJSON());

    return {
      success: true,
      appointment: appointmentDTO
    };
  } catch (error) {
    console.error('Error in getAppointmentById:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Cancel an appointment
 * Endpoint: DELETE /appointments/{appointmentId}
 * 
 * @param {string} appointmentId
 * @param {string} userId - For ownership verification
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function cancelAppointment(appointmentId, userId) {
  try {
    const result = AppointmentApplicationService.cancelAppointment(appointmentId, userId);

    if (!result.success) {
      return {
        success: false,
        error: result.errors[0]
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error in cancelAppointment:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get available time slots for a date
 * Endpoint: GET /appointments/availability/{date}
 * 
 * @param {string} date - Format: YYYY-MM-DD
 * @returns {Promise<{success: boolean, slots?: string[]}>}
 */
export async function getAvailableSlots(date) {
  try {
    const slots = AppointmentApplicationService.getAvailableSlots(date);

    return {
      success: true,
      slots: slots
    };
  } catch (error) {
    console.error('Error in getAvailableSlots:', error);
    return {
      success: false,
      slots: []
    };
  }
}

/**
 * Get available service types
 * Endpoint: GET /appointments/services
 * 
 * @returns {Promise<{success: boolean, services?: Array}>}
 */
export async function getServiceOfferings() {
  try {
    const services = AppointmentApplicationService.getServiceOfferings();

    return {
      success: true,
      services: services
    };
  } catch (error) {
    console.error('Error in getServiceOfferings:', error);
    return {
      success: false,
      services: []
    };
  }
}

/**
 * Export all functions as a service object
 */
export const AppointmentServiceAPI = {
  bookAppointment,
  getAppointmentsForUser,
  getAppointmentsForPet,
  getAppointmentById,
  cancelAppointment,
  getAvailableSlots,
  getServiceOfferings
};

export default AppointmentServiceAPI;
