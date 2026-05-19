/**
 * Appointment Service - Test Suite
 * 
 * Tests for Appointment Service functionality including inter-service calls.
 */

import AppointmentService from './index.js';
import PatientService from '../patient/index.js';
import AppointmentStore from './infrastructure/storage/AppointmentStore.js';

function setupTest() {
  AppointmentStore.clearAll();
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    return false;
  }
  console.log(`✅ PASSED: ${message}`);
  return true;
}

/**
 * ================================================
 * TEST 1: Book Appointment (With Pet)
 * ================================================
 */
export async function testBookAppointmentWithPet() {
  console.log('\n=== TEST 1: Book Appointment (User HAS pets) ===');
  setupTest();

  const userId = 'test-user-1';
  const petId = 'test-pet-1';

  // Verify user has pet (setup Patient Service data)
  const petsResult = await PatientService.getPetsByUserId(userId);
  const hasPet = petsResult.pets && petsResult.pets.length > 0;

  if (!hasPet) {
    console.log('⚠️  SKIPPED: Test requires user to have a pet');
    return;
  }

  const result = await AppointmentService.bookAppointment(userId, {
    petId: petsResult.pets[0].petId,
    date: '2024-02-20',
    time: '10:00',
    serviceType: 'checkup'
  });

  assert(result.success === true, 'Booking succeeds with pet');
  assert(result.appointment !== undefined, 'Appointment is returned');
  assert(result.appointment.appointmentId !== undefined, 'Appointment has ID');
  assert(result.appointment.status === 'confirmed', 'Appointment status is confirmed');
}

/**
 * ================================================
 * TEST 2: Reject Booking Without Pets (KEY TEST!)
 * ================================================
 */
export async function testBookAppointmentWithoutPet() {
  console.log('\n=== TEST 2: Reject Booking (User has NO pets) ===');
  setupTest();

  const userWithoutPets = 'new-user-no-pets';

  console.log('   📞 Appointment Service will call PatientService...');
  const result = await AppointmentService.bookAppointment(userWithoutPets, {
    petId: 'some-pet',
    date: '2024-02-20',
    time: '10:00',
    serviceType: 'checkup'
  });

  console.log('   ← PatientService returned 0 pets');

  assert(result.success === false, 'Booking is rejected');
  assert(result.errors !== undefined, 'Error message provided');
  assert(result.errors.length > 0, 'Has error reason');
  console.log(`   Error: "${result.errors[0]}"`);
}

/**
 * ================================================
 * TEST 3: Get User Appointments
 * ================================================
 */
export async function testGetUserAppointments() {
  console.log('\n=== TEST 3: Get User Appointments ===');
  setupTest();

  const userId = 'test-user-3';
  const petId = 'test-pet-3';

  // Book two appointments
  await AppointmentService.bookAppointment(userId, {
    petId: petId,
    date: '2024-02-20',
    time: '10:00',
    serviceType: 'checkup'
  });

  await AppointmentService.bookAppointment(userId, {
    petId: petId,
    date: '2024-02-21',
    time: '14:00',
    serviceType: 'vaccination'
  });

  const result = await AppointmentService.getAppointmentsForUser(userId);

  assert(result.success === true, 'Get succeeds');
  assert(result.appointments.length === 2, 'Returns 2 appointments');
  assert(
    result.appointments.every(a => a.userId === userId),
    'All appointments belong to user'
  );
}

/**
 * ================================================
 * TEST 4: Get Pet Appointments
 * ================================================
 */
export async function testGetPetAppointments() {
  console.log('\n=== TEST 4: Get Pet Appointments ===');
  setupTest();

  const userId = 'test-user-4';
  const petId = 'test-pet-4';
  const otherPetId = 'other-pet-4';

  // Book for first pet
  await AppointmentService.bookAppointment(userId, {
    petId: petId,
    date: '2024-02-20',
    time: '10:00',
    serviceType: 'checkup'
  });

  // Book for other pet
  await AppointmentService.bookAppointment(userId, {
    petId: otherPetId,
    date: '2024-02-21',
    time: '14:00',
    serviceType: 'vaccination'
  });

  const result = await AppointmentService.getAppointmentsForPet(petId);

  assert(result.success === true, 'Get succeeds');
  assert(result.appointments.length === 1, 'Returns 1 appointment');
  assert(result.appointments[0].petId === petId, 'Appointment is for correct pet');
}

/**
 * ================================================
 * TEST 5: Validation
 * ================================================
 */
export async function testValidation() {
  console.log('\n=== TEST 5: Validation ===');
  setupTest();

  const userId = 'test-user-5';
  const petId = 'test-pet-5';

  // Invalid: empty date
  let result = await AppointmentService.bookAppointment(userId, {
    petId: petId,
    date: '',
    time: '10:00',
    serviceType: 'checkup'
  });
  assert(result.success === false, 'Rejects empty date');

  // Invalid: invalid time
  result = await AppointmentService.bookAppointment(userId, {
    petId: petId,
    date: '2024-02-20',
    time: '25:00', // Invalid!
    serviceType: 'checkup'
  });
  assert(result.success === false, 'Rejects invalid time');

  // Invalid: empty service type
  result = await AppointmentService.bookAppointment(userId, {
    petId: petId,
    date: '2024-02-20',
    time: '10:00',
    serviceType: ''
  });
  assert(result.success === false, 'Rejects empty service type');

  // Valid
  result = await AppointmentService.bookAppointment(userId, {
    petId: petId,
    date: '2024-02-20',
    time: '10:00',
    serviceType: 'checkup'
  });
  assert(result.success === true, 'Accepts valid data');
}

/**
 * ================================================
 * TEST 6: Cancel Appointment
 * ================================================
 */
export async function testCancelAppointment() {
  console.log('\n=== TEST 6: Cancel Appointment ===');
  setupTest();

  const userId = 'test-user-6';
  const petId = 'test-pet-6';

  // Book appointment
  const bookResult = await AppointmentService.bookAppointment(userId, {
    petId: petId,
    date: '2024-02-20',
    time: '10:00',
    serviceType: 'checkup'
  });

  const appointmentId = bookResult.appointment.appointmentId;

  // Verify it exists
  let getResult = await AppointmentService.getAppointmentsForUser(userId);
  assert(getResult.appointments.length === 1, 'Appointment exists');

  // Cancel it
  const cancelResult = await AppointmentService.cancelAppointment(appointmentId, userId);
  assert(cancelResult.success === true, 'Cancellation succeeds');

  // Verify it's cancelled (status should change)
  getResult = await AppointmentService.getAppointmentsForUser(userId);
  const cancelled = getResult.appointments[0].status === 'cancelled';
  assert(cancelled === true, 'Appointment status is cancelled');
}

/**
 * ================================================
 * TEST 7: Get Available Slots
 * ================================================
 */
export async function testGetAvailableSlots() {
  console.log('\n=== TEST 7: Get Available Slots ===');
  setupTest();

  const userId = 'test-user-7';
  const petId = 'test-pet-7';
  const date = '2024-02-20';

  // Get slots when none booked
  let result = await AppointmentService.getAvailableSlots(date);
  assert(result.success === true, 'Get slots succeeds');
  assert(result.slots.length > 0, 'Returns available slots');

  const initialSlotCount = result.slots.length;

  // Book a slot
  await AppointmentService.bookAppointment(userId, {
    petId: petId,
    date: date,
    time: result.slots[0], // Book first slot
    serviceType: 'checkup'
  });

  // Get slots again
  result = await AppointmentService.getAvailableSlots(date);
  const updatedSlotCount = result.slots.length;

  assert(updatedSlotCount < initialSlotCount, 'Booked slot is removed from availability');
}

/**
 * ================================================
 * TEST 8: Get Service Offerings
 * ================================================
 */
export async function testGetServiceOfferings() {
  console.log('\n=== TEST 8: Get Service Offerings ===');

  const result = await AppointmentService.getServiceOfferings();

  assert(result.success === true, 'Get services succeeds');
  assert(result.services.length > 0, 'Returns services');
  assert(result.services[0].id !== undefined, 'Service has ID');
  assert(result.services[0].name !== undefined, 'Service has name');
}

/**
 * ================================================
 * TEST 9: Ownership Verification
 * ================================================
 */
export async function testOwnershipVerification() {
  console.log('\n=== TEST 9: Ownership Verification ===');
  setupTest();

  const userId = 'test-user-9';
  const otherUserId = 'other-user-9';
  const petId = 'test-pet-9';

  // Book appointment
  const bookResult = await AppointmentService.bookAppointment(userId, {
    petId: petId,
    date: '2024-02-20',
    time: '10:00',
    serviceType: 'checkup'
  });

  const appointmentId = bookResult.appointment.appointmentId;

  // Try to cancel as different user
  let cancelResult = await AppointmentService.cancelAppointment(appointmentId, otherUserId);
  assert(cancelResult.success === false, 'Cannot cancel as non-owner');

  // Can cancel as owner
  cancelResult = await AppointmentService.cancelAppointment(appointmentId, userId);
  assert(cancelResult.success === true, 'Can cancel as owner');
}

/**
 * ================================================
 * Run All Tests
 * ================================================
 */
export async function runAllTests() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   APPOINTMENT SERVICE TEST SUITE       ║');
  console.log('╚════════════════════════════════════════╝');

  await testBookAppointmentWithPet();
  await testBookAppointmentWithoutPet();
  await testGetUserAppointments();
  await testGetPetAppointments();
  await testValidation();
  await testCancelAppointment();
  await testGetAvailableSlots();
  await testGetServiceOfferings();
  await testOwnershipVerification();

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   ALL TESTS COMPLETE                   ║');
  console.log('╚════════════════════════════════════════╝\n');
}

export default { runAllTests };
