/**
 * Shared Contract: Pet DTO
 * Pet information owned by Patient Service
 * Shared with other services via DTO, never the domain Pet entity
 */

export class PetDTO {
  constructor(data = {}) {
    this.petId = data.petId;
    this.userId = data.userId; // Reference to user, not nested User object
    this.name = data.name;
    this.type = data.type;
    this.gender = data.gender;
    this.birthYear = data.birthYear;
    this.birthMonth = data.birthMonth;
    this.age = data.age;
    this.healthCategory = data.healthCategory;
    this.createdAt = data.createdAt;
  }

  /**
   * Calculate age if not provided
   * @returns {number} age in years
   */
  getAgeInYears() {
    if (this.age !== undefined) return this.age;
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    let years = currentYear - this.birthYear;
    if (currentMonth < this.birthMonth) years--;
    
    return Math.max(0, years);
  }

  toJSON() {
    return {
      petId: this.petId,
      userId: this.userId,
      name: this.name,
      type: this.type,
      gender: this.gender,
      birthYear: this.birthYear,
      birthMonth: this.birthMonth,
      age: this.age,
      healthCategory: this.healthCategory,
      createdAt: this.createdAt
    };
  }
}

export default PetDTO;
