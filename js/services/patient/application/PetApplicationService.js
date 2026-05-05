/**
 * Patient Service - Application Layer: Pet Application Service
 * 
 * Orchestrates pet operations.
 * Delegates validation to domain layer.
 * Delegates storage to infrastructure layer.
 * Does NOT import any other service's domain classes.
 */

import Pet from '../domain/entity/Pet.js';
import PetDomainService from '../domain/services/PetDomainService.js';
import PetStore from '../infrastructure/storage/PetStore.js';

export class PetApplicationService {
  /**
   * Create a new pet for a user
   * @param {string} userId - The user ID (reference, not User object)
   * @param {Object} petData - { name, birthYear, birthMonth, type, gender }
   * @returns {Object} - { success: boolean, pet?: Pet, errors?: string[] }
   */
  static createPet(userId, petData) {
    if (!userId) {
      return {
        success: false,
        errors: ['User ID is required']
      };
    }

    // Validate input
    const validation = PetDomainService.validatePetData(petData);
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    try {
      // Create pet entity
      const pet = new Pet({
        userId: userId,
        name: petData.name.trim(),
        birthYear: parseInt(petData.birthYear),
        birthMonth: parseInt(petData.birthMonth),
        type: petData.type,
        gender: petData.gender
      });

      // Calculate health category
      const age = PetDomainService.calculateAge(pet.birthYear, pet.birthMonth);
      pet.healthCategory = PetDomainService.getHealthCategory(age);

      // Persist to storage
      const saved = PetStore.addPet(pet);

      if (!saved) {
        return {
          success: false,
          errors: ['Failed to save pet']
        };
      }

      return {
        success: true,
        pet: pet
      };
    } catch (error) {
      console.error('Error creating pet:', error);
      return {
        success: false,
        errors: ['An error occurred while creating the pet']
      };
    }
  }

  /**
   * Get all pets for a user
   * @param {string} userId
   * @returns {Object} - { success: boolean, pets?: Pet[] }
   */
  static getPetsForUser(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          pets: []
        };
      }

      const petData = PetStore.findByUserId(userId);
      const pets = petData.map(data => new Pet(data));

      return {
        success: true,
        pets: pets
      };
    } catch (error) {
      console.error('Error getting pets for user:', error);
      return {
        success: false,
        pets: []
      };
    }
  }

  /**
   * Get a specific pet by ID
   * @param {string} petId
   * @returns {Object} - { success: boolean, pet?: Pet }
   */
  static getPetById(petId) {
    try {
      const petData = PetStore.findById(petId);

      if (!petData) {
        return {
          success: false,
          pet: null
        };
      }

      const pet = new Pet(petData);

      return {
        success: true,
        pet: pet
      };
    } catch (error) {
      console.error('Error getting pet:', error);
      return {
        success: false,
        pet: null
      };
    }
  }

  /**
   * Update a pet
   * @param {string} petId
   * @param {string} userId - For ownership verification
   * @param {Object} updates - Fields to update
   * @returns {Object} - { success: boolean, pet?: Pet }
   */
  static updatePet(petId, userId, updates) {
    try {
      // Verify ownership
      if (!PetStore.userOwnsPet(userId, petId)) {
        return {
          success: false,
          errors: ['You do not own this pet']
        };
      }

      // Update in storage
      const updated = PetStore.updatePet(petId, updates);

      if (!updated) {
        return {
          success: false,
          errors: ['Failed to update pet']
        };
      }

      // Return updated pet
      const petData = PetStore.findById(petId);
      const pet = new Pet(petData);

      return {
        success: true,
        pet: pet
      };
    } catch (error) {
      console.error('Error updating pet:', error);
      return {
        success: false,
        errors: ['An error occurred while updating the pet']
      };
    }
  }

  /**
   * Delete a pet
   * @param {string} petId
   * @param {string} userId - For ownership verification
   * @returns {Object} - { success: boolean }
   */
  static deletePet(petId, userId) {
    try {
      // Verify ownership
      if (!PetStore.userOwnsPet(userId, petId)) {
        return {
          success: false,
          errors: ['You do not own this pet']
        };
      }

      // Delete from storage
      const deleted = PetStore.deletePet(petId);

      if (!deleted) {
        return {
          success: false,
          errors: ['Pet not found']
        };
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting pet:', error);
      return {
        success: false,
        errors: ['An error occurred while deleting the pet']
      };
    }
  }

  /**
   * Verify that a user owns a pet (for other services to call)
   * @param {string} userId
   * @param {string} petId
   * @returns {boolean}
   */
  static verifyPetOwnership(userId, petId) {
    return PetStore.userOwnsPet(userId, petId);
  }

  /**
   * Get formatted pet info for display
   * @param {string} petId
   * @returns {Object} - Formatted pet info
   */
  static getPetInfo(petId) {
    try {
      const petData = PetStore.findById(petId);

      if (!petData) {
        return null;
      }

      const pet = new Pet(petData);
      return PetDomainService.formatPetInfo(pet);
    } catch (error) {
      console.error('Error formatting pet info:', error);
      return null;
    }
  }

  /**
   * Get all formatted pet info for a user
   * @param {string} userId
   * @returns {Array} - Array of formatted pet info
   */
  static getPetsInfoForUser(userId) {
    try {
      const petData = PetStore.findByUserId(userId);
      return petData.map(data => {
        const pet = new Pet(data);
        return PetDomainService.formatPetInfo(pet);
      });
    } catch (error) {
      console.error('Error formatting pets info:', error);
      return [];
    }
  }
}

export default PetApplicationService;
