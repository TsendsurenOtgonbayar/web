/**
 * Shared Contract: User DTO
 * Minimal user information that other services can consume
 * This is the ONLY user-related data shared across services
 * 
 * Each service receives this DTO from Identity Service, never the domain User entity
 */

export class UserDTO {
  constructor(data = {}) {
    this.userId = data.userId;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.currentRole = data.currentRole || 'User';
    this.createdAt = data.createdAt;
  }
  getFullName() {
    return `${this.lastName} ${this.firstName}`.trim();
  }
  isAdmin() {
    return this.currentRole === 'Admin';
  }

  toJSON() {
    return {
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      currentRole: this.currentRole,
      createdAt: this.createdAt
    };
  }
}

export default UserDTO;
