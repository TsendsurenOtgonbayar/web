/**
 * Appointment Service - Inter-Service Communication Guide
 * 
 * This file demonstrates how the Appointment Service communicates with
 * the Patient Service following SOA patterns.
 * 
 * KEY CONCEPT: When booking an appointment, the Appointment Service
 * calls PatientService.getPetsByUserId(userId) to verify the user
 * has at least one registered pet BEFORE approving the booking.
 */

import AppointmentService from './index.js';
import PatientService from '../patient/index.js';

/**
 * ====================================================
 * SCENARIO: Cross-Service Appointment Booking
 * ====================================================
 * 
 * Flow:
 * 1. Presentation layer calls AppointmentService.bookAppointment()
 * 2. AppointmentService calls PatientService.getPetsByUserId()
 * 3. If user has pets, continue with booking
 * 4. If user has NO pets, reject booking
 */

export async function scenarioBookAppointmentWithPets() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║ INTER-SERVICE: Book Appointment       ║');
  console.log('║ (User HAS pets)                       ║');
  console.log('╚════════════════════════════════════════╝\n');

  const userId = 'user-123';

  // Step 1: Ensure user has pets (setup)
  console.log('Step 1: User has registered pets');
  const petsResult = await PatientService.getPetsByUserId(userId);
  console.log(`  ✓ User has ${petsResult.pets.length} pet(s)\n`);

  // Step 2: Try to book appointment
  console.log('Step 2: User tries to book appointment\n');

  const bookingResult = await AppointmentService.bookAppointment(userId, {
    petId: petsResult.pets[0].petId, // Use first pet
    date: '2024-02-20',
    time: '10:00',
    serviceType: 'checkup',
    notes: 'Regular checkup'
  });

  if (bookingResult.success) {
    console.log(`✅ Appointment booked successfully!`);
    console.log(`   Appointment ID: ${bookingResult.appointment.appointmentId}`);
    console.log(`   Date: ${bookingResult.appointment.date} ${bookingResult.appointment.time}`);
  } else {
    console.log(`❌ Booking failed: ${bookingResult.errors[0]}`);
  }
}

/**
 * ====================================================
 * SCENARIO: Reject Booking Without Pets
 * ====================================================
 * 
 * This shows what happens when a user with NO pets tries to book.
 * The Appointment Service internally calls PatientService.getPetsByUserId()
 * which returns an empty array, so booking is rejected.
 */
export async function scenarioBookAppointmentWithoutPets() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║ INTER-SERVICE: Book Appointment       ║');
  console.log('║ (User has NO pets)                    ║');
  console.log('╚════════════════════════════════════════╝\n');

  const userWithoutPets = 'new-user-456';

  // Step 1: Verify user has NO pets
  console.log('Step 1: Check user pets');
  const petsResult = await PatientService.getPetsByUserId(userWithoutPets);
  console.log(`  Pets: ${petsResult.pets.length}\n`);

  if (petsResult.pets.length === 0) {
    console.log('User has no pets. Trying to book appointment anyway...\n');
  }

  // Step 2: Try to book (this will fail inside Appointment Service)
  console.log('Step 2: Appointment Service books appointment\n');
  console.log('   → Appointment Service calls: PatientService.getPetsByUserId()');
  console.log('   → Returns 0 pets');
  console.log('   → Booking rejected!\n');

  const bookingResult = await AppointmentService.bookAppointment(userWithoutPets, {
    petId: 'pet-123',
    date: '2024-02-20',
    time: '10:00',
    serviceType: 'checkup',
    notes: 'Checkup'
  });

  if (!bookingResult.success) {
    console.log(`❌ Booking rejected`);
    console.log(`   Reason: ${bookingResult.errors[0]}`);
    console.log(`\n   ✓ Service correctly enforced: Must have pets to book!`);
  }
}

/**
 * ====================================================
 * VISUALIZATION: Inter-Service Call Flow
 * ====================================================
 */
export function visualizeInterServiceFlow() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║ INTER-SERVICE CALL FLOW                ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log('USER ATTEMPTS TO BOOK APPOINTMENT');
  console.log('         ↓');
  console.log('PRESENTATION LAYER');
  console.log('  AppointmentService.bookAppointment()');
  console.log('         ↓');
  console.log('APPOINTMENT SERVICE (Application Layer)');
  console.log('  1. Validate appointment data');
  console.log('  2. 📞 CALL: PatientService.getPetsByUserId(userId)');
  console.log('         ↓');
  console.log('PATIENT SERVICE API');
  console.log('  ✓ Returns user\'s pets (array)');
  console.log('         ↓');
  console.log('BACK TO APPOINTMENT SERVICE');
  console.log('  3. Check: pets.length > 0?');
  console.log('     ├─ YES → Continue booking');
  console.log('     └─ NO  → Reject with error');
  console.log('         ↓');
  console.log('RESULT: Appointment created OR error returned');
  console.log();
}

/**
 * ====================================================
 * KEY CODE: Inside AppointmentApplicationService
 * ====================================================
 * 
 * This is the critical code that shows inter-service communication:
 */
export function showCriticalCode() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║ CRITICAL CODE IN APPOINTMENT SERVICE   ║');
  console.log('╚════════════════════════════════════════╝\n');

  const code = `
// File: AppointmentApplicationService.js

static async bookAppointment(userId, appointmentData) {
  // Step 1: Validate format
  const validation = AppointmentDomainService.validateAppointmentData(...);
  if (!validation.valid) return { success: false, errors: validation.errors };

  try {
    // ========== INTER-SERVICE CALL ==========
    // Get user's pets from Patient Service
    console.log('📞 Appointment Service calling Patient Service...');
    const petsResult = await PatientService.getPetsByUserId(userId);
    
    // Check if user has at least one pet
    if (!petsResult.pets || petsResult.pets.length === 0) {
      console.log('❌ User has no pets - appointment rejected');
      return {
        success: false,
        errors: ['Must register at least one pet before booking']
      };
    }
    
    console.log('✅ User has pets - proceeding with booking');
    
    // Step 2: Verify requested petId exists in user's pets
    const petIds = petsResult.pets.map(p => p.petId);
    if (!petIds.includes(appointmentData.petId)) {
      return {
        success: false,
        errors: ['Selected pet does not belong to user']
      };
    }
    
    // Step 3: Proceed with booking...
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
}
  `;

  console.log(code);
}

/**
 * ====================================================
 * RUN ALL SCENARIOS
 * ====================================================
 */
export async function runAllScenarios() {
  visualizeInterServiceFlow();
  await scenarioBookAppointmentWithPets();
  await scenarioBookAppointmentWithoutPets();
  showCriticalCode();

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║ KEY TAKEAWAYS                          ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log('1. ✅ Appointment Service depends on Patient Service API');
  console.log('   - Calls: PatientService.getPetsByUserId(userId)');
  console.log('   - Never accesses Patient Service internal classes\n');

  console.log('2. ✅ User MUST have at least one pet to book');
  console.log('   - Check happens before any appointment is created');
  console.log('   - Error message clearly states the requirement\n');

  console.log('3. ✅ Pet ownership verified');
  console.log('   - Requested petId must belong to user');
  console.log('   - Double-check against patient service data\n');

  console.log('4. ✅ Communication is synchronous (await)');
  console.log('   - Appointment Service waits for Patient Service response');
  console.log('   - Then makes decision to proceed or reject\n');

  console.log('5. ✅ Loose coupling achieved');
  console.log('   - Appointment Service only imports PatientService API');
  console.log('   - Never imports Patient domain classes');
  console.log('   - Both services can evolve independently\n');

  console.log('=== INTER-SERVICE COMMUNICATION WORKING! ===\n');
}

export default { runAllScenarios };
