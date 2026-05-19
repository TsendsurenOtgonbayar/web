/**
 * Patient Service - Test Suite
 * 
 * Examples showing how to test the Patient Service in isolation.
 * These tests don't depend on other services.
 */

import PatientService from './index.js';
import PetStore from './infrastructure/storage/PetStore.js';

/**
 * Test utility: Clear storage before each test
 */
function setupTest() {
  PetStore.clearAll();
}

/**
 * Test utility: Assert condition
 */
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
 * TEST 1: Add Pet
 * ================================================
 */
export async function testAddPet() {
  console.log('\n=== TEST: Add Pet ===');
  setupTest();

  const userId = 'test-user-1';
  const petData = {
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 6
  };

  const result = await PatientService.addPet(userId, petData);

  assert(result.success, 'Pet creation succeeds');
  assert(result.pet !== undefined, 'Pet is returned');
  assert(result.pet.petId !== undefined, 'Pet has ID');
  assert(result.pet.name === 'Fluffy', 'Pet name is correct');
  assert(result.pet.userId === userId, 'Pet has correct user reference');
}

/**
 * ================================================
 * TEST 2: Get Pets By User ID
 * ================================================
 */
export async function testGetPetsByUserId() {
  console.log('\n=== TEST: Get Pets By User ID ===');
  setupTest();

  const userId = 'test-user-2';

  // Add two pets
  await PatientService.addPet(userId, {
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 6
  });

  await PatientService.addPet(userId, {
    name: 'Rex',
    type: 'dog',
    gender: 'male',
    birthYear: 2021,
    birthMonth: 3
  });

  // Add pet for different user
  await PatientService.addPet('other-user', {
    name: 'Spot',
    type: 'dog',
    gender: 'male',
    birthYear: 2020,
    birthMonth: 1
  });

  const result = await PatientService.getPetsByUserId(userId);

  assert(result.success, 'Get pets succeeds');
  assert(result.pets.length === 2, 'Returns correct count (2 pets)');
  assert(result.pets[0].name === 'Fluffy', 'First pet is Fluffy');
  assert(result.pets[1].name === 'Rex', 'Second pet is Rex');
  assert(
    result.pets.every(p => p.userId === userId),
    'All pets belong to correct user'
  );
}

/**
 * ================================================
 * TEST 3: Verify Pet Ownership
 * ================================================
 */
export async function testVerifyPetOwnership() {
  console.log('\n=== TEST: Verify Pet Ownership ===');
  setupTest();

  const userId = 'test-user-3';
  const otherUserId = 'other-user';

  const addResult = await PatientService.addPet(userId, {
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 6
  });

  const petId = addResult.pet.petId;

  const ownsOwn = await PatientService.verifyPetOwnership(userId, petId);
  const ownsOther = await PatientService.verifyPetOwnership(otherUserId, petId);

  assert(ownsOwn === true, 'User owns their own pet');
  assert(ownsOther === false, 'Other user does not own pet');
}

/**
 * ================================================
 * TEST 4: Validation
 * ================================================
 */
export async function testValidation() {
  console.log('\n=== TEST: Validation ===');
  setupTest();

  const userId = 'test-user-4';

  // Test missing name
  let result = await PatientService.addPet(userId, {
    name: '',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 6
  });
  assert(result.success === false, 'Rejects empty name');

  // Test missing type
  result = await PatientService.addPet(userId, {
    name: 'Fluffy',
    type: '',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 6
  });
  assert(result.success === false, 'Rejects empty type');

  // Test invalid month
  result = await PatientService.addPet(userId, {
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 13 // Invalid
  });
  assert(result.success === false, 'Rejects invalid month');

  // Test valid data
  result = await PatientService.addPet(userId, {
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 6
  });
  assert(result.success === true, 'Accepts valid data');
}

/**
 * ================================================
 * TEST 5: Update Pet
 * ================================================
 */
export async function testUpdatePet() {
  console.log('\n=== TEST: Update Pet ===');
  setupTest();

  const userId = 'test-user-5';

  const addResult = await PatientService.addPet(userId, {
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 6
  });

  const petId = addResult.pet.petId;

  const updateResult = await PatientService.updatePet(petId, userId, {
    name: 'Fluffy Jr.'
  });

  assert(updateResult.success === true, 'Update succeeds');
  assert(updateResult.pet.name === 'Fluffy Jr.', 'Name is updated');
}

/**
 * ================================================
 * TEST 6: Delete Pet
 * ================================================
 */
export async function testDeletePet() {
  console.log('\n=== TEST: Delete Pet ===');
  setupTest();

  const userId = 'test-user-6';

  const addResult = await PatientService.addPet(userId, {
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 6
  });

  const petId = addResult.pet.petId;

  // Verify pet exists
  let getResult = await PatientService.getPetsByUserId(userId);
  assert(getResult.pets.length === 1, 'Pet exists before deletion');

  // Delete pet
  const deleteResult = await PatientService.deletePet(petId, userId);
  assert(deleteResult.success === true, 'Deletion succeeds');

  // Verify pet is deleted
  getResult = await PatientService.getPetsByUserId(userId);
  assert(getResult.pets.length === 0, 'Pet is deleted');
}

/**
 * ================================================
 * TEST 7: Ownership Verification on Update/Delete
 * ================================================
 */
export async function testOwnershipVerification() {
  console.log('\n=== TEST: Ownership Verification ===');
  setupTest();

  const userId = 'test-user-7';
  const otherUserId = 'other-user';

  const addResult = await PatientService.addPet(userId, {
    name: 'Fluffy',
    type: 'cat',
    gender: 'female',
    birthYear: 2022,
    birthMonth: 6
  });

  const petId = addResult.pet.petId;

  // Try to update pet as different user
  let updateResult = await PatientService.updatePet(petId, otherUserId, {
    name: 'Hacked'
  });
  assert(updateResult.success === false, 'Cannot update pet as non-owner');

  // Try to delete pet as different user
  let deleteResult = await PatientService.deletePet(petId, otherUserId);
  assert(deleteResult.success === false, 'Cannot delete pet as non-owner');

  // Can update as owner
  updateResult = await PatientService.updatePet(petId, userId, {
    name: 'Updated'
  });
  assert(updateResult.success === true, 'Can update pet as owner');

  // Can delete as owner
  deleteResult = await PatientService.deletePet(petId, userId);
  assert(deleteResult.success === true, 'Can delete pet as owner');
}

/**
 * ================================================
 * Run All Tests
 * ================================================
 */
export async function runAllTests() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   PATIENT SERVICE TEST SUITE          ║');
  console.log('╚════════════════════════════════════════╝');

  await testAddPet();
  await testGetPetsByUserId();
  await testVerifyPetOwnership();
  await testValidation();
  await testUpdatePet();
  await testDeletePet();
  await testOwnershipVerification();

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   ALL TESTS COMPLETE                  ║');
  console.log('╚════════════════════════════════════════╝\n');
}

export default { runAllTests };
