/**
 * Patient Service - Entry Point
 * 
 * This file exports the public API and is the canonical import for any code
 * that needs to use the Patient Service.
 * 
 * Usage:
 *   import PatientService from './services/patient/index.js';
 *   const result = await PatientService.addPet(userId, petData);
 * 
 * DO NOT import:
 *   import PetApplicationService from './services/patient/application/PetApplicationService.js';
 *   import PetStore from './services/patient/infrastructure/storage/PetStore.js';
 */

// Export only the public API
export { default as PatientServiceAPI } from './api/PatientServiceAPI.js';
import {
  getPetsByUserId,
  getPetById,
  addPet,
  updatePet,
  deletePet,
  verifyPetOwnership,
  getPatientProfile,
  getPetCountForUser
} from './api/PatientServiceAPI.js';

// Re-export shared contracts
export { PetDTO } from '../../shared/contracts/dtos/PetDTO.js';
export { PetAddedEvent, PetUpdatedEvent, PetDeletedEvent } from '../../shared/contracts/events/PatientEvents.js';

export default {
  getPetsByUserId,
  getPetById,
  addPet,
  updatePet,
  deletePet,
  verifyPetOwnership,
  getPatientProfile,
  getPetCountForUser
};
