class UserProfileDTO {
  constructor(user) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.fullName = user.getFullName();
    this.email = user.email;
    this.currentRole = user.currentRole;
    this.petsCount = user.pets.length;
    this.appointmentsCount = user.appointments.length;
    this.createdAt = user.createdAt;
  }
}

export default UserProfileDTO;