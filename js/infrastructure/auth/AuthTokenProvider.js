class AuthTokenProvider {
  constructor() {
    this.TOKEN_KEY = "token";
    this.LOGGED_IN_KEY = "LoggedIn";
  }

  saveToken(role) {
    localStorage.setItem(this.TOKEN_KEY, `role:` + role);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY) || null;
  }

  saveCurrentUser(user) {
    const sessionUser = {
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      fullName: user.getFullName ? user.getFullName() : `${user.lastName} ${user.firstName}`,
      email: user.email,
      currentRole: user.currentRole || "User",
      pets: Array.isArray(user.pets) ? user.pets : [],
      appointments: Array.isArray(user.appointments) ? user.appointments : [],
      comments: Array.isArray(user.comments) ? user.comments : [],
      createdAt: user.createdAt
    };
    localStorage.setItem(this.LOGGED_IN_KEY, JSON.stringify(sessionUser));
  }

  getCurrentUser() {
    try {
      const user = localStorage.getItem(this.LOGGED_IN_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("getCurrentUser алдаа:", error);
      return null;
    }
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.LOGGED_IN_KEY);
  }
}

export default AuthTokenProvider;