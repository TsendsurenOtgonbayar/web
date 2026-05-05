/**
 * Shared Contract Interface: IPatientRepository
 * 
 * Services use this interface to query patient/pet information from Patient Service.
 * Appointment Service uses this to verify pet ownership before booking.
 * Feedback Service uses this to check if user/pet exists.
 */

export class IPatientRepository {
  /**
   * Get patient profile by user ID
   * @param {string} userId
   * @returns {Promise<PatientProfileDTO>} Contains user info + pets list
   */
  async getPatientProfile(userId) {
    throw new Error('getPatientProfile must be implemented');
  }

  /**
   * Get pet by ID
   * @param {string} petId
   * @returns {Promise<PetDTO>}
   */
  async getPetById(petId) {
    throw new Error('getPetById must be implemented');
  }

  /**
   * Get all pets for a user
   * @param {string} userId
   * @returns {Promise<PetDTO[]>}
   */
  async getPetsByUserId(userId) {
    throw new Error('getPetsByUserId must be implemented');
  }

  /**
   * Verify pet ownership (does user own this pet?)
   * @param {string} userId
   * @param {string} petId
   * @returns {Promise<boolean>}
   */
  async verifyPetOwnership(userId, petId) {
    throw new Error('verifyPetOwnership must be implemented');
  }
}

export default IPatientRepository;
