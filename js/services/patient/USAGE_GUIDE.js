/**
 * Patient Service - Usage Guide & Examples
 * 
 * This guide shows how to use the Patient Service API from:
 * 1. Other services
 * 2. The presentation layer
 * 3. The API Gateway
 */

import PatientService from './index.js';

/**
 * ================================================
 * EXAMPLE 1: Add a Pet (from Presentation Layer)
 * ================================================
 */
export async function exampleAddPet() {
  const userId = 'user-123';
  const petData = {
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 3
  };

  const result = await PatientService.addPet(userId, petData);

  if (result.success) {
    console.log('✅ Pet added:', result.pet);
    // result.pet is a PetDTO
    console.log(`Pet ID: ${result.pet.petId}`);
    console.log(`Pet name: ${result.pet.name}`);
    console.log(`Pet age: ${result.pet.getAgeInYears()} years`);
  } else {
    console.log('❌ Error adding pet:', result.errors);
  }
}

/**
 * ================================================
 * EXAMPLE 2: Get All Pets for a User
 * ================================================
 */
export async function exampleGetPetsByUserId() {
  const userId = 'user-123';

  const result = await PatientService.getPetsByUserId(userId);

  if (result.success) {
    console.log(`✅ Found ${result.pets.length} pets`);
    result.pets.forEach(pet => {
      console.log(`- ${pet.name} (${pet.type})`);
    });
  } else {
    console.log('❌ Error getting pets:', result.error);
  }
}

/**
 * ================================================
 * EXAMPLE 3: Get Patient Profile
 * ================================================
 */
export async function exampleGetPatientProfile() {
  const userId = 'user-123';

  const result = await PatientService.getPatientProfile(userId);

  if (result.success) {
    console.log('✅ Patient profile:');
    console.log(`Pets: ${result.pets.length}`);
    result.pets.forEach(pet => {
      console.log(`  - ${pet.name}: ${pet.age} years old`);
    });
  } else {
    console.log('❌ Error getting profile:', result.error);
  }
}

/**
 * ================================================
 * EXAMPLE 4: Verify Pet Ownership (Cross-Service)
 * ================================================
 * 
 * Used by Appointment Service to ensure user owns the pet
 * before booking an appointment.
 */
export async function exampleVerifyPetOwnership() {
  const userId = 'user-123';
  const petId = 'pet-abc-123';

  const owns = await PatientService.verifyPetOwnership(userId, petId);

  if (owns) {
    console.log('✅ User owns this pet - can proceed with booking');
  } else {
    console.log('❌ User does not own this pet - cannot book');
  }
}

/**
 * ================================================
 * EXAMPLE 5: Update a Pet
 * ================================================
 */
export async function exampleUpdatePet() {
  const petId = 'pet-abc-123';
  const userId = 'user-123';
  const updates = {
    name: 'Fluffy Jr.'
    // Can update: name, type, gender
  };

  const result = await PatientService.updatePet(petId, userId, updates);

  if (result.success) {
    console.log('✅ Pet updated:', result.pet.name);
  } else {
    console.log('❌ Error updating pet:', result.errors);
  }
}

/**
 * ================================================
 * EXAMPLE 6: Delete a Pet
 * ================================================
 */
export async function exampleDeletePet() {
  const petId = 'pet-abc-123';
  const userId = 'user-123';

  const result = await PatientService.deletePet(petId, userId);

  if (result.success) {
    console.log('✅ Pet deleted');
  } else {
    console.log('❌ Error deleting pet:', result.error);
  }
}

/**
 * ================================================
 * EXAMPLE 7: Use in API Gateway
 * ================================================
 */
export async function exampleGatewayUsage() {
  // In APIGateway.js, booking orchestration:

  // 1. Get user's pets
  const petsResult = await PatientService.getPetsByUserId('user-123');

  // 2. Verify pet ownership before booking
  const owns = await PatientService.verifyPetOwnership('user-123', 'pet-456');

  if (!owns) {
    return {
      success: false,
      error: 'You do not own this pet'
    };
  }

  // 3. If verification passes, proceed with appointment booking
  console.log('✅ Pet ownership verified - proceeding with appointment');
}

/**
 * ================================================
 * EXAMPLE 8: Error Handling
 * ================================================
 */
export async function exampleErrorHandling() {
  // Invalid pet data
  const invalidResult = await PatientService.addPet('user-123', {
    name: '', // Empty name
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 3
  });

  if (!invalidResult.success) {
    console.log('Errors:');
    invalidResult.errors.forEach(err => {
      console.log(`  - ${err}`);
    });
    // Output:
    // Errors:
    //   - Амьтны нэр оруулна уу (Pet name is required)
  }

  // Missing user ID
  const noUserResult = await PatientService.addPet(null, {
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 3
  });

  if (!noUserResult.success) {
    console.log('Cannot add pet without user ID');
  }
}

/**
 * ================================================
 * COMPLETE WORKFLOW EXAMPLE
 * ================================================
 */
export async function exampleCompleteWorkflow() {
  console.log('=== Pet Service Complete Workflow ===\n');

  const userId = 'user-123';

  // 1. Add a pet
  console.log('Step 1: Adding a pet...');
  const addResult = await PatientService.addPet(userId, {
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 3
  });

  if (!addResult.success) {
    console.log('❌ Failed to add pet');
    return;
  }

  const petId = addResult.pet.petId;
  console.log(`✅ Pet added: ${addResult.pet.name} (ID: ${petId})\n`);

  // 2. Get all pets
  console.log('Step 2: Getting all pets for user...');
  const getPetsResult = await PatientService.getPetsByUserId(userId);
  console.log(`✅ Found ${getPetsResult.pets.length} pet(s)\n`);

  // 3. Verify ownership (e.g., before booking appointment)
  console.log('Step 3: Verifying pet ownership...');
  const owns = await PatientService.verifyPetOwnership(userId, petId);
  console.log(`✅ User owns pet: ${owns}\n`);

  // 4. Update pet
  console.log('Step 4: Updating pet...');
  const updateResult = await PatientService.updatePet(petId, userId, {
    name: 'Fluffy Jr.'
  });
  console.log(`✅ Pet updated to: ${updateResult.pet.name}\n`);

  // 5. Get patient profile
  console.log('Step 5: Getting patient profile...');
  const profileResult = await PatientService.getPatientProfile(userId);
  console.log(`✅ Patient has ${profileResult.pets.length} pet(s)`);
  profileResult.pets.forEach(pet => {
    console.log(`   - ${pet.name} (${pet.type}, ${pet.age || 0} years old)`);
  });
  console.log();

  // 6. Delete pet
  console.log('Step 6: Deleting pet...');
  const deleteResult = await PatientService.deletePet(petId, userId);
  console.log(`✅ Pet deleted\n`);

  // 7. Verify deletion
  console.log('Step 7: Verifying deletion...');
  const finalResult = await PatientService.getPetsByUserId(userId);
  console.log(`✅ User now has ${finalResult.pets.length} pet(s)\n`);

  console.log('=== Workflow Complete ===');
}

/**
 * ================================================
 * KEY POINTS
 * ================================================
 * 
 * 1. ✅ DO import from Patient Service public API:
 *    import PatientService from './services/patient/index.js';
 *    const result = await PatientService.addPet(userId, petData);
 * 
 * 2. ❌ DON'T import internal layers directly:
 *    import PetApplicationService from './services/patient/application/...';
 *    import PetStore from './services/patient/infrastructure/...';
 * 
 * 3. ✅ All results follow consistent format:
 *    { success: boolean, pet/pets?: PetDTO[], error/errors?: string[] }
 * 
 * 4. ✅ Use verifyPetOwnership() to check ownership:
 *    Before booking appointments, other services call this
 * 
 * 5. ✅ Pet data is returned as PetDTO:
 *    Use for cross-service communication
 *    Other services never see internal Pet entity
 */

export default {
  exampleAddPet,
  exampleGetPetsByUserId,
  exampleGetPatientProfile,
  exampleVerifyPetOwnership,
  exampleUpdatePet,
  exampleDeletePet,
  exampleGatewayUsage,
  exampleErrorHandling,
  exampleCompleteWorkflow
};
