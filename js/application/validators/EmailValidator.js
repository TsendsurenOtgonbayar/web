class EmailValidator {
  static validate(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static getErrorMessage() {
    return "Имэйлийн формат буруу байна";
  }
}

export default EmailValidator;