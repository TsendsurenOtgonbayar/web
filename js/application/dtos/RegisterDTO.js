class RegisterDTO {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
    this.email = email.trim();
    this.password = password;
  }
}

export default RegisterDTO;