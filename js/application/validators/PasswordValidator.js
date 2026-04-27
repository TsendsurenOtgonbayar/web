class PasswordValidator {
  static validate(password) {
    if (password.length < 8) {
      return {
        valid: false,
        message: "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой"
      };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        message: "Нууц үг томоохон үсэг агуулсан байх ёстой"
      };
    }
    if (!/[0-9]/.test(password)) {
      return {
        valid: false,
        message: "Нууц үг тоо агуулсан байх ёстой"
      };
    }
    return { valid: true, message: "Нууц үг сайн байна" };
  }
}

export default PasswordValidator;