class UserDataSource {
  constructor() {
    this.cachedUsers = null;
    this.lastFetchedAt = 0;
    this.CACHE_TTL_MS = 5 * 60 * 1000;
  }

  normalizeUser(rawUser) {
    const firstName = rawUser.FirstName || rawUser.firstName || "";
    const lastName = rawUser.LastName || rawUser.lastName || "";
    const email = (rawUser.Email || rawUser.email || "").trim();
    const password = rawUser.Password || rawUser.password || rawUser.Pass || "";
    const currentRole = rawUser.currentRole || (rawUser.role === "Admin" ? "Admin" : "User");

    return {
      id: rawUser.id || Math.random(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      currentRole: currentRole,
      pets: Array.isArray(rawUser.pets) ? rawUser.pets : [],
      appointments: Array.isArray(rawUser.appointments) ? rawUser.appointments : [],
      comments: Array.isArray(rawUser.comments) ? rawUser.comments : [],
      createdAt: rawUser.createdAt || new Date().toISOString(),
      isTestAccount: Boolean(rawUser.isTestAccount)
    };
  }

  async fetchRemoteUsers() {
    const now = Date.now();
    if (this.cachedUsers && now - this.lastFetchedAt < this.CACHE_TTL_MS) {
      return this.cachedUsers;
    }

    try {
      const response = await fetch("./domain/services/userData.json");
      if (!response.ok) throw new Error(`HTTP ` + response.status);
      const data = await response.json();
      const normalized = Array.isArray(data) ? data.map(u => this.normalizeUser(u)) : [];
      this.cachedUsers = normalized;
      this.lastFetchedAt = now;
      return normalized;
    } catch (error) {
      console.warn("Backend fetch амжилтгүй:", error.message);
      return this.cachedUsers || [];
    }
  }
}

export default UserDataSource;