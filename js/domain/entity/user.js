class User {
  constructor(firstName, lastName, email, password, id = null) {
    this.id = id || Math.random();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.currentRole = "User";
    this.pets = [];
    this.appointments = [];
    this.comments = [];
    this.createdAt = new Date().toISOString();
  }

  addPet(petObj) {
    this.pets.push(petObj);
  }

  addAppointment(appointmentObj) {
    this.appointments.push(appointmentObj);
  }

  addComment(commentObj) {
    this.comments.push(commentObj);
  }

  getFullName() {
    return `${this.lastName} ${this.firstName}`.trim();
  }

  getProfile() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.getFullName(),
      email: this.email,
      currentRole: this.currentRole,
      petsCount: this.pets.length,
      pets: this.pets,
      appointmentsCount: this.appointments.length,
      appointments: this.appointments,
      commentsCount: this.comments.length,
      comments: this.comments,
      createdAt: this.createdAt
    };
  }

  isAdmin() {
    return this.currentRole === "Admin";
  }
}

export default User;