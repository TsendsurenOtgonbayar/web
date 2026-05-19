/**
 * Patient Service - Infrastructure Layer: Pet Storage
 * 
 * Handles all persistence for pets.
 * Independent storage: localStorage['patient_service_pets']
 * No dependency on User storage or User data.
 */

import Pet from "../../domain/entity/Pet.js";

const PETS_STORAGE_KEY = 'patient_service_pets';

export class PetStore {
  /**
   * Get all pets from storage
   * @returns {Pet[]}
   */
  static getAllPets() {
    try {
      const data = localStorage.getItem(PETS_STORAGE_KEY);
      if (!data) return [];

      const petObjects = JSON.parse(data);
      return Array.isArray(petObjects) ? petObjects : [];
    } catch (error) {
      console.error('Error loading pets from storage:', error);
      return [];
    }
  }

  /**
   * Save all pets to storage
   * @param {Array} pets - Array of pet objects
   * @returns {boolean}
   */
  static savePets(pets) {
    try {
      localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(pets));
      return true;
    } catch (error) {
      console.error('Error saving pets to storage:', error);
      return false;
    }
  }

  /**
   * Add a new pet to storage
   * @param {Pet} pet - Pet entity
   * @returns {boolean}
   */
  static addPet(pet) {
    try {
      const pets = this.getAllPets();
      pets.push(pet.toJSON());
      return this.savePets(pets);
    } catch (error) {
      console.error('Error adding pet:', error);
      return false;
    }
  }

  /**
   * Find pet by ID
   * @param {string} petId
   * @returns {Object|null}
   */
  static findById(petId) {
    try {
      const pets = this.getAllPets();
      return pets.find(pet => pet.petId === petId) || null;
    } catch (error) {
      console.error('Error finding pet:', error);
      return null;
    }
  }

  /**
   * Find all pets for a user
   * @param {string} userId
   * @returns {Object[]}
   */
  static findByUserId(userId) {
    try {
      const pets = this.getAllPets();
      return pets.filter(pet => pet.userId === userId);
    } catch (error) {
      console.error('Error finding pets for user:', error);
      return [];
    }
  }

  /**
   * Update a pet
   * @param {string} petId
   * @param {Object} updates - Fields to update
   * @returns {boolean}
   */
  static updatePet(petId, updates) {
    try {
      const pets = this.getAllPets();
      const index = pets.findIndex(pet => pet.petId === petId);

      if (index === -1) {
        console.warn(`Pet ${petId} not found`);
        return false;
      }

      pets[index] = { ...pets[index], ...updates };
      return this.savePets(pets);
    } catch (error) {
      console.error('Error updating pet:', error);
      return false;
    }
  }

  /**
   * Delete a pet
   * @param {string} petId
   * @returns {boolean}
   */
  static deletePet(petId) {
    try {
      const pets = this.getAllPets();
      const filteredPets = pets.filter(pet => pet.petId !== petId);

      if (filteredPets.length === pets.length) {
        console.warn(`Pet ${petId} not found`);
        return false;
      }

      return this.savePets(filteredPets);
    } catch (error) {
      console.error('Error deleting pet:', error);
      return false;
    }
  }

  /**
   * Clear all pets (useful for testing)
   * @returns {boolean}
   */
  static clearAll() {
    try {
      localStorage.removeItem(PETS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing pets:', error);
      return false;
    }
  }

  /**
   * Get pet count for a user
   * @param {string} userId
   * @returns {number}
   */
  static getPetCountForUser(userId) {
    try {
      const pets = this.getAllPets();
      return pets.filter(pet => pet.userId === userId).length;
    } catch (error) {
      console.error('Error counting pets:', error);
      return 0;
    }
  }

  /**
   * Check if user owns a pet
   * @param {string} userId
   * @param {string} petId
   * @returns {boolean}
   */
  static userOwnsPet(userId, petId) {
    try {
      const pet = this.findById(petId);
      return pet ? pet.userId === userId : false;
    } catch (error) {
      console.error('Error checking pet ownership:', error);
      return false;
    }
  }
}

export default PetStore;
