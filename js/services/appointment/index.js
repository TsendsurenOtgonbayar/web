/**
 * Appointment Service - Entry Point
 * 
 * Import from here, never from internal layers.
 */

export { default as AppointmentServiceAPI } from './api/AppointmentServiceAPI.js';
export {
  bookAppointment,
  getAppointmentsForUser,
  getAppointmentsForPet,
  getAppointmentById,
  cancelAppointment,
  getAvailableSlots,
  getServiceOfferings
} from './api/AppointmentServiceAPI.js';

// Re-export shared contracts
export { AppointmentDTO } from '../../shared/contracts/dtos/AppointmentDTO.js';
export {
  AppointmentBookedEvent,
  AppointmentCancelledEvent,
  AppointmentCompletedEvent
} from '../../shared/contracts/events/AppointmentEvents.js';

export default {
  bookAppointment,
  getAppointmentsForUser,
  getAppointmentsForPet,
  getAppointmentById,
  cancelAppointment,
  getAvailableSlots,
  getServiceOfferings
};
