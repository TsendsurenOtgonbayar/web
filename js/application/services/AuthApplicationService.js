import LoginUseCase from "../useCases/auth/LoginUseCase.js";
import RegisterUseCase from "../useCases/auth/RegisterUseCase.js";
import LogoutUseCase from "../useCases/auth/LogoutUseCase.js";
import AuthTokenProvider from "../../infrastructure/auth/AuthTokenProvider.js";
import LoginDTO from "../dtos/LoginDTO.js";
import RegisterDTO from "../dtos/RegisterDTO.js";

class AuthApplicationService {
  constructor() {
    this.loginUseCase = new LoginUseCase();
    this.registerUseCase = new RegisterUseCase();
    this.logoutUseCase = new LogoutUseCase();
    this.tokenProvider = new AuthTokenProvider();
  }

  async login(email, password) {
    const loginDTO = new LoginDTO(email, password);
    const result = await this.loginUseCase.execute(loginDTO);

    if (result.success) {
      this.tokenProvider.saveToken(result.user.currentRole);
      this.tokenProvider.saveCurrentUser(result.user);
    }

    return result;
  }

  async register(firstName, lastName, email, password) {
    const registerDTO = new RegisterDTO(firstName, lastName, email, password);
    return await this.registerUseCase.execute(registerDTO);
  }

  logout() {
    return this.logoutUseCase.execute();
  }

  getCurrentUser() {
    return this.tokenProvider.getCurrentUser();
  }

  isAdmin(user = null) {
    const target = user || this.getCurrentUser();
    return target?.currentRole === "Admin";
  }

  getRedirectRoute(user = null) {
    const target = user || this.getCurrentUser();
    return this.isAdmin(target) ? "dashboard.html" : "profile.html";
  }
}

export default AuthApplicationService;