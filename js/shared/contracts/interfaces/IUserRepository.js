/**
 * Shared Contract Interface: IUserRepository
 * 
 * Other services use this interface to query user information from Identity Service.
 * This allows services to depend on the contract, not the implementation.
 * 
 * Each service that needs user data calls these methods (via API Gateway or direct HTTP).
 */

export class IUserRepository {
  /**
   * Get user by ID
   * @param {string} userId
   * @returns {Promise<UserDTO>}
   */
  async getUserById(userId) {
    throw new Error('getUserById must be implemented');
  }

  /**
   * Get user by email
   * @param {string} email
   * @returns {Promise<UserDTO>}
   */
  async getUserByEmail(email) {
    throw new Error('getUserByEmail must be implemented');
  }

  /**
   * Get multiple users by IDs
   * @param {string[]} userIds
   * @returns {Promise<UserDTO[]>}
   */
  async getUsersByIds(userIds) {
    throw new Error('getUsersByIds must be implemented');
  }

  /**
   * Verify if user exists
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async userExists(userId) {
    throw new Error('userExists must be implemented');
  }
}

export default IUserRepository;
