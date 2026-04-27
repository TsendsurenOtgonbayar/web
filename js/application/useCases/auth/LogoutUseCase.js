import AuthTokenProvider from "../../../infrastructure/auth/AuthTokenProvider.js";

class LogoutUseCase {
  constructor() {
    this.tokenProvider = new AuthTokenProvider();
  }

  execute() {
    this.tokenProvider.removeToken();
    return { success: true, message: "Системээс гарлаа" };
  }
}

export default LogoutUseCase;