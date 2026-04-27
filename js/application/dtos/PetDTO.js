class PetDTO {
  constructor(pet) {
    this.id = pet.id;
    this.name = pet.name;
    this.birthYear = pet.birthYear;
    this.birthMonth = pet.birthMonth;
    this.type = pet.type;
    this.gender = pet.gender;
    this.age = pet.getAge();
  }
}

export default PetDTO;