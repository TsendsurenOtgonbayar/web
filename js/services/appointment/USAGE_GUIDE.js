/**
 * Appointment Service - Usage Guide & Examples
 * 
 * Shows how to use the Appointment Service API.
 */

import AppointmentService from './index.js';

/**
 * ================================================
 * EXAMPLE 1: Book an Appointment
 * ================================================
 */
export async function exampleBookAppointment() {
  console.log('\n=== EXAMPLE 1: Book Appointment ===\n');

  const result = await AppointmentService.bookAppointment('user-123', {
    petId: 'pet-456',
    date: '2024-02-20',
    time: '10:00',
    serviceType: 'checkup',
    notes: 'Regular checkup and vaccines'
  });

  if (result.success) {
    console.log(`✅ Appointment booked!`);
    console.log(`   ID: ${result.appointment.appointmentId}`);
    console.log(`   Date: ${result.appointment.date}`);
    console.log(`   Time: ${result.appointment.time}`);
    console.log(`   Service: ${result.appointment.serviceType}`);
  } else {
    console.log(`❌ Failed: ${result.errors[0]}`);
  }
}

/**
 * ================================================
 * EXAMPLE 2: Get User's Appointments
 * ================================================
 */
export async function exampleGetUserAppointments() {
  console.log('\n=== EXAMPLE 2: Get User Appointments ===\n');

  const result = await AppointmentService.getAppointmentsForUser('user-123');

  if (result.success) {
    console.log(`✅ Found ${result.appointments.length} appointment(s)\n`);

    result.appointments.forEach((appt, index) => {
      console.log(`${index + 1}. ${appt.getDateTime()}`);
      console.log(`   Service: ${appt.serviceType}`);
      console.log(`   Status: ${appt.getStatusDisplay()}`);
      console.log();
    });
  }
}

/**
 * ================================================
 * EXAMPLE 3: Get Pet's Appointments
 * ================================================
 */
export async function exampleGetPetAppointments() {
  console.log('\n=== EXAMPLE 3: Get Pet Appointments ===\n');

  const result = await AppointmentService.getAppointmentsForPet('pet-456');

  if (result.success) {
    console.log(`✅ Found ${result.appointments.length} appointment(s) for pet`);

    result.appointments.forEach(appt => {
      console.log(`- ${appt.date} ${appt.time}: ${appt.serviceType}`);
    });
  }
}

/**
 * ================================================
 * EXAMPLE 4: Get Available Slots
 * ================================================
 */
export async function exampleGetAvailableSlots() {
  console.log('\n=== EXAMPLE 4: Get Available Slots ===\n');

  const result = await AppointmentService.getAvailableSlots('2024-02-20');

  if (result.success) {
    console.log(`✅ Available slots on 2024-02-20:\n`);

    result.slots.forEach((slot, index) => {
      if (index % 4 === 0) console.log('');
      process.stdout.write(`${slot}  `);
    });
    console.log('\n');
  }
}

/**
 * ================================================
 * EXAMPLE 5: Get Service Offerings
 * ================================================
 */
export async function exampleGetServices() {
  console.log('\n=== EXAMPLE 5: Service Offerings ===\n');

  const result = await AppointmentService.getServiceOfferings();

  if (result.success) {
    console.log(`✅ Available services:\n`);

    result.services.forEach(service => {
      console.log(`- ${service.name}`);
      console.log(`  Duration: ${service.duration} minutes\n`);
    });
  }
}

/**
 * ================================================
 * EXAMPLE 6: Cancel Appointment
 * ================================================
 */
export async function exampleCancelAppointment() {
  console.log('\n=== EXAMPLE 6: Cancel Appointment ===\n');

  // First book one
  const bookResult = await AppointmentService.bookAppointment('user-123', {
    petId: 'pet-456',
    date: '2024-02-25',
    time: '14:00',
    serviceType: 'checkup'
  });

  if (!bookResult.success) {
    console.log('Cannot book appointment to demonstrate cancellation');
    return;
  }

  const appointmentId = bookResult.appointment.appointmentId;
  console.log(`Created appointment: ${appointmentId}\n`);

  // Now cancel it
  console.log('Cancelling appointment...\n');
  const cancelResult = await AppointmentService.cancelAppointment(appointmentId, 'user-123');

  if (cancelResult.success) {
    console.log(`✅ Appointment cancelled`);
  } else {
    console.log(`❌ Failed: ${cancelResult.error}`);
  }
}

/**
 * ================================================
 * EXAMPLE 7: Get Specific Appointment
 * ================================================
 */
export async function exampleGetAppointment() {
  console.log('\n=== EXAMPLE 7: Get Specific Appointment ===\n');

  // First create one
  const bookResult = await AppointmentService.bookAppointment('user-123', {
    petId: 'pet-456',
    date: '2024-02-22',
    time: '11:00',
    serviceType: 'vaccination',
    notes: 'Annual vaccines'
  });

  if (!bookResult.success) {
    console.log('Cannot create appointment');
    return;
  }

  const appointmentId = bookResult.appointment.appointmentId;

  // Retrieve it
  const getResult = await AppointmentService.getAppointmentById(appointmentId);

  if (getResult.success) {
    const appt = getResult.appointment;
    console.log(`✅ Appointment found:\n`);
    console.log(`ID: ${appt.appointmentId}`);
    console.log(`Date: ${appt.date}`);
    console.log(`Time: ${appt.time}`);
    console.log(`Service: ${appt.serviceType}`);
    console.log(`Status: ${appt.getStatusDisplay()}`);
    console.log(`Notes: ${appt.notes}`);
  }
}

/**
 * ================================================
 * EXAMPLE 8: Error Handling
 * ================================================
 */
export async function exampleErrorHandling() {
  console.log('\n=== EXAMPLE 8: Error Handling ===\n');

  // Invalid date
  console.log('Test 1: Invalid date (past date)');
  let result = await AppointmentService.bookAppointment('user-123', {
    petId: 'pet-456',
    date: '2020-01-01', // Past date!
    time: '10:00',
    serviceType: 'checkup'
  });
  console.log(`Result: ${result.success ? '✅' : '❌'}`);
  if (!result.success) console.log(`Error: ${result.errors[0]}\n`);

  // Invalid time
  console.log('Test 2: Invalid time (outside business hours)');
  result = await AppointmentService.bookAppointment('user-123', {
    petId: 'pet-456',
    date: '2024-02-20',
    time: '22:00', // After hours!
    serviceType: 'checkup'
  });
  console.log(`Result: ${result.success ? '✅' : '❌'}`);
  if (!result.success) console.log(`Error: ${result.errors[0]}\n`);

  // Missing data
  console.log('Test 3: Missing service type');
  result = await AppointmentService.bookAppointment('user-123', {
    petId: 'pet-456',
    date: '2024-02-20',
    time: '10:00',
    serviceType: '' // Empty!
  });
  console.log(`Result: ${result.success ? '✅' : '❌'}`);
  if (!result.success) console.log(`Error: ${result.errors[0]}\n`);

  // Valid data
  console.log('Test 4: Valid appointment data');
  result = await AppointmentService.bookAppointment('user-123', {
    petId: 'pet-456',
    date: '2024-02-20',
    time: '10:00',
    serviceType: 'checkup'
  });
  console.log(`Result: ${result.success ? '✅' : '❌'}`);
  if (result.success) console.log(`Appointment: ${result.appointment.appointmentId}\n`);
}

/**
 * ================================================
 * COMPLETE WORKFLOW
 * ================================================
 */
export async function exampleCompleteWorkflow() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║ COMPLETE APPOINTMENT WORKFLOW          ║');
  console.log('╚════════════════════════════════════════╝\n');

  const userId = 'user-123';
  const petId = 'pet-456';

  console.log('Step 1: Get available services');
  const servicesResult = await AppointmentService.getServiceOfferings();
  if (servicesResult.success) {
    console.log(`✅ Found ${servicesResult.services.length} services\n`);
  }

  console.log('Step 2: Check available times on 2024-02-20');
  const slotsResult = await AppointmentService.getAvailableSlots('2024-02-20');
  if (slotsResult.success) {
    console.log(`✅ Found ${slotsResult.slots.length} available slots`);
    console.log(`   First 3: ${slotsResult.slots.slice(0, 3).join(', ')}\n`);
  }

  console.log('Step 3: Book appointment');
  const bookResult = await AppointmentService.bookAppointment(userId, {
    petId: petId,
    date: '2024-02-20',
    time: slotsResult.slots[0], // Book first available slot
    serviceType: 'checkup',
    notes: 'Annual checkup'
  });

  if (bookResult.success) {
    const appointmentId = bookResult.appointment.appointmentId;
    console.log(`✅ Appointment booked: ${appointmentId}\n`);

    console.log('Step 4: View user appointments');
    const userApptsResult = await AppointmentService.getAppointmentsForUser(userId);
    console.log(`✅ User has ${userApptsResult.appointments.length} appointment(s)\n`);

    console.log('Step 5: View pet appointments');
    const petApptsResult = await AppointmentService.getAppointmentsForPet(petId);
    console.log(`✅ Pet has ${petApptsResult.appointments.length} appointment(s)\n`);

    console.log('Step 6: Get specific appointment details');
    const detailsResult = await AppointmentService.getAppointmentById(appointmentId);
    if (detailsResult.success) {
      const appt = detailsResult.appointment;
      console.log(`✅ Appointment Details:`);
      console.log(`   Date/Time: ${appt.getDateTime()}`);
      console.log(`   Service: ${appt.serviceType}`);
      console.log(`   Status: ${appt.getStatusDisplay()}\n`);
    }
  }
}

export default {
  exampleBookAppointment,
  exampleGetUserAppointments,
  exampleGetPetAppointments,
  exampleGetAvailableSlots,
  exampleGetServices,
  exampleCancelAppointment,
  exampleGetAppointment,
  exampleErrorHandling,
  exampleCompleteWorkflow
};
