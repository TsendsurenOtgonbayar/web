import User from "../../../domain/entity/user.js";
import EmailValidator from "../../validators/EmailValidator.js";
import PasswordValidator from "../../validators/PasswordValidator.js";
import UserRepository from "../../../infrastructure/repositories/UserRepository.js";
import UserDataSource from "../../../infrastructure/dataSources/UserDataSource.js";
import UserMapper from "../../../infrastructure/mappers/UserMapper.js";

class RegisterUseCase {
  constructor() {
    this.userRepository = new UserRepository();
    this.dataSource = new UserDataSource();
  }

  async execute(registerDTO) {
    const { firstName, lastName, email, password } = registerDTO;

    if (!firstName || !lastName || !email || !password) {
      return { success: false, message: "Бүртгүүлэх талбаруудыг бүрэн оруулна уу" };
    }

    if (!EmailValidator.validate(email)) {
      return { success: false, message: EmailValidator.getErrorMessage() };
    }

    const passwordValidation = PasswordValidator.validate(password);
    if (!passwordValidation.valid) {
      return { success: false, message: passwordValidation.message };
    }

    const remoteUsers = await this.dataSource.fetchRemoteUsers();
    const registeredUsers = this.userRepository.getRegisteredUsers();
    const allUsers = [...remoteUsers, ...registeredUsers];

    const emailExists = allUsers.some(u => {
      const userEmail = (u.email || u.Email || "").toLowerCase();
      return userEmail === email.toLowerCase();
    });

    if (emailExists) {
      return { success: false, message: "Энэ имэйл дээр аль хэдийн бүртгэгдсэн байна" };
    }

    const newUser = new User(firstName, lastName, email, password);
    const userData = UserMapper.toDTO(newUser);
    this.userRepository.saveUser(userData);

    return {
      success: true,
      message: "Амжилттай бүртгэгдлээ! Одоо нэвтэрнэ үү.",
      user: newUser
    };
  }
}

export default RegisterUseCase;