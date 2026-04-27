class Pet {
  constructor(name, birthYear, birthMonth, type, gender, id = null) {
    this.id = id || Math.random();
    this.name = name;
    this.birthYear = birthYear;
    this.birthMonth = birthMonth;
    this.type = type;
    this.gender = gender;
    this.createdAt = new Date().toISOString();
  }

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

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      age: this.getAge(),
      type: this.type,
      gender: this.gender,
      createdAt: this.createdAt
    };
  }

  setName(newName) {
    this.name = newName;
  }

  setType(newType) {
    this.type = newType;
  }

  setGender(newGender) {
    this.gender = newGender;
  }
}

export default Pet;