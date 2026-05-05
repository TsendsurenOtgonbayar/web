/**
 * Patient Service - Domain Layer: Pet Service
 * 
 * Pure business logic for pet management.
 * Does NOT access infrastructure (localStorage, APIs).
 * Does NOT import User or any other service's domain.
 * Used by application layer.
 */

export class PetDomainService {
  /**
   * Validate pet data before creation
   * @param {Object} petData - Pet data object
   * @returns {Object} - { valid: boolean, errors: Array<string> }
   */
  static validatePetData(petData) {
    const errors = [];

    if (!petData.name || petData.name.trim() === '') {
      errors.push('Амьтны нэр оруулна уу');
    }

    if (!petData.type || petData.type.trim() === '') {
      errors.push('Амьтны төрөл сонгоно уу');
    }

    if (!petData.gender || petData.gender.trim() === '') {
      errors.push('Амьтны хүйс сонгоно уу');
    }

    if (!petData.birthYear || isNaN(petData.birthYear)) {
      errors.push('Төрсөн жил оруулна уу');
    }

    if (
      !petData.birthMonth ||
      isNaN(petData.birthMonth) ||
      petData.birthMonth < 1 ||
      petData.birthMonth > 12
    ) {
      errors.push('Төрсөн сар оруулна уу (1-12)');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Calculate pet age in years
   * @param {number} birthYear - Birth year
   * @param {number} birthMonth - Birth month
   * @returns {number} - Age in years
   */
  static calculateAge(birthYear, birthMonth) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    let age = currentYear - birthYear;
    if (currentMonth < birthMonth) {
      age--;
    }

    return Math.max(0, age);
  }

  /**
   * Get pet's health status category based on age
   * @param {number} age - Pet age in years
   * @returns {string} - Health category
   */
  static getHealthCategory(age) {
    if (age < 2) return 'Зөвлөмжүүлэх ажилтан';
    if (age < 7) return 'Зүүлэлт';
    if (age < 10) return 'Насанд хүрсэн';
    return 'Ахмад';
  }

  /**
   * Determine if pet needs a checkup based on age
   * @param {number} age - Pet age in years
   * @returns {boolean}
   */
  static needsCheckup(age) {
    return age > 10 || age < 2; // Young or senior pets need more checkups
  }

  /**
   * Format pet info for display
   * @param {Pet} pet - Pet entity
   * @returns {Object} - Formatted pet info
   */
  static formatPetInfo(pet) {
    const age = pet.getAge();
    const healthCategory = this.getHealthCategory(age.years);

    return {
      petId: pet.petId,
      userId: pet.userId,
      name: pet.name,
      type: pet.type,
      gender: pet.gender,
      age: age.years,
      ageMonths: age.months,
      healthCategory: healthCategory,
      needsCheckup: this.needsCheckup(age.years),
      createdAt: pet.createdAt
    };
  }
}

export default PetDomainService;
