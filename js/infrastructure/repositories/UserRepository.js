import User from "../../domain/entity/user.js";

class UserRepository {
  constructor() {
    this.REGISTERED_USERS_KEY = "isRegisted";
  }

  getRegisteredUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(this.REGISTERED_USERS_KEY)) || [];
      return Array.isArray(users) ? users : [];
    } catch (error) {
      console.error("Бүртгэлтэй хэрэглэгчдийн өгөгдөл уншихад алдаа:", error);
      return [];
    }
  }

  saveUser(userData) {
    const users = this.getRegisteredUsers();
    users.push(userData);
    localStorage.setItem(this.REGISTERED_USERS_KEY, JSON.stringify(users));
  }

  updateUser(userData) {
    const users = this.getRegisteredUsers();
    const index = users.findIndex(u => u.email && u.email.toLowerCase() === userData.email.toLowerCase());
    if (index !== -1) {
      users[index] = userData;
      localStorage.setItem(this.REGISTERED_USERS_KEY, JSON.stringify(users));
    }
  }

  findByEmail(email) {
    const users = this.getRegisteredUsers();
    return users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
  }
}

export default UserRepository;