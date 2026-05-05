/**
 * Patient Service - Domain Layer: Pet Entity
 * 
 * Pure domain model for a Pet.
 * Does NOT know about User, only stores userId as reference.
 * Contains only pet-related business logic.
 */

export class Pet {
  constructor(data = {}) {
    this.petId = data.petId || `pet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.userId = data.userId; // Reference only, NOT nested User object
    this.name = data.name;
    this.birthYear = data.birthYear;
    this.birthMonth = data.birthMonth;
    this.type = data.type;
    this.gender = data.gender;
    this.healthCategory = data.healthCategory || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  /**
   * Calculate pet age in years and months
   * @returns {Object} - { years, months }
   */
  getAge() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    let years = currentYear - this.birthYear;
    let months = currentMonth - this.birthMonth;

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months };
  }

  /**
   * Get age in years only
   * @returns {number}
   */
  getAgeInYears() {
    return this.getAge().years;
  }

  /**
   * Update pet name
   * @param {string} newName
   */
  setName(newName) {
    this.name = newName;
  }

  /**
   * Update pet type
   * @param {string} newType
   */
  setType(newType) {
    this.type = newType;
  }

  /**
   * Update pet gender
   * @param {string} newGender
   */
  setGender(newGender) {
    this.gender = newGender;
  }

  /**
   * Convert to plain object for storage/transmission
   * @returns {Object}
   */
  toJSON() {
    return {
      petId: this.petId,
      userId: this.userId,
      name: this.name,
      birthYear: this.birthYear,
      birthMonth: this.birthMonth,
      type: this.type,
      gender: this.gender,
      healthCategory: this.healthCategory,
      createdAt: this.createdAt
    };
  }
}

export default Pet;
