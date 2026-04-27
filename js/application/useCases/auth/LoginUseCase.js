import EmailValidator from "../../validators/EmailValidator.js";
import PasswordValidator from "../../validators/PasswordValidator.js";
import UserDataSource from "../../../infrastructure/dataSources/UserDataSource.js";
import UserRepository from "../../../infrastructure/repositories/UserRepository.js";
import { authenticateTestCredentials } from "../../../domain/services/mockAuthProvider.js";

class LoginUseCase {
  constructor() {
    this.dataSource = new UserDataSource();
    this.userRepository = new UserRepository();
  }

  async execute(loginDTO) {
    const email = loginDTO.email.trim().toLowerCase();
    const password = loginDTO.password;

    if (!email || !password) {
      return { success: false, error: "Имэйл болон нууц үг оруулна уу" };
    }

    if (!EmailValidator.validate(email)) {
      return { success: false, error: EmailValidator.getErrorMessage() };
    }

    const testUser = authenticateTestCredentials(email, password);
    if (testUser) {
      return {
        success: true,
        user: testUser,
        message: `Туршилтын ` + testUser.currentRole + ` эрхээр нэвтэрлээ`
      };
    }

    const remoteUsers = await this.dataSource.fetchRemoteUsers();
    const registeredUsers = this.userRepository.getRegisteredUsers();
    const allUsers = [...remoteUsers, ...registeredUsers];

    const user = allUsers.find(u => {
      const userEmail = (u.email || u.Email || "").toLowerCase();
      return userEmail === email && u.password === password;
    });

    if (!user) {
      return { success: false, error: "Email эсвэл password буруу байна" };
    }

    return {
      success: true,
      user: user,
      message: "Амжилттай нэвтэрлээ (" + user.currentRole + ")"
    };
  }
}

export default LoginUseCase;