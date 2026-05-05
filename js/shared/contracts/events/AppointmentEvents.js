/**
 * Appointment Service Domain Events
 * 
 * Events emitted by Appointment Service for other services to listen to.
 */

import DomainEvent from './DomainEvent.js';

/**
 * Emitted when an appointment is successfully booked
 */
export class AppointmentBookedEvent extends DomainEvent {
  constructor(userId, petId, appointmentData) {
    super('AppointmentBooked', userId, {
      userId,
      petId,
      appointmentData
    });
    this.userId = userId;
    this.petId = petId;
    this.appointmentData = appointmentData;
  }
}

/**
 * Emitted when an appointment is cancelled
 */
export class AppointmentCancelledEvent extends DomainEvent {
  constructor(appointmentId, userId, petId) {
    super('AppointmentCancelled', appointmentId, {
      appointmentId,
      userId,
      petId
    });
    this.appointmentId = appointmentId;
    this.userId = userId;
    this.petId = petId;
  }
}

/**
 * Emitted when an appointment is completed
 */
export class AppointmentCompletedEvent extends DomainEvent {
  constructor(appointmentId, userId, petId, notes) {
    super('AppointmentCompleted', appointmentId, {
      appointmentId,
      userId,
      petId,
      notes
    });
    this.appointmentId = appointmentId;
    this.userId = userId;
    this.petId = petId;
    this.notes = notes;
  }
}

export default {
  AppointmentBookedEvent,
  AppointmentCancelledEvent,
  AppointmentCompletedEvent
};
