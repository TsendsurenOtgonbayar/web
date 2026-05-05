/**
 * Patient Service - Public API
 * 
 * This is the only interface other services and the presentation layer should use.
 * Simulates REST API endpoints like:
 *   GET  /patients/{userId}/pets
 *   POST /patients/{userId}/pets
 *   GET  /pets/{petId}
 *   DELETE /pets/{petId}
 * 
 * No other code should import the domain, application, or infrastructure layers directly.
 * All access goes through these API functions.
 */

import PetApplicationService from '../application/PetApplicationService.js';
import { PetDTO } from '../../../shared/contracts/dtos/PetDTO.js';
import { PetAddedEvent } from '../../../shared/contracts/events/PatientEvents.js';
import { eventBus } from '../../../shared/eventBus/EventBus.js';

/**
 * ============================================
 * PATIENT SERVICE API - PUBLIC FUNCTIONS
 * ============================================
 * These are the only functions other services should call.
 */

/**
 * Get all pets for a user
 * Endpoint: GET /patients/{userId}/pets
 * 
 * @param {string} userId - The user ID
 * @returns {Promise<{success: boolean, pets?: PetDTO[], error?: string}>}
 */
export async function getPetsByUserId(userId) {
  try {
    const result = PetApplicationService.getPetsForUser(userId);

    if (!result.success) {
      return {
        success: false,
        pets: [],
        error: 'Failed to retrieve pets'
      };
    }

    // Convert to DTOs for cross-service communication
    const petDTOs = result.pets.map(pet => new PetDTO(pet.toJSON()));

    return {
      success: true,
      pets: petDTOs
    };
  } catch (error) {
    console.error('Error in getPetsByUserId:', error);
    return {
      success: false,
      pets: [],
      error: error.message
    };
  }
}

/**
 * Get a specific pet by ID
 * Endpoint: GET /pets/{petId}
 * 
 * @param {string} petId
 * @returns {Promise<{success: boolean, pet?: PetDTO, error?: string}>}
 */
export async function getPetById(petId) {
  try {
    const result = PetApplicationService.getPetById(petId);

    if (!result.success) {
      return {
        success: false,
        error: 'Pet not found'
      };
    }

    const petDTO = new PetDTO(result.pet.toJSON());

    return {
      success: true,
      pet: petDTO
    };
  } catch (error) {
    console.error('Error in getPetById:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Add a new pet for a user
 * Endpoint: POST /patients/{userId}/pets
 * 
 * @param {string} userId - The user ID
 * @param {Object} petData - {name, birthYear, birthMonth, type, gender}
 * @returns {Promise<{success: boolean, pet?: PetDTO, errors?: string[]}>}
 */
export async function addPet(userId, petData) {
  try {
    const result = PetApplicationService.createPet(userId, petData);

    if (!result.success) {
      return {
        success: false,
        errors: result.errors
      };
    }

    const petDTO = new PetDTO(result.pet.toJSON());

    // Emit event for async side effects
    eventBus.publish(new PetAddedEvent(userId, result.pet.toJSON()));

    return {
      success: true,
      pet: petDTO
    };
  } catch (error) {
    console.error('Error in addPet:', error);
    return {
      success: false,
      errors: [error.message]
    };
  }
}

/**
 * Update an existing pet
 * Endpoint: PATCH /pets/{petId}
 * 
 * @param {string} petId
 * @param {string} userId - For ownership verification
 * @param {Object} updates - Fields to update {name, type, gender}
 * @returns {Promise<{success: boolean, pet?: PetDTO, errors?: string[]}>}
 */
export async function updatePet(petId, userId, updates) {
  try {
    const result = PetApplicationService.updatePet(petId, userId, updates);

    if (!result.success) {
      return {
        success: false,
        errors: result.errors
      };
    }

    const petDTO = new PetDTO(result.pet.toJSON());

    return {
      success: true,
      pet: petDTO
    };
  } catch (error) {
    console.error('Error in updatePet:', error);
    return {
      success: false,
      errors: [error.message]
    };
  }
}

/**
 * Delete a pet
 * Endpoint: DELETE /pets/{petId}
 * 
 * @param {string} petId
 * @param {string} userId - For ownership verification
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deletePet(petId, userId) {
  try {
    const result = PetApplicationService.deletePet(petId, userId);

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
    console.error('Error in deletePet:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verify that a user owns a pet
 * Used by other services (e.g., Appointment Service) to validate ownership
 * Endpoint: GET /patients/{userId}/pets/{petId}/verify
 * 
 * @param {string} userId
 * @param {string} petId
 * @returns {Promise<boolean>}
 */
export async function verifyPetOwnership(userId, petId) {
  try {
    return PetApplicationService.verifyPetOwnership(userId, petId);
  } catch (error) {
    console.error('Error in verifyPetOwnership:', error);
    return false;
  }
}

/**
 * Get patient profile (user's pet list)
 * Endpoint: GET /patients/{userId}
 * Used to get complete patient dashboard with all pets
 * 
 * @param {string} userId
 * @returns {Promise<{success: boolean, pets?: PetDTO[], error?: string}>}
 */
export async function getPatientProfile(userId) {
  try {
    const result = PetApplicationService.getPetsForUser(userId);

    if (!result.success) {
      return {
        success: false,
        pets: [],
        error: 'Failed to retrieve patient profile'
      };
    }

    const petDTOs = result.pets.map(pet => new PetDTO(pet.toJSON()));

    return {
      success: true,
      pets: petDTOs
    };
  } catch (error) {
    console.error('Error in getPatientProfile:', error);
    return {
      success: false,
      pets: [],
      error: error.message
    };
  }
}

/**
 * Get pet count for a user (helper)
 * @param {string} userId
 * @returns {number}
 */
export function getPetCountForUser(userId) {
  return PetApplicationService.getPetsInfoForUser(userId).length;
}

/**
 * Export all functions as a service object for convenience
 */
export const PatientServiceAPI = {
  getPetsByUserId,
  getPetById,
  addPet,
  updatePet,
  deletePet,
  verifyPetOwnership,
  getPatientProfile,
  getPetCountForUser
};

export default PatientServiceAPI;
