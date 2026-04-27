class LoginDTO {
  constructor(email, password) {
    this.email = email.trim();
    this.password = password;
  }
}

export default LoginDTO;